<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosStore;
use App\Models\POS\PosSupplier;
use App\Models\POS\PosWarehouseStock;
use App\Models\POS\PosWarehouseTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosWarehouseTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1. Fetched ONCE here.
        $store = PosStore::where('id', session('pos_store_id'))->first();

        $query = PosWarehouseTransaction::where('subscriber_id', Auth::user()->subscriber_id);

        // --- SEARCH FILTERS APPLIED HERE ---
        $query->when($request->filled('date_range'), function ($q) use ($request) {
            $dates = explode(',', $request->date_range);
            if (count($dates) === 2) {
                $q->whereBetween('created_at', [$dates[0] . ' 00:00:00', $dates[1] . ' 23:59:59']);
            }
        });

        // Note: Double-check if this should be 'pos_warehouse_stock_id' instead of 'pos_warehouse_stock_id'
        $query->when($request->filled('pos_warehouse_stock_id'), function ($q) use ($request) {
            $q->where('pos_warehouse_stock_id', $request->pos_warehouse_stock_id);
        });

        $query->when($request->filled('pos_supplier_id'), function ($q) use ($request) {
            $q->whereHas('pos_warehouse_stock.product', function ($subQuery) use ($request) {
                $subQuery->where('pos_supplier_id', $request->pos_supplier_id);
            });
        });

        // FIX 1: You were missing the execution of the query! 
        // We define $units here, eager load the nested relationships, and paginate.
        $units = $query->with([
            'pos_warehouse',
            'pos_warehouse_stock',
            'pos_product_stock.pos_store', // <-- Prevents N+1 in the transform loop
            'transact_by' // Assuming you still want this based on your earlier code
        ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // FIX 2: Added null-safe operators (?->) and removed unused `use ($store)`
        $units->getCollection()->transform(function ($transaction) {
            if ($transaction->status === 'Added') {
                $transaction->transfer_from = 'Purchases';
                $transaction->transfer_to = $transaction->pos_warehouse?->name;
            } else if ($transaction->status === 'Deducted') {
                $transaction->transfer_from = $transaction->pos_warehouse?->name;
                $transaction->transfer_to = $transaction->pos_product_stock?->pos_store?->name;
            } else {
                $transaction->transfer_from = null;
                $transaction->transfer_to = null;
            }
            return $transaction;
        });

        $stocks = PosWarehouseStock::where('subscriber_id', Auth::user()->subscriber_id)
            ->where('pos_warehouse_id', $store->pos_warehouse_id)
            ->with('product')->get();

        $suppliers = PosSupplier::where('subscriber_id', Auth::user()->subscriber_id)->latest()->get();

        $stats = PosWarehouseTransaction::selectRaw("
        SUM(CASE WHEN status = 'Added' THEN stocks ELSE 0 END) as total_added,
        SUM(CASE WHEN status = 'Deducted' THEN stocks ELSE 0 END) as total_deducted,
        (SUM(CASE WHEN status = 'Added' THEN stocks ELSE 0 END) - SUM(CASE WHEN status = 'Deducted' THEN stocks ELSE 0 END)) as current_stock
    ")
            ->where('subscriber_id', Auth::user()->subscriber_id)
            ->when($request->filled('pos_warehouse_stock_id'), function ($q) use ($request) {
                $q->where('pos_warehouse_stock_id', $request->pos_warehouse_stock_id);
            })
            ->first();

        return response()->json([
            'success'   => true,
            'data'      => $units,
            'stats'     => $stats,
            'suppliers' => $suppliers,
            'stocks'    => $stocks
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
