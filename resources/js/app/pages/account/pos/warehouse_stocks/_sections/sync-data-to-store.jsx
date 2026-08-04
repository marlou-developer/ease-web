import Button from '@/app/_components/button';
import Modal from '@/app/_components/modal';
import { setAlert } from '@/app/redux/app-slice';
import { sync_data_to_store_service } from '@/app/services/pos/pos-warehouse-service';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function SyncDataToStore() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 1. Added loading state
    const dispatch = useDispatch();

    const handleSync = async () => {
        setIsLoading(true); // 2. Set loading to true when request starts

        try {
            console.log("Syncing products...");
            await sync_data_to_store_service();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Syncing successfully!",
                }),
            );
            setOpen(false);
        } catch (error) {
            console.error("Failed to sync products:", error);
            // Optional: Dispatch an error alert here
            dispatch(
                setAlert({
                    type: "error",
                    title: "Failed to sync products.",
                }),
            );
        } finally {
            setIsLoading(false); // 3. Ensure loading is set to false whether the request succeeds or fails
        }
    };

    return (
        <div className="my-3">
            <Button
                variant="primary"
                onClick={() => setOpen(true)}
            >
                Sync Products
            </Button>
            <Modal
                title="Sync Products to Store"
                width="max-w-md"
                isOpen={open}
                // Optional: Prevent closing the modal by clicking outside if it's currently loading
                onClose={() => !isLoading && setOpen(false)}
            >
                <div className="flex flex-col py-2">
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to sync products? This will push the latest product updates to the store.
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center justify-end gap-3 w-full border-t border-gray-100 pt-4 mt-2">
                        <Button
                            variant="danger"
                            outlined
                            disabled={isLoading} // 4. Disable cancel button while loading
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            disabled={isLoading} // 5. Disable confirm button while loading
                            onClick={handleSync}
                        >
                            {isLoading ? "Syncing..." : "Confirm Sync"} {/* 6. Update text conditionally */}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}