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
        users: [],
        reports: {},
        pos_warehouse_transactions: [],
        pos_store_transactions: [],
        pos_store_stats: {},
        pos_warehouse_stats: {},
        purchases_products: [],
        product_requests: [],
        count_pending_stocks: 0,
        count_processing_stocks: 0,
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
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setReports: (state, action) => {
            state.reports = action.payload;
        },
        setPosWarehouseTransactions: (state, action) => {
            state.pos_warehouse_transactions = action.payload;
        },
        setPosStoreTransactions: (state, action) => {
            state.pos_store_transactions = action.payload;
        },
        setPurchasesProducts: (state, action) => {
            state.purchases_products = action.payload;
        },
        setPosStoreStats: (state, action) => {
            state.pos_store_stats = action.payload;
        },
        setWarehouseStats: (state, action) => {
            state.pos_warehouse_stats = action.payload;
        },

        setProductRequests: (state, action) => {
            state.product_requests = action.payload;
        },
        setCountPendingStocks: (state, action) => {
            state.count_pending_stocks = action.payload;
        },
        setCountProcessingStocks: (state, action) => {
            state.count_processing_stocks = action.payload;
        },
    },
});

export const {
    setUsers,
    setCart,
    setSales,
    setUnits,
    setReports,
    setCategories,
    setStoreStocks,
    setCartDetail,
    setHeldSales,
    setSuppliers,
    setPurchases,
    setCustomers,
    setProducts,
    setProductRequests,
    setSearchTerm,
    setCategory,
    setCurrentPage,
    setAmountPaid,
    setWarehouseStats,
    setPosStoreStats,
    setPurchasesProducts,
    setCountPendingStocks,
    setOverAllProductDiscount,
    setCountProcessingStocks,
    setPosWarehouseTransactions,
    setPosStoreTransactions,
} = posSlice.actions;
export default posSlice.reducer;
