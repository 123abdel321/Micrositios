<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->id();
            $table->string('token_db', 200)->nullable();
            $table->string('razon_social', 120)->nullable();
            $table->string('nit', 100)->comment('Digito de verificacion')->nullable();
            $table->string('direccion', 200)->nullable();
            $table->string('telefono', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('logo', 300)->nullable();
            $table->string('hash', 100);
            $table->string('estado', 20)->default('activo')->comment('activo, inactivo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
