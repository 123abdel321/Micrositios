<?php

namespace App\Http\Middleware;

use DB;
use Config;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientConnectionWeb
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user->has_empresa) {
            return redirect()->route('empresas.index');
        }

        // Siempre purgar la conexión microsite para evitar cache de conexiones previas
        DB::purge('microsite');

        // Asignar la base correspondiente al usuario
        Config::set('database.connections.microsite.database', $user->has_empresa);

        // Reconectar usando la nueva configuración
        DB::reconnect('microsite');

        return $next($request);
    }
}
