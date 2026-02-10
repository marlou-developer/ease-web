import React from "react";
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    Settings,
    RotateCcw,
    BookOpen,
    ChevronDown,
    Calendar,
    Filter,
} from "lucide-react";
import { useSelector } from "react-redux";
import moment from "moment";

const StockMovementTableSection = () => {
    // Mock data mapping to your specific Laravel Schema

    const { stock_movements } = useSelector(
        (store) => store.pos_stock_movements,
    );

    const movements =
        stock_movements?.data?.map((res) => ({
            id: res.id,
            product: res.product_stock.product.name,
            type: res.type,
            qty_change: res.qty_change,
            qty_before: res.qty_before,
            qty_after: res.qty_after,
            reference: res.reference,
            user: res.user.name,
            date: moment(res.created_at).format("LLL"),
            img: res.product_stock.product.image,
            // img: "🧼",
        })) ?? [];

    const getTypeStyle = (type) => {
        switch (type) {
            case "IN":
                return "bg-green-600 text-white";
            case "OUT":
                return "bg-red-600 text-white";
            case "ADJUST":
                return "bg-emerald-600 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const getTypeName = (type) => {
        if (type === "IN") return "Addition";
        if (type === "OUT") return "Deduction";
        return "Adjustment";
    };

    return (
        <div className="  font-sans">
            {/* Header */}

            {/* Stats Cards */}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Qty Before</th>
                            <th className="px-6 py-3">Qty Change</th>
                            <th className="px-6 py-3">Qty After</th>
                            <th className="px-6 py-3">Reference</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {movements.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl shadow-sm border border-gray-200">
                                        <img
                                            src={
                                                item.img ??
                                                "/images/product_null.webp"
                                            }
                                        />
                                    </div>
                                    <span className="font-bold text-gray-700">
                                        {item.product}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-4 py-1 rounded text-xs font-semibold inline-block w-24 text-center ${getTypeStyle(item.type)}`}
                                    >
                                        {getTypeName(item.type)}
                                    </span>
                                </td>
                                <td
                                    className={`px-6 py-4 font-bold text-lg ${item.qty_before > 0 ? "text-gray-700" : "text-red-600"}`}
                                >
                                    {item.qty_before > 0
                                        ? `${item.qty_before}`
                                        : item.qty_before}
                                </td>
                                <td
                                    className={`px-6 py-4 font-bold text-lg ${item.qty_change > 0 ? "text-gray-700" : "text-red-600"}`}
                                >
                                    {item.type == "OUT" && (
                                        <div className="text-red-600">
                                            {item.qty_change > 0
                                                ? `-${item.qty_change}`
                                                : item.qty_change}
                                        </div>
                                    )}

                                    {item.type == "IN" && (
                                        <div className="text-green-600">
                                            {item.qty_change > 0
                                                ? `${item.qty_change}`
                                                : item.qty_change}
                                        </div>
                                    )}
                                </td>
                                <td
                                    className={`px-6 py-4 font-bold text-lg ${item.qty_after > 0 ? "text-gray-700" : "text-red-600"}`}
                                >
                                    {item.qty_after > 0
                                        ? `+${item.qty_after}`
                                        : item.qty_after}
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-medium">
                                    {item.reference}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {item.user}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {item.date}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="px-4 py-1 rounded border border-gray-300 text-blue-600 font-medium text-sm hover:bg-blue-50 transition">
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
        </div>
    );
};

export default StockMovementTableSection;
