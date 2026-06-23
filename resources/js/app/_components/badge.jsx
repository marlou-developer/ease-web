export default function Badge({
    label = "Badge",
    variant = "primary", // primary | secondary | success | warning | danger
    outlined = false,
    showDot = true,
    className = "",
}) {
    const base =
        "inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium";

    const variants = {
        primary: {
            solid: "bg-blue-100 text-blue-800",
            outline: "text-blue-600 border border-blue-400 inset-ring inset-ring-blue-300",
            dot: "fill-blue-500",
        },
        secondary: {
            solid: "bg-gray-100 text-gray-800",
            outline: "text-gray-600 border border-gray-400 inset-ring inset-ring-gray-300",
            dot: "fill-gray-500",
        },
        success: {
            solid: "bg-green-100 text-green-800",
            outline: "text-green-600 border border-green-400 inset-ring inset-ring-green-300",
            dot: "fill-green-500",
        },
        warning: {
            solid: "bg-yellow-100 text-yellow-800",
            outline: "text-yellow-600 border border-yellow-400 inset-ring inset-ring-yellow-300",
            dot: "fill-yellow-500",
        },
        danger: {
            solid: "bg-red-100 text-red-800",
            outline: "text-red-600 border border-red-400 inset-ring inset-ring-red-300",
            dot: "fill-red-500",
        },
    };

    const style = variants[variant] ?? variants.primary;

    return (
        <span
            className={`${base} ${outlined ? style.outline : style.solid
                } ${className}`}
        >
            {showDot && (
                <svg
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                    className={`size-1.5 ${style.dot}`}
                >
                    <circle r={3} cx={3} cy={3} />
                </svg>
            )}
            {label}
        </span>
    );
}