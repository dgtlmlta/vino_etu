<?php

namespace App\Http\Controllers;

use App\Models\Cellier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CellierController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        //
    }

    public function obtenirOriginesPourCellier($id) {
        return DB::table('bouteilles_achetees as ba')
            ->join("celliers_bouteilles_achetees as cba", "cba.bouteilles_achetees_id", "=", "ba.id")
            ->join("celliers as cel", "cel.id", "=", "cba.celliers_id")
            ->where("cel.id", $id)
            ->distinct()
            ->orderBy("ba.origine")
            ->get(["ba.origine"])
            ->pluck("origine");
    }

    public function afficherCelliersParUtilisateur(Request $request) {
        return Cellier::withSum([
            "bouteilles_achetees as total_bouteilles_vin_blanc" => function ($query) {
                $query->where("bouteilles_achetees.categories_id", 1);
            },
            "bouteilles_achetees as total_bouteilles_vin_rouge" => function ($query) {
                $query->where("bouteilles_achetees.categories_id", 2);
            },
            "bouteilles_achetees as total_bouteilles_spiritueux" => function ($query) {
                $query->where("bouteilles_achetees.categories_id", 3);
            },
            "bouteilles_achetees as total_bouteilles_porto_et_vin_fortifie" => function ($query) {
                $query->where("bouteilles_achetees.categories_id", 4);
            },
            "bouteilles_achetees as total_bouteilles_sake" => function ($query) {
                $query->where("bouteilles_achetees.categories_id", 5);
            }
        ], "celliers_bouteilles_achetees.inventaire")
        ->where("users_id", $request->userId)
        ->get();
    }

    /**
     *
     * Récupérer les bouteilles contenu dans un cellier donné.
     *
     * @param int|string $cellierId l'id du cellier d'on on veut afficher l'inventaire
     */
    public function obtenirBouteilles(Request $request, $cellierId) {
        $limite = 24;
        $orderBy = "nom";
        $orderDirection = "asc";

        // Mapping afin de s'assurer que l'utilisateur envoie bel et bien une valeur existante
        $orderByMapping = [
            "nom"     => "ba.nom",
            "origine" => "ba.origine"
        ];

        // Par défaut, mettre le nom comme champ de tri...
        $orderByTri = $orderByMapping["nom"];

        // ...si l'argument reçu existe dans le mapping, écraser la valeur par défaut
        if ($orderBy && array_key_exists($orderBy, $orderByMapping)) {
            $orderByTri = $orderByMapping[$orderBy];
        }

        $requete = DB::table('celliers_bouteilles_achetees as cba')
            ->join("bouteilles_achetees as ba", "cba.bouteilles_achetees_id", "=", "ba.id")
            ->join("categories as cat", "ba.categories_id", "=", "cat.id")
            ->select(
                "cba.id as inventaireId",
                "cba.inventaire as inventaire",
                "ba.id as bouteilleId",
                "ba.nom as nom",
                "ba.description as description",
                "ba.url_image",
                "ba.url_achat",
                "ba.url_info",
                "ba.format",
                "ba.origine",
                "ba.millesime",
                "ba.prix_paye",
                "ba.date_acquisition",
                "ba.conservation",
                "ba.notes_personnelles",
                "cat.nom as categorie"
            )
            ->where("cba.celliers_id", $cellierId);

            // Annexer les divers filtres à la requête SQL
            $this->annexerFiltres($requete, $request);

        return $requete->orderBy($orderByTri, $orderDirection)
                       ->paginate($limite);
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
        if ($request->texteRecherche && $request->texteRecherche !== "") {
            $this->annexerRechercheTextuelle($requete, $request->texteRecherche);
        }

        if ($request->categories && count($request->categories) > 0) {
            $this->annexerRechercheCategories($requete, $request->categories);
        }

        if ($request->origine && $request->origine !== "") {
            $this->annexerRechercheOrigine($requete, $request->origine);
        }

        if (($request->prixMin && $request->prixMin !== "") || ($request->prixMax && $request->prixMax !== "")) {
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
            $query->whereRaw("MATCH(ba.nom,ba.description,ba.format,ba.origine,ba.conservation,ba.notes_personnelles) against (? in boolean mode)", ["$recherche*"])
                ->orWhereRaw("MATCH(cat.nom) against (? in boolean mode)", ["$recherche*"]);
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
        if (
            is_array($categories) &&
            count($categories) === count(array_filter($categories, 'is_numeric'))
        ) {
            $requete->whereIn("cat.id", $categories);
        }
    }

    /**
     *
     * Annexe la recherche par pays à la requête SQL de la liste de bouteilles du catalogue.
     *
     * @param Builder $requete requête passée en référence afin de la métamorphoser
     *
     */
    private function annexerRechercheOrigine(&$requete, $origine) {
        $requete->where("ba.origine", $origine);
    }

    /**
     *
     * Annexe la recherche textuelle à la requête SQL de la liste de bouteilles du catalogue.
     *
     * @param Builder $requete requête passée en référence afin de la métamorphoser
     *
     */
    private function annexerRecherchePrix(&$requete, array $prix) {
        $requete->where(function ($query) use ($prix) {
            if ($prix["prixMin"]) {
                $query->where("ba.prix_paye", ">=", $prix["prixMin"]);
            }

            if ($prix["prixMax"]) {
                $query->where("ba.prix_paye", "<=", $prix["prixMax"]);
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
        $nouveauCellier = new Cellier();

        $nouveauCellier->nom = $request->nom;
        $nouveauCellier->description = $request->description;
        $nouveauCellier->users_id = $request->users_id;
        $nouveauCellier->save();

        return response()->json([
            "message" => "ajout réussi ! id : $nouveauCellier->id"
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Cellier  $cellier
     * @return \Illuminate\Http\Response
     */
    public function show(Cellier $cellier) {
        return response()->json($cellier, 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Cellier  $cellier
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $cellierId) {

        $cellier = Cellier::find($cellierId);

        $cellier->nom = $request->nom;
        $cellier->description = $request->description;

        $cellier->save();

        return response()->json([
            "message"  => "Mise à jour réussie"
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Cellier  $cellier
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $cellierId) {

        $cellier = Cellier::find($cellierId);

        $cellier->delete();

        return response()->json([
            "message" => "Cellier supprimer correctement"
        ], 200);
    }
}
