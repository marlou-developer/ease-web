import { useState, useRef } from "react";
import { usePopper } from "react-popper";
import clsx from "clsx";

export default function Tooltip({
    content,
    children,
    theme = "dark",
    position = "none", // new position prop
    offset = 14,
    className,
}) {
    const [visible, setVisible] = useState(false);
    const referenceRef = useRef(null);
    const popperRef = useRef(null);
    const arrowRef = useRef(null);

    // Map your position values to Popper placements
    const placementMap = {
        top: "top",
        "top-left": "top-start",
        "top-right": "top-end",
        bottom: "bottom",
        "bottom-left": "bottom-start",
        "bottom-right": "bottom-end",
        left: "left",
        right: "right",
    };

    const { styles, attributes } = usePopper(
        referenceRef.current,
        popperRef.current,
        {
            placement: placementMap[position] || "",
            modifiers: [
                { name: "offset", options: { offset: [0, offset] } },
                { name: "arrow", options: { element: arrowRef.current } },
            ],
        }
    );

    const themeMap = {
        light: {
            tooltip:
                "text-gray-900 bg-gray-100 rounded-lg border border-gray-200",
            arrow: "bg-gray-100",
        },
        dark: {
            tooltip: "text-white bg-gray-900 rounded-lg",
            arrow: "bg-gray-900",
        },
    };

    return (
        <>
            <span
                ref={referenceRef}
                className="inline-flex"
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            >
                {children}
            </span>

            {visible && (
                <div
                    ref={popperRef}
                    role="tooltip"
                    style={styles.popper}
                    {...attributes.popper}
                    className={clsx(
                        "z-10 px-3 py-2 text-sm font-medium shadow-xs ",
                        themeMap[theme].tooltip,
                        className
                    )}
                >
                    {content}

                    <div
                        ref={arrowRef}
                        data-popper-arrow
                        style={styles.arrow}
                        className={clsx(
                            "absolute w-3 h-3 rotate-45",
                            themeMap[theme].arrow
                        )}
                    />
                </div>
            )}
        </>
    );
}
