import { setCurrentPage } from "@/app/redux/pos/pos-slice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SalesPaginationSection() {
    const { searchTerm, category, currentPage, products } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();
    const itemsPerPage = 10;

    // Safety check just in case products is ever undefined
    const safeProducts = products?.pos_warehouse?.pos_warehouse_stocks || [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredProducts = safeProducts.filter((p) => {
        const matchesSearch = p?.product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || "");
        const matchesCat = category === "All Categories" || p.category === category;
        return matchesSearch && matchesCat;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // --- Dynamic Page Numbers Logic ---
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            // If 7 or fewer pages, show all numbers
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // If near the beginning
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            }
            // If near the end
            else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
            // If in the middle
            else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    // Don't render pagination if there are no products to show
    if (filteredProducts.length === 0) return null;

    return (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-bold">
                    {Math.min(indexOfLastItem, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold">{filteredProducts.length}</span>{" "}
                products
            </p>

            <div className="flex items-center gap-1">
                {/* Previous Button */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                {/* Dynamic Page Numbers */}
                {getPageNumbers().map((number, index) => (
                    <button
                        key={index}
                        onClick={() => typeof number === 'number' && dispatch(setCurrentPage(number))}
                        disabled={number === '...'}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition ${currentPage === number
                            ? "bg-blue-600 text-white shadow-md"
                            : number === '...'
                                ? "bg-transparent border-transparent text-slate-400 cursor-default"
                                : "bg-white border border-slate-300 hover:border-blue-500"
                            }`}
                    >
                        {number}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}