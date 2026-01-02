<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCategory;
use Illuminate\Http\Request;

class PosCategoryController extends Controller
{
    /**
     * List all categories.
     */
    public function index()
    {
        $categories = PosCategory::all();
        return response()->json(['success' => true, 'data' => $categories]);
    }

    /**
     * Store a new category.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = PosCategory::create($request->only('name', 'description'));

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ]);
    }

    /**
     * Show a specific category.
     */
    public function show(PosCategory $posCategory)
    {
        return response()->json(['success' => true, 'data' => $posCategory]);
    }

    /**
     * Update a category.
     */
    public function update(Request $request, PosCategory $posCategory)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $posCategory->update($request->only('name', 'description'));

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $posCategory
        ]);
    }

    /**
     * Delete a category.
     */
    public function destroy(PosCategory $posCategory)
    {
        $posCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }
}
