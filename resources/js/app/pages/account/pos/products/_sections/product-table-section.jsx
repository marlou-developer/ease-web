
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductTableSection() {
    const { searchTerm, category, currentPage, products } = useSelector(
        (store) => store.pos_products
    );
    const dispatch = useDispatch();
    const INITIAL_PRODUCTS = products;
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
        const matchesSearch = p?.product?.name?.toLowerCase()?.includes(searchTerm.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category_id === category;
        return matchesSearch && matchesCat;
    });
    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const handleDelete = (name) => alert(`Delete ${name}?`);
    const handleEdit = (name) => alert(`Edit ${name}?`);
    console.log("currentItems", currentItems);
    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold">Image</th>
                            <th className="px-6 py-4 font-semibold">Name</th>
                            <th className="px-6 py-4 font-semibold">Barcode</th>
                            <th className="px-6 py-4 font-semibold">
                                Cost Price
                            </th>
                            <th className="px-6 py-4 font-semibold">
                                Selling Price
                            </th>
                            <th className="px-6 py-4 font-semibold">
                                Category
                            </th>

                            <th className="px-6 py-4 font-semibold">Unit</th>
                            <th className="px-6 py-4 font-semibold text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((res, i) => (
                            <tr
                                key={i}
                                className="hover:bg-slate-50 transition group"
                            >
                                <td className="px-6 ">
                                    <img
                                        src={
                                            "https://cdn-icons-png.flaticon.com/128/1321/1321742.png"
                                        }
                                        alt={res?.product.name}
                                        className="w-10 h-10 object-contain drop-shadow-sm"
                                    />
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    {res?.product.name}
                                </td>

                                <td className="px-6 py-4 text-sm">
                                 {res?.product.barcode}
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">
                                    {peso_value(res?.cost_price)}
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">
                                    {peso_value(res?.sell_price)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {res?.product?.category_id}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {res?.product?.unit_id}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(res?.product.name)
                                            }
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(res?.product.name)
                                            }
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600 transition"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
