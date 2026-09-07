import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_expenses_thunk } from "@/app/redux/pos/pos-thunk";
import { delete_pos_expense_service } from "@/app/services/pos/pos-expense-service";
import store from "@/app/store/store";
import { Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AddExpenseSection from "./add-expense-section";
import DeleteExpenseSection from "./delete-expense-section";

export default function ExpensesTableSection() {
    const { searchTerm, category, currentPage, expenses } = useSelector(
        (store) => store.pos,
    );
    const dispatch = useDispatch();
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredExpenses = expenses?.filter((expense) => {
        const matchesSearch = expense?.title
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase() || "");
        const matchesCat =
            category === "All Categories" ||
            expense.pos_expense_category_id === category;
        return matchesSearch && matchesCat;
    });

    const currentItems = filteredExpenses?.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );



    const columns = [
        {
            header: "Title",
            accessor: "title",
            className: "font-bold text-gray-700",
        },
        {
            header: "Category",
            accessor: "category",
            render: (row) => row.category?.name ?? "-",
        },
        {
            header: "Amount",
            accessor: "amount",
            className: "font-bold text-gray-700",
            render: (row) => peso_value(row.amount),
        },
        {
            header: "Date",
            accessor: "expense_date",
            render: (row) => row.expense_date ?? "-",
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
                    <AddExpenseSection expense={row} />
                    <DeleteExpenseSection
                        row={row}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} data={currentItems} />
        </>
    );
}
