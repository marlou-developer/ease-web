import React from 'react';
import { useSelector } from 'react-redux';
import Skeleton from './skeleton';

const Table = ({ columns, data }) => {
    const { loading } = useSelector((store) => store.app);

    return loading ? (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    ) : (
        <div className="w-full px-3 sm:px-0">
            {/* --- Table Component --- */}
            <table className="w-full text-sm border-collapse md:border md:border-gray-100 md:shadow-sm md:divide-y md:divide-gray-50">
                <thead className="hidden md:table-header-group">
                    <tr className="text-left text-gray-400 border-b border-gray-100 bg-gray-50/50">
                        {columns?.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 font-medium uppercase text-xs tracking-wider select-none transition-colors duration-200 cursor-default"
                            >
                                <div className={`flex items-center space-x-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                                    <span>{col.header}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-transparent md:bg-white divide-y divide-gray-50 block md:table-row-group">
                    {data?.map((row, rowIndex) => (
                        <tr
                            key={row.id || rowIndex}
                            className="block md:table-row mb-4 md:mb-0 bg-white border md:border-0 border-gray-200 rounded-lg shadow-sm md:shadow-none hover:bg-blue-50/30 transition duration-150"
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`flex md:table-cell justify-between items-center p-4 md:px-6 md:py-4 border-b md:border-0 border-gray-50 last:border-b-0 ${col.align === 'right' ? 'md:text-right' : col.align === 'center' ? 'md:text-center' : 'md:text-left'} ${col.className || ''}`}
                                >
                                    <span className="md:hidden text-xs font-semibold uppercase text-gray-400 w-1/3">
                                        {col.header}
                                    </span>
                                    <div className="w-2/3 md:w-auto flex justify-end md:justify-start md:inline-block text-right md:text-left">
                                        {/* Check if a custom render function exists, otherwise render raw data */}
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;