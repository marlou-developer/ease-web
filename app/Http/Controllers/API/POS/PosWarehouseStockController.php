<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCategory;
use App\Models\POS\PosProduct;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosStore;
use App\Models\POS\PosSupplier;
use App\Models\POS\PosUnit;
use App\Models\POS\PosWarehouse;
use App\Models\POS\PosWarehouseStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PosWarehouseStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pos_store = PosStore::where('id', session('pos_store_id'))
            ->where('subscriber_id', Auth::user()->subscriber_id)->with(['pos_warehouse'])->first();
        $categories = PosCategory::where('subscriber_id', Auth::user()->subscriber_id)->get();
        $suppliers = PosSupplier::where('subscriber_id', Auth::user()->subscriber_id)->get();
        $units = PosUnit::get();
        return response()->json([
            'success' => true,
            'categories' => $categories,
            'units' => $units,
            'data' => $pos_store,
            'suppliers' => $suppliers
        ]);
    }

    public function update(Request $request, $id)
    {
        $pos_product = PosProduct::where('id', $request->pos_product_id)->first();

        $pos_warehouse_stock = PosWarehouseStock::where('id', $request->id)->first();

        $pos_product_stock = PosProductStock::where('pos_product_id', $request->pos_product_id)
            ->where('subscriber_id', $request->subscriber_id)
            ->first();

        if ($pos_product) {
            $pos_product->update([
                'barcode' => $request->barcode,
                'unit_id' => $request->unit_id,
                'category_id' => $request->category_id,
            ]);
        }

        if ($pos_product_stock && !$pos_product_stock->pos_supplier_id) {
            $pos_product_stock->update([
                'pos_supplier_id' => $request->pos_supplier_id
            ]);
        }

        // 2. Update Product Stock (Wrapped in a null check!)
        if ($pos_product_stock) {
            if ($pos_product_stock->cost_price == 0.00) {
                $pos_product_stock->update([
                    'cost_price' => $request->cost_price // ✅ Fixed
                ]);
            }

            if ($pos_product_stock->selling_price == 0.00) {
                $pos_product_stock->update([
                    'selling_price' => $request->selling_price // ✅ Fixed
                ]);
            }
        }

        if ($pos_warehouse_stock) {
            $pos_warehouse_stock->update([
                'cost_price' => $request->cost_price,
                'selling_price' => $request->selling_price,
                'stocks' => $request->stocks,
                'pos_supplier_id' => $request->pos_supplier_id
            ]);
        }

        if ($request->hasFile('image')) {
            if ($pos_product && !$pos_product->image) {
                $path = $request->file('image')->store('ease-web-' . date("Y"), 's3');
                $url = Storage::disk('s3')->url($path);
                $pos_product->update([
                    'image' => $url
                ]);
            }
        }

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PosWarehouseStock $posWarehouseStock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PosWarehouseStock $posWarehouseStock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosWarehouseStock $posWarehouseStock)
    {
        //
    }
}
