<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosSale;
use App\Models\POS\PosSalesItem;
use App\Models\POS\PosStoreTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosSalesItemController extends Controller
{
    /**
     * List all sale items.
     */
    public function index()
    {
        $items = PosSalesItem::with('sale', 'product')->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * Store a new sale item.
     */
    public function store(Request $request)
    {
        $request->validate([
            'sale_id' => 'required|exists:pos_sales,id',
            'pos_product_stock_id' => 'required|exists:pos_products,id',
            'quantity' => 'required|numeric|min:1',
            'selling_price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $item = PosSalesItem::create([
            'sale_id' => $request->sale_id,
            'pos_product_stock_id' => $request->pos_product_stock_id,
            'quantity' => $request->quantity,
            'selling_price' => $request->selling_price,
            'discount' => $request->discount ?? 0,
            'subtotal' => ($request->quantity * $request->selling_price) - ($request->discount ?? 0),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sale item created successfully',
            'data' => $item->load('product', 'sale')
        ]);
    }

    /**
     * Show a specific sale item.
     */
    public function show(PosSalesItem $posSalesItem)
    {
        $posSalesItem->load('product', 'sale');

        return response()->json([
            'success' => true,
            'data' => $posSalesItem
        ]);
    }

    /**
     * Update a sale item.
     */
    public function update(Request $request, PosSalesItem $posSalesItem)
    {
        $request->validate([
            'quantity' => 'sometimes|required|numeric|min:1',
            'selling_price' => 'sometimes|required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $posSalesItem->update($request->only('quantity', 'selling_price', 'discount'));

        // Update subtotal
        $posSalesItem->subtotal = ($posSalesItem->quantity * $posSalesItem->selling_price) - ($posSalesItem->discount ?? 0);
        $posSalesItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Sale item updated successfully',
            'data' => $posSalesItem->load('product', 'sale')
        ]);
    }

    /**
     * Delete a sale item.
     */
    public function destroy($id)
    {
        $posSalesItem = PosSalesItem::where('id', $id)->first();

        if ($posSalesItem) {
            $pos_sales = PosSale::where('id', $posSalesItem->sale_id)->first();
            if ($pos_sales) {
                $newTotalAmount = max(0, $pos_sales->total_amount - $posSalesItem->selling_price);
                $newDiscount    = max(0, $pos_sales->discount - $posSalesItem->discount);
                $newChangeDue   = max(0, $pos_sales->amount_paid - $newTotalAmount);
                // return response()->json([
                //     'total_amount' => $newTotalAmount,
                //     'amount' => ($newTotalAmount - $newDiscount),
                //     'discount'     => $newDiscount, // done
                //     'change_due'   => $newChangeDue, //done
                // ], 500);
                $pos_sales->update([
                    'total_amount' => $newTotalAmount,
                    'amount' => ($newTotalAmount - $newDiscount),
                    'discount'     => $newDiscount,
                    'change_due'   => $newChangeDue,
                    'balance' => $pos_sales->balance - $posSalesItem->total
                ]);
            }
            $pos_product_stock = PosProductStock::where('id', $posSalesItem->pos_product_stock_id)->first();

            if ($pos_product_stock) {
                $pos_product_stock->increment('stocks', $posSalesItem->quantity);
                $pos_store_transaction =  PosStoreTransaction::create([
                    'transact_by' => Auth::id(),
                    'subscriber_id' => Auth::user()->subscriber_id,
                    // 'pos_warehouse_id' => $warehouse_stock->pos_warehouse_id,
                    'pos_product_stock_id' => $posSalesItem->pos_product_stock_id,
                    // 'pos_warehouse_stock_id' => $warehouse_stock->id,
                    'stocks' => $posSalesItem->quantity,
                ]);
                $transaction_id = str_pad($pos_store_transaction->id, 10, '0', STR_PAD_LEFT);
                $pos_store_transaction->update([
                    'transaction_id' => $transaction_id
                ]);
            }
            $posSalesItem->delete();
        }
        return response()->json([
            'data'    => $posSalesItem,
            'success' => true,
            'message' => 'Sale item deleted successfully'
        ]);
    }
}
