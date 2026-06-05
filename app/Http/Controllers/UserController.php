<?php

namespace App\Http\Controllers;

use App\Models\POS\PosCategory;
use App\Models\POS\PosStore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stores = PosStore::where('subscriber_id', $user->id)->get();
        $categories = PosCategory::where('subscriber_id', $user->id)->get();
        return response()->json([
            'user' => $user,
            'categories' => $categories,
            'stores' => $stores,
            'store' => session('pos_store_id')
        ]);
    }
}
