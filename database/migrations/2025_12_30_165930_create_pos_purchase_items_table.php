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
        Schema::create('pos_purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_purchase_id')->constrained('pos_purchases');
            $table->foreignId('pos_product_id')->constrained('pos_products');
            $table->decimal('quantity', 10, 3);
            $table->decimal('cost_price', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_purchase_items');
    }
};
