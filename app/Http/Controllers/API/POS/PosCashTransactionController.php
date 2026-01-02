<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCashTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosCashTransactionController extends Controller
{
    /**
     * List all cash transactions.
     */
    public function index()
    {
        $transactions = PosCashTransaction::with('register', 'user')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Store a newly created transaction.
     */
    public function store(Request $request)
    {
        $request->validate([
            'register_id' => 'required|exists:pos_cash_registers,id',
            'type' => 'required|in:add,withdraw,expense',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string'
        ]);

        $transaction = PosCashTransaction::create([
            'register_id' => $request->register_id,
            'type' => $request->type,
            'amount' => $request->amount,
            'reason' => $request->reason,
            'user_id' => Auth::id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaction created successfully',
            'data' => $transaction
        ]);
    }

    /**
     * Display the specified transaction.
     */
    public function show(PosCashTransaction $posCashTransaction)
    {
        $posCashTransaction->load('register', 'user');

        return response()->json([
            'success' => true,
            'data' => $posCashTransaction
        ]);
    }

    /**
     * Update the specified transaction.
     */
    public function update(Request $request, PosCashTransaction $posCashTransaction)
    {
        $request->validate([
            'type' => 'sometimes|required|in:add,withdraw,expense',
            'amount' => 'sometimes|required|numeric|min:0',
            'reason' => 'nullable|string'
        ]);

        $posCashTransaction->update($request->only('type','amount','reason'));

        return response()->json([
            'success' => true,
            'message' => 'Transaction updated successfully',
            'data' => $posCashTransaction
        ]);
    }

    /**
     * Remove the specified transaction.
     */
    public function destroy(PosCashTransaction $posCashTransaction)
    {
        $posCashTransaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaction deleted successfully'
        ]);
    }
}
