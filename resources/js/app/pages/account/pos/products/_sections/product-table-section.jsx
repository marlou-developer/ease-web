import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductTableSection() {
    const { searchTerm, category, currentPage } = useSelector(
        (store) => store.pos_products
    );
    const dispatch = useDispatch();

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
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
        const matchesSearch = p.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category === category;
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
                            <th className="px-6 py-4 font-semibold">
                                Category
                            </th>
                            <th className="px-6 py-4 font-semibold">Price</th>
                            <th className="px-6 py-4 font-semibold">Stock</th>
                            <th className="px-6 py-4 font-semibold text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentItems.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-slate-50 transition group"
                            >
                                <td className="px-6 py-4">
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="w-10 h-10 object-contain drop-shadow-sm"
                                    />
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {product.category}
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">
                                    ${product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full ${
                                                product.stock > 10
                                                    ? "bg-green-500"
                                                    : "bg-amber-500"
                                            }`}
                                        ></span>
                                        <span className="text-sm font-medium">
                                            {product.stock}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(product.name)
                                            }
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product.name)
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
