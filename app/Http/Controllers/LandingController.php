<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//MODELS
use App\Models\Module;
use App\Models\Landing;
use App\Models\Component;
use App\Models\Submission;
use App\Models\FieldValue;

class LandingController extends Controller
{
    public function save(Request $request, Landing $landing)
    {
        // Obtener todos los datos
        $data = $request->all();
        
        if (isset($data['blocks']) && is_string($data['blocks'])) {
            $data['blocks'] = json_decode($data['blocks'], true);
        }

        // Validar
        $validated = validator($data, [
            'blocks' => 'required|array',
            'blocks.*.module_id' => 'required|exists:modules,id',
            'blocks.*.values' => 'required|array',
            'blocks.*.order' => 'integer',
        ])->validate();

        // Eliminar bloques anteriores
        $landing->blocks()->delete();

        foreach ($validated['blocks'] as $blockData) {
            $submission = $landing->blocks()->create([
                'module_id' => $blockData['module_id'],
                'order' => $blockData['order'] ?? 0,
            ]);

            foreach ($blockData['values'] as $key => $value) {
                $component = Component::where('module_id', $blockData['module_id'])
                    ->where('name', $key)->first();
                if ($component) {
                    FieldValue::create([
                        'submission_id' => $submission->id,
                        'component_id' => $component->id,
                        'value' => is_array($value) ? json_encode($value) : $value,
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Landing guardada');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $landings = Landing::where('user_id', auth()->id())->with('blocks')->get();
        return inertia('builder/index', [
            'landings' => $landings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('builder/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:landings',
        ]);

        $landing = Landing::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'slug' => $request->slug,
        ]);

        return redirect()->route('builder.edit', $landing);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Landing $landing)
    {
        $landing->load('blocks.fieldValues.component', 'blocks.module');

        $blocks = $landing->blocks->map(function ($submission) {
            $values = [];
            foreach ($submission->fieldValues as $fv) {
                $values[$fv->component->name] = $fv->value;
            }
            $submission->setAttribute('values', $values);
            // 👇 ESTA LÍNEA ES LA QUE FALTA
            $submission->setAttribute('module_slug', $submission->module->slug);
            return $submission;
        });

        $modules = Module::with('components.options')->get();

        return inertia('builder/edit', [
            'landing' => $landing,
            'modules' => $modules,
            'blocks' => $blocks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:landings,slug,' . $landing->id,
        ]);

        $landing->update($request->only('name', 'slug'));

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
