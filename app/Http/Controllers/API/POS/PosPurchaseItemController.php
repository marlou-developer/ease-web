<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosPurchaseItem;
use Illuminate\Http\Request;

class PosPurchaseItemController extends Controller
{
    /**
     * List all purchase items.
     */
    public function index()
    {
        $items = PosPurchaseItem::with('purchase', 'product')->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Store a new purchase item.
     */
    public function store(Request $request)
    {
        $request->validate([
            'purchase_id' => 'required|exists:pos_purchases,id',
            'product_id' => 'required|exists:pos_products,id',
            'quantity' => 'required|numeric|min:1',
            'cost_price' => 'required|numeric|min:0',
        ]);

        $item = PosPurchaseItem::create([
            'purchase_id' => $request->purchase_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'cost_price' => $request->cost_price,
            'subtotal' => $request->quantity * $request->cost_price,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Purchase item created successfully',
            'data' => $item->load('purchase', 'product')
        ]);
    }

    /**
     * Show a specific purchase item.
     */
    public function show(PosPurchaseItem $posPurchaseItem)
    {
        $posPurchaseItem->load('purchase', 'product');

        return response()->json([
            'success' => true,
            'data' => $posPurchaseItem
        ]);
    }

    /**
     * Update a purchase item.
     */
    public function update(Request $request, PosPurchaseItem $posPurchaseItem)
    {
        $request->validate([
            'quantity' => 'sometimes|required|numeric|min:1',
            'cost_price' => 'sometimes|required|numeric|min:0',
        ]);

        $posPurchaseItem->update($request->only('quantity', 'cost_price'));

        // Update subtotal
        $posPurchaseItem->subtotal = $posPurchaseItem->quantity * $posPurchaseItem->cost_price;
        $posPurchaseItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Purchase item updated successfully',
            'data' => $posPurchaseItem->load('purchase', 'product')
        ]);
    }

    /**
     * Delete a purchase item.
     */
    public function destroy(PosPurchaseItem $posPurchaseItem)
    {
        $posPurchaseItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase item deleted successfully'
        ]);
    }
}
