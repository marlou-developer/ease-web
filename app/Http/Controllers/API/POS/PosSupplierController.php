<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosSupplier;
use Illuminate\Http\Request;

class PosSupplierController extends Controller
{
    /**
     * List all suppliers.
     */
    public function index()
    {
        $suppliers = PosSupplier::all();

        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }

    /**
     * Store a new supplier.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:100|unique:pos_suppliers,email',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $supplier = PosSupplier::create($request->only('name', 'email', 'phone', 'address'));

        return response()->json([
            'success' => true,
            'message' => 'Supplier created successfully',
            'data' => $supplier
        ]);
    }

    /**
     * Show a specific supplier.
     */
    public function show(PosSupplier $posSupplier)
    {
        return response()->json([
            'success' => true,
            'data' => $posSupplier
        ]);
    }

    /**
     * Update a supplier.
     */
    public function update(Request $request, PosSupplier $posSupplier)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:100|unique:pos_suppliers,email,' . $posSupplier->id,
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $posSupplier->update($request->only('name', 'email', 'phone', 'address'));

        return response()->json([
            'success' => true,
            'message' => 'Supplier updated successfully',
            'data' => $posSupplier
        ]);
    }

    /**
     * Delete a supplier.
     */
    public function destroy(PosSupplier $posSupplier)
    {
        $posSupplier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Supplier deleted successfully'
        ]);
    }
}
