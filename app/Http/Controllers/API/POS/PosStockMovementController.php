<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosStockMovement;
use App\Models\POS\PosProductStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosStockMovementController extends Controller
{
    /**
     * List all stock movements.
     */
    public function index()
    {
        $movements = PosStockMovement::with('product', 'user')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $movements
        ]);
    }

    /**
     * Store a new stock movement.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:pos_products,id',
            'quantity' => 'required|numeric',
            'type' => 'required|in:add,remove,transfer',
            'reason' => 'nullable|string',
            'location_from' => 'nullable|string',
            'location_to' => 'nullable|string',
        ]);

        // Create stock movement record
        $movement = PosStockMovement::create([
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'type' => $request->type,
            'reason' => $request->reason,
            'location_from' => $request->location_from,
            'location_to' => $request->location_to,
            'user_id' => Auth::id(),
        ]);

        // Update product stock
        $stock = PosProductStock::firstOrCreate(
            ['product_id' => $request->product_id, 'location' => $request->location_to ?? 'default'],
            ['quantity' => 0]
        );

        if ($request->type === 'add') {
            $stock->quantity += $request->quantity;
        } elseif ($request->type === 'remove') {
            $stock->quantity -= $request->quantity;
        } elseif ($request->type === 'transfer') {
            // Subtract from old location
            if ($request->location_from) {
                $stockFrom = PosProductStock::firstOrCreate(
                    ['product_id' => $request->product_id, 'location' => $request->location_from],
                    ['quantity' => 0]
                );
                $stockFrom->quantity -= $request->quantity;
                $stockFrom->save();
            }
            $stock->quantity += $request->quantity;
        }

        $stock->save();

        return response()->json([
            'success' => true,
            'message' => 'Stock movement recorded successfully',
            'data' => $movement
        ]);
    }

    /**
     * Show a specific stock movement.
     */
    public function show(PosStockMovement $posStockMovement)
    {
        $posStockMovement->load('product', 'user');

        return response()->json([
            'success' => true,
            'data' => $posStockMovement
        ]);
    }

    /**
     * Update a stock movement.
     */
    public function update(Request $request, PosStockMovement $posStockMovement)
    {
        $request->validate([
            'quantity' => 'sometimes|required|numeric',
            'reason' => 'nullable|string',
        ]);

        $posStockMovement->update($request->only('quantity', 'reason'));

        return response()->json([
            'success' => true,
            'message' => 'Stock movement updated successfully',
            'data' => $posStockMovement->load('product', 'user')
        ]);
    }

    /**
     * Delete a stock movement.
     */
    public function destroy(PosStockMovement $posStockMovement)
    {
        $posStockMovement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Stock movement deleted successfully'
        ]);
    }
}
