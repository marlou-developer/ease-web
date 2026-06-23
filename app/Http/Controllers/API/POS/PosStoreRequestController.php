<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosStore;
use App\Models\POS\PosStoreRequest;
use App\Models\POS\PosStoreRequestItem;
use App\Models\POS\PosStoreTransaction;
use App\Models\POS\PosWarehouseStock;
use App\Models\POS\PosWarehouseTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosStoreRequestController extends Controller
{

    public function action_store_requests(Request $request)
    {
        $storeRequest = PosStoreRequest::find($request->id);

        if ($request->status == 'Received') {
            foreach ($request->request_items as $key => $value) {

                if (!is_array($value) || empty($value['warehouse_stock']['id'])) {
                    continue;
                }

                $warehouse_stock = PosWarehouseStock::findOrFail($value['warehouse_stock']['id']);
                $quantity = (int) ($value['quantity'] ?? 0);

                $warehouse_stock->decrement('stocks', $quantity);

                $store_stock = PosProductStock::firstOrNew([
                    'pos_store_id'   => session('pos_store_id'),
                    'pos_product_id' => $warehouse_stock->pos_product_id,
                    'subscriber_id'  => Auth::user()->subscriber_id ?? null,
                    'cost_price'     => $warehouse_stock->cost_price,
                    'selling_price'  => $warehouse_stock->selling_price,
                ], ['stocks' => 0]);

                $store_stock->stocks += $quantity;
                $store_stock->pos_supplier_id = $warehouse_stock->pos_supplier_id;
                $store_stock->selling_price   = $warehouse_stock->selling_price;
                $store_stock->save();

                $pos_warehouse_transaction = PosWarehouseTransaction::create([
                    'transact_by'            => Auth::id(),
                    'subscriber_id'          => Auth::user()->subscriber_id ?? null,
                    'pos_warehouse_id'       => $warehouse_stock->pos_warehouse_id,
                    'pos_product_stock_id'   => $store_stock->id,
                    'pos_warehouse_stock_id' => $warehouse_stock->id,
                    'stocks'                 => $quantity,
                    'status'                 => 'Deducted'
                ]);

                $transaction_id = str_pad($pos_warehouse_transaction->id, 10, '0', STR_PAD_LEFT);
                $pos_warehouse_transaction->update([
                    'transaction_id' => $transaction_id
                ]);

                $pos_store_transaction = PosStoreTransaction::create([
                    'transact_by'            => Auth::id(),
                    'subscriber_id'          => Auth::user()->subscriber_id ?? null,
                    'pos_warehouse_id'       => $warehouse_stock->pos_warehouse_id,
                    'pos_product_stock_id'   => $store_stock->id,
                    'pos_warehouse_stock_id' => $warehouse_stock->id,
                    'stocks'                 => $quantity,
                ]);

                $transaction_id = str_pad($pos_store_transaction->id, 10, '0', STR_PAD_LEFT);
                $pos_store_transaction->update([
                    'transaction_id' => $transaction_id
                ]);
            }
        }

        if ($storeRequest) {
            $storeRequest->update([
                'status' => $request->status
            ]);
        }

        return response()->json([
            'success' => true,
        ]);
    }
    public function index(Request $request)
    {
        $requests = PosStoreRequest::where('subscriber_id', Auth::user()->subscriber_id)
            ->where('pos_store_id', session('pos_store_id'))
            ->with(['processor', 'requestor', 'receiver', 'pos_store', 'request_items'])
            ->paginate();

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
                'pos_warehouse_stock_id' => $value['warehouse_stock']['id'],
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
