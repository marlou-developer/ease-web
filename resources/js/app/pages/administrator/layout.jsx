import SidebarSection from "./_sections/sidebar-section";
import { useSelector } from "react-redux";
import TopbarSection from "./_sections/topbar-section";



export default function Layout() {
    const { desktopCollapsed } = useSelector((store) => store.app);


    return (
        <div className="h-full bg-white dark:bg-gray-900">
            <SidebarSection />
            <div
                className={`${
                    desktopCollapsed ? "lg:pl-20" : "lg:pl-72"
                } flex flex-col min-h-screen transition-all duration-300`}
            >
                <TopbarSection />
                <main
                    className={`flex-1 p-6 ${desktopCollapsed ? "ml-20" : ""}`}
                >
                    dawdadkj
                </main>
            </div>
        </div>
    );
}
