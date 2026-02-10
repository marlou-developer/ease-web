import { createSlice } from "@reduxjs/toolkit";

export const posStockMovementSlice = createSlice({
    name: "app",
    initialState: {
        stock_movements: [],
        stats: {},
    },
    reducers: {
        setStockMovements: (state, action) => {
            state.stock_movements = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
    },
});

export const { setStockMovements, setStats } = posStockMovementSlice.actions;
export default posStockMovementSlice.reducer;
