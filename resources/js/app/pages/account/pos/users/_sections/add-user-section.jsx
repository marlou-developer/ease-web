import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_users_thunk } from "@/app/redux/pos/pos-thunk";
import { add_user_service } from "@/app/services/app-service";
import store from "@/app/store/store";
import { Plus, User } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function AddUserSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        control, // Added control here for the Select Controller
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fname: "",
            mname: "",
            lname: "",
            suffix: "",
            position: "",
            email: "",
            pos_user_type: "",
        },
    });

    const onSubmit = async (formData) => {
        try {
            setError('')
            await add_user_service(formData);
            await store.dispatch(get_pos_users_thunk());
            setOpen(false);
            reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "User created successfully!",
                })
            );
        } catch (error) {
            setError(error?.response?.data?.message)
            console.error("Error creating user:", error?.response?.data?.message);
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
                    <Plus size={18} /> Add User
                </div>
            </Button>

            <Modal
                title=""
                width="max-w-md"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                {/* Custom Form Header */}
                <div className="flex items-center gap-2 mb-6 text-[#5c6e82] font-semibold text-lg">
                    <User className="text-blue-500 w-5 h-5 fill-current" />
                    User Information
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                        })}
                        error={errors.email}
                    />
                    {
                        error && <div className="text-red-500">
                            {error}
                        </div>
                    }


                    {/* Custom Select Component via Controller */}
                    <Controller
                        name="pos_user_type"
                        control={control}
                        rules={{ required: "Role is required" }}
                        render={({ field: { onChange, value, ...restField } }) => (
                            <Select
                                label="Select User Type"
                                // Formatted labels to have capital letters for the UI, but lowercase values for the backend
                                options={[
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'inventory', label: 'Inventory' },
                                    { value: 'shopee', label: 'Shopee' },
                                    { value: 'cashier', label: 'Cashier' },
                                    { value: 'encoder', label: 'Encoder' }
                                ]}
                                value={value}
                                onChange={onChange}
                                {...restField}
                                error={errors.pos_user_type}
                            />
                        )}
                    />

                    {/* First Name */}
                    <Input
                        label="First name"
                        name="fname"
                        {...register("fname", {
                            required: "First name is required",
                        })}
                        error={errors.fname}
                    />

                    {/* Middle Name */}
                    <Input
                        label="Middle name"
                        name="mname"
                        {...register("mname")}
                        error={errors.mname}
                    />

                    {/* Last Name */}
                    <Input
                        label="Last name"
                        name="lname"
                        {...register("lname", {
                            required: "Last name is required",
                        })}
                        error={errors.lname}
                    />

                    {/* Suffix */}
                    <Input
                        label="Suffix"
                        name="suffix"
                        {...register("suffix")}
                        error={errors.suffix}
                    />

                    {/* Position */}
                    <Input
                        label="Position"
                        name="position"
                        {...register("position", {
                            required: "Position is required",
                        })}
                        error={errors.position}
                    />

                    {/* Email */}

                    {/* Footer Note */}
                    <p className="text-[13px] text-gray-500 italic mt-2 leading-tight">
                        <span className="font-semibold">Note:</span> Default password is "egiespos" and can be changed after the user is created via settings.
                    </p>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            type="button"
                            variant="default"
                            className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-6"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}