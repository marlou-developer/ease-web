import SidebarSection from "./_sections/sidebar-section";
import { useSelector } from "react-redux";
import TopbarSection from "./_sections/topbar-section";
import { useEffect } from "react";
import store from "@/app/store/store";
import { get_user_thunk } from "@/app/redux/app-thunk";

export default function Layout({ children }) {
    const { desktopCollapsed } = useSelector((store) => store.app);

    useEffect(() => {
        store.dispatch(get_user_thunk())
    }, [])
    return (
        <div className="h-full bg-white ">
            <SidebarSection />
            <div
                className={`${desktopCollapsed ? "" : "lg:pl-72"
                    } flex flex-col min-h-screen transition-all duration-300`}
            >
                <TopbarSection />
                <main
                    className={`flex-1 ${desktopCollapsed ? "ml-20" : ""}`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
