<?php


namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosSupplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosSupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sales = PosSupplier::where('subscriber_id', Auth::id())->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $sales
        ]);
    }

    public function store(Request $request)
    {
        $supplier = PosSupplier::updateOrCreate(
            [
                'email' => $request->email,
                'subscriber_id' => Auth::id()
            ],
            $request->all()
        );
        return response()->json([
            'success' => true,
            'message' => 'Supplier successfully saved.',
            'data'    => $supplier
        ]);
    }
    /**
     * Display the specified resource.
     */
    public function show(PosSupplier $posSupplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PosSupplier $posSupplier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PosSupplier $posSupplier)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PosSupplier $posSupplier)
    {
        //
    }
}
