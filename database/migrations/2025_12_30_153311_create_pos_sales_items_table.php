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
        Schema::create('pos_sales_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_store_id')->constrained('pos_stores');
            $table->foreignId('sale_id')->constrained('pos_sales');
            $table->foreignId('pos_category_id')->constrained('pos_categories');
            $table->foreignId('pos_supplier_id')->constrained('pos_suppliers');
            $table->foreignId('pos_product_stock_id')->constrained('pos_product_stocks');
            $table->integer('quantity')->default(0);
            $table->decimal('cost_price', 10, 2)->default(0);
            $table->decimal('selling_price', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('discounted_price', 10, 2)->default(0);
            $table->decimal('profit', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_sales_items');
    }
};
