<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sistema\Landing;
use App\Models\Sistema\Submission;
use App\Models\Sistema\FieldValue;
use App\Models\Sistema\Module;
use App\Models\Sistema\BlockDefinition;

class BlockController extends Controller
{
    
    public function store(Request $request, Landing $landing)
    {
        $request->validate([
            'type' => 'required|in:section,block',
            'module_id' => 'required_if:type,section|exists:modules,id',
            'block_definition_id' => 'required_if:type,block|exists:block_definitions,id',
            'parent_id' => 'nullable|exists:submissions,id',
            'order' => 'nullable|integer',
        ]);

        // 🔹 Validación de límite de hijos si se especifica parent_id
        if ($request->parent_id) {
            $parent = Submission::findOrFail($request->parent_id);
            $parentDef = $parent->definition; // usa el accessor getDefinitionAttribute()
            
            if ($parentDef && $parentDef->is_container) {
                $currentChildrenCount = Submission::where('parent_id', $parent->id)->count();
                if ($parentDef->max_children && $currentChildrenCount >= $parentDef->max_children) {
                    return redirect()->back()->withErrors([
                        'parent_id' => 'Este contenedor no puede tener más de ' . $parentDef->max_children . ' hijos.'
                    ]);
                }
            }
        }

        // Calcular orden si no viene
        $order = $request->order ?? Submission::where('landing_id', $landing->id)
            ->where('parent_id', $request->parent_id)
            ->max('order') + 1;

        $block = Submission::create([
            'landing_id' => $landing->id,
            'user_id' => auth()->id(),
            'type' => $request->type,
            'module_id' => $request->module_id,
            'block_definition_id' => $request->block_definition_id,
            'parent_id' => $request->parent_id,
            'order' => $order,
        ]);

        // Crear field_values para los componentes de la definición correspondiente
        $definition = $block->type === 'section' 
            ? Module::with('components')->find($request->module_id)
            : BlockDefinition::with('components')->find($request->block_definition_id);

        if ($definition && $definition->components) {
            foreach ($definition->components as $component) {
                FieldValue::create([
                    'submission_id' => $block->id,
                    'component_id' => $component->id,
                    'value' => null,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Bloque agregado.');
    }

    public function update(Request $request, Landing $landing, Submission $block)
    {
        $request->validate([
            'values' => 'array',
        ]);

        foreach ($request->values as $componentId => $value) {
            FieldValue::updateOrCreate(
                ['submission_id' => $block->id, 'component_id' => $componentId],
                ['value' => $value]
            );
        }

        return redirect()->back();
    }

    public function destroy(Landing $landing, Submission $block)
    {
        $block->delete(); // En cascada elimina hijos y field_values gracias a FK
        return redirect()->back();
    }

    public function reorder(Request $request, Landing $landing)
    {
        $request->validate([
            'blocks' => 'required|array',
            'blocks.*.id' => 'required|exists:submissions,id',
            'blocks.*.order' => 'required|integer',
        ]);

        foreach ($request->blocks as $item) {
            Submission::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return redirect()->back();
    }

    // Método adicional para mover un bloque dentro de otro (cambiar parent_id)
    public function move(Request $request, Landing $landing, Submission $block)
    {
        $request->validate([
            'new_parent_id' => 'nullable|exists:submissions,id',
            'new_order' => 'required|integer',
        ]);

        // Verificar que el nuevo padre permita hijos (si es bloque contenedor)
        if ($request->new_parent_id) {
            $newParent = Submission::findOrFail($request->new_parent_id);
            $definition = $newParent->definition;
            if ($definition && !$definition->is_container) {
                return back()->withErrors(['new_parent_id' => 'Este bloque no puede contener hijos.']);
            }
        }

        $block->update([
            'parent_id' => $request->new_parent_id,
            'order' => $request->new_order,
        ]);

        return redirect()->back();
    }
}