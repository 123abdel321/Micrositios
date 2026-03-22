<?php

use Illuminate\Support\Facades\Route;
//CONTROLLERS
use App\Http\Controllers\Api\OptionsController;
use App\Http\Controllers\Api\MenuItemsController;
use App\Http\Controllers\Api\FooterConfigController;
use App\Http\Controllers\Api\SelectOptionsController;
use App\Http\Controllers\Api\FooterColumnsController;
use App\Http\Controllers\Api\SocialNetworksController;

// ============================================
// ENDPOINTS PARA DATOS EXTERNOS DE LOS BLOQUES
// ============================================

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/landings/options', [SelectOptionsController::class, 'getLandings']);
    Route::get('/select-options/{type}', [SelectOptionsController::class, 'getOptions']);
});

// HeaderBlock Menu Items
Route::get('/menu-items', [MenuItemsController::class, 'index']);
Route::get('/menu-items/{landingId}', [MenuItemsController::class, 'getForLanding']);

// Footer Config
Route::get('/footer-config', [FooterConfigController::class, 'index']);
Route::get('/footer-config/{landingId}', [FooterConfigController::class, 'getForLanding']);

// Opciones
Route::get('/column-types', [OptionsController::class, 'getColumnTypes']);
Route::get('/social-platforms', [OptionsController::class, 'getSocialPlatforms']);