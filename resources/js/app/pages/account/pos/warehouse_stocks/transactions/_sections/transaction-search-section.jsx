import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Select from '@/app/_components/select';
import DateRangePicker from '@/app/_components/date-range';
import Button from '@/app/_components/button';
import { router } from '@inertiajs/react';

// Helper function to extract URL parameters
// The 'typeof window' check prevents errors if your app uses Server-Side Rendering (SSR)
const getDefaultValuesFromUrl = () => {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    return {
        pos_warehouse_stock_id: params.get('pos_warehouse_stock_id') || '',
        pos_supplier_id: params.get('pos_supplier_id') || '',
        date_range: params.get('date_range') || '',
    };
};

export default function TransactionSearchSection() {
    const { suppliers, store_stocks } = useSelector((state) => state.pos);

    // 1. Initialize useForm with the extracted URL parameters as defaultValues
    const { control, formState: { errors }, setValue, handleSubmit } = useForm({
        defaultValues: getDefaultValuesFromUrl(),
    });

    // 2. Handle the submission
    function search_data(data) {
        // Clean out empty/null values so your URL doesn't look messy
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != null && v !== '')
        );
        const queryString = new URLSearchParams(cleanData).toString();

        router.visit(`?${queryString}`);
    }

    return (
        <form onSubmit={handleSubmit(search_data)} className='flex gap-3 items-start'>

            <Controller
                name="pos_warehouse_stock_id"
                control={control}
                rules={{ required: false }} // Usually false for search filters so users can view all
                render={({ field: { onChange, value, ...restField } }) => (
                    <Select
                        label="Select Product"
                        options={[
                            { value: "", label: "All Products" }, // Added reset option
                            ...(store_stocks?.map((product) => ({
                                value: String(product.id), 
                                label: `${product?.product?.name}  (Cost: ${product?.cost_price??0} & Sell: ${product?.selling_price??0})` || "Unnamed Product", // <-- Safety fallback added here
                            })) || [])
                        ]}
                        error={errors?.pos_warehouse_stock_id?.message}
                        value={value}
                        {...restField}
                        onChange={(selectedValue) => {
                            onChange(selectedValue);
                        }}
                    />
                )}
            />

            <Controller
                name="pos_supplier_id"
                control={control}
                rules={{ required: false }}
                render={({ field: controllerField }) => (
                    <Select
                        label="Select supplier"
                        options={[
                            { value: "", label: "All Suppliers" }, // Added reset option
                            ...(suppliers?.map((supplier) => ({
                                value: String(supplier.id), 
                                label: `${supplier.name}` || "Unnamed Supplier", // <-- Safety fallback added here
                            })) || [])
                        ]}
                        error={errors?.pos_supplier_id?.message}
                        {...controllerField}
                    />
                )}
            />

            <Controller
                name="date_range"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                    const [start = '', end = ''] = (value || '').split(',');

                    return (
                        <DateRangePicker
                            label="Select Date Range"
                            startDate={start}
                            endDate={end}
                            error={error}
                            onDateChange={(dates) => {
                                if (dates.start || dates.end) {
                                    onChange(`${dates.start},${dates.end}`);
                                } else {
                                    onChange('');
                                }
                            }}
                        />
                    );
                }}
            />

            <Button type="submit" className="w-full sm:w-auto" variant='primary'>
                Search
            </Button>

        </form>
    );
}