import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import store from "@/app/store/store";
import { get_pos_customer_thunk } from "@/app/redux/pos/pos-thunk";
import { create_pos_customer_service } from "@/app/services/pos/pos-customer-service";

export default function CreateCustomerSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
        },
    });

    const onSubmit = async (formData) => {
        try {
            create_pos_customer_service(formData)
            await store.dispatch(get_pos_customer_thunk())
            setOpen(false);
            reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Customer created successfully!",
                })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to create customer.",
                })
            );
            console.error("Error creating customer:", error);
        }
    };

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
                    <Plus size={18} /> Add Customer
                </div>
            </Button>

            <Modal
                title="Create New Customer"
                width="max-w-2xl" // Reduced width since it's a smaller form now
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    {/* CUSTOMER DETAILS FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Customer Name"
                            type="text"
                            placeholder="John Doe"
                            {...register("name", { required: "Name is required" })}
                            error={errors?.name?.message}
                        />
                        <Input
                            label="Phone Number"
                            type="text"
                            placeholder="0917 123 4567" // Standard Philippine mobile placeholder
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    // Validates both local (09XXXXXXXXX) and international (+639XXXXXXXXX) formats
                                    value: /^(09|\+639)\d{9}$/,
                                    message: "Invalid format. Use 09171234567 or +639171234567"
                                }
                            })}
                            error={errors?.phone?.message}
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                {...register("email")}
                                error={errors?.email?.message}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Input
                                label="Home/Billing Address"
                                type="text"
                                placeholder="123 Main St, Suite 100"
                                {...register("address")}
                                error={errors?.address?.message}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

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
                            Save Customer
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}