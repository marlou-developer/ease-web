import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { create_pos_store_requests_service } from "@/app/services/pos/pos-store-requests-service";
import { router } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function ProductRequestStocksSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const { products, suppliers, categories } = useSelector((state) => state.pos);
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        getValues, // <-- 1. Added getValues here
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            requests: [
                { pos_warehouse_stock_id: "", quantity: "" }
            ],
        },
    });

    console.log('categories', categories)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "requests",
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

            console.log('formData', formData)
            await create_pos_store_requests_service(formData);
            router.visit('/account/pos/store_stocks/my_product_requests')
            setOpen(false);
            reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Request added successfully!",
                })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to add request.",
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
                    <Plus size={18} /> Request from Warehouse
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
                                        name={`requests.${index}.pos_warehouse_stock_id`}
                                        control={control}
                                        rules={{ required: "Product is required" }}
                                        render={({ field: { onChange, value, ...restField } }) => (
                                            <Select
                                                label="Select Product"
                                                options={products?.map((product) => ({
                                                    value: product.id,
                                                    label: `${product?.product?.name}  (Cost: ${product?.cost_price ?? 0}, Sell: ${product?.selling_price ?? 0} & Stocks: ${product?.stocks ?? 0})` || "Unnamed Product",
                                                })) || []}
                                                error={errors?.requests?.[index]?.pos_warehouse_stock_id?.message}
                                                value={value}
                                                {...restField}
                                                onChange={(selectedValue) => {
                                                    onChange(selectedValue);

                                                    const selectedProduct = products?.find(
                                                        (prod) => String(prod.id) === String(selectedValue)
                                                    );

                                                    if (selectedProduct) {
                                                        const autoPrice = selectedProduct.cost_price ?? selectedProduct.product?.cost_price ?? "";
                                                        const autoSelling = selectedProduct.selling_price ?? selectedProduct.product?.selling_price ?? "";
                                                        const autoStocks = selectedProduct.stocks ?? selectedProduct.product?.stocks ?? "";
                                                        setValue(`requests.${index}.cost_price`, autoPrice);
                                                        setValue(`requests.${index}.selling_price`, autoSelling);
                                                        setValue(`requests.${index}.stocks`, autoStocks);
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="w-1/4">
                                    <Input
                                        label="Stocks"
                                        name={`requests.${index}.stocks`}
                                        type="number"
                                        min="1"
                                        disabled
                                        {...register(`requests.${index}.stocks`, {
                                            required: "Required",
                                            min: { value: 1, message: "Min 1" }
                                        })}
                                        error={errors?.requests?.[index]?.stocks?.message}
                                    />
                                </div>
                                <div className="w-1/4">
                                    <Input
                                        label="Qty"
                                        name={`requests.${index}.quantity`}
                                        type="number"
                                        min="1"
                                        {...register(`requests.${index}.quantity`, {
                                            required: "Required",
                                            min: { value: 1, message: "Min 1" },
                                            // 2. Added custom validation here
                                            validate: (value) => {
                                                const currentStocks = getValues(`requests.${index}.stocks`);
                                                // Prevent validation from running if stocks haven't been selected yet
                                                if (currentStocks === undefined || currentStocks === "") return true;

                                                return Number(value) <= Number(currentStocks) || `Exceeds stock (${currentStocks})`;
                                            }
                                        })}
                                        error={errors?.requests?.[index]?.quantity?.message}
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
                            Save Requests
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}