import {
    setCategory,
    setCurrentPage,
    setSearchTerm,
} from "@/app/redux/pos/pos-product-slice";
import { Search } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductSearchSection() {
    const { searchTerm, category } = useSelector((store) => store.pos_products);
    const dispatch = useDispatch();
    return (
        <>
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4">
                <select
                    className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={category}
                    onChange={(e) => {
                        dispatch(setCategory(e.target.value));
                        dispatch(setCurrentPage(1));
                    }}
                >
                    <option>All Categories</option>
                    <option>Dairy</option>
                    <option>Bakery</option>
                    <option>Fruits</option>
                    <option>Snacks</option>
                    <option>Beverages</option>
                </select>
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-2.5 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => {
                            dispatch(setSearchTerm(e.target.value));
                            dispatch(setCurrentPage(1));
                        }}
                    />
                </div>
            </div>
        </>
    );
}
