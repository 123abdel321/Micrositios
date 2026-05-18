<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PublicLandingController;
use App\Http\Controllers\Api\OptionsController;
use App\Http\Controllers\Api\MenuItemsController;
use App\Http\Controllers\Api\FooterConfigController;
use App\Http\Controllers\Api\SelectOptionsController;

// Portal principal
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Rutas autenticadas (dashboard, builder, empresas, etc.)
Route::middleware(['auth', 'verified'])->group(function () {

    // Empresas
    Route::controller(EmpresaController::class)->group(function () {
        Route::get('/empresas', 'index')->name('empresas.index');
        Route::get('/empresas-create', 'create')->name('empresas.create');
        Route::post('/empresas', 'store')->name('empresas.store');
        Route::get('/empresas-read', 'read')->name('empresas.read');
        Route::get('/empresas/{empresa}', 'show')->name('empresas.show');
        Route::get('/empresas/{empresa}/edit', 'edit')->name('empresas.edit');
        Route::put('/empresas/{empresa}', 'update')->name('empresas.update');
        Route::delete('/empresas/{empresa}', 'destroy')->name('empresas.destroy');
        Route::post('/empresas-select', 'selectEmpresa')->name('empresas.select');
    });

    

    // Builder de landings (con conexión a BD de la empresa)
    Route::group(['middleware' => ['client_connection']], function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
        Route::controller(LandingController::class)->group(function () {
            Route::get('/builder', 'index')->name('builder.index');
            Route::get('/builder/create', 'create')->name('builder.create');
            Route::post('/builder', 'store')->name('builder.store');
            Route::get('/builder/{landing}/edit', 'edit')->name('builder.edit');
            Route::put('/builder/{landing}', 'update')->name('builder.update');
            Route::delete('/builder/{landing}', 'destroy')->name('builder.destroy');
            Route::post('/builder/{landing}/save', 'save')->name('builder.save');
        });
    
        Route::controller(BlockController::class)->group(function () {
            Route::post('/builder/{landing}/blocks', 'store')->name('blocks.store');
            Route::put('/builder/{landing}/blocks/{block}', 'update')->name('blocks.update');
            Route::delete('/builder/{landing}/blocks/{block}', 'destroy')->name('blocks.destroy');
            Route::post('/builder/{landing}/blocks/reorder', 'reorder')->name('blocks.reorder');
            Route::post('/builder/{landing}/blocks/{block}/move', 'move')->name('blocks.move');
        });
    });
});

// API routes (con prefijo /api)
Route::middleware(['auth', 'verified', 'client_connection'])->prefix('api')->group(function () {
    Route::get('/landings/options', [SelectOptionsController::class, 'getLandings']);
    Route::get('/select-options/{type}', [SelectOptionsController::class, 'getOptions']);
    Route::get('/menu-items', [MenuItemsController::class, 'index']);
    Route::get('/menu-items/{landingId}', [MenuItemsController::class, 'getForLanding']);
    Route::get('/footer-config', [FooterConfigController::class, 'index']);
    Route::get('/footer-config/{landingId}', [FooterConfigController::class, 'getForLanding']);
    Route::get('/column-types', [OptionsController::class, 'getColumnTypes']);
    Route::get('/social-platforms', [OptionsController::class, 'getSocialPlatforms']);
});

// ============================================
// RUTAS PÚBLICAS DE EMPRESAS (FALLBACK)
// Se ejecutan SOLO si ninguna ruta anterior coincidió
// ============================================
Route::middleware(['set.db.empresa'])->group(function () {
    Route::get('/{empresaSlug}', [PublicLandingController::class, 'home'])->name('empresa.home');
    Route::get('/{empresaSlug}/{slug}', [PublicLandingController::class, 'show'])->name('empresa.show');
});

require __DIR__.'/settings.php';