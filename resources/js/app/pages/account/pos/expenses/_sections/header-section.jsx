import { HandCoins } from "lucide-react";
import React from "react";

export default function HeaderSection() {
    return (
        <>
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold flex-1">
                    <HandCoins size={24} />
                    Expenses
                </div>
            </div>
        </>
    );
}
