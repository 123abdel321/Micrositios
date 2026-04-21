<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Empresa\Empresa;

class DetectEmpresaByDomain
{
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();
        $baseDomain = config('app.base_domain', 'micrositios.com');
        
        // Si el host es el dominio base o 'www.dominio', no asignar empresa
        if ($host === $baseDomain || $host === 'www.' . $baseDomain) {
            return $next($request);
        }
        
        // Intentar encontrar por subdominio
        $subdomain = null;
        if (str_ends_with($host, '.' . $baseDomain)) {
            $subdomain = substr($host, 0, -strlen('.' . $baseDomain));
        }
        
        $empresa = null;
        if ($subdomain && $subdomain !== 'www') {
            $empresa = Empresa::where('subdomain', $subdomain)
                ->where('estado', 'activo')
                ->first();
        }
        
        // Si no, buscar por dominio personalizado
        if (!$empresa) {
            $empresa = Empresa::where('custom_domain', $host)
                ->where('estado', 'activo')
                ->first();
        }
        
        if ($empresa) {
            $request->attributes->set('empresa', $empresa);
            // Opcional: establecer conexión a la base de datos de la empresa
            // config(['database.connections.microsite.database' => $empresa->token_db]);
            // DB::purge('microsite');
        }
        
        return $next($request);
    }
}