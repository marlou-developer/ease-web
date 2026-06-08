import { router } from "@inertiajs/react";
import React from "react";

export default function ViewCategoriesSection() {
    return (
        <div className="ml-1 mt-0.5">
            <button
                className="hover:text-pink-500 transition-colors duration-200"
                onClick={() =>
                    router.visit(`/account/pos/warehouse/categories`)
                }
            >
                <u className="text-sm">View All Categories</u>
            </button>
        </div>
    );
}
