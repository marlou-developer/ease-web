import React from "react";
import ProductCreateSection from "./product-create-section";

export default function ProductHeaderSection() {
    return (
        <>
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <h1 className="flex-1 text-xl font-bold">Products</h1>
                <div>
                    <ProductCreateSection />
                </div>
            </div>
        </>
    );
}
