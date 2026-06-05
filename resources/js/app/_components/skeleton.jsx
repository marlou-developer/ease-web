import React from "react";

export default function Skeleton() {
    return (
        <>
            <div className="w-full flex flex-col gap-5">
                <div className="h-3 bg-gray-200  w-full"></div>
                <div className="h-3 bg-gray-200  w-full"></div>
                <div className="h-3 bg-gray-200  w-full"></div>
                <div className="h-3 bg-gray-200  w-full"></div>
                <div className="h-3 bg-gray-200  w-full"></div>
                <div className="h-3 bg-gray-200  w-full"></div>
            </div>
        </>
    );
}
