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
    // Maps the POS user type label to its numeric role id used for authorization checks
    private const USER_TYPE_ROLES = [
        'Admin' => 1,
        'Inventory' => 2,
        'Cashier' => 3,
        'Encoder' => 4,
    ];

    public function index()
    {
        $user = Auth::user()->load('store');
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
        $users = User::with('store')->where('subscriber_id', Auth::user()->subscriber_id)->get();
        return response()->json([
            'data' => $users,
        ]);
    }

    public function get_user_login_logs(User $user)
    {
        if ($user->subscriber_id !== Auth::user()->subscriber_id) {
            abort(403);
        }

        $logs = $user->loginLogs()->with('store')->paginate(15);

        return response()->json($logs);
    }

    public function store(Request $request)
    {
        // 1. Validate the incoming request data
        $validatedData = $request->validate([
            'fname'  => 'required|string|max:255',
            'lname'   => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'pos_user_type'   => ['required', 'string', 'in:' . implode(',', array_keys(self::USER_TYPE_ROLES))],
            'pos_store_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'mname' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:255',
        ]);

        // 2. Create the user using ONLY the validated data (Secure)
        // role is derived from pos_user_type server-side, never trusted from the client
        $user = User::create([
            'subscriber_id' => Auth::user()->subscriber_id,
            'name' => trim($validatedData['fname'] . ' ' . ($validatedData['mname'] ?? '') . ' ' . $validatedData['lname'] . ' ' . ($validatedData['suffix'] ?? '')),
            'fname' => $validatedData['fname'],
            'mname' => $validatedData['mname'] ?? null,
            'lname' => $validatedData['lname'],
            'email' => $validatedData['email'],
            'position' => $validatedData['title'],
            'pos_store_id' => $validatedData['pos_store_id'],
            'pos_user_type' => $validatedData['pos_user_type'],
            'password' => Hash::make('egiespos'),
            'role' => self::USER_TYPE_ROLES[$validatedData['pos_user_type']],
        ]);

        // 3. Return the response
        return response()->json([
            'message' => 'User created successfully',
            'data'    => $user,
        ], 200);
    }

    public function update(Request $request, User $user)
    {
        // Ensure users can only update accounts within their own subscriber
        if ($user->subscriber_id !== Auth::user()->subscriber_id) {
            abort(403);
        }

        $validatedData = $request->validate([
            'fname'  => 'required|string|max:255',
            'lname'   => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email,' . $user->id,
            'pos_user_type'   => ['required', 'string', 'in:' . implode(',', array_keys(self::USER_TYPE_ROLES))],
            'pos_store_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'mname' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:255',
        ]);

        $user->update([
            'name' => trim($validatedData['fname'] . ' ' . ($validatedData['mname'] ?? '') . ' ' . $validatedData['lname'] . ' ' . ($validatedData['suffix'] ?? '')),
            'fname' => $validatedData['fname'],
            'mname' => $validatedData['mname'] ?? null,
            'lname' => $validatedData['lname'],
            'email' => $validatedData['email'],
            'position' => $validatedData['title'],
            'pos_store_id' => $validatedData['pos_store_id'],
            'pos_user_type' => $validatedData['pos_user_type'],
            'role' => self::USER_TYPE_ROLES[$validatedData['pos_user_type']],
        ]);

        return response()->json([
            'message' => 'User updated successfully',
            'data'    => $user,
        ], 200);
    }

    public function destroy(User $user)
    {
        // Ensure users can only delete accounts within their own subscriber
        if ($user->subscriber_id !== Auth::user()->subscriber_id) {
            abort(403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }

    public function toggle_lock(Request $request, User $user)
    {
        // Ensure users can only lock/unlock accounts within their own subscriber
        if ($user->subscriber_id !== Auth::user()->subscriber_id) {
            abort(403);
        }

        if ($user->id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot lock your own account',
            ], 422);
        }

        $user->update([
            'is_locked' => ! $user->is_locked,
            'locked_at' => $user->is_locked ? null : now(),
        ]);

        return response()->json([
            'message' => $user->is_locked ? 'User locked successfully' : 'User unlocked successfully',
            'data' => $user,
        ], 200);
    }
}
