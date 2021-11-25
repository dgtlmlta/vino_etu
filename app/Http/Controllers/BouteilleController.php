<?php

namespace App\Http\Controllers;

use App\Http\Resources\BouteilleResource;
use App\Models\Bouteille;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Mockery\Undefined;

class BouteilleController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $request->limite = 24;

        $orderBy = $request->orderBy = "b.nom";
        $orderDirection = $request->orderDirection = "asc";

        $requete = DB::table("bouteilles as b")
            ->join("pays as p", "p.id", "=", "b.pays_id")
            ->join("categories as c", "c.id", "=", "b.categories_id")
            ->select("*", "p.nom as pays", "c.nom as categorie", "b.nom as nom", "b.id as id");

        // Annexer les divers filtres à la requête SQL
        $this->annexerFiltres($requete, $request);

        // return $requete->toSql();

        return $requete
            ->orderBy($orderBy, $orderDirection)
            ->paginate($request->limite);
    }

    /**
     *
     * Annexer, ou non, les filtres à partir des paramètres reçus en requête
     *
     * @param Builder $requete requête passée en référence afin de la métamorphoser
     * @param Request $request objet request avec les filtres
     * @return array
     *
     */
    private function annexerFiltres(&$requete, Request $request) {
        $filtres = [];

        if ($request->texteRecherche && $request->texteRecherche !== "") {
            $this->annexerRechercheTextuelle($requete, $request->texteRecherche);
        }

        if($request->categories && count($request->categories) > 0) {
            $this->annexerRechercheCategories($requete, $request->categories);
        }

        if($request->paysId && $request->paysId !== "") {
            $this->annexerRecherchePays($requete, $request->paysId);
        }

        if(($request->prixMin && $request->prixMin !== "") || ($request->prixMax && $request->prixMax !== "")) {
            $limitesPrix = [
                "prixMin" => $request->prixMin ?? null,
                "prixMax" => $request->prixMax ?? null,
            ];

            $this->annexerRecherchePrix($requete, $limitesPrix);
        }

        return $requete;
    }

    /**
     *
     * Annexe la recherche textuelle à la requête SQL de la liste de bouteilles du catalogue.
     *
     * @param Builder $requete requête passée en référence afin de la métamorphoser
     *
     */
    private function annexerRechercheTextuelle(&$requete, $recherche) {
        $requete->where(function ($query) use ($recherche) {
            $query->whereRaw("MATCH(b.nom,description,b.format) against (? in boolean mode)", ["$recherche*"])
            ->orWhereRaw("MATCH(p.nom) against (? in boolean mode)", ["$recherche*"])
            ->orWhereRaw("MATCH(c.nom) against (? in boolean mode)", ["$recherche*"]);
        });
    }


    /**
     *
     * Annexe la recherche par catégorie à la requête SQL de la liste de bouteilles du catalogue.
     *
     * @param Builder $requete requête passée en référence afin de la métamorphoser
     *
     */
    private function annexerRechercheCategories(&$requete, $categories) {
        // S'assurer que tous les items du arrays sont numériques
        if(
            is_array($categories) &&
            count($categories) === count(array_filter($categories,'is_numeric'))
        ) {
            $requete->whereIn("c.id", $categories);
        }
    }

    /**
     *
     * Annexe la recherche par pays à la requête SQL de la liste de bouteilles du catalogue.
     *
     * @param Builder $requete requête passée en référence afin de la métamorphoser
     *
     */
    private function annexerRecherchePays(&$requete, $paysId) {
        $requete->where("p.id", $paysId);
    }

    /**
     *
     * Annexe la recherche textuelle à la requête SQL de la liste de bouteilles du catalogue.
     *
     * @param Builder $requete requête passée en référence afin de la métamorphoser
     *
     */
    private function annexerRecherchePrix(&$requete, array $prix) {
        $requete->where(function($query) use ($prix) {
            if($prix["prixMin"]) {
                $query->where("b.prix", ">=", $prix["prixMin"]);
            }

            if($prix["prixMax"]) {
                $query->where("b.prix", "<=", $prix["prixMax"]);
            }
        });
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $nouvelleBouteille = new Bouteille();

        $nouvelleBouteille->nom = $request->nom;
        $nouvelleBouteille->pays_id = $request->pays_id;
        $nouvelleBouteille->prix = str_replace(",", ".", filter_var($request->prix, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION));
        $nouvelleBouteille->format = $request->format;
        $nouvelleBouteille->url_image = $request->url_image;
        $nouvelleBouteille->categories_id = $request->categories_id;
        $nouvelleBouteille->users_id = $request->users_id;
        $nouvelleBouteille->save();

        return response()->json([
            "message" => "ajout réussi !",
            "id_bouteille" => $nouvelleBouteille->id
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Bouteille  $bouteille
     * @return \Illuminate\Http\Response
     */

    public function show(Bouteille $bouteille) {

        return BouteilleResource::make($bouteille);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Bouteille  $bouteille
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Bouteille $bouteille) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Bouteille  $bouteille
     * @return \Illuminate\Http\Response
     */
    public function destroy(Bouteille $bouteille) {
        //
    }
}
