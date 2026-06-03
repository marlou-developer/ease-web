<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosStore;
use Illuminate\Http\Request;

class PosStoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function update(Request $request)
    {
        $request->validate([
            'pos_store_id' => 'required'
        ]);
        session(['pos_store_id' => $request->pos_store_id]);

        return response()->json([
            'success' => true,
            'message' => 'Store updated successfully'
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PosStore $posStore)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PosStore $posStore)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosStore $posStore)
    {
        //
    }
}
