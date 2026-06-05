import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import {
    setCategory,
    setCurrentPage,
    setSearchTerm,
} from "@/app/redux/pos/pos-slice";
import { Search } from "lucide-react";
import React from "react";
import { FcSearch } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";

export default function CustomersSearchSection() {
    const { app } = useSelector(
        (store) => store.app
    );
    const dispatch = useDispatch();
    return (
        <>
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4">
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
            </div>
        </>
    );
}
