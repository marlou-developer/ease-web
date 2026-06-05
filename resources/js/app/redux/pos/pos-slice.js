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
        cart: [],
        cartDetail: {
            tax: 0.06,
            grandTotal: 0,
            changeDue: 0,
            subtotal: 0,
        },
        heldSales: [],
        store_stocks:[]
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
    },
});

export const {
    setCart,
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
} = posSlice.actions;
export default posSlice.reducer;
