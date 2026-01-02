<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use Illuminate\Http\Request;

class PosProductStockController extends Controller
{
    /**
     * List all product stocks.
     */
    public function index()
    {
        $stocks = PosProductStock::with('product')->get();

        return response()->json([
            'success' => true,
            'data' => $stocks
        ]);
    }

    /**
     * Store a new product stock.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:pos_products,id',
            'quantity' => 'required|numeric|min:0',
            'location' => 'nullable|string|max:255',
        ]);

        $stock = PosProductStock::create($request->only('product_id', 'quantity', 'location'));

        return response()->json([
            'success' => true,
            'message' => 'Product stock added successfully',
            'data' => $stock
        ]);
    }

    /**
     * Show a specific product stock.
     */
    public function show(PosProductStock $posProductStock)
    {
        $posProductStock->load('product');

        return response()->json([
            'success' => true,
            'data' => $posProductStock
        ]);
    }

    /**
     * Update a product stock.
     */
    public function update(Request $request, PosProductStock $posProductStock)
    {
        $request->validate([
            'quantity' => 'sometimes|required|numeric|min:0',
            'location' => 'nullable|string|max:255',
        ]);

        $posProductStock->update($request->only('quantity', 'location'));

        return response()->json([
            'success' => true,
            'message' => 'Product stock updated successfully',
            'data' => $posProductStock
        ]);
    }

    /**
     * Delete a product stock.
     */
    public function destroy(PosProductStock $posProductStock)
    {
        $posProductStock->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product stock deleted successfully'
        ]);
    }
}
