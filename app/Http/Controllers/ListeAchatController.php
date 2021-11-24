<?php

namespace App\Http\Controllers;

use App\Models\Bouteille;
use App\Models\ListeAchat;
use App\Models\ListeAchatBouteille;
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

    }   


    public function listeAchatParUtilisateur(Request $request) {
        return ListeAchat::obtenirListeAchatParUtilisateur($request->userId);
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
     * Ajouter une bouteille à la liste d'achat
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $nouvelItem = new ListeAchat();
        $nouvelItem->users_id = $request->userId;
        $nouvelItem->save();


        return response()->json([
            "message" => "ajout réussi"
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
