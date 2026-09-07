import AddExpenseSection from "./add-expense-section";
import AddExpenseCategorySection from "./add-expense-category-section";
import Select from "@/app/_components/select";
import Input from "@/app/_components/input";
import {
    setCategory,
    setCurrentPage,
    setSearchTerm,
} from "@/app/redux/pos/pos-slice";
import React from "react";
import { FcSearch } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";

export default function ExpenseSearchSection() {
    const { expense_categories, category, searchTerm } = useSelector(
        (store) => store.pos,
    );

    const dispatch = useDispatch();

    return (
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4">
            <div className="flex-none">
                <Select
                    value={category || "All Categories"}
                    onChange={(value) => {
                        dispatch(setCategory(value || "All Categories"));
                        dispatch(setCurrentPage(1));
                    }}
                    name="categories"
                    label="Select Categories"
                    options={[
                        { value: "All Categories", label: "All Categories" },
                        ...(expense_categories?.map((category) => ({
                            value: category.id,
                            label: category.name,
                        })) || []),
                    ]}
                />
            </div>

            <div className="flex-1">
                <Input
                    value={searchTerm || ""}
                    icon={<FcSearch className="text-2xl" />}
                    onChange={(e) => {
                        dispatch(setSearchTerm(e.target.value));
                        dispatch(setCurrentPage(1));
                    }}
                    label="Search expenses..."
                />
            </div>

            <div className="flex gap-2">
                <AddExpenseSection />
                <AddExpenseCategorySection />
            </div>
        </div>
    );
}
