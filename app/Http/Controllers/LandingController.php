<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
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
        // 1. Decodificar antes de validar para que las reglas de Laravel funcionen
        $data = $request->all();
        if (isset($data['blocks']) && is_string($data['blocks'])) {
            $data['blocks'] = json_decode($data['blocks'], true);
        }

        try {
            // 2. Validar (Si falla, Laravel lanza automáticamente una ValidationException)
            $validated = validator($data, [
                'blocks' => 'required|array',
                'blocks.*.module_id' => 'required|exists:modules,id',
                'blocks.*.values' => 'required|array',
                'blocks.*.order' => 'integer',
            ])->validate();

            // 3. Iniciar la transacción
            DB::beginTransaction();

            // Eliminar bloques anteriores
            $landing->blocks()->delete();

            foreach ($validated['blocks'] as $blockData) {
                $submission = $landing->blocks()->create([
                    'module_id' => $blockData['module_id'],
                    'order' => $blockData['order'] ?? 0,
                ]);

                foreach ($blockData['values'] as $key => $value) {
                    $component = Component::where('module_id', $blockData['module_id'])
                        ->where('name', $key)
                        ->first();

                    if ($component) {
                        $storedValue = $this->processValueForStorage($component, $value);
                        
                        FieldValue::create([
                            'submission_id' => $submission->id,
                            'component_id' => $component->id,
                            'value' => $storedValue,
                        ]);
                    }
                }
            }

            // 4. Si todo salió bien, confirmamos los cambios
            DB::commit();

            return redirect()->back()->with('success', 'Landing guardada correctamente.');

        } catch (ValidationException $e) {
            // No hacemos Rollback aquí porque la validación falla ANTES de tocar la DB
            throw $e; 

        } catch (\Exception $e) {
            // 5. Algo salió mal: deshacemos todo y registramos el error
            DB::rollBack();
            
            Log::error("Error al guardar la landing {$landing->id}: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'data' => $data
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Ocurrió un problema técnico al guardar los datos.');
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
                $values[$fv->component->name] = $this->processValueForDisplay($fv->component, $fv->value);
            }
            $submission->setAttribute('values', $values);
            $submission->setAttribute('module_slug', $submission->module->slug);
            return $submission;
        });

        $modules = Module::with('components')->get();

        return inertia('builder/edit', [
            'landing' => $landing,
            'modules' => $modules,
            'blocks' => $blocks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Landing $landing)
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