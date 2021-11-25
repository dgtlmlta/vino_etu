<?php

use App\Http\Controllers\BouteilleAcheteeController;
use App\Http\Controllers\BouteilleController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CellierBouteilleAcheteeController;
use App\Http\Controllers\CellierController;
use App\Http\Controllers\PaysController;
use App\Http\Controllers\UnionsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomAuthController;
use App\Http\Controllers\ListeAchatController;
use App\Http\Controllers\ListeAchatBouteilleController;
use App\Models\Cellier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Générer les ressources nécessaires par défaut
Route::apiResource("user", UserController::class)->only(
    "store",
);

// Pour ces modèles, ne rendre que l'obtention de la liste complète comme disponible
Route::apiResource('pays', PaysController::class)->parameters(["pays" => "pays"])->only([
    "index",
]);

Route::apiResource('categories', CategorieController::class)->only([
    "index",
]);

Route::apiResource("bouteilles", BouteilleController::class)->only([
    "index",
    "show",
]);

Route::get("catalogue-bouteilles", [BouteilleController::class, "index"])->middleware("auth:sanctum");

// Récupérer la liste des pays
Route::get("liste-pays", [PaysController::class, "index"]);

// Récupérer le data d'une bouteille achetée
Route::get('bouteilles-achetees/{bouteilleAchetee}', [BouteilleAcheteeController::class, "show"]);

// Creation d'une compte utilisateur
Route::post('creerCompte', [CustomAuthController::class, "creerCompte"]);

// Ajout d'une bouteille à un cellier
Route::post('celliers/{cellier}/bouteilles', [CellierBouteilleAcheteeController::class, "store"]);

// Connexion
Route::post('connection', [CustomAuthController::class, "connection"]);

// Routes protégées
Route::group(['middleware' => ["auth:sanctum"]], function () {
    // Afficher les bouteilles d'un cellier
    Route::get('celliers/{cellierId}/bouteilles', [CellierController::class, "obtenirBouteilles"]);

    // Récupérer un cellier donné
    Route::get('celliers/{cellier}', [CellierController::class, "show"]);

    // Récupérer un utilisateur donné
    Route::get('user/{userId}', [CustomAuthController::class, "getUtilisateur"]);

    // Récupérer la liste des celliers pour un utilisateur donné
    Route::get('celliers', [CellierController::class, "afficherCelliersParUtilisateur"]);

    // Ajout d'un nouveau cellier
    Route::post('celliers', [CellierController::class, "store"]);

    // Ajout d'une nouvelle bouteille personnalisé au catalogue
    Route::post('bouteilles', [BouteilleController::class, "store"]);

    // Modifier le data d'un cellier
    Route::put('celliers/{cellierId}', [CellierController::class, "update"]);

    // Supprimer un cellier
    Route::delete('supprimerCellier/{cellierId}', [CellierController::class, "destroy"]);

    // Mise à jour des informations d'une bouteille dans un cellier donné
    Route::put("celliers/modifier-bouteille/{bouteilleAchetee}", [BouteilleAcheteeController::class, "modifierInventaireBouteille"]);

    // Mise à jour de l'inventaire d'une bouteille dans un cellier donné
    Route::put("celliers/modifier-inventaire/{cellierBouteilleId}", [CellierBouteilleAcheteeController::class, "modifierInventaireBouteille"]);

    // Modifier le data d'une bouteille achetée
    Route::put('bouteilles-achetees/{bouteilleAchetee}', [BouteilleAcheteeController::class, "update"]);

    // Supprimer une bouteille
    Route::delete('supprimer/{cellierBouteilleAchetee}', [CellierBouteilleAcheteeController::class, "supprimerBouteille"]);

    // Ajout d'une bouteille à la liste d'achat
    Route::post('listes-achats/{id}/ajout-bouteille', [ListeAchatBouteilleController::class, "store"]);

    // Supprimer une bouteille de la liste d'achat
    Route::delete('supprimerBouteille/{bouteilleId}', [ListeAchatBouteilleController::class, "destroy"]);

     // Récupérer la liste d'achat par utilisateur
     Route::get('listes-achats', [ListeAchatController::class, "listeAchatParUtilisateur"]);

    // Modifier les informations d'un utilisateur
    Route::put('user/{userId}', [CustomAuthController::class, "update"]);

    //Deconnexion
    Route::post('deconnexion', [CustomAuthController::class, "deconnexion"]);

    // Récupérer les différentes origines existantes dans un cellier donné
    Route::get("origines-par-cellier/{id}", [CellierController::class, "obtenirOriginesPourCellier"]);
});
