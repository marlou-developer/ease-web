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
        Schema::create('pos_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->nullable()->constrained('users');
            $table->foreignId('pos_supplier_id')->nullable()->constrained('pos_suppliers');
            $table->string('reference_no')->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'received'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_purchases');
    }
};
