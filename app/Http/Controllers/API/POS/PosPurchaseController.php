<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosPurchase;
use App\Models\POS\PosPurchaseItem;
use App\Models\POS\PosSupplier;
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
        $purchases = PosPurchase::where('subscriber_id', Auth::id())->with('supplier', 'items.product_stock')->latest()->get();
        $suppliers = PosSupplier::where('subscriber_id', Auth::id())->latest()->get();
        $products = PosProductStock::where('subscriber_id', Auth::id())->with(['product'])->latest()->get();
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

        // Calculate total
        $total = collect($request->purchases)->sum(function ($item) {
            return $item['quantity'] * $item['cost_price'];
        });
        

        $purchase = PosPurchase::create([
            'subscriber_id' => Auth::id(),
            'pos_supplier_id' => $request->pos_supplier_id,
            'reference_no' => 'REF' . Carbon::now()->format('mdYHis'),
            'total_amount' => $total,
            'status' => 'pending',
        ]);

        // Add purchase items
        foreach ($request->purchases as $item) {
            PosPurchaseItem::create([
                'pos_purchase_id' => $purchase->id,
                'pos_product_stock_id' => $item['pos_product_stock_id'],
                'quantity' => $item['quantity'],
                'cost_price' => $item['cost_price'],
                'subtotal' => $item['quantity'] * $item['cost_price'],
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
