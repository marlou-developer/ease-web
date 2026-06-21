<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\POS\PosCashRegisterController;
use App\Http\Controllers\API\POS\PosCashTransactionController;
use App\Http\Controllers\API\POS\PosCategoryController;
use App\Http\Controllers\API\POS\PosCustomerController;
use App\Http\Controllers\API\POS\PosItemController;
use App\Http\Controllers\API\POS\PosProductController;
use App\Http\Controllers\API\POS\PosProductStockController;
use App\Http\Controllers\API\POS\PosPurchaseController;
use App\Http\Controllers\API\POS\PosPurchaseItemController;
use App\Http\Controllers\API\POS\PosSaleController;
use App\Http\Controllers\API\POS\PosSalesItemController;
use App\Http\Controllers\API\POS\PosStockMovementController;
use App\Http\Controllers\API\POS\PosSupplierController;
use App\Http\Controllers\API\POS\PosUnitController;
use App\Http\Controllers\API\POS\PosStoreController;
use App\Http\Controllers\API\POS\PosWarehouseStockController;
use App\Http\Controllers\API\POS\PosReportController;
use App\Http\Controllers\API\POS\PosStoreTransactionController;
use App\Http\Controllers\API\POS\PosWarehouseTransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/session', function (Request $request) {
    return  session('pos_store_id');
});



Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('user', UserController::class);
    Route::apiResource('pos-registers', PosCashRegisterController::class);
    Route::apiResource('pos-store', PosStoreController::class);
    Route::post('pos-registers/{pos_register}/transaction', [PosCashRegisterController::class, 'addTransaction']);
    Route::apiResource('pos-transactions', PosCashTransactionController::class);
    Route::apiResource('pos-categories', PosCategoryController::class);
    Route::apiResource('pos-customers', PosCustomerController::class);
    Route::apiResource('pos-products', PosProductController::class);
    Route::apiResource('pos-product-stocks', PosProductStockController::class);
    Route::post('pos-product-stocks-received', [PosProductStockController::class, 'received_stock']);
    Route::post('add_new_stock_in_store', [PosProductStockController::class, 'add_new_stock_in_store']);
    Route::apiResource('pos-purchases', PosPurchaseController::class);
    Route::apiResource('pos-sales', PosSaleController::class);
    Route::apiResource('pos-sale-items', PosSalesItemController::class);
    Route::apiResource('pos-stock-movements', PosStockMovementController::class);
    Route::apiResource('pos-suppliers', PosSupplierController::class);
    Route::apiResource('pos-units', PosUnitController::class);
    Route::apiResource('pos-purchase-items', PosPurchaseItemController::class);
    Route::apiResource('pos-warehouse-stock', PosWarehouseStockController::class);
    Route::apiResource('pos-reports', PosReportController::class);
    Route::get('get_pos_users', [UserController::class, 'get_pos_users']);
    Route::apiResource('pos-warehouse-transaction', PosWarehouseTransactionController::class);
    Route::apiResource('pos-store-transaction', PosStoreTransactionController::class);
});





Route::post('/ai-response', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'message' => 'required|string',
    ]);

    $userMessage = trim($request->message);

    // Track ticket info in session
    $ticketInfo = session('ticket_info', [
        'fname' => null,
        'lname' => null,
        'phone' => null,
        'item_number' => null,
        'type' => null, // refund or replacement
    ]);

    // Determine next missing field
    $missingFields = [];
    foreach ($ticketInfo as $key => $value) {
        if (!$value) $missingFields[] = $key;
    }

    try {
        if (!empty($missingFields)) {
            $nextField = $missingFields[0];

            // Special prompt for 'type'
            if ($nextField === 'type') {
                $aiText = "Do you want a refund or a replacement?";
            } else {
                $fieldPrompts = [
                    'fname' => "What is your first name?",
                    'lname' => "What is your last name?",
                    'phone' => "What is your phone number?",
                    'item_number' => "What is your item number?"
                ];
                $aiText = $fieldPrompts[$nextField] ?? "Please provide {$nextField}.";
            }

            // Save customer's reply
            $ticketInfo[$nextField] = $userMessage;
            session(['ticket_info' => $ticketInfo]);
        } else {
            // All info collected → confirmation
            $aiText = "Ticket created for {$ticketInfo['fname']} {$ticketInfo['lname']}, phone: {$ticketInfo['phone']}, item number: {$ticketInfo['item_number']}, request type: {$ticketInfo['type']}.";

            // Optionally save to DB
            // \App\Models\Ticket::create($ticketInfo);

            // Clear session
            session()->forget('ticket_info');
        }

        return response()->json(['response' => $aiText]);
    } catch (\Exception $e) {
        return response()->json(['response' => 'AI call failed.'], 500);
    }
});
