import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_users_thunk } from "@/app/redux/pos/pos-thunk";
import { delete_user_service } from "@/app/services/app-service";
import store from "@/app/store/store";
import { useDispatch } from "react-redux";

export default function DeleteUserSection({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await delete_user_service(user?.id);
            await store.dispatch(get_pos_users_thunk());
            setIsModalOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: "User deleted successfully!",
                })
            );
        } catch (error) {
            console.error("Error deleting user:", error?.response?.data?.message);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "User deletion unsuccessful!",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-red-500 hover:text-red-700"
            >
                <Trash2 size={16} />
            </button>

            <Modal
                title="Delete User"
                width="max-w-md"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleDelete();
                    }}
                    className="flex flex-col gap-4"
                >
                    <h1 className="text-lg font-semibold">
                        Are you sure you want to delete {user?.name || "this user"}?
                    </h1>
                    <hr className="my-2" />
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="danger"
                            outlined
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            Delete User
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
