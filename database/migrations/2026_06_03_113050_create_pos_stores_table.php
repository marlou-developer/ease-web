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
        Schema::create('pos_stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('users');
            $table->foreignId('pos_warehouse_id')->constrained('pos_warehouses');
            $table->string('name')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_stores');
    }
};
