import { ArrowDown, ArrowUp, Settings } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

export default function StockMovementCardSection() {
    const { stats } = useSelector((store) => store.pos_stock_movements);

    console.log("stats", stats);

    const StatCard = ({ color, border, icon, value, label }) => (
        <div
            className={`${color} border ${border} p-4 rounded-lg flex items-center gap-4`}
        >
            <div className="p-2 bg-white/50 rounded-lg">{icon}</div>
            <div>
                <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-gray-800">
                        {value}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-tighter">
                        units
                    </span>
                </div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <StatCard
                color="bg-green-50"
                border="border-green-200"
                icon={<ArrowUp className="text-green-600" />}
                value={stats.additions_today??0}
                label="Additions Today"
            />
            <StatCard
                color="bg-red-50"
                border="border-red-200"
                icon={<ArrowDown className="text-red-600" />}
                value={stats.deductions_today??0}
                label="Deductions Today"
            />
            <StatCard
                color="bg-orange-50"
                border="border-orange-200"
                icon={<ArrowDown className="text-orange-600" />}
                value={stats.adjustments_today??0}
                label="Adjustments Today"
            />
            <StatCard
                color="bg-blue-50"
                border="border-blue-200"
                icon={<Settings className="text-blue-600" />}
                value={stats.current_in_stock??0}
                label="Current In-Stock"
            />
        </div>
    );
}
