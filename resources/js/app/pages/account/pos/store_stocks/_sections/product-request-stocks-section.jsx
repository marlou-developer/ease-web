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

export default function ProductRequestStocksSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const { store_stocks, suppliers, categories } = useSelector((state) => state.pos);
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
                { pos_warehouse_stock_id: "", quantity: "" }
            ],
        },
    });

    console.log('categories', categories)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "purchases",
    });

    const handleAddRow = () => {
        append({ pos_warehouse_stock_id: "", quantity: "" });
    };

    const handleDeleteRow = (index) => {
        if (fields.length > 1) {
            remove(index);
        }
    };



    const onSubmit = async (formData) => {
        try {
            // await add_pos_purchases_service(formData);
            // await store.dispatch(get_pos_purchases_thunk());
            // setOpen(false);
            // reset();
            // dispatch(
            //     setAlert({
            //         type: "success",
            //         title: "Purchases added successfully!",
            //     })
            // );
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
                    <Plus size={18} /> Request Products
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

                    {/* Render Dynamic Rows */}
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 flex-col items-center justify-end">
                            {/* Product Select */}
                            <div className="flex-1 flex gap-3 w-full">
                                <div className="flex-1">
                                    <Controller
                                        name={`purchases.${index}.pos_warehouse_stock_id`}
                                        control={control}
                                        rules={{ required: "Product is required" }}
                                        render={({ field: { onChange, value, ...restField } }) => (
                                            <Select
                                                label="Select Product"
                                                options={store_stocks?.map((product) => ({
                                                    value: product.id,
                                                    label: `${product?.product?.name}  (Cost: ${product?.cost_price ?? 0}, Sell: ${product?.selling_price ?? 0} & Quantity: ${product?.quantity ?? 0})` || "Unnamed Product", // <-- Safety fallback added here
                                                })) || []}
                                                error={errors?.purchases?.[index]?.pos_warehouse_stock_id?.message}
                                                value={value}
                                                {...restField}
                                                // Intercepting onChange handler to extract and set the price
                                                onChange={(selectedValue) => {
                                                    onChange(selectedValue); // 1. Update standard field value

                                                    // 2. Find the selected item's price from Redux store data
                                                    const selectedProduct = store_stocks?.find(
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
                                </div>
                                <div className="w-1/4">
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