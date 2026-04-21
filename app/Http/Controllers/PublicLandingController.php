<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sistema\Landing;
use App\Models\Empresa\Empresa;

class PublicLandingController extends Controller
{
    /**
     * Página de inicio de la empresa (slug vacío)
     */
    public function home($empresaSlug)
    {
        $landing = Landing::where('slug', '')
            ->where('is_active', true)
            ->firstOrFail();

        return $this->renderLanding($landing);
    }

    /**
     * Página interna de la empresa (contacto, blog, etc.)
     */
    public function show($empresaSlug, $slug)
    {
        $landing = Landing::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return $this->renderLanding($landing);
    }

    /**
     * Previsualización (requiere autenticación)
     */
    public function preview(Request $request, $id)
    {
        $landing = Landing::findOrFail($id);
        if ($landing->user_id !== auth()->id()) {
            abort(403);
        }
        return $this->renderLanding($landing, true);
    }

    private function renderLanding(Landing $landing, $isPreview = false)
    {
        $landing->load('blocks.fieldValues.component', 'blocks.module');
        
        $blocks = $landing->blocks->sortBy('order')->map(function ($submission) {
            $values = [];
            foreach ($submission->fieldValues as $fv) {
                $values[$fv->component->name] = $fv->value;
            }
            $submission->setAttribute('values', $values);
            $submission->setAttribute('module_slug', $submission->module->slug);
            return $submission;
        });
        
        return inertia('landing/show', [
            'landing' => $landing,
            'blocks' => $blocks,
            'isPreview' => $isPreview,
        ]);
    }

}