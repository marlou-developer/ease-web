import { BookOpen } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux';
import ProductCreateSection from './product-create-section';

export default function HeaderSection() {
    const { products } = useSelector((store) => store.pos);
    return (
        <>
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold flex-1">
                    <BookOpen size={24} />
                    Warehouse: {products?.pos_warehouse?.name} - {products?.pos_warehouse?.location}
                </div>
              <ProductCreateSection />
            </div>
        </>
    )
}
