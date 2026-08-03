<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosSale;
use App\Models\POS\PosSaleItem;
use App\Models\POS\PosSalesItem;
use App\Models\POS\PosStockMovement;
use App\Models\POS\PosStoreTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosSaleController extends Controller
{

    public function update_discount_per_item_service(Request $request)
    {
        $request->validate([
            'id'       => 'required|exists:pos_sales_items,id',
            'discount' => 'required|numeric|min:0'
        ]);


        $item = PosSalesItem::lockForUpdate()->find($request->id);

        if ($item) {
            // 1. Calculate the difference between the old and new discount
            $oldDiscount  = $item->discount;
            $newDiscount  = $request->discount;
            $discountDiff = $newDiscount - $oldDiscount;
            // 2. Recalculate Item Financials
            // Revenue (Total) and Profit go down exactly as much as the discount goes up
            $newTotal = $item->total + $oldDiscount - $newDiscount;
            $newProfit = $item->profit + $oldDiscount - $newDiscount;
            $newDiscountedPrice = $item->quantity > 0 ? ($newTotal / $item->quantity) : 0;

            $item->update([
                'discount'         => $newDiscount,
                'total'            => $newTotal,
                'discounted_price' => $newDiscountedPrice,
                'profit'           => $newProfit
            ]);
            // 3. Update the Parent Sale
            $sale = PosSale::lockForUpdate()->find($item->sale_id);

            if ($sale) {
                $newSaleTotalAmount = max(0, $sale->total_amount);
                $newSaleDiscount    = max(0, $sale->discount + $discountDiff);
                // Recalculate change: Amount Paid minus the New Final Total
                $newSaleChangeDue   = max(0, $sale->amount_paid - $newSaleTotalAmount);

                $sale->update([
                    'total_amount' => $newSaleTotalAmount,
                    'discount'     => $newSaleDiscount,
                    'amount'            => ($newSaleTotalAmount - $newSaleDiscount),
                    'change_due'   => $newSaleChangeDue,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Item discount updated successfully',
            'data'    => $item
        ]);
    }
    public function add_sales_items(Request $request)
    {
        $request->validate([
            'pos_sale_id'                  => 'required|exists:pos_sales,id',
            'items'                        => 'required|array|min:1',
            'items.*.pos_product_stock_id' => 'required|exists:pos_product_stocks,id',
            'items.*.quantity'             => 'required|numeric|min:1',
            'items.*.selling_price'        => 'required|numeric|min:0',
            'items.*.cost_price'           => 'required|numeric|min:0',
            'items.*.discount'             => 'nullable|numeric|min:0',
            'payment_type'                 => 'nullable|in:Cash,E-Wallet,Bank Transfer,Credit/Debit Card',
            'amount_paid'                  => 'required|numeric|min:0',
            'discount'                     => 'nullable|numeric|min:0', // Ensure global discount is validated
        ]);


        $global_discount = $request->discount ?? 0;
        $split_product_discount = $global_discount / count($request->items);

        // Track accumulations for the parent sale update
        $addedTotalAmount = 0;
        $addedDiscount    = 0;

        foreach ($request->items as $item) {
            $quantity     = $item['quantity'];
            $sellingPrice = $item['selling_price'];
            $costPrice    = $item['cost_price'];
            $itemDiscount = $item['discount'] ?? 0;

            $totalLineDiscount = $itemDiscount + $split_product_discount;
            $totalLineRevenue  = ($quantity * $sellingPrice) - $totalLineDiscount;

            // Prevent division by zero
            $discountedPricePerUnit = $quantity > 0 ? ($totalLineRevenue / $quantity) : 0;
            $profit = $totalLineRevenue - ($quantity * $costPrice);

            // Accumulate totals for the parent PosSale
            $addedTotalAmount += $totalLineRevenue;
            $addedDiscount    += $totalLineDiscount;

            // 1. Create Sales Item
            PosSalesItem::create([
                'pos_supplier_id'      => $item['pos_supplier_id'] ?? null,
                'pos_category_id'      => $item['pos_category_id'],
                'pos_store_id'         => session('pos_store_id'),
                'pos_product_stock_id' => $item['pos_product_stock_id'],
                'sale_id'              => $request->pos_sale_id,
                'quantity'             => $quantity,
                'selling_price'        => $sellingPrice,
                'cost_price'           => $costPrice,
                'discount'             => $totalLineDiscount,
                'total'                => $totalLineRevenue,
                'discounted_price'     => $discountedPricePerUnit,
                'profit'               => $profit,
            ]);

            // 2. Deduct Stock safely using locking
            $product_stock = PosProductStock::lockForUpdate()->find($item['pos_product_stock_id']);
            if ($product_stock) {
                $product_stock->decrement('stocks', $quantity);
            }

            // 3. Create Store Transaction
            $pos_store_transaction = PosStoreTransaction::create([
                'transact_by'          => Auth::id(),
                'subscriber_id'        => Auth::user()->subscriber_id,
                'pos_product_stock_id' => $item['pos_product_stock_id'],
                'pos_sale_id'          => $request->pos_sale_id,
                'stocks'               => $quantity,
                'status'               => 'Deducted'
            ]);

            $pos_store_transaction->update([
                'transaction_id' => str_pad($pos_store_transaction->id, 10, '0', STR_PAD_LEFT)
            ]);
        }

        // 4. Update the Parent Sale Record
        $pos_sales = PosSale::find($request->pos_sale_id);

        if ($pos_sales) {
            $newTotalAmount = $pos_sales->total_amount + $sellingPrice;
            $newDiscount    = $pos_sales->discount + $addedDiscount;

            // Change due is Amount Paid MINUS the final Total Amount
            $newChangeDue   = max(0, $request->amount_paid - $newTotalAmount);

            $pos_sales->update([
                'total_amount' => $newTotalAmount,
                'discount'     => $newDiscount,
                'amount' => ($newTotalAmount - $newDiscount),
                'change_due'   => $newChangeDue,
                'payment_type' => $request->payment_type ?? $pos_sales->payment_type,
                'balance' => $pos_sales->balance + $addedTotalAmount,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Sales items added successfully',
            'data'    => $request->all()
        ]);
    }
    public function index(Request $request)
    {
        $sales = PosSale::where('subscriber_id', Auth::user()->subscriber_id)
            ->where('is_credit', $request->is_credit ?? 0)
            ->with(['sale_items', 'cashier', 'customer'])->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $sales
        ]);
    }

    /**
     * Store a new sale.
     */
    public function store(Request $request)
    {

        $request->validate([
            'customer_id' => 'nullable',
            'items' => 'required|array|min:1',
            'items.*.pos_product_stock_id' => 'required|exists:pos_product_stocks,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.selling_price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'payment_type' => 'nullable|in:Cash,E-Wallet,Bank Transfer,Credit/Debit Card',
            'amount_paid' => 'required|numeric|min:0',
            'change_due' => 'required',
        ]);

        $total = collect($request->items)->sum(function ($item) {
            return $item['quantity'] * $item['selling_price'];
        });

        $split_product_discount = $request->discount / count($request->items);

        $total_discount = collect($request->items)->sum('discount') + $request->discount;

        $sale = PosSale::create([
            'pos_store_id' => session('pos_store_id'),
            'invoice_no' => 0,
            'customer_id' => $request->customer_id ?? null,
            'subscriber_id' => Auth::user()->subscriber_id,
            'cashier_id' => Auth::id(),
            'total_amount' => $total,
            'discount' => $total_discount ?? 0,
            'tax' => $request->tax ?? 0,
            'amount_paid' => $request->amount_paid,
            'change_due' => $request->change_due,
            'payment_type' => $request->payment_type,
            'amount' => ($total - ($total_discount ?? 0)),
            'balance' => $request->is_credit ? ($total - ($total_discount ?? 0)) : 0,
            'is_credit' => $request->is_credit,
            'due_date' => $request->due_date ?? null,
            'status' => $request->is_credit ? 'Pending' : 'Paid',
        ]);
        $invoice_no = str_pad($sale->id, 8, '0', STR_PAD_LEFT);

        $sale->update([
            'invoice_no' => $invoice_no
        ]);
        // Add sale items
        foreach ($request->items as $item) {
            $quantity = $item['quantity'];
            $sellingPrice = $item['selling_price'];
            $costPrice = $item['cost_price'];
            $discount = $item['discount'] ?? 0;

            // Calculate the line total (Revenue) first
            $total = ($quantity * $sellingPrice) - ($discount + $split_product_discount);

            // Calculate discounted price per unit (safeguard against division by zero)
            $discountedPrice = $quantity > 0 ? ($total / $quantity) : 0;

            // Calculate profit: Total Revenue - Total Cost
            $profit = $total - ($quantity * $costPrice);

            PosSalesItem::create([
                'pos_supplier_id' => $item['pos_supplier_id'] ?? null,
                'pos_category_id' => $item['pos_category_id'],
                'pos_store_id'         => session('pos_store_id'),
                'pos_product_stock_id' => $item['pos_product_stock_id'],
                'sale_id'              => $sale->id,
                'quantity'             => $quantity,
                'selling_price'        => $sellingPrice,
                'cost_price'           => $costPrice,
                'discount'             => $discount + $split_product_discount,
                'total'                => $total,
                'discounted_price'     => $discountedPrice,
                'profit'               => $profit,
            ]);

            $product_stock = PosProductStock::find($item['pos_product_stock_id']);
            if ($product_stock) {
                $product_stock->decrement('stocks', $quantity);
            }


            $pos_store_transaction =  PosStoreTransaction::create([
                'transact_by' => Auth::id(),
                'subscriber_id' => Auth::user()->subscriber_id,
                'pos_product_stock_id' => $item['pos_product_stock_id'],
                'pos_sale_id' => $sale->id,
                'stocks' => $quantity,
                'status' => 'Deducted'
            ]);
            $transaction_id = str_pad($pos_store_transaction->id, 10, '0', STR_PAD_LEFT);
            $pos_store_transaction->update([
                'transaction_id' => $transaction_id
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'Sale created successfully',
        ]);
    }

    /**
     * Show a specific sale.
     */
    public function show(PosSale $posSale)
    {
        $posSale->load('sale_items.pos_product_stock', 'customer', 'user', 'cashier');

        return response()->json([
            'success' => true,
            'data' => $posSale
        ]);
    }

    /**
     * Update a sale (e.g., change customer or payment info).
     */
    public function update(Request $request, PosSale $posSale)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:pos_customers,id',
            'payment_type' => 'nullable|in:cash,card',
            'amount_paid' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:paid,unpaid,cancelled',
        ]);

        $posSale->update($request->only('customer_id', 'payment_type', 'amount_paid', 'status'));

        return response()->json([
            'success' => true,
            'message' => 'Sale updated successfully',
            'data' => $posSale->load('sale_items.product', 'customer', 'user')
        ]);
    }

    /**
     * Delete a sale.
     */
    public function destroy(PosSale $posSale)
    {
        $posSale->sale_items()->delete(); // Delete related items first
        $posSale->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sale deleted successfully'
        ]);
    }
}
