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

        // Módulo Hero
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
            [
                'module_id' => $hero->id,
                'label' => 'Botón de acción',
                'name' => 'cta_button',
                'type' => 'external',
                'placeholder' => null,
                'is_required' => false,
                'order' => 4,
                'validation_rules' => json_encode(['nullable', 'array']),
                'data_source' => env('ERP_API_URL') . '/cta-config',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Módulo Footer
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
                'label' => 'Redes sociales',
                'name' => 'social_networks',
                'type' => 'select',
                'placeholder' => null,
                'is_required' => false,
                'order' => 3,
                'validation_rules' => json_encode(['nullable', 'array']),
                'data_source' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Opciones para redes sociales
        $socialComponent = Component::where('name', 'social_networks')->first();
        if ($socialComponent) {
            ComponentOption::insert([
                [
                    'component_id' => $socialComponent->id,
                    'label' => 'Facebook',
                    'value' => 'facebook',
                    'order' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'component_id' => $socialComponent->id,
                    'label' => 'Twitter',
                    'value' => 'twitter',
                    'order' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'component_id' => $socialComponent->id,
                    'label' => 'Instagram',
                    'value' => 'instagram',
                    'order' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}