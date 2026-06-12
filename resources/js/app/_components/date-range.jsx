import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateRangePicker({
    label = "Date Range",
    startDate,
    endDate,
    onDateChange,
    error,
    disabled = false,
    required = false
}) {
    // Safely extract the error string if an object (like from react-hook-form) is passed
    const errorMessage = typeof error === 'object' && error !== null ? error.message : error;

    const handleStartChange = (e) => {
        const newStart = e.target.value;
        const newEnd = (endDate && newStart > endDate) ? newStart : endDate;
        onDateChange({ start: newStart, end: newEnd });
    };

    const handleEndChange = (e) => {
        const newEnd = e.target.value;
        onDateChange({ start: startDate, end: newEnd });
    };

    return (
        <div className="w-full">
            {/* Main Input Wrapper (Uses focus-within for border highlighting) */}
            <div className={`
                relative flex items-center w-full h-12 rounded-lg border-2 px-3 transition-all duration-200
                ${disabled
                    ? "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-transparent text-gray-900 " + (errorMessage
                        ? "border-red-500 focus-within:border-red-500"
                        : "border-blue-500 focus-within:border-blue-600 hover:border-blue-500")
                }
            `}>

                {/* Floating Label (Permanently docked at the top for Date inputs) */}
                <label className={`
                    absolute px-1 pointer-events-none transition-all duration-200
                    left-3 -top-2.5 text-xs font-medium
                    ${disabled ? "text-gray-400 bg-gray-50" : `bg-white ${errorMessage ? "text-red-500" : "text-blue-500"}`}
                `}>
                    <div className="flex gap-0.5">
                        {label}
                        {required && <span className={`${disabled ? "text-gray-400" : "text-red-500"} font-medium`}>*</span>}
                    </div>
                </label>

                {/* Optional Icon matching your Input style */}
                <div className={`mr-2 pointer-events-none transition-opacity duration-200 ${disabled ? "text-gray-400 opacity-50" : "text-gray-400"}`}>
                    <Calendar size={18} />
                </div>

                {/* Start Date Input */}
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartChange}
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer disabled:cursor-not-allowed"
                />

                <span className="mx-2 text-gray-400 text-sm font-medium">to</span>

                {/* End Date Input */}
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndChange}
                    min={startDate}
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer disabled:cursor-not-allowed"
                />
            </div>

            {/* Error Message (Identical to your Input component) */}
            {errorMessage && !disabled && (
                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorMessage}
                </p>
            )}
        </div>
    );
}