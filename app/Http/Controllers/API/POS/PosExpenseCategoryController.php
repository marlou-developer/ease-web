<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosExpenseCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = PosExpenseCategory::where('subscriber_id', Auth::user()->subscriber_id)->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $category = PosExpenseCategory::create([
            'subscriber_id' => Auth::user()->subscriber_id,
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense category successfully saved.',
            'data' => $category
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(PosExpenseCategory $posExpenseCategory)
    {
        return response()->json([
            'success' => true,
            'data' => $posExpenseCategory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosExpenseCategory $posExpenseCategory)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $posExpenseCategory->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense category successfully updated.',
            'data' => $posExpenseCategory
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosExpenseCategory $posExpenseCategory)
    {
        $posExpenseCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expense category successfully deleted.'
        ]);
    }
}
