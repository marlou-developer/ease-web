<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProduct;
use Illuminate\Http\Request;

class PosProductController extends Controller
{
    /**
     * List all products.
     */
    public function index()
    {
        $products = PosProduct::with('category', 'unit')->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Store a new product.
     */
    public function store(Request $request)
    {
        $request->validate([
            'barcode' => 'nullable|string|unique:pos_products,barcode',
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:pos_categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'image' => 'nullable|string', // optional image URL
        ]);
       

        $product = PosProduct::create($request->only(
            'name', 'barcode', 'category_id', 'unit_id', 
            'cost_price', 'sell_price', 'image'
        ));

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ]);
    }

    /**
     * Show a specific product.
     */
    public function show(PosProduct $posProduct)
    {
        $posProduct->load('category', 'unit');

        return response()->json([
            'success' => true,
            'data' => $posProduct
        ]);
    }

    /**
     * Update a product.
     */
    public function update(Request $request, PosProduct $posProduct)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'barcode' => 'nullable|string|unique:pos_products,barcode,' . $posProduct->id,
            'category_id' => 'nullable|exists:pos_categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'cost_price' => 'sometimes|required|numeric|min:0',
            'sell_price' => 'sometimes|required|numeric|min:0',
            'reorder_level' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $posProduct->update($request->only(
            'name', 'barcode', 'category_id', 'unit_id', 
            'cost_price', 'sell_price', 'reorder_level', 'description', 'image'
        ));

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $posProduct
        ]);
    }

    /**
     * Delete a product.
     */
    public function destroy(PosProduct $posProduct)
    {
        $posProduct->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
