import Button from '@/app/_components/button'
import Modal from '@/app/_components/modal'
import Table from '@/app/_components/table'
import { setAlert } from '@/app/redux/app-slice'
import { get_pos_store_requests_thunk } from '@/app/redux/pos/pos-thunk'
import { action_store_requests_service } from '@/app/services/pos/pos-store-requests-service'
import store from '@/app/store/store'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

export default function ActionProductSection({ props_data }) {
    const [open, setOpen] = useState(false)
    const [loadingAction, setLoadingAction] = useState(null) // Tracks which action is loading
    const dispatch = useDispatch()

    const columns = [
        {
            header: 'Product',
            accessor: 'id',
            className: 'font-bold text-slate-800',
            render: (row) => row?.warehouse_stock?.product?.name
        },
        {
            header: 'Quantity',
            accessor: 'id',
            className: 'font-bold text-slate-800',
            render: (row) => row?.quantity
        },
    ];


    async function action_submit(value) {
        setLoadingAction(value) // Set loading state before API call
        console.log('value', {
            id: props_data.id,
            status: value,
            request_items: props_data.request_items
        })

        try {
            await action_store_requests_service({
                id: props_data.id,
                status: value,
                request_items: props_data.request_items
            })
            await store.dispatch(get_pos_store_requests_thunk())
            dispatch(
                setAlert({
                    type: "success",
                    title: `Request ${value} Successfully!`,
                })
            );
            setOpen(false) // Optionally close the modal on success
        } catch (error) {
            console.error("Failed to submit action:", error)
            // You can optionally dispatch an error alert here
        } finally {
            setLoadingAction(null) // Always clear loading state when done
        }
    }

    return (
        <>
            {
                props_data.status == 'Processing' && <Button
                    onClick={() => setOpen(true)}
                    variant='primary'
                >
                    Action
                </Button>
            }
            <Modal
                title="Would you like to receive the products?"
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <div className='flex flex-col gap-5'>
                    <Table
                        columns={columns}
                        data={props_data?.request_items ?? []}
                    />
                    <div className='flex w-full gap-3'>
                        <Button
                            variant='danger'
                            outlined
                            disabled={!!loadingAction}
                            onClick={() => action_submit('Returned')}
                        >
                            {loadingAction === 'Returned' ? 'RETURNING...' : 'RETURN'}
                        </Button>
                        <Button
                            variant='primary'
                            className='w-full'
                            disabled={!!loadingAction}
                            onClick={() => action_submit('Received')}
                        >
                            {loadingAction === 'Received' ? 'RECEIVING...' : 'RECEIVED'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}