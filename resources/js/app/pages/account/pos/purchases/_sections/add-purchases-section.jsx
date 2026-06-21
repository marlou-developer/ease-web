import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_purchases_thunk } from "@/app/redux/pos/pos-thunk";
import { add_pos_purchases_service } from "@/app/services/pos/pos-purchases-service";
import store from "@/app/store/store";
import { Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function AddPurchasesSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const { purchases_products, suppliers, categories } = useSelector((state) => state.pos);
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
            purchases: [
                { pos_warehouse_stock_id: "", quantity: "", cost_price: "", subtotal: "", selling_price: "", category_id: "" }
            ],
        },
    });

    console.log('categories', categories)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "purchases",
    });

    const handleAddRow = () => {
        append({ pos_warehouse_stock_id: "", quantity: "", cost_price: "", selling_price: "", category_id: "" });
    };

    const handleDeleteRow = (index) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    // const watchPurchases = watch("purchases");

    // Auto-calculate subtotal for EACH row dynamically
    // useEffect(() => {
    //     watchPurchases.forEach((row, index) => {
    //         const qty = parseFloat(row.quantity) || 0;
    //         const price = parseFloat(row.cost_price) || 0;
    //         const calculatedSubtotal = (qty * price).toFixed(2);

    //         if (row.subtotal !== calculatedSubtotal && (qty > 0 || price > 0)) {
    //             setValue(`purchases.${index}.subtotal`, calculatedSubtotal);
    //         }
    //     });
    // }, [watchPurchases, setValue]);

    const onSubmit = async (formData) => {
        try {
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

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                    reset();
                }}
                variant="primary"
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
                    <Button
                        type="button"
                        className="w-52"
                        variant="primary"
                        outlined
                        onClick={handleAddRow}
                    >
                        + ADD PRODUCT
                    </Button>

                    <Controller
                        name="pos_supplier_id"
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
                        <div key={field.id} className="flex gap-3 flex-col items-center justify-end">
                            {/* Product Select */}
                            <div className="flex-1 flex gap-3 w-full">
                                <Controller
                                    name={`purchases.${index}.pos_warehouse_stock_id`}
                                    control={control}
                                    rules={{ required: "Product is required" }}
                                    render={({ field: { onChange, value, ...restField } }) => (
                                        <Select
                                            label="Select Product"
                                            options={purchases_products?.map((product) => ({
                                                value: product.id,
                                                label: `${product?.product?.name}  (Cost: ${product?.cost_price ?? 0} & Sell: ${product?.selling_price ?? 0})` || "Unnamed Product", // <-- Safety fallback added here
                                            })) || []}
                                            error={errors?.purchases?.[index]?.pos_warehouse_stock_id?.message}
                                            value={value}
                                            {...restField}
                                            // Intercepting onChange handler to extract and set the price
                                            onChange={(selectedValue) => {
                                                onChange(selectedValue); // 1. Update standard field value

                                                // 2. Find the selected item's price from Redux store data
                                                const selectedProduct = purchases_products?.find(
                                                    (prod) => String(prod.id) === String(selectedValue)
                                                );

                                                if (selectedProduct) {
                                                    // Safe fallback checks depending on how your state nesting is configured
                                                    const autoPrice = selectedProduct.cost_price ?? selectedProduct.product?.cost_price ?? "";
                                                    const autoSelling = selectedProduct.selling_price ?? selectedProduct.product?.selling_price ?? "";
                                                    setValue(`purchases.${index}.cost_price`, autoPrice);
                                                    setValue(`purchases.${index}.selling_price`, autoSelling);
                                                }
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name={`purchases.${index}.category_id`}
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field: { onChange, value, ...restField } }) => (
                                        <Select
                                            label="Select Category"
                                            options={categories?.map((res) => ({
                                                value: res.id,
                                                label: res?.name,
                                            })) || []}
                                            error={errors?.purchases?.[index]?.category_id?.message}
                                            value={value}
                                            {...restField}
                                            // Intercepting onChange handler to extract and set the price
                                            onChange={(selectedValue) => {
                                                onChange(selectedValue); // 1. Update standard field value


                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex gap-3 w-full">

                                {/* Quantity */}
                                <div className="flex-1">
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
                                <div className="flex-1">
                                    <Input
                                        label="Cost Price"
                                        name={`purchases.${index}.cost_price`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...register(`purchases.${index}.cost_price`, {
                                            required: false,
                                        })}
                                        disabled
                                        error={errors?.purchases?.[index]?.cost_price?.message}
                                    />
                                </div>

                                <div className="flex-1">
                                    <Input
                                        label="Selling Price"
                                        name={`purchases.${index}.selling_price`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...register(`purchases.${index}.selling_price`, {
                                            required: false,
                                        })}
                                        disabled
                                        error={errors?.purchases?.[index]?.selling_price?.message}
                                    />
                                </div>

                                {/* Remove Row Button */}
                                <div className="pb-1">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteRow(index)}
                                        disabled={fields.length === 1}
                                        className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove row"
                                    >
                                        <Trash2 className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

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