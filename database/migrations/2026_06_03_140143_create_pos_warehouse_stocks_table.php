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
        Schema::create('pos_warehouse_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_warehouse_id')->constrained('pos_warehouses');
            $table->foreignId('pos_product_id')->constrained('pos_products');
            $table->foreignId('subscriber_id')->constrained('users');
            $table->decimal('cost_price', 10, 2)->default(0);
            $table->decimal('selling_price', 10, 2)->default(0);
            $table->bigInteger('stocks')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_warehouse_stocks');
    }
};
