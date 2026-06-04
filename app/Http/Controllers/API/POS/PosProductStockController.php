<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProduct;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosPurchase;
use App\Models\POS\PosStockMovement;
use App\Models\POS\PosStore;
use App\Models\POS\PosWarehouseStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PosProductStockController extends Controller
{
    /**
     * List all product stocks.
     */
    public function index()
    {
        $stocks = PosProductStock::where('pos_store_id', session('pos_store_id'))
            ->where('subscriber_id', Auth::id())
            ->with('product')->get();
        return response()->json($stocks, 200);
    }

    public function add_new_stock_in_store(Request $request)
    {

        $warehouse_stock = PosWarehouseStock::findOrFail($request->id);
        $warehouse_stock->decrement('stocks', $request->stocks);
        $store_stock = PosProductStock::firstOrNew([
            'pos_store_id'   => session('pos_store_id'),
            'pos_product_id' => $warehouse_stock->pos_product_id,
            'subscriber_id'  => Auth::id(),
            'cost_price'       => $request->cost_price,
            'sell_price'       => $request->sell_price,
        ], ['stocks' => 0]);
        $store_stock->stocks += $request->stocks;
        $store_stock->sell_price = $request->sell_price;
        $store_stock->save();
        return response()->json([
            'success' => true,
            'message' => 'Stock successfully transferred to the retail store store.',
        ]);
    }

    public function received_stock(Request $request)
    {
        foreach ($request->items as $item) {
            $base = PosWarehouseStock::findOrFail($item['pos_warehouse_stock_id']);
            $stock = PosWarehouseStock::firstOrNew([
                'pos_warehouse_id' => $base->pos_warehouse_id,
                'pos_product_id'   => $base->pos_product_id,
                'cost_price'       => $item['cost_price'],
                'subscriber_id'    => Auth::id(),
            ], ['stocks' => 0]);

            $stock->stocks += $item['quantity'];
            $stock->save();
        }

        PosPurchase::where('id', $request->id)->update(['status' => 'received']);

        return response()->json([
            'message' => 'Product stock received successfully',
        ]);
    }

    public function store(Request $request)
    {
        $auth = Auth::user();

        $pos_product = PosProduct::where('barcode', $request->barcode)->first();
        $pos_store = PosStore::where('id', session('pos_store_id'))->first();
        if (!$pos_product) {
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('ease-web-' . date("Y"), 's3');
                $url = Storage::disk('s3')->url($path);
            }
            $pos_product =  PosProduct::create([
                'unit_id' => $request->unit_id,
                'category_id' => $request->category_id,
                'barcode' => $request->barcode,
                'name' => $request->name,
                'image' =>  $url
            ]);
        }
        $pos_stock = PosProductStock::where([
            ['pos_product_id', '=', $pos_product->id],
            ['subscriber_id', '=', $auth->id]
        ])->first();

        $pos_warehouse_stock = PosWarehouseStock::where([
            ['pos_warehouse_id', '=', $pos_store->pos_warehouse_id],
            ['pos_product_id', '=', $pos_product->id],
            ['subscriber_id', '=', $auth->id]
        ])->first();


        if (!$pos_warehouse_stock) {
            PosWarehouseStock::create([
                'pos_warehouse_id' => $pos_store->pos_warehouse_id,
                'pos_product_id' => $pos_product->id,
                'subscriber_id' => $auth->id,
                'cost_price' => 0,
                'stocks' => 0,
            ]);
        }

        if (!$pos_stock) {
            $pos_product_stock = PosProductStock::create([
                'pos_store_id' => session('pos_store_id'),
                'pos_product_id' => $pos_product->id,
                'subscriber_id' => $auth->id,
                'stocks' => $request->stocks,
                'cost_price' => 0,
                'sell_price' => 0,
                'discount' => 0,
            ]);
            // $stock_movement = PosStockMovement::where('pos_product_stock_id', $pos_product_stock->id)->first();
            // if (!$stock_movement) {
            //     PosStockMovement::create([
            //         'pos_store_id' => session('pos_store_id'),
            //         'pos_product_stock_id' => $pos_product_stock->id,
            //         'subscriber_id' => Auth::id(),
            //         'type' => 'IN',
            //         'reference' => 'Initial Stock',
            //         'qty_before' => 0,
            //         'qty_change' => $request->stocks,
            //         'qty_after' => $request->stocks,
            //     ]);
            // }
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
