<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $user = Auth::user();
    return match ($user?->role) {
        1 => redirect('/administrator/dashboard'),
        2 => redirect('/account/pos/dashboard'),
        default => Inertia::render('auth/login/page'),
    };
})->name('login');

Route::get('/dashboard', function () {
    $user = Auth::user();
    return match ($user?->role) {
        1 => redirect('/administrator/dashboard'),
        2 => redirect('/account/pos/dashboard'),
        default => Inertia::render('auth/login/page'),
    };
})->name('dashboard');

Route::prefix('administrator')->middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('administrator/dashboard/page');
    });
    Route::get('/subscribers', function () {
        return Inertia::render('administrator/subscribers/page');
    });

    Route::get('/users', function () {
        return Inertia::render('administrator/users/page');
    });
    Route::get('/settings', function () {
        return Inertia::render('administrator/settings/page');
    });
});

Route::prefix('account')->middleware('auth')->group(function () {
    Route::prefix('pos')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('account/pos/dashboard/page');
        });
        Route::get('/cashiering', function () {
            return Inertia::render('account/pos/cashiering/page');
        });
        Route::get('/pos', function () {
            return Inertia::render('account/pos/pos/page');
        });
        Route::get('/products', function () {
            return Inertia::render('account/pos/products/page');
        });
        Route::get('/stock_movements', function () {
            return Inertia::render('account/pos/stock_movements/page');
        });
        Route::get('/purchases', function () {
            return Inertia::render('account/pos/purchases/page');
        });
        Route::get('/suppliers', function () {
            return Inertia::render('account/pos/suppliers/page');
        });
        Route::get('/customers', function () {
            return Inertia::render('account/pos/customers/page');
        });
        Route::get('/cash_register', function () {
            return Inertia::render('account/pos/cash_register/page');
        });
        Route::get('/reports', function () {
            return Inertia::render('account/pos/reports/page');
        });
        Route::get('/settings', function () {
            return Inertia::render('account/pos/settings/page');
        });
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
