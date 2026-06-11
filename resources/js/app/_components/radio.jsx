import React from "react";

export default function Radio({
    label,
    id,
    disabled = false,
    ...props // Automatically collects type, name, value, checked, onChange, or register
}) {
    return (
        <label
            className={`flex items-center gap-2 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
        >
            <input
                type="radio"
                id={id}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                {...props}
            />
            <span className="text-sm text-gray-800">{label}</span>
        </label>
    );
}
