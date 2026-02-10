import { ChevronRight } from "lucide-react";
import React from "react";

export default function StockMovementPaginationSection() {
    const PaginationButton = ({ label, active, icon }) => (
        <button
            className={`px-4 py-1.5 rounded text-sm font-medium border transition flex items-center gap-1 ${
                active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
        >
            {label} {icon}
        </button>
    );
    return (
        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50/50">
            <span className="text-sm text-gray-500">
                Showing 1 to 5 of 25 entries
            </span>
            <div className="flex gap-1">
                <PaginationButton label="Previous" />
                <PaginationButton label="1" active />
                <PaginationButton label="2" />
                <PaginationButton label="3" />
                <PaginationButton
                    label="Next"
                    icon={<ChevronRight size={16} />}
                />
            </div>
        </div>
    );
}
