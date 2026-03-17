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
        Schema::create('components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('label');
            $table->string('name'); // nombre para el input HTML
            $table->enum('type', ['text', 'number', 'select', 'color', 'image', 'range', 'toggle', 'external'])->default('text');
            $table->string('placeholder')->nullable();
            $table->boolean('is_required')->default(false);
            $table->integer('order')->default(0);
            $table->json('validation_rules')->nullable(); // ej: ["required", "image", "max:2048"]
            $table->string('data_source')->nullable(); // URL del endpoint para tipos 'external'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('components');
    }
};
