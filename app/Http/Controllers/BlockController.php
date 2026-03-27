<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//MODELS
use App\Models\Sistema\Module;
use App\Models\Sistema\Landing;
use App\Models\Sistema\Submission;
use App\Models\Sistema\FieldValue;

class BlockController extends Controller
{
    public function store(Request $request, Landing $landing)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'order' => 'sometimes|integer',
        ]);

        $order = $request->order ?? $landing->blocks()->max('order') + 1;

        $block = Submission::create([
            'landing_id' => $landing->id,
            'module_id' => $request->module_id,
            'user_id' => auth()->id(),
            'order' => $order,
        ]);

        // Inicializar field_values vacíos para cada componente del módulo
        $module = Module::with('components')->find($request->module_id);
        foreach ($module->components as $component) {
            FieldValue::create([
                'submission_id' => $block->id,
                'component_id' => $component->id,
                'value' => null,
            ]);
        }

        return redirect()->back();
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
        $block->delete();
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
}
