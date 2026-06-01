import { createSlice } from "@reduxjs/toolkit";

export const posSlice = createSlice({
    name: "app",
    initialState: {
        suppliers: [],
        purchases: [],
        products: [],
    },
    reducers: {
        setSuppliers: (state, action) => {
            state.suppliers = action.payload;
        },
        setPurchases: (state, action) => {
            state.purchases = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
    },
});

export const { setSuppliers, setPurchases } = posSlice.actions;
export default posSlice.reducer;
