<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCashRegister;
use App\Models\POS\PosCashTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosCashRegisterController extends Controller
{
    /**
     * List all cash registers.
     */
    public function index()
    {
        $registers = PosCashRegister::with('user', 'cash_transactions')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $registers
        ]);
    }

    /**
     * Open a new cash register.
     */
    public function store(Request $request)
    {
        $request->validate([
            'opening_amount' => 'required|numeric|min:0',
        ]);

        $register = PosCashRegister::create([
            'user_id' => Auth::id(),
            'opened_at' => now(),
            'opening_amount' => $request->opening_amount,
            'total_sales' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cash register opened successfully',
            'data' => $register
        ]);
    }

    /**
     * Show specific register details.
     */
    public function show(PosCashRegister $posCashRegister)
    {
        $posCashRegister->load('user', 'cash_transactions');

        return response()->json([
            'success' => true,
            'data' => $posCashRegister
        ]);
    }

    /**
     * Close or update a register.
     */
    public function update(Request $request, PosCashRegister $posCashRegister)
    {
        $request->validate([
            'closing_amount' => 'required|numeric|min:0',
        ]);

        $posCashRegister->update([
            'closing_amount' => $request->closing_amount,
            'closed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cash register closed successfully',
            'data' => $posCashRegister
        ]);
    }

    /**
     * Delete a cash register.
     */
    public function destroy(PosCashRegister $posCashRegister)
    {
        $posCashRegister->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cash register deleted successfully'
        ]);
    }

    /**
     * Add a cash transaction (deposit, withdraw, expense).
     */
    public function addTransaction(Request $request, PosCashRegister $posCashRegister)
    {
        $request->validate([
            'type' => 'required|in:add,withdraw,expense',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string'
        ]);

        $transaction = PosCashTransaction::create([
            'register_id' => $posCashRegister->id,
            'type' => $request->type,
            'amount' => $request->amount,
            'reason' => $request->reason,
            'user_id' => Auth::id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaction added successfully',
            'data' => $transaction
        ]);
    }
}
