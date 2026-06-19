import React from "react";
import { useSelector } from "react-redux";
import CreateCategorySection from "./create-category-section";

export default function CategoryHeaderSection() {
    const { products } = useSelector((store) => store.pos);
    return (
        <>
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold flex-1">
                    Categories:
                </div>
                <CreateCategorySection />
            </div>
        </>
    );
}
