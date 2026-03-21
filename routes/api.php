<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SelectOptionsController;
use App\Http\Controllers\Api\MenuItemsController;
use App\Http\Controllers\Api\FooterColumnsController;
use App\Http\Controllers\Api\SocialNetworksController;

// ============================================
// ENDPOINTS PARA DATOS EXTERNOS DE LOS BLOQUES
// ============================================

// Menu Items (para HeaderBlock)
Route::get('/menu-items', [MenuItemsController::class, 'index']);
Route::get('/menu-items/{landingId}', [MenuItemsController::class, 'getForLanding']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/landings/options', [SelectOptionsController::class, 'getLandings']);
    Route::get('/select-options/{type}', [SelectOptionsController::class, 'getOptions']);
});

// Footer Columns (para FooterBlock)
// Route::get('/footer-columns', [FooterColumnsController::class, 'index']);
// Route::get('/footer-columns/{landingId}', [FooterColumnsController::class, 'getForLanding']);

// // Social Networks (para FooterBlock)
// Route::get('/social-networks', [SocialNetworksController::class, 'index']);
// Route::get('/social-networks/{landingId}', [SocialNetworksController::class, 'getForLanding']);