<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosPurchase;
use App\Models\POS\PosPurchaseItem;
use Illuminate\Http\Request;

class PosPurchaseController extends Controller
{
    /**
     * List all purchases.
     */
    public function index()
    {
        $purchases = PosPurchase::with('supplier', 'items.product')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $purchases
        ]);
    }

    /**
     * Store a new purchase.
     */
    public function store(Request $request)
    {
        $request->validate([
            'supplier_id' => 'nullable|exists:suppliers,id',
            'reference_no' => 'nullable|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:pos_products,id',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.cost_price' => 'required|numeric|min:0',
        ]);

        // Calculate total
        $total = collect($request->items)->sum(function ($item) {
            return $item['quantity'] * $item['cost_price'];
        });

        $purchase = PosPurchase::create([
            'supplier_id' => $request->supplier_id,
            'reference_no' => $request->reference_no,
            'total_amount' => $total,
            'status' => 'pending',
        ]);

        // Add purchase items
        foreach ($request->items as $item) {
            PosPurchaseItem::create([
                'purchase_id' => $purchase->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'cost_price' => $item['cost_price'],
                'subtotal' => $item['quantity'] * $item['cost_price'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Purchase created successfully',
            'data' => $purchase->load('items.product', 'supplier')
        ]);
    }

    /**
     * Show a specific purchase.
     */
    public function show(PosPurchase $posPurchase)
    {
        $posPurchase->load('items.product', 'supplier');

        return response()->json([
            'success' => true,
            'data' => $posPurchase
        ]);
    }

    /**
     * Update a purchase.
     */
    public function update(Request $request, PosPurchase $posPurchase)
    {
        $request->validate([
            'supplier_id' => 'nullable|exists:suppliers,id',
            'reference_no' => 'nullable|string|max:100',
            'status' => 'nullable|in:pending,received',
        ]);

        $posPurchase->update($request->only('supplier_id', 'reference_no', 'status'));

        return response()->json([
            'success' => true,
            'message' => 'Purchase updated successfully',
            'data' => $posPurchase->load('items.product', 'supplier')
        ]);
    }

    /**
     * Delete a purchase.
     */
    public function destroy(PosPurchase $posPurchase)
    {
        $posPurchase->items()->delete(); // Delete related items first
        $posPurchase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase deleted successfully'
        ]);
    }
}
