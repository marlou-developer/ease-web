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
        $sales = PosSale::with('customer', 'sale_items.product', 'user')->latest()->get();

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
            'items.*.product_stock_id' => 'required|exists:pos_products,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.selling_price' => 'required|numeric|min:0',
            'payment_type' => 'nullable|in:cash,card',
            'amount_paid' => 'required|numeric|min:0',
            'change_due' => 'required',
        ]);


        $total = collect($request->items)->sum(function ($item) {
            return $item['quantity'] * $item['selling_price'];
        });

        $sale = PosSale::create([
            'invoice_no' => 0,
            'customer_id' => $request->customer_id,
            'user_id' => Auth::id(),
            'total_amount' => $total,
            'discount' => $request->discount ?? 0,
            'tax' => $request->tax ?? 0,
            'amount_paid' => $request->amount_paid,
            'change_due' => $request->change_due,
            'payment_type' => $request->payment_type,
            'status' => 'paid',
        ]);
        $invoice_no = str_pad($sale->id, 8, '0', STR_PAD_LEFT);

        $sale->update([
            'invoice_no' => $invoice_no
        ]);
        // Add sale items
        foreach ($request->items as $item) {
            PosSalesItem::create([
                'product_stock_id' => $item['product_stock_id'],
                'sale_id' => $sale->id,
                'quantity' => $item['quantity'],
                'selling_price' => $item['selling_price'],
                'discount' => $item['discount'] ?? 0,
                'subtotal' => ($item['quantity'] * $item['selling_price']) - ($item['discount'] ?? 0),
            ]);

            PosProductStock::where('id', $item['product_stock_id'])->decrement('stocks', $item['quantity']);

            $product_stock = PosProductStock::find($item['product_stock_id']);
            if ($product_stock) {
                $qty_before = $product_stock->stocks;
                $qty_after = $qty_before - $item['quantity'];

                PosStockMovement::create([
                    'product_stock_id' => $item['product_stock_id'],
                    'user_id' => Auth::id(),
                    'type' => 'OUT',
                    'reference' => $invoice_no,
                    'qty_before' => $qty_before,
                    'qty_change' => $item['quantity'],
                    'qty_after' => $qty_after,
                ]);

                $product_stock->decrement('stocks', $item['quantity']);
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
