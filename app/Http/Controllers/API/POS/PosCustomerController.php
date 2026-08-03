<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCreditPayment;
use App\Models\POS\PosCustomer;
use App\Models\POS\PosSale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosCustomerController extends Controller
{
    public function add_credit_payment(Request $request)
    {
        // 1. Validate the incoming payload
        $request->validate([
            'id' => 'required|integer|exists:pos_sales,id',
            'payment.amount' => 'required|numeric|min:0.01',
            'payment.modeOfPayment' => 'required|string',
            'payment.due_date' => 'nullable|date', // Validate the date if provided
        ]);
        try {

            $sale = PosSale::findOrFail($request->id);

            // 3. Extract payment data
            $paymentData = $request->input('payment');
            $paymentAmount = (float) $paymentData['amount'];
            $totalAmount = (float) $sale->amount;


            // Ensure the balance doesn't drop below 0 if they overpay
            $newBalance = max(0, $totalAmount - $paymentAmount);
            $sale->balance = $newBalance;

            // Update the due date if it's a partial payment and a new date is provided
            if (!empty($paymentData['due_date']) && !empty($paymentData['isPartialPayment'])) {
                $sale->due_date = $paymentData['due_date'];
            }

            // Automatically manage the status
            if ($paymentAmount >= $totalAmount) {
                $sale->status = 'Paid';
                // $sale->is_credit = false; // Clears the credit flag once fully paid
            } else {
                $sale->status = 'Partial';
            }

            $sale->save();

            // 6. Map frontend payment values to the strict Database ENUM 
            $enumMapping = [
                'cash'          => 'Cash',
                'Cash'          => 'Cash',
                'gcash'         => 'E-Wallet',
                'bank_transfer' => 'Bank Transfer',
                'credit_card'   => 'Credit/Debit Card',
            ];

            $mappedPaymentType = $enumMapping[$paymentData['modeOfPayment']] ?? 'Cash';

            // 7. Create the payment history record
            PosCreditPayment::create([
                'subscriber_id' => $request->subscriber_id,
                'pos_sales_id'  => $sale->id,
                'payee_id'      => $request->cashier_id,
                'customer_id'   => $request->customer_id,
                'amount'        => $paymentAmount,
                'payment_type'  => $mappedPaymentType,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully.',
                'data'    => $sale
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
    public function index()
    {
        $customers = PosCustomer::where('subscriber_id', Auth::user()->subscriber_id)->get();

        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }

    /**
     * Store a new customer.
     */
    public function store(Request $request)
    {


        $customer = PosCustomer::create([
            ...$request->all(),
            'subscriber_id' => Auth::user()->subscriber_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => $customer
        ]);
    }

    /**
     * Show a specific customer.
     */
    public function show(PosCustomer $posCustomer)
    {
        return response()->json([
            'success' => true,
            'data' => $posCustomer
        ]);
    }

    /**
     * Update a customer.
     */
    public function update(Request $request, PosCustomer $posCustomer)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100|unique:pos_customers,email,' . $posCustomer->id,
            'address' => 'nullable|string'
        ]);

        $posCustomer->update($request->only('name', 'phone', 'email', 'address'));

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => $posCustomer
        ]);
    }

    /**
     * Delete a customer.
     */
    public function destroy(PosCustomer $posCustomer)
    {
        $posCustomer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully'
        ]);
    }
}
