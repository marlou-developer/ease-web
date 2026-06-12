import Button from '@/app/_components/button';
import Select from '@/app/_components/select';
import React from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { router } from '@inertiajs/react';
import DateRangePicker from '@/app/_components/date-range';

export default function ReportsSearchSection() {
    const { reports } = useSelector((store) => store.pos);

    // 1. Safely grab the URL search parameters on page load
    const searchParams = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    // 2. Initialize useForm with default values from the URL
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            cashier_id: Number(searchParams.get('cashier_id')) || 0,
            report_type: searchParams.get('report_type') || '',
            customer_id: Number(searchParams.get('customer_id')) || 0,
            product_id: Number(searchParams.get('product_id')) || 0,
            pos_supplier_id: Number(searchParams.get('pos_supplier_id')) || 0,
            pos_category_id: searchParams.get('pos_category_id') || '',
            date_range: searchParams.get('date_range') || ''
        }
    });

    const report_types = [
        "Daily Sales",
        "Expenses",
        "Invoices",
        "Payment Types by Customer",
        "Payment Types by User",
        "Profit and Margin",
        "Purchase by Product",
        "Purchase by Supplier",
        "Purchase Invoices",
        "Refunds",
        "Sales By Customer",
        "Sales By Payment Types",
        "Sales By Product",
        "Stock Movement",
        "Unpaid Sales",
    ];

    const onSubmit = (data) => {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== '')
        );

        router.get('/account/pos/reports', cleanData, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    console.log('product', reports?.products)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col sm:flex-row flex-wrap gap-3 w-full items-end'>

            <div className="w-full sm:w-auto flex-1">
                <Controller
                    name="report_type"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <Select
                            label="Report Type"
                            name="report_type"
                            ref={ref}
                            value={value}
                            onChange={onChange}
                            error={errors.report_type?.message}
                            options={report_types?.map(res => ({
                                label: res,
                                value: res
                            }))}
                        />
                    )}
                />
            </div>
            <div className="w-full sm:w-auto flex-1">
                <Controller
                    name="cashier_id"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <Select
                            label="Select Cashier"
                            name="cashier_id"
                            ref={ref}
                            value={value}
                            onChange={onChange}
                            error={errors.cashier_id?.message}
                            options={reports?.users?.map(res => ({
                                label: res.name,
                                value: res.id
                            })) || []}
                        />
                    )}
                />
            </div>

            <div className="w-full sm:w-auto flex-1">
                <Controller
                    name="customer_id"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <Select
                            label="Select Customer"
                            name="customer_id"
                            ref={ref}
                            value={value}
                            onChange={onChange}
                            error={errors.customer_id?.message}
                            options={reports?.customers?.map(res => ({
                                label: res.name,
                                value: res.id
                            })) || []}
                        />
                    )}
                />
            </div>

            <div className="w-full sm:w-auto flex-1">
                <Controller
                    name="pos_supplier_id"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <Select
                            label="Select Supplier"
                            name="pos_supplier_id"
                            ref={ref}
                            value={value}
                            onChange={onChange}
                            error={errors.pos_supplier_id?.message}
                            options={reports?.suppliers?.map(res => ({
                                label: res.name,
                                value: res.id
                            })) || []}
                        />
                    )}
                />
            </div>

            <div className="w-full sm:w-auto flex-1">
                <Controller
                    name="product_id"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <Select
                            label="Select Products"
                            name="product_id"
                            ref={ref}
                            value={value}
                            onChange={onChange}
                            error={errors.product_id?.message}
                            options={reports?.products?.map(res => ({
                                label: res.product.name,
                                value: res.id
                            })) || []}
                        />
                    )}
                />
            </div>

            <div className="w-full sm:w-auto flex-1">
                <Controller
                    name="pos_category_id"
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <Select
                            label="Select Category"
                            name="pos_category_id"
                            ref={ref}
                            value={value}
                            onChange={onChange}
                            error={errors.pos_category_id?.message}
                            options={reports?.categories?.map(res => ({
                                label: res.name,
                                value: res.id
                            })) || []}
                        />
                    )}
                />
            </div>

            <div className="w-full sm:w-auto flex-1">
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
                                error={error} // <-- Now supports standard form errors
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
            </div>

            <div className="w-full sm:w-auto">
                <Button type="submit" className="w-full sm:w-auto" variant='primary'>
                    Search
                </Button>
            </div>
        </form>
    );
}