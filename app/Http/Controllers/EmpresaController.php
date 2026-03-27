<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
//JOBS
use App\Jobs\ProcessProvisionedDatabase;
//MODELS
use App\Models\User;
use App\Models\Empresa\Empresa;
use App\Models\Empresa\UsuarioEmpresa;

class EmpresaController extends Controller
{
    public function save(Request $request, Landing $landing)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $empresas = Empresa::query()
            ->when($request->search, function ($query, $search) {
                $query->where('razon_social', 'like', "%{$search}%")
                    ->orWhere('nit', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return inertia('empresas/index', [
            'empresas' => $empresas,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('empresas/form', [
            'empresa' => null,
            'pageTitle' => 'Crear Empresa',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'razon_social' => 'required|string|max:255',
            'nit' => 'required|string|max:20|unique:clientes.empresas,nit',
            'dv' => 'nullable|string|max:1',
            'email' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:500'
        ]);

        try {
            $empresa = Empresa::create($validated);

            $empresa->token_db = $this->generateUniqueNameDb($empresa);
            $empresa->hash = Hash::make($empresa->id);
            $empresa->save();

            $this->associateUserToCompany($empresa);
            ProcessProvisionedDatabase::dispatch($empresa);
            
            return redirect()
                ->route('empresas.index')
                ->with('success', 'Empresa creada exitosamente');

        } catch (\Exception $e) {

            Log::error('Error al crear empresa: ' . $e->getMessage());
            
            return back()
                ->withErrors([
                    'error' => 'Error al crear la empresa'
                ])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $empresa = Empresa::findOrFail($id);
        
        return inertia('empresas/show', [
            'empresa' => $empresa,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $empresa = Empresa::findOrFail($id);
        
        return inertia('empresas/form', [
            'empresa' => $empresa,
            'pageTitle' => 'Editar Empresa',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $empresa = Empresa::findOrFail($id);
        
        $validated = $request->validate([
            'razon_social' => 'required|string|max:255',
            'nit' => 'required|string|max:20|unique:clientes.empresas,nit,' . $id,
            'dv' => 'nullable|string|max:1',
            'email' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:500',
            'token_db' => 'nullable|string|max:100',
        ]);

        try {
            $empresa->update($validated);
            
            return redirect()->route('empresas.index')
                ->with('success', 'Empresa actualizada exitosamente');
        } catch (\Exception $e) {
            Log::error('Error al actualizar empresa: ' . $e->getMessage());
            
            return back()->withErrors(['error' => 'Error al actualizar la empresa'])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $empresa = Empresa::findOrFail($id);
            $empresa->delete();
            
            return redirect()->route('empresas.index')
                ->with('success', 'Empresa eliminada exitosamente');
        } catch (\Exception $e) {
            Log::error('Error al eliminar empresa: ' . $e->getMessage());
            
            return back()->withErrors(['error' => 'Error al eliminar la empresa']);
        }
    }

    public function selectEmpresa(Request $request)
    {
        $empresa = Empresa::findOrFail($request->empresa_id);

        session(['empresa_selected' => $empresa]);
        
        return redirect()->route('dashboard')
            ->with('success', 'Empresa seleccionada: ' . $empresa->razon_social);
    }

    private function generateUniqueNameDb($empresa)
    {
        $razonSocial = strtolower($empresa->razon_social);
        $razonSocial = iconv('UTF-8', 'ASCII//TRANSLIT', $razonSocial);
        $razonSocial = str_replace(' ', '_', $razonSocial);
        $razonSocial = preg_replace('/[^a-z0-9_]/', '', $razonSocial);
        $razonSocial = preg_replace('/_+/', '_', $razonSocial);
        $razonSocial = trim($razonSocial, '_');

        return "micrositio_{$razonSocial}_{$empresa->nit}";
    }

    private function associateUserToCompany($empresa)
	{
        User::where('id', request()->user()->id)->update([
            'id_empresa' => $empresa->id,
            'has_empresa' => $empresa->token_db,
        ]);

		$usuarioEmpresa = UsuarioEmpresa::where('id_usuario', request()->user()->id)
			->where('id_empresa', $empresa->id)
			->first();

		if(!$usuarioEmpresa){
			UsuarioEmpresa::create([
				'id_usuario' => request()->user()->id,
				'id_empresa' => $empresa->id
			]);
		}

		return;
	}


}