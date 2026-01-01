import { setCart } from "@/app/redux/pos/pos-product-slice";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function POSProductListSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const { cart } = useSelector((store) => store.pos_products);
    const dispatch = useDispatch();
    const PRODUCTS = [
        {
            id: 1,
            name: "Milk",
            price: 2.5,
            category: "Dairy",
            img: "https://cdn-icons-png.flaticon.com/128/372/372627.png",
        },
        {
            id: 2,
            name: "Bread",
            price: 1.0,
            category: "Bakery",
            img: "https://cdn-icons-png.flaticon.com/128/422/422160.png",
        },
        {
            id: 3,
            name: "Eggs",
            price: 3.0,
            category: "Dairy",
            img: "https://cdn-icons-png.flaticon.com/128/837/837165.png",
        },
        {
            id: 4,
            name: "Apple",
            price: 1.2,
            category: "Fruit",
            img: "https://cdn-icons-png.flaticon.com/128/415/415682.png",
        },
        {
            id: 5,
            name: "Orange Juice",
            price: 2.5,
            category: "Beverage",
            img: "https://cdn-icons-png.flaticon.com/128/1321/1321742.png",
        },
        {
            id: 6,
            name: "Potato Chips",
            price: 1.5,
            category: "Snack",
            img: "https://cdn-icons-png.flaticon.com/128/2553/2553691.png",
        },
        {
            id: 7,
            name: "Cheese",
            price: 4.0,
            category: "Dairy",
            img: "https://cdn-icons-png.flaticon.com/128/2153/2153788.png",
        },
        {
            id: 8,
            name: "Yogurt",
            price: 0.9,
            category: "Dairy",
            img: "https://cdn-icons-png.flaticon.com/128/2358/2358979.png",
        },
        {
            id: 9,
            name: "Croissant",
            price: 1.8,
            category: "Bakery",
            img: "https://cdn-icons-png.flaticon.com/128/2821/2821805.png",
        },
        {
            id: 10,
            name: "Banana",
            price: 0.5,
            category: "Fruit",
            img: "https://cdn-icons-png.flaticon.com/128/2909/2909761.png",
        },
        {
            id: 11,
            name: "Coffee",
            price: 5.5,
            category: "Beverage",
            img: "https://cdn-icons-png.flaticon.com/128/633/633513.png",
        },
        {
            id: 12,
            name: "Chocolate Bar",
            price: 1.25,
            category: "Snack",
            img: "https://cdn-icons-png.flaticon.com/128/2553/2553642.png",
        },
        {
            id: 13,
            name: "Butter",
            price: 3.2,
            category: "Dairy",
            img: "https://cdn-icons-png.flaticon.com/128/2619/2619550.png",
        },
        {
            id: 14,
            name: "Bagel",
            price: 1.1,
            category: "Bakery",
            img: "https://cdn-icons-png.flaticon.com/128/1232/1232448.png",
        },
        {
            id: 15,
            name: "Water Bottle",
            price: 1.0,
            category: "Beverage",
            img: "https://cdn-icons-png.flaticon.com/128/3100/3100566.png",
        },
        {
            id: 16,
            name: "Grapes",
            price: 2.75,
            category: "Fruit",
            img: "https://cdn-icons-png.flaticon.com/128/7290/7290117.png",
        },
        {
            id: 17,
            name: "Muffin",
            price: 2.25,
            category: "Bakery",
            img: "https://cdn-icons-png.flaticon.com/128/2261/2261214.png",
        },
        {
            id: 18,
            name: "Soda",
            price: 1.5,
            category: "Beverage",
            img: "https://cdn-icons-png.flaticon.com/128/2405/2405479.png",
        },
        {
            id: 19,
            name: "Cookies",
            price: 3.0,
            category: "Snack",
            img: "https://cdn-icons-png.flaticon.com/128/541/541732.png",
        },
        {
            id: 20,
            name: "Ice Cream",
            price: 4.5,
            category: "Dairy",
            img: "https://cdn-icons-png.flaticon.com/128/938/938063.png",
        },
    ];

    const filteredProducts = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product) => {
        const exists = cart.find((item) => item.id === product.id);
        if (exists)
            return dispatch(
                setCart(
                    cart.map((item) =>
                        item.id === product.id
                            ? { ...item, qty: item.qty + 1 }
                            : item
                    )
                )
            );
        return dispatch(setCart([...cart, { ...product, qty: 1 }]));
    };
    return (
        <>
            <section className="col-span-12 lg:col-span-4 border-r flex flex-col p-4 bg-white overflow-auto">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search product..."
                        className="w-full border p-2 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-2">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="border rounded-lg p-2 text-center hover:shadow-md transition bg-gray-50"
                        >
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-12 h-12 mx-auto mb-2 opacity-80"
                            />
                            <p className="text-xs font-bold truncate">
                                {product.name}
                            </p>
                            <p className="text-blue-600 text-xs mb-2">
                                ${product.price.toFixed(2)}
                            </p>
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-blue-600 text-white text-[10px] py-1 rounded uppercase font-bold hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
