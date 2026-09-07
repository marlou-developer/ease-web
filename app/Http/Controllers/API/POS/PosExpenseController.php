<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = PosExpense::where('subscriber_id', Auth::user()->subscriber_id)
            ->with('category')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $expenses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pos_expense_category_id' => 'required|exists:pos_expense_categories,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $expense = PosExpense::create([
            'subscriber_id' => Auth::user()->subscriber_id,
            'pos_expense_category_id' => $request->pos_expense_category_id,
            'title' => $request->title,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense successfully saved.',
            'data' => $expense->load('category')
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PosExpense $posExpense)
    {
        return response()->json([
            'success' => true,
            'data' => $posExpense->load('category')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosExpense $posExpense)
    {
        $request->validate([
            'pos_expense_category_id' => 'required|exists:pos_expense_categories,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $posExpense->update([
            'pos_expense_category_id' => $request->pos_expense_category_id,
            'title' => $request->title,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense successfully updated.',
            'data' => $posExpense->load('category')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosExpense $posExpense)
    {
        $posExpense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expense successfully deleted.'
        ]);
    }
}
