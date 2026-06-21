<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosStore;
use App\Models\POS\PosStoreRequest;
use App\Models\POS\PosStoreRequestItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosStoreRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $requests = PosStoreRequest::where('subscriber_id', Auth::user()->subscriber_id)
            ->where('pos_store_id', session('pos_store_id'))->paginate();
        $pos_store = PosStore::where('id', session('pos_store_id'))
            ->where('subscriber_id', Auth::user()->subscriber_id)->with(['pos_warehouse'])->first();
        return response()->json([
            'success' => true,
            'requests' => $requests,
            'warehouse_products' => $pos_store->pos_warehouse['pos_warehouse_stocks']
        ]);
    }

    public function store(Request $request)
    {
        $pos_store_request = PosStoreRequest::create([
            'subscriber_id' => Auth::user()->subscriber_id,
            'requestor_id' => Auth::id(),
            'pos_store_id' => session('pos_store_id'),
        ]);

        foreach ($request->requests as $key => $value) {
            PosStoreRequestItem::create([
                'pos_store_request_id' => $pos_store_request->id,
                'pos_warehouse_stock_id' => $value['pos_warehouse_stock_id'],
                'quantity' => $value['quantity'],
            ]);
        }
        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PosStoreRequest $posStoreRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PosStoreRequest $posStoreRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosStoreRequest $posStoreRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosStoreRequest $posStoreRequest)
    {
        //
    }
}
