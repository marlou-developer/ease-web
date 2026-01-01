import React from "react";
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

const ReportsTableSection = () => {
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
        <div className="space-y-6">
            {/* Header & Export Actions */}
            <div className="flex justify-between items-center bg-white p-4  border border-blue-100">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Analytics & Reports
                        </h1>
                        <p className="text-sm text-gray-500">
                            Overview for Jan 01, 2026 - Jan 31, 2026
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                        <Calendar size={16} /> Custom Range
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-md transition">
                        <Download size={16} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
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
                                className={`flex items-center text-xs font-bold ${
                                    card.positive
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

            {/* Bottom Sections: Inventory vs Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
                {/* Top Products Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h3 className="font-bold text-gray-700">
                            Stock Performance (Turnover)
                        </h3>
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                            View All
                        </button>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 bg-gray-50/50">
                                <th className="px-6 py-3 font-semibold uppercase text-[10px]">
                                    Product
                                </th>
                                <th className="px-6 py-3 font-semibold uppercase text-[10px]">
                                    Units Sold
                                </th>
                                <th className="px-6 py-3 font-semibold uppercase text-[10px]">
                                    Current Stock
                                </th>
                                <th className="px-6 py-3 font-semibold uppercase text-[10px]">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                {
                                    name: "Coca-Cola 1L",
                                    sold: 850,
                                    stock: 120,
                                    revenue: "$1,700",
                                },
                                {
                                    name: "Milo 1kg",
                                    sold: 420,
                                    stock: 45,
                                    revenue: "$4,200",
                                },
                                {
                                    name: "Tide Powder",
                                    sold: 310,
                                    stock: 15,
                                    revenue: "$3,100",
                                },
                            ].map((item, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-blue-50/20 transition"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {item.sold}
                                    </td>
                                    <td
                                        className={`px-6 py-4 font-bold ${
                                            item.stock < 20
                                                ? "text-red-500"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {item.stock}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {item.revenue}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Cash Register Summary */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        Live Register Status
                    </h3>
                    <div className="space-y-4">
                        {[
                            {
                                name: "Front Counter",
                                amount: "$1,235.50",
                                status: "Open",
                            },
                            {
                                name: "Drive-Thru",
                                amount: "$678.75",
                                status: "Open",
                            },
                            {
                                name: "Main Register",
                                amount: "$0.00",
                                status: "Closed",
                            },
                        ].map((reg, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                            >
                                <div>
                                    <p className="text-sm font-bold text-gray-700">
                                        {reg.name}
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">
                                        {reg.status}
                                    </p>
                                </div>
                                <p className="font-mono font-bold text-blue-600">
                                    {reg.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsTableSection;
