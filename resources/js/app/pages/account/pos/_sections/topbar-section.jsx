import { useState, Fragment } from "react";
import { Transition, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { setDesktopCollapsed, setSidebarOpen } from "@/app/redux/app-slice";
import { Link } from "@inertiajs/react";
import SelectStoreSection from "./select-store-section";


export default function TopbarSection() {
    const { app } = useSelector((store) => store.app)
    console.log('app', app)
    const dispatch = useDispatch();

    return (
        <>
            <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
                <button
                    className="hidden lg:block p-2  items-center justify-center text-gray-900 hover:text-gray-700"
                    onClick={() => dispatch(setDesktopCollapsed())}
                >
                    <Bars3Icon className="w-5 h-5" />
                </button>
                <button
                    type="button"
                    onClick={() => dispatch(setSidebarOpen())}
                    className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                <div className="flex-1 flex items-center gap-x-4">
                    <form className="flex-1 relative  mx-5">
                        {
                            app?.user?.pos_user_type == 'Admin' && <SelectStoreSection />
                        }

                        {app?.user?.pos_user_type !== 'Admin' && app?.user?.store?.name && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full shadow-sm">
                                {/* Optional: A small storefront icon for better UX */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 text-emerald-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>

                                <span>{app.user.store.name}</span>
                            </div>
                        )}
                    </form>

                    <div className="flex items-center gap-x-4">
                        {/* <button className="p-2 text-gray-400 hover:text-gray-500 ">
                            <BellIcon className="w-6 h-6" />
                        </button> */}

                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center">
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                                <span className="ml-2 hidden lg:block text-sm font-semibold text-gray-900">
                                    {app?.user?.name}
                                </span>
                                <ChevronDownIcon className="ml-1 w-5 h-5 text-gray-400 " />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg">
                                    <Menu.Item>
                                        <a
                                            as="button"
                                            className={
                                                "block px-3 py-1 text-sm text-gray-900 hover:bg-gray-100"
                                            }
                                        >
                                            Profile
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Link
                                            method="post"
                                            href={route("logout")}
                                            as="button"
                                            className={
                                                "block px-3 py-1 text-sm text-gray-900 hover:bg-gray-100"
                                            }
                                        >
                                            Sign Out
                                        </Link>
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </>
    );
}
