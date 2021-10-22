<?php

use App\Http\Controllers\PaysController;
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

// Pour ces modèles, ne rendre que l'obtention de la liste complète comme disponible
Route::apiResource('pays', PaysController::class)->only([
    "index",
]);

Route::apiResource('alcool_types', AlcoolTypeController::class)->only([
    "index",
]);



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
