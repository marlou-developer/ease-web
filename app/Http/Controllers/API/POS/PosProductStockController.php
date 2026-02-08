<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProduct;
use App\Models\POS\PosProductStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosProductStockController extends Controller
{
    /**
     * List all product stocks.
     */
    public function index()
    {
        $stocks = PosProductStock::with('product')->get();
        return response()->json($stocks, 200);
    }

    /**
     * Store a new product stock.
     */
    public function store(Request $request)
    {
        $auth = Auth::user();

        $pos_product = PosProduct::where('barcode', $request->barcode)->first();

        if (!$pos_product) {
            $pos_product =  PosProduct::create([
                'unit_id' => $request->unit_id,
                'category_id' => $request->category_id,
                'barcode' => $request->barcode,
                'name' => $request->name,
                'image' => $request->image
            ]);
        }
        $pos_stock = PosProductStock::where([
            ['product_id', '=', $pos_product->id],
            ['subscriber_id', '=', $auth->id]
        ])->first();
        if (!$pos_stock) {
            PosProductStock::create([
                'product_id' => $pos_product->id,
                'subscriber_id' => $auth->id,
                'stocks' => $request->stocks,
                'cost_price' => $request->cost_price,
                'sell_price' => $request->sell_price,
                'discount' => 0,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product stock added successfully',
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
