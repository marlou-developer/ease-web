import { setCart } from "@/app/redux/pos/pos-slice";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function POSProductListSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { cart = [], store_stocks = [] } = useSelector((store) => store.pos);
    const dispatch = useDispatch();

    const PRODUCTS =
        store_stocks?.map((res) => ({
            pos_supplier_id: res?.pos_supplier_id,
            pos_category_id: res?.product?.category?.id,
            id: res?.id,
            name: res?.product?.name ?? "Unknown",
            stocks: res?.stocks ?? "Unknown",
            price: Number(res?.selling_price).toFixed(2),
            srp: Number(res?.selling_price).toFixed(2),
            category: res?.product?.category?.name ?? "N/A",
            img: res?.product.image,
            cost_price: res?.cost_price,
            discount: res?.discount,
        })) || [];

    const filteredProducts = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    console.log("store_stocksbadodo", cart);
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
            <section className="col-span-12 lg:col-span-4 border-r flex flex-col p-4 bg-white overflow-hidden">
                <div className="relative mb-4 sticky top-0 z-10 bg-white pb-1">
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={searchTerm}
                        className="w-full border p-2 pl-10 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2 overflow-y-auto flex-1">
                    {filteredProducts.map((product, i) => (
                        <div
                            key={i}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedProduct(product)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedProduct(product);
                                }
                            }}
                            className={`border ${product.stocks == 0 ? "bg-gray-300" : ""} rounded-lg p-2 text-center hover:shadow-md transition bg-blue-50 cursor-pointer`}
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
                                ₱{product.price}
                            </p>
                            <p className="font-thin text-sm  mb-2">
                                Quantity:{product.stocks}
                            </p>
                            <button
                                disabled={product.stocks == 0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                }}
                                className="w-full bg-blue-600 text-white text-[10px] py-1 rounded uppercase font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img
                            src={selectedProduct.img}
                            alt={selectedProduct.name}
                            className="w-32 h-32 object-contain mx-auto mb-4"
                        />
                        <h3 className="text-center text-lg font-bold">
                            {selectedProduct.name}
                        </h3>
                        <p className="text-center text-sm text-gray-500 mb-3">
                            {selectedProduct.category}
                        </p>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price</span>
                                <span className="font-semibold text-blue-600">
                                    ₱{selectedProduct.price}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Stock</span>
                                <span className="font-semibold">
                                    {selectedProduct.stocks}
                                </span>
                            </div>
                        </div>
                        <button
                            disabled={selectedProduct.stocks == 0}
                            onClick={() => {
                                addToCart(selectedProduct);
                                setSelectedProduct(null);
                            }}
                            className="mt-4 w-full rounded bg-blue-600 py-2 text-xs font-bold uppercase text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
