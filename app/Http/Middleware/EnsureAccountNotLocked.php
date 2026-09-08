<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountNotLocked
{
    /**
     * Force-logout any authenticated user whose account was locked mid-session.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->is_locked) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Your account has been locked.'], 403);
            }

            return redirect()->route('login')->withErrors(['email' => 'Your account has been locked.']);
        }

        return $next($request);
    }
}
