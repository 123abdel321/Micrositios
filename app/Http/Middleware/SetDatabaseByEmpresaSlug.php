<?php

namespace App\Http\Middleware;

use Closure;
use DB;
use Config;
use Illuminate\Http\Request;
use App\Models\Empresa\Empresa;

class SetDatabaseByEmpresaSlug
{
    public function handle(Request $request, Closure $next)
    {
        // Obtener el slug de la empresa desde la ruta
        $empresaSlug = $request->route('empresaSlug');
        
        if (!$empresaSlug) {
            return $next($request);
        }
        
        // Buscar la empresa por subdomain
        $empresa = Empresa::where('subdomain', $empresaSlug)->first();
        
        if (!$empresa) {
            abort(404);
        }
        
        // Configurar la conexión microsite con la base de datos de la empresa
        $databaseName = $empresa->token_db;
        if (!$databaseName) {
            abort(500, 'Base de datos no configurada para esta empresa');
        }
        
        // Limpiar y reconectar
        DB::purge('microsite');
        Config::set('database.connections.microsite.database', $databaseName);
        DB::reconnect('microsite');
        
        // Guardar la empresa en la request (opcional)
        $request->attributes->set('empresa', $empresa);
        
        return $next($request);
    }
}