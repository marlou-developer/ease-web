import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Table from "@/app/_components/table";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_purchases_thunk } from "@/app/redux/pos/pos-thunk";
import { received_pos_product_stocks_service } from "@/app/services/pos/pos-product-stock";
import store from "@/app/store/store";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function ViewPurchasesSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        trigger, // <-- Added trigger to force re-validation
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onChange", // <-- Validates instantly as the user types
    });

    // Dynamically pre-fill the form whenever the modal opens
    useEffect(() => {
        if (open && props_data?.items) {
            const defaultPurchases = props_data.items.map(item => ({
                ...item, // <-- CRITICAL: Keep all the original data (IDs, quantity, etc)
                selling_price: item.selling_price || "",
                cost_price: item.cost_price || "",
            }));

            reset({ purchases: defaultPurchases });
        }
    }, [open, props_data, reset]);

    const onSubmit = async (formData) => {
        try {
            // Reconstruct the payload so the backend gets the full object with the NEW prices
            const payload = {
                ...props_data,
                items: formData.purchases
            };

            await received_pos_product_stocks_service(payload);
            await store.dispatch(get_pos_purchases_thunk());

            setOpen(false);
            reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Product Received successfully!",
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
                onClick={() => setOpen(true)}
                variant="primary"
            >
                Show
            </Button>

            <Modal
                title="List of Purchases"
                width="max-w-5xl"
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    reset();
                }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Table
                        columns={[
                            { header: 'Product Name', accessor: 'name' },
                            { header: 'Barcode', accessor: 'barcode' },
                            { header: 'Supplier', accessor: 'supplier' },
                            { header: 'Cost Price', accessor: 'cost_price' },
                            { header: 'Selling Price', accessor: 'selling_price' },
                            { header: 'Quantity', accessor: 'quantity' },
                        ]}
                        data={props_data?.items?.map((res, index) => ({
                            ...res,

                            cost_price: (
                                <Input
                                    label="Cost Price"
                                    name={`purchases.${index}.cost_price`}
                                    type="number"
                                    min="1"
                                    step="any"
                                    {...register(`purchases.${index}.cost_price`, {
                                        required: "Required",
                                        min: { value: 1, message: "Min 1" },
                                        validate: (value) => {
                                            const sellingPrice = Number(getValues(`purchases.${index}.selling_price`));
                                            if (sellingPrice && Number(value) >= sellingPrice) {
                                                return "Cost must be lower";
                                            }
                                            return true;
                                        },
                                        // When cost changes, re-check selling price to clear any stuck errors
                                        onChange: () => trigger(`purchases.${index}.selling_price`)
                                    })}
                                    error={errors?.purchases?.[index]?.cost_price?.message}
                                />
                            ),
                            selling_price: (
                                <Input
                                    label="Selling Price"
                                    name={`purchases.${index}.selling_price`}
                                    type="number"
                                    min="1"
                                    step="any"
                                    {...register(`purchases.${index}.selling_price`, {
                                        required: "Required",
                                        min: { value: 1, message: "Min 1" },
                                        validate: (value) => {
                                            const costPrice = Number(getValues(`purchases.${index}.cost_price`));
                                            if (costPrice && Number(value) <= costPrice) {
                                                return "Selling must be higher";
                                            }
                                            return true;
                                        },
                                        // When selling changes, re-check cost price to clear any stuck errors
                                        onChange: () => trigger(`purchases.${index}.cost_price`)
                                    })}
                                    error={errors?.purchases?.[index]?.selling_price?.message}
                                />
                            ),
                            name: res?.pos_warehouse_stock?.product?.name,
                            supplier: props_data?.supplier?.name,
                            barcode: res?.pos_warehouse_stock?.product?.barcode,
                        }))}
                    />

                    <div className="w-full flex items-center justify-end gap-3 mt-4">
                        <Button
                            type="button"
                            variant="danger"
                            disabled={props_data?.status === 'received'}
                        >
                            CANCEL ORDER
                        </Button>
                        <Button
                            disabled={props_data?.status === 'received'}
                            type="submit"
                            variant="success"
                            loading={isSubmitting}
                        >
                            RECEIVED
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}