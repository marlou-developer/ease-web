import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    setCategory,
    setCurrentPage,
    setSearchTerm,
} from "@/app/redux/pos/pos-slice";
import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import React from "react";
import { FcSearch } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import ProductRequestStocksSection from "./product-request-stocks-section";

export default function ProductSearchSection() {

    const { app } = useSelector(
        (store) => store.app
    );
    const { count_processing_stocks } = useSelector(
        (store) => store.pos
    );

    const dispatch = useDispatch();
    return (
        <>
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="flex-none">
                    <Select
                        onChange={(e) => {
                            dispatch(setCategory(e.target.value));
                            dispatch(setCurrentPage(1));
                        }}
                        name="categories"
                        label="Select Categories"
                        options={app?.categories?.map((product) => ({
                            value: product.id,
                            label: product.name,
                        })) || []}
                    />

                    <div className="ml-1 mt-5 flex flex-wrap gap-3">
                        {/* Transactions Button */}
                        <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1"
                            onClick={() => router.visit(`/account/pos/store_stocks/transactions`)}
                        >
                            View All Transactions
                        </button>

                        <button
                            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1"
                            onClick={() => router.visit(`/account/pos/store_stocks/my_product_requests`)}
                        >
                            My Product Requests
                            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-red-600 bg-red-100 rounded-full group-hover:bg-red-500 group-hover:text-white transition-colors duration-200">
                                {count_processing_stocks}
                            </span>
                        </button>
                    </div>
                </div>
                <div className=" flex-1">
                    <Input
                        icon={<FcSearch
                            className="text-2xl"
                        />}
                        onChange={(e) => {
                            dispatch(setSearchTerm(e.target.value));
                            dispatch(setCurrentPage(1));
                        }}
                        label="Search products..." />
                </div>
                <div>
                    <ProductRequestStocksSection />
                </div>
            </div>
        </>
    );
}
