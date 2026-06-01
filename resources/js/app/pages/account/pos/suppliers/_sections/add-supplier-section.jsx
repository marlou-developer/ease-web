import Button from "@/app/_components/button";
import ImageUpload from "@/app/_components/image-upload";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_suppliers_thunk } from "@/app/redux/pos/pos-thunk";
import { add_pos_suppliers_service } from "@/app/services/pos-supplier-service";
import store from "@/app/store/store";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function AddSupplierSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            contact_person: "",
            name: "",
            phone: "",
            email: "",
            address: "",
        },
    });

    const onSubmit = async (formData) => {
        try {

            await add_pos_suppliers_service(formData);
            await store.dispatch(get_pos_suppliers_thunk())
            await setOpen(false);
            await reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Supplier created Successfully!",
                })
            );
            console.log("Supplier created successfully!");
        } catch (error) {
            setOpen(false);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Supplier created Unsuccessful!",
                })
            );
            console.error("Error creating product:", error);
        }
    };

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                    reset();
                }}
                className="text-white  border-white shadow-sm  hover:bg-blue-500"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Plus size={18} /> Add Supplier
                </div>
            </Button>
            <Modal
                title="Create Supplier"
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    {/* Contact_person */}
                    <div className="flex gap-3">
                        <Input
                            label="Contact Name"
                            name="contact_person"
                            {...register("contact_person", {
                                required: "Contact is required",
                            })}
                            error={errors.contact_person}
                        />

                        {/* Name */}
                        <Input
                            label="Supplier's Name"
                            name="name"
                            {...register("name", {
                                required: "Name is required",
                            })}
                            error={errors.name}
                        />
                    </div>

                    <div className="flex gap-3">
                        {/* Category */}
                        <Input
                            label="Phone"
                            name="phone"
                            {...register("phone", {
                                required: "Phone is required",
                            })}
                            type="number"
                            error={errors.phone}
                        />

                        <Input
                            label="Email"
                            name="email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                            type="email"
                            error={errors.email}
                        />
                    </div>
                    <div className="flex gap-3">
                        {/* Address */}
                        <Input
                            label="Address"
                            {...register("address", {
                                required: "Address is required",
                            })}
                            name="address"
                            error={errors.address}
                        />


                    </div>


                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                        <Button
                            type="submit"
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
                            Save Product
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
