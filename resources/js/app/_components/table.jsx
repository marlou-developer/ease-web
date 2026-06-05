import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Skeleton from './skeleton';

const Table = ({ columns, data }) => {
    const { loading } = useSelector((store) => store.pos)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const sortedData = useMemo(() => {
        if (!data) return [];

        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const valueA = a[sortConfig.key] || '';
                const valueB = b[sortConfig.key] || '';

                if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key, disableSort) => {
        if (disableSort) return;
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return loading ? <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
    </> : <div className="w-full px-3 sm:px-0">
        <div className="md:hidden flex items-center justify-between mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex-1 mr-3 flex items-center space-x-2">
                <label htmlFor="mobile-sort" className="text-sm font-medium text-blue-800">Sort by:</label>
                <select
                    id="mobile-sort"
                    className="flex-1 bg-white border border-gray-300 text-gray-800 text-sm rounded-md p-1.5"
                    value={sortConfig.key || ''}
                    onChange={(e) => setSortConfig({ key: e.target.value, direction: sortConfig.direction })}
                >
                    <option value="" disabled>Select column</option>
                    {columns?.filter(col => !col.disableSort).map((col) => (
                        <option key={col.accessor} value={col.accessor}>{col.header}</option>
                    ))}
                </select>
            </div>
            <button
                onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                disabled={!sortConfig.key}
                className="p-1.5 bg-white border border-gray-300 rounded-md text-blue-600 disabled:opacity-50"
            >
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
            </button>
        </div>

        {/* --- Table Component --- */}
        <table className="w-full text-sm border-collapse md:border md:border-gray-100 md:shadow-sm md:divide-y md:divide-gray-50">
            <thead className="hidden md:table-header-group">
                <tr className="text-left text-gray-400 border-b border-gray-100 bg-gray-50/50">
                    {columns?.map((col, index) => (
                        <th
                            key={index}
                            onClick={() => requestSort(col.accessor, col.disableSort)}
                            className={`px-6 py-4 font-medium uppercase text-xs tracking-wider select-none transition-colors duration-200 ${col.disableSort ? 'cursor-default' : 'cursor-pointer hover:text-gray-700'
                                }`}
                        >
                            <div className={`flex items-center space-x-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                                <span>{col.header}</span>
                                {!col.disableSort && (
                                    sortConfig.key === col.accessor ? (
                                        <span className="text-blue-500">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                    ) : (
                                        <span className="text-transparent">▲</span>
                                    )
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody className="bg-transparent md:bg-white divide-y divide-gray-50 block md:table-row-group">
                {sortedData?.map((row, rowIndex) => (
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
};

export default Table;