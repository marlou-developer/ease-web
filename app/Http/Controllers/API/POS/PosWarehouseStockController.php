<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosStore;
use App\Models\POS\PosWarehouseStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosWarehouseStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pos_store = PosStore::where('id', session('pos_store_id'))
            ->where('subscriber_id', Auth::id())->with(['pos_warehouse'])->first();
        return response()->json([
            'success' => true,
            'data' => $pos_store
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
    public function show(PosWarehouseStock $posWarehouseStock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PosWarehouseStock $posWarehouseStock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosWarehouseStock $posWarehouseStock)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosWarehouseStock $posWarehouseStock)
    {
        //
    }
}
