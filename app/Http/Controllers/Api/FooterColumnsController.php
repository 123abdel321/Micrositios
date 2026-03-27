<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//MODELS
use App\Models\Sistema\Landing;

class FooterColumnsController extends Controller
{
    public function index(Request $request)
    {
        // Columnas por defecto
        $columns = [
            [
                'title' => 'Enlaces',
                'links' => [
                    ['label' => 'Inicio', 'url' => '/', 'target' => '_self'],
                    ['label' => 'Acerca de Nosotros', 'url' => '/sobre-nosotros', 'target' => '_self'],
                    ['label' => 'Contacto', 'url' => '/contacto', 'target' => '_self'],
                ]
            ],
            [
                'title' => 'Legal',
                'links' => [
                    ['label' => 'Política de Privacidad', 'url' => '/privacidad', 'target' => '_self'],
                    ['label' => 'Términos y Condiciones', 'url' => '/terminos', 'target' => '_self'],
                    ['label' => 'Cookies', 'url' => '/cookies', 'target' => '_self'],
                ]
            ],
            [
                'title' => 'Soporte',
                'links' => [
                    ['label' => 'Preguntas Frecuentes', 'url' => '/faq', 'target' => '_self'],
                    ['label' => 'Ayuda', 'url' => '/ayuda', 'target' => '_self'],
                    ['label' => 'Centro de Soporte', 'url' => '/soporte', 'target' => '_self'],
                ]
            ],
            [
                'title' => 'Recursos',
                'links' => [
                    ['label' => 'Blog', 'url' => '/blog', 'target' => '_self'],
                    ['label' => 'Recursos Gratuitos', 'url' => '/recursos', 'target' => '_self'],
                    ['label' => 'Newsletter', 'url' => '/newsletter', 'target' => '_self'],
                ]
            ],
        ];
        
        return response()->json($columns);
    }
    
    public function getForLanding($landingId)
    {
        // Puedes personalizar columnas por landing si lo necesitas
        return $this->index(request());
    }
}