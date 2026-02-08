import { setCart } from "@/app/redux/pos/pos-product-slice";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function POSProductListSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const { cart = [], products = [] } = useSelector(
        (store) => store.pos_products,
    );
    const dispatch = useDispatch();

    const PRODUCTS =
        products?.map((res) => ({
            id: res.id,
            name: res.product?.name ?? "Unknown",
            stocks: res.stocks ?? "Unknown",
            price: Number(res.sell_price).toFixed(2),
            category: res.product?.category?.name ?? "N/A",
            img: res.product.image,
        })) || [];

    const filteredProducts = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const addToCart = (product) => {
        const exists = cart.find((item) => item.id === product.id);
        if (exists)
            return dispatch(
                setCart(
                    cart.map((item) =>
                        item.id === product.id
                            ? { ...item, qty: item.qty + 1 }
                            : item,
                    ),
                ),
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
                    {filteredProducts.map((product, i) => (
                        <button
                            key={i}
                            disabled={product.stocks == 0}
                            onClick={() => addToCart(product)}
                            className={`border ${product.stocks == 0 ? "bg-gray-300" : ""} rounded-lg p-2 text-center hover:shadow-md transition bg-blue-50`}
                        >
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-12 h-12 mx-auto mb-2 opacity-80"
                            />
                            <p className="text-xs font-bold truncate">
                                {product.name}
                            </p>
                            <p className="text-blue-600 text-xs">
                                ${product.price}
                            </p>
                            <p className="font-thin text-sm  mb-2">
                                Quantity:{product.stocks}
                            </p>
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-blue-600 text-white text-[10px] py-1 rounded uppercase font-bold hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </button>
                    ))}
                </div>
            </section>
        </>
    );
}
