<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//MODELS
use App\Models\Sistema\Landing;

class SelectOptionsController extends Controller
{
    /**
     * Obtener landings como opciones para selects
     */
    public function getLandings(Request $request)
    {
        $landings = Landing::where('user_id', auth()->id())
            ->orderBy('name')
            ->get();
        
        return response()->json(
            $landings->map(function ($landing) {
                return [
                    'value' => $landing->id,
                    'label' => $landing->name,
                    'slug' => $landing->slug
                ];
            })
        );
    }
    
    /**
     * Obtener opciones genéricas para selects
     */
    public function getOptions(Request $request, $type)
    {
        switch ($type) {
            case 'button_styles':
                return response()->json([
                    ['value' => 'primary', 'label' => 'Primario'],
                    ['value' => 'secondary', 'label' => 'Secundario'],
                    ['value' => 'outline', 'label' => 'Outline'],
                ]);
                
            case 'alignments':
                return response()->json([
                    ['value' => 'left', 'label' => 'Izquierda'],
                    ['value' => 'center', 'label' => 'Centro'],
                    ['value' => 'right', 'label' => 'Derecha'],
                ]);
                
            default:
                return response()->json([]);
        }
    }
}