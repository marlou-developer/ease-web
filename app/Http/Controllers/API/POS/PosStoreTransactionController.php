<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosStore;
use App\Models\POS\PosStoreTransaction;
use App\Models\POS\PosSupplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosStoreTransactionController extends Controller
{

    public function index(Request $request)
    {
        $store = PosStore::where('id', session('pos_store_id'))->first();

        // 1. Initialize the query
        $query = PosStoreTransaction::where('subscriber_id', Auth::user()->subscriber_id)
            ->whereHas('pos_product_stock', function ($query) use ($store) {
                $query->where('pos_store_id', $store->id);
            });

        // --- SEARCH FILTERS APPLIED HERE ---

        // Filter by Date Range (Format from React: "YYYY-MM-DD,YYYY-MM-DD")
        $query->when($request->filled('date_range'), function ($q) use ($request) {
            $dates = explode(',', $request->date_range);
            if (count($dates) === 2) {
                // Assuming you want to filter by the 'created_at' column. 
                // We append times to ensure the entire end day is included.
                $q->whereBetween('created_at', [$dates[0] . ' 00:00:00', $dates[1] . ' 23:59:59']);
            }
        });

        // Filter by Product/Stock
        // Note: Your React component names this `pos_product_stock_id` but maps it to `store_stocks`. 
        // Adjust the column name 'pos_product_stock_id' if your DB schema uses a different foreign key.
        $query->when($request->filled('pos_product_stock_id'), function ($q) use ($request) {
            $q->where('pos_product_stock_id', $request->pos_product_stock_id);
        });

        // Filter by Supplier
        $query->when($request->filled('pos_supplier_id'), function ($q) use ($request) {
            // Option A: If supplier ID is stored directly on the transaction table
            // $q->where('pos_supplier_id', $request->pos_supplier_id);

            // Option B: If supplier is attached to the product inside the stock relationship
            $q->whereHas('pos_product_stock.product', function ($subQuery) use ($request) {
                $subQuery->where('pos_supplier_id', $request->pos_supplier_id);
            });
        });
        // Execute query, load relationships, and paginate
        $units = $query->with(['pos_sale', 'pos_warehouse', 'pos_product_stock', 'transact_by'])
            ->latest() // Optional but recommended to show newest first
            ->paginate(10)
            ->withQueryString(); // IMPORTANT: This keeps your URL search params intact when navigating pagination pages!

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

        $stocks = PosProductStock::where('pos_store_id', session('pos_store_id'))
            ->where('subscriber_id', Auth::user()->subscriber_id)
            ->with('product')->get();

        $suppliers = PosSupplier::where('subscriber_id', Auth::user()->subscriber_id)->latest()->get();

        $stats = PosStoreTransaction::selectRaw("
        SUM(CASE WHEN status = 'Added' THEN stocks ELSE 0 END) as total_added,
        SUM(CASE WHEN status = 'Deducted' THEN stocks ELSE 0 END) as total_deducted,
        (SUM(CASE WHEN status = 'Added' THEN stocks ELSE 0 END) - SUM(CASE WHEN status = 'Deducted' THEN stocks ELSE 0 END)) as current_stock
    ")
            ->where('subscriber_id', Auth::user()->subscriber_id)
            ->where('pos_product_stock_id',  $request->pos_product_stock_id)
            ->first();
        return response()->json([
            'success' => true,
            'stats' => $stats,
            'data'    => $units,
            'stocks'  => $stocks,
            'suppliers' => $suppliers,
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
