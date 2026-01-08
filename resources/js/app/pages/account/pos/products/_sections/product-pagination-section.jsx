import { setCurrentPage } from "@/app/redux/pos/pos-product-slice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

  const INITIAL_PRODUCTS = [
        {
            id: 1,
            name: "Milk",
            category: "Dairy",
            price: 2.5,
            stock: 20,
            img: "https://cdn-icons-png.flaticon.com/128/372/372627.png",
        },
        {
            id: 2,
            name: "Bread",
            category: "Bakery",
            price: 1.0,
            stock: 15,
            img: "https://cdn-icons-png.flaticon.com/128/422/422160.png",
        },
        {
            id: 3,
            name: "Eggs",
            category: "Dairy",
            price: 3.0,
            stock: 30,
            img: "https://cdn-icons-png.flaticon.com/128/837/837165.png",
        },
        {
            id: 4,
            name: "Apple",
            category: "Fruits",
            price: 1.2,
            stock: 50,
            img: "https://cdn-icons-png.flaticon.com/128/415/415682.png",
        },
        {
            id: 5,
            name: "Orange Juice",
            category: "Fruits",
            price: 2.5,
            stock: 25,
            img: "https://cdn-icons-png.flaticon.com/128/1321/1321742.png",
        },
        {
            id: 6,
            name: "Chips",
            category: "Snacks",
            price: 1.5,
            stock: 40,
            img: "https://cdn-icons-png.flaticon.com/128/2553/2553691.png",
        },
        // Adding more to reach 20 for pagination demo
        {
            id: 7,
            name: "Butter",
            category: "Dairy",
            price: 3.2,
            stock: 12,
            img: "https://cdn-icons-png.flaticon.com/128/2619/2619550.png",
        },
        {
            id: 8,
            name: "Croissant",
            category: "Bakery",
            price: 1.8,
            stock: 8,
            img: "https://cdn-icons-png.flaticon.com/128/2821/2821805.png",
        },
        {
            id: 9,
            name: "Banana",
            category: "Fruits",
            price: 0.5,
            stock: 60,
            img: "https://cdn-icons-png.flaticon.com/128/2909/2909761.png",
        },
        {
            id: 10,
            name: "Soda",
            category: "Beverages",
            price: 1.5,
            stock: 45,
            img: "https://cdn-icons-png.flaticon.com/128/2405/2405479.png",
        },
        {
            id: 11,
            name: "Cheese",
            category: "Dairy",
            price: 4.5,
            stock: 18,
            img: "https://cdn-icons-png.flaticon.com/128/2153/2153788.png",
        },
        {
            id: 12,
            name: "Cookies",
            category: "Snacks",
            price: 2.0,
            stock: 35,
            img: "https://cdn-icons-png.flaticon.com/128/541/541732.png",
        },
        {
            id: 13,
            name: "Yogurt",
            category: "Dairy",
            price: 0.8,
            stock: 22,
            img: "https://cdn-icons-png.flaticon.com/128/2358/2358979.png",
        },
        {
            id: 14,
            name: "Bagel",
            category: "Bakery",
            price: 1.1,
            stock: 14,
            img: "https://cdn-icons-png.flaticon.com/128/1232/1232448.png",
        },
        {
            id: 15,
            name: "Grapes",
            category: "Fruits",
            price: 2.75,
            stock: 10,
            img: "https://cdn-icons-png.flaticon.com/128/7290/7290117.png",
        },
        {
            id: 16,
            name: "Water",
            category: "Beverages",
            price: 1.0,
            stock: 100,
            img: "https://cdn-icons-png.flaticon.com/128/3100/3100566.png",
        },
        {
            id: 17,
            name: "Chocolate",
            category: "Snacks",
            price: 1.25,
            stock: 55,
            img: "https://cdn-icons-png.flaticon.com/128/2553/2553642.png",
        },
        {
            id: 18,
            name: "Muffin",
            category: "Bakery",
            price: 2.25,
            stock: 9,
            img: "https://cdn-icons-png.flaticon.com/128/2261/2261214.png",
        },
        {
            id: 19,
            name: "Ice Cream",
            category: "Dairy",
            price: 4.0,
            stock: 20,
            img: "https://cdn-icons-png.flaticon.com/128/938/938063.png",
        },
        {
            id: 20,
            name: "Coffee",
            category: "Beverages",
            price: 5.0,
            stock: 30,
            img: "https://cdn-icons-png.flaticon.com/128/633/633513.png",
        },
    ];
export default function ProductPaginationSection() {
     const { searchTerm, category, currentPage,products } = useSelector(
        (store) => store.pos_products
    );
    const dispatch = useDispatch();
     const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

     const filteredProducts = products.filter((p) => {
        const matchesSearch = p?.product?.name?.toLowerCase()?.includes(searchTerm.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category === category;
        return matchesSearch && matchesCat;
    });

    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    return (
        <>
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
                    <button
                        disabled={currentPage === 1}
                        onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => dispatch(setCurrentPage(i + 1))}
                            className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                                currentPage === i + 1
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white border border-slate-300 hover:border-blue-500"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
