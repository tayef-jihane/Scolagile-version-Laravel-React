<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('etudiants', function (Blueprint $table) {
            $table->id();
            $table->string('login', 20)->unique();
            $table->string('pass', 256);
            $table->string('nom', 20);
            $table->integer('note1')->default(0);
            $table->integer('note2')->default(0);
            $table->float('moyenne')->default(0);
            $table->float('longitude')->nullable(); 
            $table->float('latitude')->nullable();  
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};