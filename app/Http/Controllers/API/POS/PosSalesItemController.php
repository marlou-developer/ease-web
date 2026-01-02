<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosSalesItem;
use Illuminate\Http\Request;

class PosSalesItemController extends Controller
{
    /**
     * List all sale items.
     */
    public function index()
    {
        $items = PosSalesItem::with('sale', 'product')->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Store a new sale item.
     */
    public function store(Request $request)
    {
        $request->validate([
            'sale_id' => 'required|exists:pos_sales,id',
            'product_id' => 'required|exists:pos_products,id',
            'quantity' => 'required|numeric|min:1',
            'selling_price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $item = PosSalesItem::create([
            'sale_id' => $request->sale_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'selling_price' => $request->selling_price,
            'discount' => $request->discount ?? 0,
            'subtotal' => ($request->quantity * $request->selling_price) - ($request->discount ?? 0),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sale item created successfully',
            'data' => $item->load('product', 'sale')
        ]);
    }

    /**
     * Show a specific sale item.
     */
    public function show(PosSalesItem $posSalesItem)
    {
        $posSalesItem->load('product', 'sale');

        return response()->json([
            'success' => true,
            'data' => $posSalesItem
        ]);
    }

    /**
     * Update a sale item.
     */
    public function update(Request $request, PosSalesItem $posSalesItem)
    {
        $request->validate([
            'quantity' => 'sometimes|required|numeric|min:1',
            'selling_price' => 'sometimes|required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $posSalesItem->update($request->only('quantity', 'selling_price', 'discount'));

        // Update subtotal
        $posSalesItem->subtotal = ($posSalesItem->quantity * $posSalesItem->selling_price) - ($posSalesItem->discount ?? 0);
        $posSalesItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Sale item updated successfully',
            'data' => $posSalesItem->load('product', 'sale')
        ]);
    }

    /**
     * Delete a sale item.
     */
    public function destroy(PosSalesItem $posSalesItem)
    {
        $posSalesItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sale item deleted successfully'
        ]);
    }
}
