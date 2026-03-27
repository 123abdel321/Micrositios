<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//MODELS
use App\Models\Sistema\Landing;

class MenuItemsController extends Controller
{
    public function index(Request $request)
    {
        // Obtener landings activos ordenados
        $landings = Landing::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();
        
        $menuItems = $landings->map(function ($landing) use ($request) {
            return [
                'id' => $landing->id,
                'label' => $landing->name,
                'url' => $landing->slug ? '/' . $landing->slug : '/',
                'target' => '_self',
                'active' => $request->path() === ($landing->slug ?: '/'),
            ];
        });
        
        // Si no hay landings activos, devolver items por defecto
        if ($menuItems->isEmpty()) {
            $menuItems = collect([
                [
                    'id' => null,
                    'label' => 'Inicio',
                    'url' => '/',
                    'target' => '_self',
                    'active' => $request->path() === '/',
                ],
                [
                    'id' => null,
                    'label' => 'Acerca de Nosotros',
                    'url' => '/sobre-nosotros',
                    'target' => '_self',
                    'active' => $request->path() === '/sobre-nosotros',
                ],
                [
                    'id' => null,
                    'label' => 'Contacto',
                    'url' => '/contacto',
                    'target' => '_self',
                    'active' => $request->path() === '/contacto',
                ],
            ]);
        }
        
        return response()->json($menuItems);
    }
    
    public function getForLanding($landingSlug)
    {
        $currentLanding = Landing::where('slug', $landingSlug)
            ->where('is_active', true)
            ->first();
        
        $landings = Landing::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();
        
        $menuItems = $landings->map(function ($landing) use ($currentLanding) {
            return [
                'id' => $landing->id,
                'label' => $landing->name,
                'url' => $landing->slug ? '/' . $landing->slug : '/',
                'target' => '_self',
                'active' => $currentLanding && $currentLanding->id === $landing->id,
            ];
        });
        
        return response()->json($menuItems);
    }
}