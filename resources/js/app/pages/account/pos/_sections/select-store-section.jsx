import Select from '@/app/_components/select'
import { change_store_service } from '@/app/services/app-service'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FcShop } from 'react-icons/fc'
import { useSelector } from 'react-redux'

export default function SelectStoreSection() {
    const { app } = useSelector((store) => store.app)
    const {
        control,
        handleSubmit,
        setValue // 1. Fixed: Changed 'value' to 'setValue'
    } = useForm({
        defaultValues: {
            pos_store_id: ''
        }
    });

    // 2. Fixed: Adjusted to cleanly pull the app slice from the Redux store

    // 3. Fixed: Added dependencies so it sets the value when Redux data resolves
    useEffect(() => {
        if (app?.store) {
            setValue('pos_store_id', app.store)
        }
    }, [app?.store, setValue])

    const onSubmit = async (data) => {
        try {
            await change_store_service(data)
            window.location.reload()
        } catch (error) {

        }
        // Put your API request or state update action here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <Controller
                name="pos_store_id"
                control={control}
                rules={{ required: "Store selection is required" }}
                render={({ field: { onChange, value, ...restField } }) => (
                    <Select
                        iconLeft={<FcShop className='text-2xl' />}
                        label="Select Store"
                        // 4. Added optional chaining safety for the map array
                        options={app?.stores?.map(res => ({
                            value: res.id,
                            label: res.name
                        })) || []}
                        value={value}
                        {...restField}
                        onChange={(selectedValue) => {
                            onChange(selectedValue);         // Updates React Hook Form state
                            handleSubmit(onSubmit)();       // Triggers auto-submit instantly
                        }}
                    />
                )}
            />
        </form>
    )
}