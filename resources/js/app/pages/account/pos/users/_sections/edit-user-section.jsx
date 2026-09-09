import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_users_thunk } from "@/app/redux/pos/pos-thunk";
import { update_user_service } from "@/app/services/app-service";
import store from "@/app/store/store";
import { Edit2, User } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function EditUserSection({ user }) {
    const { app } = useSelector((store) => store.app);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fname: "",
            mname: "",
            lname: "",
            suffix: "",
            email: "",
            pos_user_type: "",
            pos_store_id: "",
            title: "",
        },
    });

    const handleOpen = () => {
        setError("");
        reset({
            fname: user?.fname || "",
            mname: user?.mname || "",
            lname: user?.lname || "",
            suffix: user?.suffix || "",
            email: user?.email || "",
            pos_user_type: user?.pos_user_type || "",
            pos_store_id: user?.pos_store_id || "",
            title: user?.position || "",
        });
        setOpen(true);
    };

    const onSubmit = async (formData) => {
        try {
            setError("");
            await update_user_service(user?.id, formData);
            await store.dispatch(get_pos_users_thunk());
            setOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: "User updated successfully!",
                }),
            );
        } catch (error) {
            setError(error?.response?.data?.message);
            console.error(
                "Error updating user:",
                error?.response?.data?.message,
            );
        }
    };

    return (
        <div>
            <button
                title="Edit user"
                type="button"
                onClick={handleOpen}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700"
            >
                <Edit2 size={14} />
                Edit
            </button>

            <Modal
                title="Edit User"
                width="max-w-md"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
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
                    {error && <div className="text-red-500">{error}</div>}

                    <Controller
                        name="pos_user_type"
                        control={control}
                        rules={{ required: "Role is required" }}
                        render={({
                            field: { onChange, value, ...restField },
                        }) => (
                            <Select
                                label="Select User Type"
                                options={[
                                    { value: "Admin", label: "Admin" },
                                    { value: "Inventory", label: "Inventory" },
                                    { value: "Cashier", label: "Cashier" },
                                    { value: "Encoder", label: "Encoder" },
                                ]}
                                value={value}
                                onChange={onChange}
                                {...restField}
                                error={errors.pos_user_type}
                            />
                        )}
                    />
                    <Controller
                        name="pos_store_id"
                        control={control}
                        rules={{ required: "Store selection is required" }}
                        render={({
                            field: { onChange, value, ...restField },
                        }) => (
                            <Select
                                label="Select Store"
                                name="pos_store_id"
                                options={
                                    app?.stores?.map((res) => ({
                                        value: res.id,
                                        label: res.name,
                                    })) || []
                                }
                                value={value}
                                {...restField}
                                onChange={onChange}
                            />
                        )}
                    />

                    <Input
                        label="First name"
                        name="fname"
                        {...register("fname", {
                            required: "First name is required",
                        })}
                        error={errors.fname}
                    />

                    <Input
                        label="Middle name"
                        name="mname"
                        {...register("mname")}
                        error={errors.mname}
                    />

                    <Input
                        label="Last name"
                        name="lname"
                        {...register("lname", {
                            required: "Last name is required",
                        })}
                        error={errors.lname}
                    />

                    <Input
                        label="Suffix"
                        name="suffix"
                        {...register("suffix")}
                        error={errors.suffix}
                    />

                    <Input
                        label="Position"
                        name="title"
                        {...register("title", {
                            required: "Position is required",
                        })}
                        error={errors.title}
                    />

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
        </div>
    );
}
