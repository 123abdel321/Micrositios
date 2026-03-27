<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
//CONTROLLERS
use App\Http\Controllers\LandingController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\EmpresaController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    //Empresas
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

    Route::group(['middleware' => ['client_connection']], function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
        // Landings
        Route::controller(LandingController::class)->group(function () {
            Route::get('/builder', 'index')->name('builder.index');
            Route::get('/builder/create', 'create')->name('builder.create');
            Route::post('/builder', 'store')->name('builder.store');
            Route::get('/builder/{landing}/edit', 'edit')->name('builder.edit');
            Route::put('/builder/{landing}', 'update')->name('builder.update');
            Route::delete('/builder/{landing}', 'destroy')->name('builder.destroy');
        });
    
        // Bloques de una landing
        Route::controller(BlockController::class)->group(function () {
            Route::post('/builder/{landing}/blocks', 'store')->name('blocks.store');
            Route::post('/builder/{landing}/save', [LandingController::class, 'save'])->name('builder.save');
            Route::put('/builder/{landing}/blocks/{block}', 'update')->name('blocks.update');
            Route::delete('/builder/{landing}/blocks/{block}', 'destroy')->name('blocks.destroy');
            // Reordenar bloques
            Route::post('/builder/{landing}/blocks/reorder', 'reorder')->name('blocks.reorder');
        });
    });    


});

require __DIR__.'/settings.php';
