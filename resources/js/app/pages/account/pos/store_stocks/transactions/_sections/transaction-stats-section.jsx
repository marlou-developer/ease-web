import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

const StatCard = ({ title, value, icon, colorClass, hoverClass }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`flex flex-col justify-between w-full p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 ease-in-out transform md:hover:-translate-y-1 hover:shadow-lg ${hoverClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onPointerDown={() => setIsHovered(true)} // Ensures the "hover" animation triggers on mobile tap
            onPointerUp={() => setIsHovered(false)}
            onClick={() => console.log(`Clicked on ${title}`)}
        >
            <div className='flex items-center justify-between'>
                <div className='flex-1'>
                    {/* Typography scales down on mobile (text-xs) and up on desktop (md:text-sm) */}
                    <p className='text-xs md:text-sm font-medium text-gray-500 mb-1'>{title}</p>
                    <h3 className='text-2xl md:text-3xl font-bold text-gray-800 tracking-tight'>
                        {value !== undefined ? value : '0'}
                    </h3>
                </div>
                {/* Icon background padding scales depending on device size */}
                <div className={`p-2 md:p-3 rounded-full ${colorClass} transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    {icon}
                </div>
            </div>
            
            {/* Progress bar margin adjusts for mobile vs desktop */}
            <div className={`h-1 w-full mt-4 md:mt-5 rounded-full bg-gray-100 overflow-hidden`}>
                <div 
                    className={`h-full ${colorClass.replace('bg-opacity-20', '').replace('bg-', 'bg-')} transition-all duration-500 ease-out`}
                    style={{ width: isHovered ? '100%' : '30%' }}
                />
            </div>
        </div>
    );
};

export default function TransactionStatsSection() {
    const { pos_store_stats } = useSelector((store) => store.pos);
    
    return (
        <div className='w-full '>
            
            {/* CSS Grid Layout:
                - Mobile: 1 column stack (grid-cols-1)
                - Tablet: 2 columns (sm:grid-cols-2)
                - Desktop: 3 columns (lg:grid-cols-3)
            */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                
                <StatCard 
                    title="Total Quantity Added"
                    value={pos_store_stats?.total_added}
                    icon={<ArrowUpRight className="text-green-600 w-5 h-5 md:w-6 md:h-6" />}
                    colorClass="bg-green-100"
                    hoverClass="hover:border-green-300"
                />

                <StatCard 
                    title="Total Quantity Deducted"
                    value={pos_store_stats?.total_deducted}
                    icon={<ArrowDownRight className="text-red-600 w-5 h-5 md:w-6 md:h-6" />}
                    colorClass="bg-red-100"
                    hoverClass="hover:border-red-300"
                />

                {/* On tablet size (sm), 3 cards look awkward in 2 columns. 
                    This wrapper forces the 3rd card to span across both columns to maintain symmetry,
                    then returns to taking up exactly 1 column on large desktop screens (lg:col-span-1).
                */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <StatCard 
                        title="Current Stocks"
                        value={pos_store_stats?.current_stock}
                        icon={<Package className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />}
                        colorClass="bg-blue-100"
                        hoverClass="hover:border-blue-300"
                    />
                </div>

            </div>
        </div>
    );
}