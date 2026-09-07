import { CreditCard } from "lucide-react";
import React from "react";

export default function HeaderSection() {
    return (
        <>
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold flex-1">
                    <CreditCard size={24} />
                    Credits
                </div>
            </div>
        </>
    );
}
