import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "app",
    initialState: {
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
    },
    reducers: {
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
    },
});
export const { setUser, setSidebarOpen, setDesktopCollapsed, setAlert,setApp } =
    appSlice.actions;

export default appSlice.reducer;
