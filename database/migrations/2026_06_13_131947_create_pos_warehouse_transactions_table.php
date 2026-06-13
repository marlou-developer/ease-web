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
        Schema::create('pos_warehouse_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transact_by')->nullable()->constrained('users');
            $table->string('transaction_id')->nullable();
            $table->foreignId('subscriber_id')->nullable()->constrained('pos_subscribers');
            $table->foreignId('pos_warehouse_id')->nullable()->constrained('pos_warehouses');
            $table->foreignId('pos_product_stock_id')->nullable()->constrained('pos_product_stocks');
            $table->foreignId('pos_warehouse_stock_id')->nullable()->constrained('pos_warehouse_stocks');
            $table->foreignId('pos_purchase_id')->nullable()->constrained('pos_purchases');
            $table->bigInteger('stocks')->default(0);
            $table->enum('status', ['Added', 'Returned', 'Deducted'])->default('Added');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_warehouse_transactions');
    }
};
