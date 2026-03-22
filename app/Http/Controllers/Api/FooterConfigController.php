<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Landing;
use Illuminate\Http\Request;

class FooterConfigController extends Controller
{
    public function index(Request $request)
    {
        // Estructura por defecto
        $columns = [
            [
                'id' => 1,
                'type' => 'links',
                'title' => 'Enlaces',
                'links' => [1, 2], // IDs de menu-items seleccionados
            ],
            [
                'id' => 2,
                'type' => 'social',
                'title' => 'Redes Sociales',
                'socials' => [
                    ['platform' => 'facebook', 'url' => 'https://facebook.com/tuempresa'],
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/tuempresa'],
                ]
            ],
            [
                'id' => 3,
                'type' => 'contact',
                'title' => 'Contacto',
                'contact' => [
                    'phones' => ['+123 456 7890'],
                    'email' => 'info@tuempresa.com',
                    'address' => 'Calle Principal 123, Ciudad',
                    'whatsapp' => '+1234567890',
                    'whatsapp_message' => 'Hola, me gustaría más información',
                ]
            ],
        ];
        
        return response()->json($columns);
    }
    
    public function getForLanding($landingId)
    {
        return $this->index(request());
    }
}