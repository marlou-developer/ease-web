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
use App\Http\Controllers\API\POS\PosUnitController;
use App\Http\Controllers\PosSupplierController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('pos-registers', PosCashRegisterController::class);
    Route::post('pos-registers/{pos_register}/transaction', [PosCashRegisterController::class, 'addTransaction']);
    Route::apiResource('pos-transactions', PosCashTransactionController::class);
    Route::apiResource('pos-categories', PosCategoryController::class);
    Route::apiResource('pos-customers', PosCustomerController::class);
    Route::apiResource('pos-products', PosProductController::class);
    Route::apiResource('pos-product-stocks', PosProductStockController::class);
    Route::apiResource('pos-purchases', PosPurchaseController::class);
    Route::apiResource('pos-sales', PosSaleController::class);
    Route::apiResource('pos-sale-items', PosSalesItemController::class);
    Route::apiResource('pos-stock-movements', PosStockMovementController::class);
    Route::apiResource('pos-suppliers', PosSupplierController::class);
    Route::apiResource('pos-units', PosUnitController::class);
    Route::apiResource('pos-purchase-items', PosPurchaseItemController::class);
});
