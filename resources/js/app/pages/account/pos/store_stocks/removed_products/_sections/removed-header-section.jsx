import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

export default function RemovedHeaderSection() {
    const { removed_stocks } = useSelector((store) => store.pos);

    return (
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <h1 className="flex-1 text-xl font-bold">
                Removed Products ({removed_stocks?.length ?? 0})
            </h1>
            <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 rounded-lg hover:bg-white/20 transition"
                onClick={() => router.visit("/account/pos/store_stocks")}
            >
                <ArrowLeft size={16} /> Back to Products
            </button>
        </div>
    );
}
