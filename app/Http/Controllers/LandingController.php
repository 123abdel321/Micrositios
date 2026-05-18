<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
//MODELS
use App\Models\Sistema\Module;
use App\Models\Sistema\Landing;
use App\Models\Sistema\Component;
use App\Models\Sistema\Submission;
use App\Models\Sistema\FieldValue;
use App\Models\Sistema\BlockDefinition;

class LandingController extends Controller
{
    public function save(Request $request, $id)
    {
        try {
            $landing = Landing::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
            
            $validated = $request->validate([
                'blocks' => 'required|array',
                'blocks.*.id' => 'nullable|integer',  // para identificar existentes
                'blocks.*.type' => 'required|in:section,block',
                'blocks.*.module_id' => 'required_if:blocks.*.type,section|exists:modules,id',
                'blocks.*.block_definition_id' => 'required_if:blocks.*.type,block|exists:block_definitions,id',
                'blocks.*.parent_id' => 'nullable|exists:submissions,id',
                'blocks.*.order' => 'required|integer',
                'blocks.*.values' => 'array',
                'blocks.*.children' => 'nullable|array',  // recursión
            ]);

            DB::connection('microsite')->beginTransaction();

            // Eliminar todos los bloques existentes de esta landing (reemplazo completo)
            Submission::where('landing_id', $landing->id)->delete();

            // Función recursiva para guardar un bloque y sus hijos
            $saveBlock = function ($blockData, $parentId = null) use ($landing, &$saveBlock) {
                $submission = Submission::create([
                    'landing_id' => $landing->id,
                    'user_id' => auth()->id(),
                    'type' => $blockData['type'],
                    'module_id' => $blockData['module_id'] ?? null,
                    'block_definition_id' => $blockData['block_definition_id'] ?? null,
                    'parent_id' => $parentId,
                    'order' => $blockData['order'],
                ]);

                // Guardar field_values
                if (isset($blockData['values']) && is_array($blockData['values'])) {
                    // Obtener la definición (Module o BlockDefinition) para mapear component name -> id
                    $definition = $submission->definition;
                    if ($definition && $definition->components) {
                        $componentsMap = [];
                        foreach ($definition->components as $comp) {
                            $componentsMap[$comp->name] = $comp->id;
                        }
                        foreach ($blockData['values'] as $name => $value) {
                            if (isset($componentsMap[$name])) {
                                $storedValue = $this->processValueForStorage(
                                    (object)['type' => 'select', 'configuration' => []], // simplificado; idealmente recuperar el componente real
                                    $value
                                );
                                FieldValue::create([
                                    'submission_id' => $submission->id,
                                    'component_id' => $componentsMap[$name],
                                    'value' => $storedValue,
                                ]);
                            }
                        }
                    }
                }

                // Guardar hijos recursivamente
                if (isset($blockData['children']) && is_array($blockData['children'])) {
                    foreach ($blockData['children'] as $childData) {
                        $saveBlock($childData, $submission->id);
                    }
                }
            };

            foreach ($validated['blocks'] as $blockData) {
                $saveBlock($blockData);
            }

            DB::connection('microsite')->commit();

            return redirect()->back()->with('success', 'Landing guardada correctamente.');

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            DB::connection('microsite')->rollBack();
            Log::error("Error al guardar la landing {$landing->id}: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'data' => $request->all()
            ]);
            return redirect()->back()->withInput()->with('error', 'Ocurrió un problema técnico al guardar los datos.');
        }
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
            'slug' => 'required|string|unique:microsite.landings,slug',
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
    public function edit(string $id)
    {
        try {
            $landing = Landing::findOrFail($id);
            // Cargar solo bloques raíz (parent_id null) con sus hijos recursivamente
            $landing->load(['blocks' => function($q) {
                $q->whereNull('parent_id')->orderBy('order');
            }]);

            // Cargar recursivamente los hijos y sus fieldValues
            $this->loadChildrenRecursive($landing->blocks);

            // Transformar igual que antes para obtener values
            $blocks = $landing->blocks->map(function ($submission) {
                return $this->transformSubmission($submission);
            });

            $modules = Module::with('components')->get();
            $blockDefinitions = BlockDefinition::with('components')->get();
            
            return inertia('builder/edit', [
                'landing' => $landing,
                'modules' => $modules,
                'blockDefinitions' => $blockDefinitions,
                'blocksTree' => $blocks, // árbol de bloques
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al cargar el builder.');
        }
    }

    private function loadChildrenRecursive($submissions)
    {
        foreach ($submissions as $submission) {
            $submission->load(['children.fieldValues.component']);
            if ($submission->children->isNotEmpty()) {
                $this->loadChildrenRecursive($submission->children);
            }
        }
    }

    private function transformSubmission($submission)
    {
        $values = [];
        foreach ($submission->fieldValues as $fv) {
            $values[$fv->component->name] = $this->processValueForDisplay($fv->component, $fv->value);
        }
        $submission->setAttribute('values', $values);
        $submission->setAttribute('definition_slug', $submission->definition->slug ?? null);
        
        // Transformar hijos recursivamente
        $children = $submission->children->map(function ($child) {
            return $this->transformSubmission($child);
        });
        $submission->setAttribute('children', $children);
        
        return $submission;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Landing $landing)
    {
        try {

            $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'required|string|unique:microsite.landings,slug,' . $landing->id,
            ]);

            DB::connection('microsite')->beginTransaction();

            $landing->update($request->only('name', 'slug'));

            DB::connection('microsite')->commit();

            return redirect()->back();

        } catch (ValidationException $e) {

            throw $e;

        } catch (\Exception $e) {

            DB::connection('microsite')->rollBack();

            return redirect()->back()
                ->withInput()
                ->with('error', 'Ocurrió un problema técnico al guardar los datos.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Procesa el valor para almacenarlo según el tipo de componente
     */
    private function processValueForStorage($component, $value)
    {
        // Si es null o vacío
        if ($value === null || $value === '') {
            return null;
        }

        // Para selects, verificar si es múltiple
        if ($component->type === 'select') {
            $config = $component->configuration ?? [];
            $isMultiple = $config['is_multiple'] ?? false;

            if ($isMultiple) {
                // Asegurar que es un array
                if (is_array($value)) {
                    // Extraer solo los IDs si vienen con formato "1 - Landing"
                    $ids = array_map(function($item) {
                        // Si el valor es "1 - Landing", extraer solo el ID
                        if (is_string($item) && strpos($item, ' - ') !== false) {
                            return explode(' - ', $item)[0];
                        }
                        return $item;
                    }, $value);

                    // Filtrar valores vacíos
                    $filtered = array_filter($ids, function($v) {
                        return $v !== null && $v !== '' && $v !== 'undefined';
                    });

                    return json_encode(array_values($filtered));
                }
                return json_encode([]);
            }

            // Select simple
            if (is_string($value) && strpos($value, ' - ') !== false) {
                return explode(' - ', $value)[0];
            }

            if ($value === 'undefined' || $value === '') {
                return null;
            }
            return $value;
        }

        // Para arrays en general
        if (is_array($value)) {
            return json_encode($value);
        }

        // Para valores simples
        return $value;
    }

    /**
     * Procesa el valor para mostrarlo según el tipo de componente
     */
    private function processValueForDisplay($component, $value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        // Para selects, verificar si es múltiple
        if ($component->type === 'select') {
            $config = $component->configuration ?? [];
            $isMultiple = $config['is_multiple'] ?? false;

            if ($isMultiple) {
                $decoded = json_decode($value, true);
                if (is_array($decoded)) {
                    // Filtrar valores undefined
                    return array_filter($decoded, function($v) {
                        return $v !== 'undefined';
                    });
                }
                return [];
            }

            // Select simple
            if ($value === 'undefined') {
                return null;
            }
            return $value;
        }

        // Para external
        if ($component->type === 'external') {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : $value;
        }

        return $value;
    }
}
