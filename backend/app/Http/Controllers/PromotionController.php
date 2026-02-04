<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['data' => Promotion::all()]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promotions',
            'discount' => 'required|string',
            'type' => 'required|string',
            'maxUsage' => 'required|integer',
            'status' => 'required|string'
        ]);

        $promotion = Promotion::create($validated);
        return response()->json(['data' => $promotion], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Promotion $promotion)
    {
        return response()->json(['data' => $promotion]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'code' => 'string|unique:promotions,code,' . $promotion->id,
            'discount' => 'string',
            'type' => 'string',
            'maxUsage' => 'integer',
            'status' => 'string'
        ]);

        $promotion->update($validated);
        return response()->json(['data' => $promotion]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return response()->json(null, 204);
    }
}
