<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
//CONTROLLERS
use App\Http\Controllers\LandingController;
use App\Http\Controllers\BlockController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Landings
    Route::get('/builder', [LandingController::class, 'index'])->name('builder.index');
    Route::get('/builder/create', [LandingController::class, 'create'])->name('builder.create');
    Route::post('/builder', [LandingController::class, 'store'])->name('builder.store');
    Route::get('/builder/{landing}/edit', [LandingController::class, 'edit'])->name('builder.edit');
    Route::put('/builder/{landing}', [LandingController::class, 'update'])->name('builder.update');
    Route::delete('/builder/{landing}', [LandingController::class, 'destroy'])->name('builder.destroy');

    // Bloques de una landing
    Route::post('/builder/{landing}/blocks', [BlockController::class, 'store'])->name('blocks.store');
    Route::post('/builder/{landing}/save', [LandingController::class, 'save'])->name('builder.save');
    Route::put('/builder/{landing}/blocks/{block}', [BlockController::class, 'update'])->name('blocks.update');
    Route::delete('/builder/{landing}/blocks/{block}', [BlockController::class, 'destroy'])->name('blocks.destroy');
    // Para reordenar bloques
    Route::post('/builder/{landing}/blocks/reorder', [BlockController::class, 'reorder'])->name('blocks.reorder');
});

require __DIR__.'/settings.php';
