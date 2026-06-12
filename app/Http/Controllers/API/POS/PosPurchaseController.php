<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosPurchase;
use App\Models\POS\PosPurchaseItem;
use App\Models\POS\PosStore;
use App\Models\POS\PosSupplier;
use App\Models\POS\PosWarehouseStock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosPurchaseController extends Controller
{
    /**
     * List all purchases.
     */
    public function index()
    {
        $purchases = PosPurchase::where('pos_store_id', session('pos_store_id'))
            ->where('subscriber_id', Auth::user()->subscriber_id)
            ->with('supplier', 'items.pos_warehouse_stock')
            ->latest()->get();

        $suppliers = PosSupplier::where('subscriber_id', Auth::user()->subscriber_id)->latest()->get();
        $pos_store = PosStore::where('id', session('pos_store_id'))->first();

        $products = PosWarehouseStock::where('pos_warehouse_id', $pos_store->pos_warehouse_id)
            ->where('subscriber_id', Auth::user()->subscriber_id)->with(['product'])
            ->latest()->get();

        return response()->json([
            'success' => true,
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'products' => $products
        ]);
    }

    /**
     * Store a new purchase.
     */
    public function store(Request $request)
    {

        $purchase = PosPurchase::create([
            'pos_store_id' => session('pos_store_id'),
            'subscriber_id' => Auth::user()->subscriber_id,
            'pos_supplier_id' => $request->pos_supplier_id,
            'reference_no' => 'REF' . Carbon::now()->format('mdYHis'),
            'total_amount' => 0,
            'status' => 'pending',
        ]);

        foreach ($request->purchases as $item) {
            PosPurchaseItem::create([
                'pos_purchase_id' => $purchase->id,
                'pos_warehouse_stock_id' => $item['pos_warehouse_stock_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Purchase created successfully',
        ]);
    }

    /**
     * Show a specific purchase.
     */
    public function show(PosPurchase $posPurchase)
    {
        $posPurchase->load('items.product', 'supplier');

        return response()->json([
            'success' => true,
            'data' => $posPurchase
        ]);
    }

    /**
     * Update a purchase.
     */
    public function update(Request $request, PosPurchase $posPurchase)
    {
        $request->validate([
            'pos_supplier_id' => 'nullable|exists:suppliers,id',
            'reference_no' => 'nullable|string|max:100',
            'status' => 'nullable|in:pending,received',
        ]);

        $posPurchase->update($request->only('pos_supplier_id', 'reference_no', 'status'));

        return response()->json([
            'success' => true,
            'message' => 'Purchase updated successfully',
            'data' => $posPurchase->load('items.product', 'supplier')
        ]);
    }

    /**
     * Delete a purchase.
     */
    public function destroy(PosPurchase $posPurchase)
    {
        $posPurchase->items()->delete(); // Delete related items first
        $posPurchase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Purchase deleted successfully'
        ]);
    }
}
