import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
        loading: true,
        user: {},
        app: {},
        sidebarOpen: false,
        desktopCollapsed: false,
        pos_store_id: 1,
        alert: {
            type: "none",
            title: "",
            message: "",
            open: false,
        },
        categories: [],
        searchTerm: "",
        category: "All Categories",
        currentPage: 1,
        products: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setApp: (state, action) => {
            state.app = action.payload;
        },
        setSidebarOpen: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setDesktopCollapsed: (state) => {
            state.desktopCollapsed = !state.desktopCollapsed;
        },
        setAlert: (state, action) => {
            state.alert = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
    },
});
export const {
    setLoading,
    setUser,
    setSidebarOpen,
    setDesktopCollapsed,
    setAlert,
    setApp,
    setCategories,
} = appSlice.actions;

export default appSlice.reducer;
