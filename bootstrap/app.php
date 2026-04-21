<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
//MIDDLEWARE
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\ClientConnectionWeb;
use App\Http\Middleware\DetectEmpresaByDomain;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetDatabaseByEmpresaSlug;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'detect_empresa' => DetectEmpresaByDomain::class,
            'client_connection' => ClientConnectionWeb::class,
            'set.db.empresa' => SetDatabaseByEmpresaSlug::class,
        ]);
        
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
