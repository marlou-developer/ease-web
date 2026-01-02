<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosUnit;
use Illuminate\Http\Request;

class PosUnitController extends Controller
{
    /**
     * List all units.
     */
    public function index()
    {
        $units = PosUnit::all();

        return response()->json([
            'success' => true,
            'data' => $units
        ]);
    }

    /**
     * Store a new unit.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:pos_units,name',
            'description' => 'nullable|string',
        ]);

        $unit = PosUnit::create($request->only('name', 'description'));

        return response()->json([
            'success' => true,
            'message' => 'Unit created successfully',
            'data' => $unit
        ]);
    }

    /**
     * Show a specific unit.
     */
    public function show(PosUnit $posUnit)
    {
        return response()->json([
            'success' => true,
            'data' => $posUnit
        ]);
    }

    /**
     * Update a unit.
     */
    public function update(Request $request, PosUnit $posUnit)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:50|unique:pos_units,name,' . $posUnit->id,
            'description' => 'nullable|string',
        ]);

        $posUnit->update($request->only('name', 'description'));

        return response()->json([
            'success' => true,
            'message' => 'Unit updated successfully',
            'data' => $posUnit
        ]);
    }

    /**
     * Delete a unit.
     */
    public function destroy(PosUnit $posUnit)
    {
        $posUnit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit deleted successfully'
        ]);
    }
}
