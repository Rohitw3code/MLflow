import React, { useState } from 'react';
import { ChevronLeft, Table, ChevronDown, ChevronUp, Save, Download } from 'lucide-react';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const [showHead, setShowHead] = useState(true);
  const [rowsToShow, setRowsToShow] = useState(5);

  // Dummy data
  const dummyData = {
    columns: ['Age', 'Income', 'Score', 'Category'],
    data: Array.from({ length: 100 }, (_, i) => ({
      Age: Math.floor(Math.random() * 50) + 20,
      Income: Math.floor(Math.random() * 100000) + 30000,
      Score: Math.floor(Math.random() * 100),
      Category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    })),
  };

  const handleSaveProject = () => {
    // Implement save project logic
    console.log('Saving project...');
  };

  const handleDownloadData = () => {
    // Create CSV content
    const headers = dummyData.columns.join(',');
    const rows = dummyData.data.map(row => 
      dummyData.columns.map(col => row[col]).join(',')
    ).join('\n');
    const csvContent = `${headers}\n${rows}`;

    // Create and trigger download
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
              onClick={handleSaveProject}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Save Project"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadData}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Download Preprocessed Data"
            >
              <Download className="w-5 h-5" />
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

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-700">
                <tr>
                  {dummyData.columns.map((col) => (
                    <th key={col} className="px-4 py-2 text-purple-400">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(showHead ? dummyData.data.slice(0, rowsToShow) : dummyData.data.slice(-rowsToShow)).map((row, i) => (
                  <tr key={i} className="border-b border-gray-700">
                    {dummyData.columns.map((col) => (
                      <td key={col} className="px-4 py-2 text-gray-300">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}