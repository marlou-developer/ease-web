import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_purchases_thunk } from "@/app/redux/pos/pos-thunk";
import { add_pos_purchases_service } from "@/app/services/pos-purchases-service";
import store from "@/app/store/store";
import { Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function AddPurchasesSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    // Pull your dynamic products list from Redux
    const { products, suppliers } = useSelector((state) => state.pos);
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            // Wrap the fields in an array to allow multiple rows
            purchases: [
                { pos_product_id: "", quantity: "", cost_price: "", subtotal: "" }
            ],
        },
    });

    console.log('products',products)

    // Initialize the dynamic field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: "purchases",
    });

    // --- ADDED EXPLICIT ADD & DELETE FUNCTIONS ---
    const handleAddRow = () => {
        append({ pos_product_id: "", quantity: "", cost_price: "", subtotal: "" });
    };

    const handleDeleteRow = (index) => {
        // Double-check to prevent deleting the very last row
        if (fields.length > 1) {
            remove(index);
        }
    };

    // Watch all purchases to perform dynamic calculations
    const watchPurchases = watch("purchases");

    // Auto-calculate subtotal for EACH row dynamically
    useEffect(() => {
        watchPurchases.forEach((row, index) => {
            const qty = parseFloat(row.quantity) || 0;
            const price = parseFloat(row.cost_price) || 0;
            const calculatedSubtotal = (qty * price).toFixed(2);

            // Only update if the calculated value is different to prevent infinite re-renders
            if (row.subtotal !== calculatedSubtotal && (qty > 0 || price > 0)) {
                setValue(`purchases.${index}.subtotal`, calculatedSubtotal);
            }
        });
    }, [watchPurchases, setValue]);

    // Calculate the Grand Total
    const grandTotal = watchPurchases.reduce((acc, current) => {
        return acc + (parseFloat(current.subtotal) || 0);
    }, 0).toFixed(2);

    const onSubmit = async (formData) => {
        try {
            // formData.purchases will now hold an array of all the rows added
            await add_pos_purchases_service(formData);
            await store.dispatch(get_pos_purchases_thunk());
            setOpen(false);
            reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Purchases added successfully!",
                })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to add purchases.",
                })
            );
            console.error("Error creating purchase:", error);
        }
    };

    console.log('suppliers', suppliers)
    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                    reset();
                }}
                className="text-white border-white shadow-sm hover:bg-blue-500"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Plus size={18} /> Add Purchase
                </div>
            </Button>

            <Modal
                title="Add Purchase"
                width="max-w-5xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    {/* Wired up the new add product button you inserted */}
                    <Button
                        type="button"
                        className="w-52"
                        variant="primary"
                        onClick={handleAddRow}
                    >
                        + ADD PRODUCT
                    </Button>

                    <Controller
                        name={`pos_supplier_id`}
                        control={control}
                        rules={{ required: "supplier is required" }}
                        render={({ field: controllerField }) => (
                            <Select
                                label="Select supplier"
                                options={suppliers?.map((product) => ({
                                    value: product.id,
                                    label: product.name,
                                })) || []}
                                error={errors?.pos_supplier_id?.message}
                                {...controllerField}
                            />
                        )}
                    />
                    {/* Render Dynamic Rows */}
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-center justify-end ">
                            {/* Product Select */}
                            <div className="flex-1">
                                <Controller
                                    name={`purchases.${index}.pos_product_id`}
                                    control={control}
                                    rules={{ required: "Product is required" }}
                                    render={({ field: controllerField }) => (
                                        <Select
                                            label="Select Product"
                                            options={products?.map((product) => ({
                                                value: product.id,
                                                label: product?.product?.name,
                                            })) || []}
                                            error={errors?.purchases?.[index]?.pos_product_id?.message}
                                            {...controllerField}
                                        />
                                    )}
                                />
                            </div>

                            {/* Quantity */}
                            <div className="w-52">
                                <Input
                                    label="Qty"
                                    name={`purchases.${index}.quantity`}
                                    type="number"
                                    min="1"
                                    {...register(`purchases.${index}.quantity`, {
                                        required: "Required",
                                        min: { value: 1, message: "Min 1" }
                                    })}
                                    error={errors?.purchases?.[index]?.quantity?.message}
                                />
                            </div>

                            {/* Cost Price */}
                            <div className="w-52">
                                <Input
                                    label="Cost Price"
                                    name={`purchases.${index}.cost_price`}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register(`purchases.${index}.cost_price`, {
                                        required: "Required",
                                    })}
                                    error={errors?.purchases?.[index]?.cost_price?.message}
                                />
                            </div>

                            {/* Remove Row Button */}
                            <div className="pb-1">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteRow(index)}
                                    disabled={fields.length === 1} // Prevent deleting the very last row
                                    className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Remove row"
                                >
                                    <Trash2 className="text-xl" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Row Button */}
                    <div>
                        <Button
                            type="button"
                            variant="secondary"
                            outlined
                            onClick={handleAddRow}
                        >
                            <div className="flex gap-2 items-center text-sm">
                                <Plus size={16} /> Add Another Item
                            </div>
                        </Button>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-end pr-14 mt-2">
                        <div className="text-lg font-semibold text-gray-800">
                            Grand Total: <span className="text-blue-600">${grandTotal}</span>
                        </div>
                    </div>

                    <hr className="my-2" />

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="danger"
                            outlined
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                        >
                            Save Purchases
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}