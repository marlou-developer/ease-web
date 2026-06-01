import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Table from "@/app/_components/table";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_purchases_thunk } from "@/app/redux/pos/pos-thunk";
import { received_pos_product_stocks_service } from "@/app/services/pos-product-stock";
import store from "@/app/store/store";
import React, { useState, useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function ViewPurchasesSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

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
                { pos_product_stock_id: "", quantity: "", cost_price: "", subtotal: "" }
            ],
        },
    });



    const onSubmit = async () => {
        try {
            await received_pos_product_stocks_service(props_data);
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

    console.log('props_data', props_data?.items)

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                    reset();
                }}
                variant="primary"

            >
                Show
            </Button>

            <Modal
                title="List of Purchases"
                width="max-w-5xl"
                isOpen={open}
                onClose={() => setOpen(false)}
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

                            { header: 'Quantity', accessor: 'quantity' },
                        ]}
                        data={props_data?.items.map(res => ({
                            ...res,
                            name: res?.product_stock?.product?.name,
                            supplier: props_data?.supplier?.name,
                            barcode: res?.product_stock?.product?.barcode,
                        }))}
                    />
                    <div className="w-full flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="danger"
                        >
                            CANCEL ORDER
                        </Button>
                        <Button
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