<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCustomer;
use App\Models\POS\PosProduct;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosPurchase;
use App\Models\POS\PosStockMovement;
use App\Models\POS\PosStore;
use App\Models\POS\PosStoreTransaction;
use App\Models\POS\PosWarehouseStock;
use App\Models\POS\PosWarehouseTransaction;
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
            ->where('subscriber_id', Auth::user()->subscriber_id)
            ->with('product')->get();
        $customers = PosCustomer::where('subscriber_id', Auth::user()->subscriber_id)->get();

        return response()->json([
            'pos_product_stock' => $stocks,
            'customers' => $customers
        ]);
    }

    public function add_new_stock_in_store(Request $request)
    {

        $warehouse_stock = PosWarehouseStock::findOrFail($request->id);
        $warehouse_stock->decrement('stocks', $request->stocks);
        $store_stock = PosProductStock::firstOrNew([
            'pos_store_id'   => session('pos_store_id'),
            'pos_product_id' => $warehouse_stock->pos_product_id,
            'subscriber_id'  => Auth::user()->subscriber_id,
            'cost_price'       => $request->cost_price,
            'selling_price'       => $request->selling_price,
        ], ['stocks' => 0]);
        $store_stock->stocks += $request->stocks;
        $store_stock->pos_supplier_id = $request->pos_supplier_id ?? null;
        $store_stock->selling_price = $request->selling_price;
        $store_stock->save();

        $pos_warehouse_transaction =  PosWarehouseTransaction::create([
            'transact_by' => Auth::id(),
            'subscriber_id' => Auth::user()->subscriber_id,
            'pos_warehouse_id' => $warehouse_stock->pos_warehouse_id,
            'pos_product_stock_id' => $store_stock->id,
            'pos_warehouse_stock_id' => $warehouse_stock->id,
            'pos_purchase_id' => $request->id,
            'stocks' => $request->stocks,
            'status' => 'Deducted'
        ]);
        $transaction_id = str_pad($pos_warehouse_transaction->id, 10, '0', STR_PAD_LEFT);
        $pos_warehouse_transaction->update([
            'transaction_id' => $transaction_id
        ]);

        $pos_store_transaction =  PosStoreTransaction::create([
            'transact_by' => Auth::id(),
            'subscriber_id' => Auth::user()->subscriber_id,
            'pos_warehouse_id' => $warehouse_stock->pos_warehouse_id,
            'pos_product_stock_id' => $store_stock->id,
            'pos_warehouse_stock_id' => $warehouse_stock->id,
            'stocks' => $request->stocks,
        ]);
        $transaction_id = str_pad($pos_store_transaction->id, 10, '0', STR_PAD_LEFT);
        $pos_store_transaction->update([
            'transaction_id' => $transaction_id
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Stock successfully transferred to the retail store store.',
        ]);
    }

    public function received_stock(Request $request)
    {
        foreach ($request->items as $item) {
            $base = PosWarehouseStock::findOrFail($item['pos_warehouse_stock_id']);

            // Create a variable to safely hold our ID
            $stockId = null;

            if ($base->cost_price == 0 && $base->selling_price == 0 && $base->stocks == 0) {

                // 1. Update the price/supplier info (do NOT assign this to a $stock variable)
                $base->update([
                    'pos_supplier_id' => $request->pos_supplier_id,
                    'cost_price'      => $item['cost_price'],
                    'selling_price'   => $item['selling_price'],
                ]);

                // 2. Safely ADD the incoming quantity to the existing stocks
                $base->increment('stocks', $item['quantity']);

                // 3. Grab the ID safely
                $stockId = $base->id;
            } else {
                $stock = PosWarehouseStock::firstOrCreate([
                    'pos_supplier_id'  => $request->pos_supplier_id,
                    'pos_warehouse_id' => $base->pos_warehouse_id,
                    'pos_product_id'   => $base->pos_product_id,
                    'cost_price'       => $item['cost_price'],
                    'selling_price'    => $item['selling_price'],
                    'subscriber_id'    => Auth::user()->subscriber_id,
                ], ['stocks' => 0]);

                // Safely ADD the incoming quantity
                $stock->increment('stocks', $item['quantity']);

                // Grab the ID safely
                $stockId = $stock->id;
            }

            // Create transaction using the safe $stockId
            $pos_warehouse_transaction = PosWarehouseTransaction::create([
                'transact_by'            => Auth::id(),
                'subscriber_id'          => Auth::user()->subscriber_id,
                'pos_warehouse_id'       => $base->pos_warehouse_id,
                'pos_warehouse_stock_id' => $stockId, // <-- No more boolean crash!
                'pos_purchase_id'        => $request->id,
                'stocks'                 => $item['quantity'],
            ]);

            $transaction_id = str_pad($pos_warehouse_transaction->id, 10, '0', STR_PAD_LEFT);
            $pos_warehouse_transaction->update([
                'transaction_id' => $transaction_id
            ]);
        }

        PosPurchase::where('id', $request->id)->update(['status' => 'received']);

        return response()->json([
            'message' => 'Product stock received successfully',
        ]);
    }
    public function store(Request $request)
    {
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
            ['subscriber_id', '=', Auth::user()->subscriber_id]
        ])->first();

        $pos_warehouse_stock = PosWarehouseStock::where([
            ['pos_warehouse_id', '=', $pos_store->pos_warehouse_id],
            ['pos_product_id', '=', $pos_product->id],
            ['subscriber_id', '=', Auth::user()->subscriber_id]
        ])->first();


        if (!$pos_warehouse_stock) {
            PosWarehouseStock::create([
                'pos_warehouse_id' => $pos_store->pos_warehouse_id,
                'pos_product_id' => $pos_product->id,
                'subscriber_id' => Auth::user()->subscriber_id,
                'cost_price' => 0,
                'stocks' => 0,
            ]);
        }

        if (!$pos_stock) {
            PosProductStock::create([
                'pos_store_id' => session('pos_store_id'),
                'pos_product_id' => $pos_product->id,
                'subscriber_id' => Auth::user()->subscriber_id,
                'stocks' => 0,
                'cost_price' => 0,
                'selling_price' => 0,
                'discount' => 0,
            ]);
            // $stock_movement = PosStockMovement::where('pos_product_stock_id', $pos_product_stock->id)->first();
            // if (!$stock_movement) {
            //     PosStockMovement::create([
            //         'pos_store_id' => session('pos_store_id'),
            //         'pos_product_stock_id' => $pos_product_stock->id,
            //         'subscriber_id' => Auth::user()->subscriber_id,
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
    public function update(Request $request, $id)
    {
        $pos_product_stock =  PosProductStock::where('id', $id)->first();
        if ($pos_product_stock) {
            $pos_product_stock->update($request->all());
        }
        return response()->json([
            'success' => true,
            'message' => 'Product stock updated successfully',
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
