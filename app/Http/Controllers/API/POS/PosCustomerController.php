<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCustomer;
use Illuminate\Http\Request;

class PosCustomerController extends Controller
{
    /**
     * List all customers.
     */
    public function index()
    {
        $customers = PosCustomer::all();

        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }

    /**
     * Store a new customer.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100|unique:pos_customers,email',
            'address' => 'nullable|string'
        ]);

        $customer = PosCustomer::create($request->only('name', 'phone', 'email', 'address'));

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => $customer
        ]);
    }

    /**
     * Show a specific customer.
     */
    public function show(PosCustomer $posCustomer)
    {
        return response()->json([
            'success' => true,
            'data' => $posCustomer
        ]);
    }

    /**
     * Update a customer.
     */
    public function update(Request $request, PosCustomer $posCustomer)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100|unique:pos_customers,email,' . $posCustomer->id,
            'address' => 'nullable|string'
        ]);

        $posCustomer->update($request->only('name', 'phone', 'email', 'address'));

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => $posCustomer
        ]);
    }

    /**
     * Delete a customer.
     */
    public function destroy(PosCustomer $posCustomer)
    {
        $posCustomer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully'
        ]);
    }
}
