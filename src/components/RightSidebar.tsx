import React, { useState, useEffect } from 'react';
import { ChevronLeft, Table, ChevronDown, ChevronUp, Save, Download, RefreshCw } from 'lucide-react';
import { preprocessApi } from '../api';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const [showHead, setShowHead] = useState(true);
  const [rowsToShow, setRowsToShow] = useState(5);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await (showHead 
        ? preprocessApi.getHead(rowsToShow)
        : preprocessApi.getTail(rowsToShow));
      
      setData(response.data);
      setColumns(response.columns);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, showHead, rowsToShow]);

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    if (typeof value === 'number') {
      if (isNaN(value)) return 'N/A';
      if (Number.isInteger(value)) return value.toString();
      return value.toFixed(4);
    }
    return value.toString();
  };

  const handleDownloadData = () => {
    if (!data.length) return;

    const headers = columns.join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col];
        if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
          return '';
        }
        return value;
      }).join(',')
    ).join('\n');
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preprocessed_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100vh-64px)] w-80 bg-slate-800 transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-semibold">Data Preview</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadData}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Download Preprocessed Data"
              disabled={!data.length}
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={fetchData}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Refresh Data"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHead(true)}
                className={`px-3 py-1 rounded-lg ${
                  showHead ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                Head
              </button>
              <button
                onClick={() => setShowHead(false)}
                className={`px-3 py-1 rounded-lg ${
                  !showHead ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                Tail
              </button>
            </div>
            <select
              value={rowsToShow}
              onChange={(e) => setRowsToShow(Number(e.target.value))}
              className="bg-slate-700 text-white rounded-lg px-2 py-1"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} rows
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="text-red-400 bg-red-400/10 p-3 rounded-lg">
              {error}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-700">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-4 py-2 text-purple-400 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-2 text-gray-300 whitespace-nowrap">
                          {formatCellValue(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}