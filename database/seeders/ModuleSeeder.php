<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\Component;
use App\Models\ComponentOption;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        // Módulo Header
        $header = Module::create([
            'name' => 'Header',
            'description' => 'Configuración del encabezado del sitio',
            'slug' => 'header',
        ]);

        Component::insert([
            [
                'module_id' => $header->id,
                'label' => 'Logo',
                'name' => 'logo',
                'type' => 'image',
                'placeholder' => 'URL del logo',
                'is_required' => true,
                'order' => 1,
                'validation_rules' => json_encode(['required', 'image', 'max:2048']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $header->id,
                'label' => 'Color de fondo',
                'name' => 'background_color',
                'type' => 'color',
                'placeholder' => '#ffffff',
                'is_required' => false,
                'order' => 2,
                'validation_rules' => json_encode(['nullable', 'string']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $header->id,
                'label' => 'Menú principal',
                'name' => 'menu_items',
                'type' => 'external',
                'placeholder' => null,
                'is_required' => false,
                'order' => 3,
                'validation_rules' => json_encode(['nullable', 'array']),
                'data_source' => env('ERP_API_URL') . '/menu-items',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Módulo Hero (mejorado)
        $hero = Module::create([
            'name' => 'Hero',
            'description' => 'Sección principal de la página de inicio',
            'slug' => 'hero',
        ]);

        Component::insert([
            [
                'module_id' => $hero->id,
                'label' => 'Título principal',
                'name' => 'title',
                'type' => 'text',
                'placeholder' => 'Bienvenido a nuestro sitio',
                'is_required' => true,
                'order' => 1,
                'validation_rules' => json_encode(['required', 'string', 'max:100']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $hero->id,
                'label' => 'Subtítulo',
                'name' => 'subtitle',
                'type' => 'text',
                'placeholder' => 'Descubre nuestros productos',
                'is_required' => false,
                'order' => 2,
                'validation_rules' => json_encode(['nullable', 'string', 'max:200']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $hero->id,
                'label' => 'Imagen de fondo',
                'name' => 'background_image',
                'type' => 'image',
                'placeholder' => 'URL de la imagen',
                'is_required' => true,
                'order' => 3,
                'validation_rules' => json_encode(['required', 'image', 'max:5120']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Nuevos campos:
            [
                'module_id' => $hero->id,
                'label' => 'Color de fondo',
                'name' => 'background_color',
                'type' => 'color',
                'placeholder' => '#ffffff',
                'is_required' => false,
                'order' => 4,
                'validation_rules' => json_encode(['nullable', 'string']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $hero->id,
                'label' => 'Color del texto',
                'name' => 'text_color',
                'type' => 'color',
                'placeholder' => '#000000',
                'is_required' => false,
                'order' => 5,
                'validation_rules' => json_encode(['nullable', 'string']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $hero->id,
                'label' => 'Texto del botón',
                'name' => 'button_text',
                'type' => 'text',
                'placeholder' => 'Llamada a la acción',
                'is_required' => false,
                'order' => 6,
                'validation_rules' => json_encode(['nullable', 'string', 'max:50']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $hero->id,
                'label' => 'URL del botón',
                'name' => 'button_url',
                'type' => 'text',
                'placeholder' => 'https://ejemplo.com',
                'is_required' => false,
                'order' => 7,
                'validation_rules' => json_encode(['nullable', 'url']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $hero->id,
                'label' => 'Estilo del botón',
                'name' => 'button_style',
                'type' => 'select',
                'placeholder' => null,
                'is_required' => false,
                'order' => 8,
                'validation_rules' => json_encode(['nullable', 'string']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Opciones para estilo del botón
        $buttonStyleComp = Component::where('module_id', $hero->id)
            ->where('name', 'button_style')
            ->first();
        if ($buttonStyleComp) {
            ComponentOption::insert([
                [
                    'component_id' => $buttonStyleComp->id,
                    'label' => 'Primario',
                    'value' => 'primary',
                    'order' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'component_id' => $buttonStyleComp->id,
                    'label' => 'Secundario',
                    'value' => 'secondary',
                    'order' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'component_id' => $buttonStyleComp->id,
                    'label' => 'Outline',
                    'value' => 'outline',
                    'order' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        // Módulo Footer (mejorado: social_networks como texto)
        $footer = Module::create([
            'name' => 'Footer',
            'description' => 'Pie de página del sitio',
            'slug' => 'footer',
        ]);

        Component::insert([
            [
                'module_id' => $footer->id,
                'label' => 'Texto de copyright',
                'name' => 'copyright',
                'type' => 'text',
                'placeholder' => '© 2026 Tu Empresa',
                'is_required' => true,
                'order' => 1,
                'validation_rules' => json_encode(['required', 'string']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $footer->id,
                'label' => 'Enlaces del footer',
                'name' => 'footer_links',
                'type' => 'external',
                'placeholder' => null,
                'is_required' => false,
                'order' => 2,
                'validation_rules' => json_encode(['nullable', 'array']),
                'data_source' => env('ERP_API_URL') . '/footer-links',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $footer->id,
                'label' => 'Redes sociales (separadas por comas)',
                'name' => 'social_networks',
                'type' => 'text', // Cambiado de select a text
                'placeholder' => 'facebook, twitter, instagram',
                'is_required' => false,
                'order' => 3,
                'validation_rules' => json_encode(['nullable', 'string']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}