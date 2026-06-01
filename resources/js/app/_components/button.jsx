import React from "react";

const Button = ({
    children,
    variant = "white",
    outlined = false,
    loading = false, // New prop added
    disabled = false, // Explicitly extract disabled to combine it with loading
    className = "",
    type = "button",
    ...props
}) => {
    // Added 'inline-flex items-center justify-center gap-2' for spinner alignment
    const baseClasses =
        "inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-medium text-sm shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed border";

    // Standard filled colors
    const solidVariants = {
        white: "bg-white text-gray-600 border-gray-300 hover:text-gray-800 hover:bg-gray-50 focus:ring-gray-200",
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border-transparent",
        success:
            "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border-transparent",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border-transparent",
        warning:
            "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400 border-transparent",
        info: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400 border-transparent",
        purple: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 border-transparent",
    };

    // Outlined colors (transparent background, colored border and text)
    const outlinedVariants = {
        white: "bg-transparent border-white text-white hover:bg-white/10 focus:ring-white/50 shadow-sm", // Great for dark backgrounds
        primary:
            "bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 shadow-sm",
        success:
            "bg-transparent border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500 shadow-sm",
        danger: "bg-transparent border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 shadow-sm",
        warning:
            "bg-transparent border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-400 shadow-sm",
        info: "bg-transparent border-sky-500 text-sky-600 hover:bg-sky-50 focus:ring-sky-400 shadow-sm",
        purple: "bg-transparent border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500 shadow-sm",
    };

    // Choose the correct dictionary based on the outlined prop
    const activeVariants = outlined ? outlinedVariants : solidVariants;

    // Fallback to white if an invalid variant is passed
    const selectedVariant = activeVariants[variant] || activeVariants.white;

    return (
        <button
            type={type}
            disabled={loading || disabled} // Disable if loading OR explicitly disabled
            className={`${baseClasses} ${selectedVariant} ${className}`}
            {...props}
        >
            {/* Loading Spinner */}
            {loading && (
                <svg
                    className="animate-spin h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
