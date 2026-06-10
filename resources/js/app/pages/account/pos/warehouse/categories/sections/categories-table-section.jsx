import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CategoryTableSection() {
    const { searchTerm, category, currentPage, products,categories } = useSelector(
        (store) => store.pos,
    );
    const dispatch = useDispatch();
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredProducts =categories;

    const currentItems = filteredProducts?.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );
    console.log('categories',categories)

    const columns = [
        {
            header: "Category",
            accessor: "name",
            className: "font-bold text-gray-700",
            render: (row) => row?.name,
        },
        // {
        //     header: "Stocks",
        //     accessor: "stocks",
        //     className: "font-bold text-gray-700",
        // },
    ];

    return (
        <>
            <Table 
            columns={columns} 
            data={currentItems} 
            />
        </>
    );
}
