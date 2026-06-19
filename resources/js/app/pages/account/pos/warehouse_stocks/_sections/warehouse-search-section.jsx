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

export default function WarehouseSearchSection() {
    const { app } = useSelector((store) => store.app);
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
                        options={
                            app?.categories?.map((product) => ({
                                value: product.id,
                                label: product.name,
                            })) || []
                        }
                    />
                    <div className="ml-1 mt-0.5 flex gap-3">
                        <button
                            className="hover:text-pink-500 transition-colors duration-200"
                            onClick={() =>
                                router.visit(`/account/pos/warehouse_stocks/categories`)
                            }
                        >
                            <u className="text-sm">View All Categories</u>
                        </button>

                         <button
                            className="hover:text-pink-500 transition-colors duration-200"
                            onClick={() =>
                                router.visit(`/account/pos/warehouse_stocks/transactions`)
                            }
                        >
                            <u className="text-sm">View All Transaction</u>
                        </button>
                    </div>
                </div>
                <div className=" flex-1">
                    <Input
                        icon={<FcSearch className="text-2xl" />}
                        onChange={(e) => {
                            dispatch(setSearchTerm(e.target.value));
                            dispatch(setCurrentPage(1));
                        }}
                        label="Search products..."
                    />
                </div>
            </div>
        </>
    );
}
