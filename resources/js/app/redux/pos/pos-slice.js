import { createSlice } from "@reduxjs/toolkit";

export const posSlice = createSlice({
    name: "app",
    initialState: {
        suppliers: [],
        purchases: [],
        products: [],
        customers: [],
        categories: [],
        searchTerm: "",
        category: "All Categories",
        currentPage: 1,
        products: [],
        amountPaid: 0,
        overall_all_product_discount: 0,
        cart: [],
        cartDetail: {
            tax: 0,
            grandTotal: 0,
            changeDue: 0,
            subtotal: 0,
        },
        heldSales: [],
        store_stocks: [],
        sales: [],
        units: [],
    },
    reducers: {
        setStoreStocks: (state, action) => {
            state.store_stocks = action.payload;
        },
        setSuppliers: (state, action) => {
            state.suppliers = action.payload;
        },

        setPurchases: (state, action) => {
            state.purchases = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setCustomers: (state, action) => {
            state.customers = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setAmountPaid: (state, action) => {
            state.amountPaid = action.payload;
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        setCartDetail: (state, action) => {
            state.cartDetail = action.payload;
        },
        setHeldSales: (state, action) => {
            state.heldSales = action.payload;
        },
        setSales: (state, action) => {
            state.sales = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setUnits: (state, action) => {
            state.units = action.payload;
        },
        setOverAllProductDiscount: (state, action) => {
            state.overall_all_product_discount = action.payload;
        },
    },
});

export const {
    setCart,
    setSales,
    setUnits,
    setCategories,
    setStoreStocks,
    setCartDetail,
    setHeldSales,
    setSuppliers,
    setPurchases,
    setCustomers,
    setProducts,
    setSearchTerm,
    setCategory,
    setCurrentPage,
    setAmountPaid,
    setOverAllProductDiscount,
} = posSlice.actions;
export default posSlice.reducer;
