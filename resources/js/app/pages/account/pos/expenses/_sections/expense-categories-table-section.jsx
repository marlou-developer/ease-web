import Table from "@/app/_components/table";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_expense_categories_thunk } from "@/app/redux/pos/pos-thunk";
import { delete_pos_expense_category_service } from "@/app/services/pos/pos-expense-category-service";
import store from "@/app/store/store";
import { Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AddExpenseCategorySection from "./add-expense-category-section";

export default function ExpenseCategoriesTableSection() {
    const { expense_categories } = useSelector((store) => store.pos);
    const dispatch = useDispatch();

    const handleDelete = async (category) => {
        if (!confirm(`Delete expense category "${category.name}"?`)) return;
        try {
            await delete_pos_expense_category_service(category.id);
            await store.dispatch(get_pos_expense_categories_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Expense category deleted successfully!",
                }),
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to delete expense category!",
                }),
            );
            console.error("Error deleting expense category:", error);
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
            className: "font-bold text-gray-700",
        },
        {
            header: "Description",
            accessor: "description",
            render: (row) => row.description ?? "-",
        },
        {
            header: "Action",
            accessor: "action",
            align: "center",
            render: (row) => (
                <div className="flex gap-2 justify-center">
                    <AddExpenseCategorySection category={row} />
                    <button
                        onClick={() => handleDelete(row)}
                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="mt-6">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-lg font-semibold text-gray-700">
                Expense Categories
            </div>
            <Table columns={columns} data={expense_categories} />
        </div>
    );
}
