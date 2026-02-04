<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of clients (non-admin users).
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->user()->is_admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $clients = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum('orders', 'total_amount')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $clients
        ]);
    }

    /**
     * Display the specified client.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, User $user)
    {
        if (!$request->user()->is_admin) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user->load(['orders.items'])
        ]);
    }
}
