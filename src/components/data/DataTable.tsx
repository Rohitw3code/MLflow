import React, { useEffect, useState } from 'react';
import { dataApi } from '../../api';

interface DataTableProps {
  columns: string[];
  data: any[];
  isLoading: boolean;
}

// Dummy data for loading state
const dummyData = {
  columns: ['id', 'name', 'age', 'salary'],
  data: Array.from({ length: 5 }, () => ({
    id: 'Loading...',
    name: 'Loading...',
    age: 'Loading...',
    salary: 'Loading...',
  })),
};

async function fetchHeadData(count: number) {
  try {
    const response = await dataApi.getHead(count);
    console.log('Head of dataset:', response);
    return response;
  } catch (error) {
    console.error('Error fetching head of dataset:', error);
    return null;
  }
}

async function fetchTailData(count: number) {
  try {
    const response = await dataApi.getTail(count);
    console.log('Tail of dataset:', response);
    return response;
  } catch (error) {
    console.error('Error fetching tail of dataset:', error);
    return null;
  }
}

export function DataTable() {
  const [rowsToShow, setRowsToShow] = useState(3);
  const [showHead, setShowHead] = useState(true);
  const [data, setData] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const result = showHead
        ? await fetchHeadData(rowsToShow)
        : await fetchTailData(rowsToShow);
      if (result) {
        setData(result.data);
        setColumns(result.columns);
      } else {
        setData(dummyData.data);
        setColumns(dummyData.columns);
      }
      setIsLoading(false);
    };
    loadData();
  }, [rowsToShow, showHead]);

  const displayData = data || dummyData.data;
  const displayColumns = columns.length > 0 ? columns : dummyData.columns;

  return (
    <div
      className={`bg-white/5 backdrop-blur-lg p-6 rounded-lg mb-6 ${
        isLoading ? 'animate-pulse' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={rowsToShow}
            onChange={(e) => setRowsToShow(Number(e.target.value))}
            className="bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700"
            disabled={isLoading}
          >
            {[3, 5, 8, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} rows
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHead(true)}
              className={`px-3 py-1 rounded-lg ${
                showHead ? 'bg-purple-600' : 'bg-slate-700'
              }`}
              disabled={isLoading}
            >
              Head
            </button>
            <button
              onClick={() => setShowHead(false)}
              className={`px-3 py-1 rounded-lg ${
                !showHead ? 'bg-purple-600' : 'bg-slate-700'
              }`}
              disabled={isLoading}
            >
              Tail
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {data
            ? `Showing ${showHead ? 'first' : 'last'} ${Math.min(
                rowsToShow,
                data.length
              )} of ${data.length} rows`
            : 'No data loaded'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800">
            <tr>
              {displayColumns.map((col) => (
                <th key={col} className="px-4 py-2 text-purple-400">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isLoading ? 'opacity-50' : ''}>
            {displayData.slice(0, rowsToShow).map((row, i) => (
              <tr key={i} className="border-b border-gray-700 hover:bg-white/5">
                {displayColumns.map((col) => (
                  <td key={col} className="px-4 py-2 text-gray-300">
                    {row[col]?.toString() || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
