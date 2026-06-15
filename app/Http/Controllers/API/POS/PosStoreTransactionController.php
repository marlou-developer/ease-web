<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosStore;
use App\Models\POS\PosStoreTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosStoreTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $store = PosStore::where('id', session('pos_store_id'))->first();

        // 1. Filter the database query BEFORE pagination using whereHas
        $units = PosStoreTransaction::where('subscriber_id', Auth::user()->subscriber_id)
            ->whereHas('pos_product_stock', function ($query) use ($store) {
                // This checks the 'pos_product_stocks' table directly for the matching store ID
                $query->where('pos_store_id', $store->id);
            })
            ->with(['pos_sale', 'pos_warehouse', 'pos_product_stock', 'transact_by'])
            ->paginate(10);

        // 2. Transform the collection to append your custom attributes
        $units->getCollection()->transform(function ($transaction) {

            if ($transaction->status === 'Added') {
                $transaction->transfer_from = $transaction->pos_warehouse?->name;
                $transaction->transfer_to = $transaction->pos_product_stock->pos_store->name;
            } else if ($transaction->status === 'Deducted') {
                $transaction->transfer_from = $transaction->pos_product_stock->pos_store->name;
                $transaction->transfer_to = $transaction->pos_sale->customer->name ?? 'Customer';
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
    public function show(PosStoreTransaction $posStoreTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PosStoreTransaction $posStoreTransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosStoreTransaction $posStoreTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosStoreTransaction $posStoreTransaction)
    {
        //
    }
}
