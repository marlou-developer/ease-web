import React, { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_users_thunk } from "@/app/redux/pos/pos-thunk";
import { toggle_user_lock_service } from "@/app/services/app-service";
import store from "@/app/store/store";
import { useDispatch } from "react-redux";

export default function LockProfileSection({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const isLocked = !!user?.is_locked;

    const handleToggleLock = async () => {
        setLoading(true);
        try {
            await toggle_user_lock_service(user?.id);
            await store.dispatch(get_pos_users_thunk());
            setIsModalOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: isLocked
                        ? "User unlocked successfully!"
                        : "User locked successfully!",
                }),
            );
        } catch (error) {
            console.error(
                "Error toggling user lock:",
                error?.response?.data?.message,
            );
            dispatch(
                setAlert({
                    type: "danger",
                    title:
                        error?.response?.data?.message ||
                        "Unable to update lock status!",
                }),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                title={isLocked ? "Unlock user" : "Lock user"}
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={
                    isLocked
                        ? "text-amber-500 hover:text-amber-700"
                        : "text-gray-500 hover:text-gray-700"
                }
            >
                {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>

            <Modal
                title={isLocked ? "Unlock User" : "Lock User"}
                width="max-w-md"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleToggleLock();
                    }}
                    className="flex flex-col gap-4"
                >
                    <h1 className="text-lg font-semibold">
                        {isLocked
                            ? `Unlock ${user?.name || "this user"}'s account? They will be able to sign in again.`
                            : `Lock ${user?.name || "this user"}'s account? They will not be able to sign in until unlocked.`}
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
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            {isLocked ? "Unlock User" : "Lock User"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

 