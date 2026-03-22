<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OptionsController extends Controller
{
    // Tipos de columnas disponibles
    public function getColumnTypes()
    {
        return response()->json([
            ['value' => 'links', 'label' => 'Enlaces'],
            ['value' => 'social', 'label' => 'Redes Sociales'],
            ['value' => 'contact', 'label' => 'Contacto'],
        ]);
    }
    
    // Redes sociales disponibles
    public function getSocialPlatforms()
    {
        return response()->json([
            ['value' => 'facebook', 'label' => 'Facebook', 'icon' => '📘', 'default_url' => 'https://facebook.com/'],
            ['value' => 'twitter', 'label' => 'Twitter', 'icon' => '🐦', 'default_url' => 'https://twitter.com/'],
            ['value' => 'instagram', 'label' => 'Instagram', 'icon' => '📷', 'default_url' => 'https://instagram.com/'],
            ['value' => 'linkedin', 'label' => 'LinkedIn', 'icon' => '🔗', 'default_url' => 'https://linkedin.com/in/'],
            ['value' => 'youtube', 'label' => 'YouTube', 'icon' => '▶️', 'default_url' => 'https://youtube.com/@'],
            ['value' => 'whatsapp', 'label' => 'WhatsApp', 'icon' => '💬', 'default_url' => 'https://wa.me/'],
            ['value' => 'tiktok', 'label' => 'TikTok', 'icon' => '🎵', 'default_url' => 'https://tiktok.com/@'],
        ]);
    }
}