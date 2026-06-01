import React, { forwardRef, useState, useEffect, useRef } from "react";

const Select = forwardRef(
    (
        {
            label,
            name,
            options = [],
            error,
            onSelect,
            iconLeft,
            iconRight,
            disabled = false,
            className = "",
            value, // from React Hook Form
            onChange, // from React Hook Form
            required = false,
            ...props
        },
        ref,
    ) => {
        const [search, setSearch] = useState("");
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef();

        // Sync search text with value
        useEffect(() => {
            const selectedOption = options.find((o) => o.value === value);
            if (selectedOption) setSearch(selectedOption.label);
            else setSearch("");
        }, [value, options]);

        const handleSelect = (option) => {
            setSearch(option.label);
            onChange(option.value);
            onSelect && onSelect(option);
            setIsOpen(false);
        };

        const handleInputClick = () => {
            if (!disabled) setIsOpen(true);
        };

        // Close dropdown on outside click
        useEffect(() => {
            const handleClickOutside = (e) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target)
                ) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        // Filter options
        const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase()),
        );

        return (
            <div className="w-full" ref={containerRef}>
                <div className="relative">
                    {/* Left Icon */}
                    {iconLeft && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                            {iconLeft}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        type="search"
                        {...props}
                        autoComplete="off"
                        required={required}
                        ref={ref}
                        id={name}
                        name={name}
                        disabled={disabled}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setIsOpen(true); // open dropdown while typing
                        }}
                        onClick={handleInputClick}
                        placeholder=""
                        className={`w-full rounded-md  bg-white py-3 border-2 px-4 text-sm text-black
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${iconLeft ? "pl-10" : ""} ${iconRight ? "pr-10" : "pr-8"}
              ${error ? "border-red-500 focus:ring-red-500" : "border-blue-500"}
              ${className}`}
                    />

                    {/* Floating Label */}
                    <label
                        htmlFor={name}
                        className={`absolute left-3 bg-white px-1 text-sm transition-all duration-200 ease-out
              ${search || isOpen ? "-top-2 text-xs text-blue-600" : "top-2.5 text-gray-500"}`}
                    >
                        <div className="flex gap-0.5">
                            {label}
                            {required && <span className="text-red-500 font-medium">*</span>}
                        </div>
                    </label>

                    {/* Dropdown Arrow */}
                    {!iconRight && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <svg
                                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Right Icon */}
                    {iconRight && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {iconRight}
                        </div>
                    )}

                    {/* Dropdown Options */}
                    {isOpen && !disabled && (
                        <ul className="absolute z-[60] mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white shadow-lg">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, idx) => (
                                    <li
                                        key={idx}
                                        className={`cursor-pointer px-4 py-2 hover:bg-blue-100 text-black text-sm ${value === option.value
                                            ? "bg-blue-50 text-blue-600"
                                            : ""
                                            }`}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // prevent blur
                                            handleSelect(option);
                                        }}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-sm text-gray-500">
                                    No results found
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error.message ?? error}
                    </p>
                )}
            </div>
        );
    },
);

Select.displayName = "Select";

export default Select;
