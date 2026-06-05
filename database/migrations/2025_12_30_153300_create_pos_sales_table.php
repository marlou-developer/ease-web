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
        Schema::create('pos_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_store_id')->constrained('pos_stores'); 
            $table->foreignId('subscriber_id')->constrained('users'); 
            $table->foreignId('cashier_id')->constrained('users'); 
            $table->foreignId('customer_id')->nullable()->constrained('pos_customers');
            $table->string('invoice_no')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('amount_paid', 10, 2);
            $table->decimal('change_due', 10, 2)->default(0);
            $table->enum('payment_type', ['cash', 'card', 'gcash', 'bank']);
            $table->boolean('is_credit')->default(false);
            $table->enum('status', ['paid', 'void', 'refund'])->default('paid');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_sales');
    }
};
