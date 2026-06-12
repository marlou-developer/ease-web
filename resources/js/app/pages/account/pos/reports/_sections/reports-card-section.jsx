import React from 'react'
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    Calendar,
    Filter,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

export default function ReportsCardSection() {
      const reportCards = [
        {
            title: "Total Sales",
            value: "$42,500.00",
            change: "+12.5%",
            positive: true,
            icon: <TrendingUp size={20} className="text-emerald-600" />,
        },
        {
            title: "Purchase Costs",
            value: "$18,200.00",
            change: "+5.2%",
            positive: false,
            icon: <FileText size={20} className="text-blue-600" />,
        },
        {
            title: "Net Profit",
            value: "$24,300.00",
            change: "+18.3%",
            positive: true,
            icon: <BarChart3 size={20} className="text-indigo-600" />,
        },
        {
            title: "Inventory Value",
            value: "$85,400.00",
            change: "-2.1%",
            positive: true,
            icon: <PieChart size={20} className="text-orange-600" />,
        },
    ];
  return (
    <>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                {card.icon}
                            </div>
                            <div
                                className={`flex items-center text-xs font-bold ${card.positive
                                        ? "text-emerald-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {card.positive ? (
                                    <ArrowUpRight size={14} />
                                ) : (
                                    <ArrowDownRight size={14} />
                                )}
                                {card.change}
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">
                            {card.title}
                        </h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>
    </>
  )
}
