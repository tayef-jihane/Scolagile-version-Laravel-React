<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('type', 255);
            $table->integer('size');
            $table->binary('bin_img')->nullable(); // LONGBLOB équivalent en Laravel
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};