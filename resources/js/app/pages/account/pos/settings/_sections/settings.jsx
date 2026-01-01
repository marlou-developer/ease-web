import React, { useState } from "react";
import {
    Settings,
    Building2,
    Percent,
    Bell,
    ShieldCheck,
    Save,
    Globe,
    Smartphone,
    Database,
} from "lucide-react";

const SettingsSection = () => {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "General", icon: <Building2 size={18} /> },
        { id: "tax", label: "Taxes & Currency", icon: <Percent size={18} /> },
        {
            id: "notifications",
            label: "Notifications",
            icon: <Bell size={18} />,
        },
        { id: "security", label: "Security", icon: <ShieldCheck size={18} /> },
    ];

    return (
        <div>
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <Settings size={24} />
                    System Settings
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1 px-6 py-1.5 rounded-md transition text-sm font-bold shadow-md">
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="flex flex-col md:flex-row min-h-[500px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === "general" && (
                        <div className="max-w-2xl space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                                    Business Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <InputGroup
                                        label="Store Name"
                                        placeholder="My Retail Store"
                                    />
                                    <InputGroup
                                        label="Contact Email"
                                        placeholder="admin@store.com"
                                    />
                                    <InputGroup
                                        label="Address"
                                        placeholder="123 Business Ave, New York"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                                    Regional
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectGroup
                                        label="Language"
                                        options={[
                                            "English",
                                            "Spanish",
                                            "French",
                                        ]}
                                    />
                                    <SelectGroup
                                        label="Timezone"
                                        options={[
                                            "UTC-5 (EST)",
                                            "UTC+0 (GMT)",
                                            "UTC+8 (PST)",
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "tax" && (
                        <div className="max-w-2xl space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                                Tax & Finance Configuration
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup
                                    label="Tax Rate (%)"
                                    placeholder="12.00"
                                />
                                <SelectGroup
                                    label="Currency Symbol"
                                    options={["USD ($)", "EUR (€)", "PHP (₱)"]}
                                />
                                <div className="col-span-2 flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600"
                                        id="tax_inclusive"
                                    />
                                    <label
                                        htmlFor="tax_inclusive"
                                        className="text-sm text-blue-800 font-medium"
                                    >
                                        Prices are tax-inclusive
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="max-w-2xl space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                                System Security
                            </h3>
                            <div className="p-4 border rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-700">
                                        Database Backups
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Automatically backup data every 24 hours
                                    </p>
                                </div>
                                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1">
                                    <div className="w-4 h-4 bg-white rounded-full translate-x-6"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Sub-components
const InputGroup = ({ label, placeholder }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">
            {label}
        </label>
        <input
            type="text"
            placeholder={placeholder}
            className="px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-sm transition"
        />
    </div>
);

const SelectGroup = ({ label, options }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 uppercase">
            {label}
        </label>
        <select className="px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white transition">
            {options.map((opt, i) => (
                <option key={i}>{opt}</option>
            ))}
        </select>
    </div>
);

export default SettingsSection;
