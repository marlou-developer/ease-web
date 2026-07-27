import React, { useState } from 'react';
import { Search, Download, Plus, Filter, Calendar } from 'lucide-react';
import AddProductSection from './add-product-section';

export default function SalesHeaderSection() {
    // State for interactivity
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterActive, setIsFilterActive] = useState(false);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            
            {/* Left side: Title and Subtitle */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Sales Records</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and track your store's transactions.</p>
            </div>

            {/* Right side: Interactive Tools */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                {/* Call to Action Button */}
                <AddProductSection />
               
            </div>

        </div>
    );
}