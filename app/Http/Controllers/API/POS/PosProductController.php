<?php

namespace App\Http\Controllers\API\POS;

use App\Http\Controllers\Controller;
use App\Models\POS\PosCategory;
use App\Models\POS\PosCustomer;
use App\Models\POS\PosProduct;
use App\Models\POS\PosProductStock;
use App\Models\POS\PosWarehouseStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PosProductController extends Controller
{
    /**
     * List all products.
     */
    public function index()
    {
        $products = PosProduct::with('category', 'unit')->get();

        return response()->json($products, 200);
    }

    public function get_products()
    {
        $filename = public_path("csv/customers.csv");
        $products = [];

        if (!file_exists($filename)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        if (($handle = fopen($filename, "r")) !== FALSE) {
            $raw_headers = fgetcsv($handle, 0, ",");

            $clean_headers = array_map(function ($header, $index) {
                $header = mb_convert_encoding(trim($header), 'UTF-8', 'ISO-8859-1');
                if ($index === 0) {
                    $header = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $header);
                }
                return strtolower(str_replace(' ', '_', $header));
            }, $raw_headers, array_keys($raw_headers));

            $header_count = count($clean_headers);

            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                if (count($data) === $header_count) {
                    $utf8_data = array_map(function ($value) {
                        return mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
                    }, $data);

                    $row = array_combine($clean_headers, $utf8_data);
                    $products[] = (object) $row; // Saving as OBJECT
                }
            }
            fclose($handle);
        }

        $authId = Auth::id();
        $storeId = session('pos_store_id');

        // foreach ($products as $key => $value) {
        //     $pos_product = PosProduct::updateOrCreate(
        //         ['name' => $value->name],
        //         ['image' => $value->file]
        //     );

        //     PosProductStock::updateOrCreate(
        //         [
        //             'pos_store_id' => $storeId,
        //             'pos_product_id' => $pos_product->id,
        //             'subscriber_id' => $authId,
        //         ],
        //         [
        //             'stocks' => 0,
        //             'cost_price' => $value->cost ?? $value->cost == "NULL" ? 0.00 : 0.00,
        //             'sell_price' => $value->srp ?? $value->cost == "NULL" ? 0.00 : 0.00,
        //             'discount' => 0,
        //         ]
        //     );

        //     PosWarehouseStock::updateOrCreate(
        //         [
        //             'pos_warehouse_id' => 1,
        //             'pos_product_id' => $pos_product->id,
        //             'subscriber_id' => $authId,
        //         ],
        //         [
        //             'cost_price' => $value->cost ?? $value->cost == "NULL" ? 0.00 : 0.00,
        //             'stocks' => 0,
        //         ]
        //     );
        // }

        // foreach ($products as $key => $value) {
        //     $addressParts = [
        //         $value->brgy ?? null,
        //         $value->city ?? null,
        //         $value->province ?? null,
        //         $value->postal ?? null,
        //     ];
        //     $cleanParts = array_filter($addressParts, function ($part) {
        //         return !empty(trim($part)) && strtoupper(trim($part)) !== 'NULL';
        //     });
        //     $fullAddress = empty($cleanParts) ? null : implode(', ', $cleanParts);
        //     PosCustomer::updateOrCreate(
        //         [
        //             'name' => $value->name,
        //             'subscriber_id' => $authId,
        //         ],
        //         [
        //             'address' => $fullAddress
        //         ]
        //     );
        // }
        return response()->json($products);
    }
    /**
     * Store a new product.
     */
    public function store(Request $request)
    {

        $product = PosProduct::create($request->all());
        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ]);
    }

    /**
     * Show a specific product.
     */
    public function show(PosProduct $posProduct)
    {
        $posProduct->load('category', 'unit');

        return response()->json([
            'success' => true,
            'data' => $posProduct
        ]);
    }

    /**
     * Update a product.
     */
    public function update(Request $request, PosProduct $posProduct)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'barcode' => 'nullable|string|unique:pos_products,barcode,' . $posProduct->id,
            'category_id' => 'nullable|exists:pos_categories,id',
            'unit_id' => 'nullable|exists:pos_units,id',
            'cost_price' => 'sometimes|required|numeric|min:0',
            'sell_price' => 'sometimes|required|numeric|min:0',
            'reorder_level' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $posProduct->update($request->only(
            'name',
            'barcode',
            'category_id',
            'unit_id',
            'cost_price',
            'sell_price',
            'reorder_level',
            'description',
            'image'
        ));

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $posProduct
        ]);
    }

    /**
     * Delete a product.
     */
    public function destroy(PosProduct $posProduct)
    {
        $posProduct->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
