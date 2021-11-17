<?php

namespace App\Http\Controllers;

use App\Models\ListeAchat;
use Illuminate\Http\Request;

class ListeAchatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $items = ListeAchat::all();

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $nouvelItem = new ListeAchat();

        $nouvelItem->users_id = $request->users_id;
        $nouvelItem->bouteille_id = $request->bouteille_id;
        $nouvelItem->save();

        return response()->json([
            "message" => "ajout réussi ! id : $nouvelItem->id"
        ], 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ListeAchat  $listeAchat
     * @return \Illuminate\Http\Response
     */
    public function show(ListeAchat $listeAchat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ListeAchat  $listeAchat
     * @return \Illuminate\Http\Response
     */
    public function edit(ListeAchat $listeAchat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ListeAchat  $listeAchat
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ListeAchat $listeAchat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ListeAchat  $listeAchat
     * @return \Illuminate\Http\Response
     */
    public function destroy(ListeAchat $listeAchat)
    {
        //
    }
}
