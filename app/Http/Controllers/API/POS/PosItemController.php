<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosItem;
use Illuminate\Http\Request;

class PosItemController extends Controller
{
    /**
     * List all POS items.
     */
    public function index()
    {
        $items = PosItem::with('category', 'unit')->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Store a new POS item.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|unique:pos_items,barcode',
            'category_id' => 'nullable|exists:pos_categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'reorder_level' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $item = PosItem::create($request->only(
            'name', 'barcode', 'category_id', 'unit_id', 
            'cost_price', 'sell_price', 'reorder_level', 'description'
        ));

        return response()->json([
            'success' => true,
            'message' => 'POS item created successfully',
            'data' => $item
        ]);
    }

    /**
     * Show a specific POS item.
     */
    public function show(PosItem $posItem)
    {
        $posItem->load('category', 'unit');

        return response()->json([
            'success' => true,
            'data' => $posItem
        ]);
    }

    /**
     * Update a POS item.
     */
    public function update(Request $request, PosItem $posItem)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'barcode' => 'nullable|string|unique:pos_items,barcode,' . $posItem->id,
            'category_id' => 'nullable|exists:pos_categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'cost_price' => 'sometimes|required|numeric|min:0',
            'sell_price' => 'sometimes|required|numeric|min:0',
            'reorder_level' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $posItem->update($request->only(
            'name', 'barcode', 'category_id', 'unit_id', 
            'cost_price', 'sell_price', 'reorder_level', 'description'
        ));

        return response()->json([
            'success' => true,
            'message' => 'POS item updated successfully',
            'data' => $posItem
        ]);
    }

    /**
     * Delete a POS item.
     */
    public function destroy(PosItem $posItem)
    {
        $posItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'POS item deleted successfully'
        ]);
    }
}
