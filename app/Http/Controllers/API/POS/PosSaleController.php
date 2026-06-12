<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosSale;
use App\Models\POS\PosSaleItem;
use App\Models\POS\PosSalesItem;
use App\Models\POS\PosStockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosSaleController extends Controller
{
    /**
     * List all sales.
     */
    public function index()
    {
        $sales = PosSale::where('subscriber_id', Auth::user()->subscriber_id)->with(['sale_items','cashier'])->latest()->get();

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
                'pos_store_id'         => session('pos_store_id'),
                'pos_product_stock_id' => $item['pos_product_stock_id'],
                'sale_id'              => $sale->id,
                'quantity'             => $quantity,
                'selling_price'        => $sellingPrice,
                'cost_price'           => $costPrice,
                'discount'             => $discount + $split_product_discount,
                'total'                => $total,
                'discounted_price'     => $discountedPrice,
                'profit'               => $profit, // <--- Added profit here
            ]);

            $product_stock = PosProductStock::find($item['pos_product_stock_id']);
            if ($product_stock) {
                $product_stock->decrement('stocks', $quantity);
            }
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
        $posSale->load('sale_items.product', 'customer', 'user');

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
