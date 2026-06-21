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
        Schema::create('pos_store_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_store_request_id')->nullable()->constrained('pos_store_requests');
            $table->foreignId('pos_warehouse_stock_id')->nullable()->constrained('pos_warehouse_stocks');
            $table->bigInteger('quantity')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_store_request_items');
    }
};
