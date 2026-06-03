import { BookOpen } from 'lucide-react'
import React from 'react'
import CreateCustomerSection from './create-customer-section'

export default function HeaderSection() {
    return (
        <>
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold flex-1">
                    <BookOpen size={24} />
                    Customers
                </div>
                <CreateCustomerSection  />
            </div>
        </>
    )
}
