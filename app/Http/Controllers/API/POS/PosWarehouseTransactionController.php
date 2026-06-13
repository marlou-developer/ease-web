<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosStore;
use App\Models\POS\PosWarehouseTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosWarehouseTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 1. Fetched ONCE here.
        $store = PosStore::where('id', session('pos_store_id'))->first();

        $units = PosWarehouseTransaction::where('subscriber_id', Auth::user()->subscriber_id)
            ->where('pos_warehouse_id', $store->pos_warehouse_id)
            ->with(['pos_purchase', 'pos_warehouse', 'pos_product_stock','transact_by'])
            ->paginate(10);

        // 2. Pass $store into the closure with `use ($store)`
        $units->getCollection()->transform(function ($transaction) use ($store) {
            if ($transaction->status === 'Added') {
                $transaction->transfer_from = 'Purchases';
                $transaction->transfer_to = $transaction->pos_warehouse?->name;
            } else if ($transaction->status === 'Deducted') {
                $transaction->transfer_from = $transaction->pos_warehouse?->name;
                $transaction->transfer_to = $transaction->pos_product_stock->pos_store->name;
            } else {
                $transaction->transfer_from = null;
                $transaction->transfer_to = null;
            }
            return $transaction;
        });

        return response()->json([
            'success' => true,
            'data'    => $units
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
    public function show(PosWarehouseTransaction $posWarehouseTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PosWarehouseTransaction $posWarehouseTransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosWarehouseTransaction $posWarehouseTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosWarehouseTransaction $posWarehouseTransaction)
    {
        //
    }
}
