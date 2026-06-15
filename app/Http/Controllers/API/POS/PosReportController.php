<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCategory;
use App\Models\POS\PosCustomer;
use App\Models\POS\PosSale;
use App\Models\POS\PosSalesItem;
use App\Models\POS\PosSupplier;
use App\Models\POS\PosWarehouseStock;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Make sure DB is imported!

class PosReportController extends Controller
{
    public function profit_and_margin(Request $request)
    {
        // 1. Build the query but DO NOT execute it yet
        $query = PosSalesItem::where('pos_store_id', session('pos_store_id'))
            ->when($request->pos_supplier_id, function ($query, $supplier) {
                return $query->where('pos_supplier_id', $supplier);
            })
            ->when($request->date_range, function ($query, $dateString) {
                $dates = explode(',', $dateString);

                if (count($dates) === 2 && $dates[0] !== '' && $dates[1] !== '') {
                    $start = \Carbon\Carbon::parse($dates[0])->startOfDay();
                    $end = \Carbon\Carbon::parse($dates[1])->endOfDay();
                    return $query->whereBetween('created_at', [$start, $end]);
                }
                return $query;
            })
            ->when($request->pos_category_id, function ($query, $category) {
                return $query->where('pos_category_id', $category);
            })
            ->when($request->product_id, function ($query, $product) {
                return $query->where('pos_product_stock_id', $product);
            })
            ->when($request->customer_id, function ($query, $customerId) {
                return $query->whereHas('sale', function ($q) use ($customerId) {
                    $q->where('subscriber_id', Auth::user()->subscriber_id);
                    if ($customerId) {
                        $q->where('customer_id', $customerId);
                    }
                });
            })
            ->when($request->cashier_id, function ($query, $cashier) {
                return $query->whereHas('sale', function ($q) use ($cashier) {
                    $q->where('subscriber_id', Auth::user()->subscriber_id);
                    if ($cashier) {
                        $q->where('cashier_id', $cashier);
                    }
                });
            })
            ->with(['sale', 'pos_product_stock']);
        $query->latest('id');
        // 2. Conditionally execute the query
        // Using except('page') ensures that navigating to ?page=2 doesn't break pagination
        if (empty($request->except('page'))) {
            $sales_items = $query->paginate(15);
            return [...$sales_items];
        } else {
            $sales_items = $query->get();
            return $sales_items;
        }
    }
    public function index(Request $request)
    {
        $customers = PosCustomer::where('subscriber_id', Auth::user()->subscriber_id)->get();
        $products = PosWarehouseStock::where('subscriber_id', Auth::user()->subscriber_id)->with(['product'])->get();
        $suppliers = PosSupplier::where('subscriber_id', Auth::user()->subscriber_id)->get();
        $categories = PosCategory::where('subscriber_id', Auth::user()->subscriber_id)->get();
        $users = User::where('subscriber_id', Auth::user()->subscriber_id)->get();


        return response()->json([
            'success' => true,
            'data' => [
                'customers' => $customers,
                'products'  =>  $products,
                'suppliers' => $suppliers,
                'categories' => $categories,
                'data' => $this->profit_and_margin($request),
                'users' => $users
            ]
        ]);
    }
}
