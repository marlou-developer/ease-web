<?php

namespace App\Http\Controllers;

use App\Models\POS\PosCategory;
use App\Models\POS\PosStore;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stores = PosStore::where('subscriber_id', $user->subscriber_id)->get();
        $categories = PosCategory::where('subscriber_id', $user->subscriber_id)->get();
        return response()->json([
            'user' => $user,
            'categories' => $categories,
            'stores' => $stores,
            'store' => session('pos_store_id')
        ]);
    }
    public function get_pos_users()
    {
        $users = User::where('subscriber_id', Auth::user()->subscriber_id)->get();
        return response()->json([
            'data' => $users,
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validate the incoming request data
        $validatedData = $request->validate([
            'fname'  => 'required|string|max:255',
            'lname'   => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'pos_user_type'   => 'required|string',
        ]);

        // 2. Create the user using ONLY the validated data (Secure)
        $user = User::create([
            ...$request->all(),
            'subscriber_id' => Auth::user()->subscriber_id,
            'name' => $request->fname . ' ' . $request->lname,
            'password' => Hash::make('admin')
        ]);

        // 3. Return the response
        return response()->json([
            'message' => 'User created successfully',
            'data'    => $user,
        ], 200);
    }
}
