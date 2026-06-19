import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function DateRangePicker({
    label = "Date Range",
    startDate,
    endDate,
    onDateChange,
    error,
    disabled = false,
    required = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    
    // 1. Initialize simply to the current date
    const [viewDate, setViewDate] = useState(new Date());

    const errorMessage = typeof error === 'object' && error !== null ? error.message : error;

    // 2. Add a useEffect to reset the view whenever the calendar opens
    useEffect(() => {
        if (isOpen) {
            if (startDate) {
                // Snap to the selected start date's month/year
                const [y, m, d] = startDate.split('-');
                setViewDate(new Date(y, m - 1, d));
            } else {
                // Default to the actual current system month/year
                setViewDate(new Date());
            }
        }
    }, [isOpen, startDate]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // --- Navigation Handlers ---
    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    const handlePrevYear = () => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
    const handleNextYear = () => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));

    // --- Calendar Math Helpers ---
    const getCalendarData = (year, month) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const prevDays = Array.from({ length: firstDay }, (_, i) => daysInPrevMonth - firstDay + i + 1);
        const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        
        // Calculate remaining slots to finish the final week grid
        const totalSoFar = prevDays.length + currentDays.length;
        const nextDaysCount = totalSoFar % 7 === 0 ? 0 : 7 - (totalSoFar % 7);
        const nextDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);

        return { prevDays, currentDays, nextDays };
    };

    const getCellDateStr = (year, month, day, type) => {
        let d = new Date(year, month, day);
        if (type === 'prev') d = new Date(year, month - 1, day);
        if (type === 'next') d = new Date(year, month + 1, day);
        
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
    };

    const handleDateClick = (clickedDateStr, type) => {
        if (type === 'prev' || type === 'next') return; 

        if (!startDate || (startDate && endDate)) {
            onDateChange({ start: clickedDateStr, end: '' });
        } else {
            if (clickedDateStr >= startDate) {
                onDateChange({ start: startDate, end: clickedDateStr });
                setIsOpen(false);
            } else {
                onDateChange({ start: clickedDateStr, end: '' });
            }
        }
    };

    const renderDayCell = (day, type, baseYear, baseMonth) => {
        const cellDateStr = getCellDateStr(baseYear, baseMonth, day, type);

        const isStart = cellDateStr === startDate;
        const isEnd = cellDateStr === endDate;
        const inRange = startDate && endDate && cellDateStr > startDate && cellDateStr < endDate;
        const isOffMonth = type === 'prev' || type === 'next';

        return (
            <div
                key={`${type}-${cellDateStr}`}
                className={`w-full flex items-center justify-center ${inRange ? 'bg-[#eaf4fd]' : ''}`}
            >
                <button
                    type="button" 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(cellDateStr, type);
                    }}
                    disabled={isOffMonth}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors
                        ${isStart || isEnd ? 'bg-blue-500 text-white font-medium shadow-sm' : ''}
                        ${!isStart && !isEnd && !isOffMonth ? 'text-gray-700 hover:bg-gray-100 cursor-pointer' : ''}
                        ${isOffMonth && !inRange ? 'text-gray-300 cursor-default' : ''}
                        ${isOffMonth && inRange ? 'text-gray-400 cursor-default' : ''}
                    `}
                >
                    {day}
                </button>
            </div>
        );
    };

    // Calculate left and right month data dynamically
    const leftYear = viewDate.getFullYear();
    const leftMonth = viewDate.getMonth();
    const leftMonthName = new Date(leftYear, leftMonth).toLocaleString('default', { month: 'short' });
    const leftCal = getCalendarData(leftYear, leftMonth);

    // Right calendar is always 1 month ahead
    const rightDate = new Date(leftYear, leftMonth + 1, 1);
    const rightYear = rightDate.getFullYear();
    const rightMonth = rightDate.getMonth();
    const rightMonthName = rightDate.toLocaleString('default', { month: 'short' });
    const rightCal = getCalendarData(rightYear, rightMonth);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                relative flex items-center w-full h-12 rounded-lg border-2 px-3 transition-all duration-200
                ${disabled
                        ? "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-transparent text-gray-900 cursor-pointer " + (errorMessage
                            ? "border-red-500 focus-within:border-red-500"
                            : isOpen ? "border-blue-600" : "border-blue-500 hover:border-blue-500")
                    }
            `}>
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

                <div className={`mr-2 pointer-events-none transition-opacity duration-200 ${disabled ? "text-gray-400 opacity-50" : "text-gray-400"}`}>
                    <Calendar size={18} />
                </div>

                <input
                    type="text"
                    readOnly
                    placeholder="Start Date"
                    value={startDate || ""}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer disabled:cursor-not-allowed pointer-events-none"
                />

                <span className="mx-2 text-gray-400 text-sm font-medium">to</span>

                <input
                    type="text"
                    readOnly
                    placeholder="End Date"
                    value={endDate || ""}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer disabled:cursor-not-allowed pointer-events-none"
                />
            </div>

            {errorMessage && !disabled && (
                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorMessage}
                </p>
            )}

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-md shadow-xl p-5 flex gap-8 text-sm text-gray-800 w-max font-sans border border-gray-100">

                    {/* Left Calendar */}
                    <div className="w-64">
                        <div className="flex items-center justify-between mb-5 px-2">
                            <div className="flex gap-2 text-gray-400">
                                <ChevronsLeft onClick={handlePrevYear} size={16} className="cursor-pointer hover:text-gray-700 transition-colors" />
                                <ChevronLeft onClick={handlePrevMonth} size={16} className="cursor-pointer hover:text-gray-700 transition-colors" />
                            </div>
                            <span className="font-bold text-gray-900">{leftMonthName} {leftYear}</span>
                            <div className="w-8"></div>
                        </div>

                        <div className="grid grid-cols-7 text-center mb-2 font-medium">
                            {daysOfWeek.map(day => <div key={day} className="text-gray-500 text-xs">{day}</div>)}
                        </div>

                        <div className="grid grid-cols-7 text-center gap-y-2">
                            {leftCal.prevDays.map(d => renderDayCell(d, 'prev', leftYear, leftMonth))}
                            {leftCal.currentDays.map(d => renderDayCell(d, 'current', leftYear, leftMonth))}
                            {leftCal.nextDays.map(d => renderDayCell(d, 'next', leftYear, leftMonth))}
                        </div>
                    </div>

                    {/* Right Calendar */}
                    <div className="w-64">
                        <div className="flex items-center justify-between mb-5 px-2">
                            <div className="w-8"></div>
                            <span className="font-bold text-gray-900">{rightMonthName} {rightYear}</span>
                            <div className="flex gap-2 text-gray-400">
                                <ChevronRight onClick={handleNextMonth} size={16} className="cursor-pointer hover:text-gray-700 transition-colors" />
                                <ChevronsRight onClick={handleNextYear} size={16} className="cursor-pointer hover:text-gray-700 transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-7 text-center mb-2 font-medium">
                            {daysOfWeek.map(day => <div key={day} className="text-gray-500 text-xs">{day}</div>)}
                        </div>

                        <div className="grid grid-cols-7 text-center gap-y-2">
                            {rightCal.prevDays.map(d => renderDayCell(d, 'prev', rightYear, rightMonth))}
                            {rightCal.currentDays.map(d => renderDayCell(d, 'current', rightYear, rightMonth))}
                            {rightCal.nextDays.map(d => renderDayCell(d, 'next', rightYear, rightMonth))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}