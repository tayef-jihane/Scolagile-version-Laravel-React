<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\ImageController;
use App\Http\Middleware\CorsMiddleware;

// Gérer les requêtes OPTIONS pour le CORS
Route::options('{any}', function () {
    return response()->json([], 200);
})->where('any', '.*')->middleware(CorsMiddleware::class);

// Appliquer le middleware CORS à toutes les routes API
Route::middleware([CorsMiddleware::class])->group(function () {

    // Routes publiques (sans authentification)
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Routes protégées (nécessitent un token JWT valide)
    Route::middleware('jwt.auth')->group(function () {

        // Authentification
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Étudiants
        Route::get('/etudiants', [EtudiantController::class, 'index']);
        Route::get('/etudiants/stats', [EtudiantController::class, 'stats']);
        Route::get('/etudiants/geolocations', [EtudiantController::class, 'geolocations']);
        Route::get('/etudiants/{id}', [EtudiantController::class, 'show']);
        Route::put('/etudiants/{id}', [EtudiantController::class, 'update']);
        Route::post('/etudiants/geoloc', [EtudiantController::class, 'updateGeoloc']);
        Route::post('/etudiants/quiz-score', [EtudiantController::class, 'saveQuizScore']);

        // Images
        Route::get('/images', [ImageController::class, 'index']);
        Route::post('/images', [ImageController::class, 'store']);
        Route::get('/images/{id}', [ImageController::class, 'show']);
        Route::delete('/images/{id}', [ImageController::class, 'destroy']);
    });
});