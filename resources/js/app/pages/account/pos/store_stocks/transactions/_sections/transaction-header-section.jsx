import { BarChart3, Calendar, Download } from 'lucide-react'
import React from 'react'

export default function TransactionHeaderSection() {
    return (
        <>
            {/* Added flex-col for mobile, md:flex-row for larger screens, and gap-4 to separate stacked items */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-blue-100 gap-4 md:gap-0">

                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Store Stock Movement
                        </h1>
                        <p className="text-sm text-gray-500">
                            Overview for Jan 01, 2026 - Jan 31, 2026
                        </p>
                    </div>
                </div>

                {/* Made the button container full width on mobile, and stack buttons on very small screens */}
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                    <button className="flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                        <Calendar size={16} /> Custom Range
                    </button>
                    <button className="flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-md transition">
                        <Download size={16} /> Export PDF
                    </button>
                </div>

            </div>
        </>
    )
}