import React, { useState } from 'react';
import { Wand2, ChevronDown, ChevronUp } from 'lucide-react';

// Dummy data for data types
const dummyDataTypes = {
  Age: { current: 'object', suggested: 'int64' },
  Income: { current: 'object', suggested: 'float64' },
  Score: { current: 'object', suggested: 'float64' },
  Category: { current: 'object', suggested: 'category' },
};

export function DataTypeCasting() {
  const [expanded, setExpanded] = useState(false);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
    {}
  );

  const handleTypeCast = async (column: string) => {
    if (!selectedTypes[column]) return;

    setProcessing((prev) => ({ ...prev, [column]: true }));
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProcessing((prev) => ({ ...prev, [column]: false }));
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Wand2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Data Type Conversion
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {Object.entries(dummyDataTypes).map(([column, info]) => (
            <div key={column} className="bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-white font-medium">{column}</h4>
                  <p className="text-sm text-gray-400">
                    Current: {info.current}
                    {info.current !== info.suggested && (
                      <span className="text-yellow-500">
                        {' '}
                        (Suggested: {info.suggested})
                      </span>
                    )}
                  </p>
                </div>
                {info.current !== info.suggested && (
                  <Wand2 className="text-yellow-500 w-5 h-5" />
                )}
              </div>

              {info.current !== info.suggested && (
                <div className="flex flex-wrap gap-3">
                  <select
                    className="flex-1 min-w-[200px] bg-slate-700 text-white rounded-lg px-3 py-2"
                    onChange={(e) => {
                      setSelectedTypes((prev) => ({
                        ...prev,
                        [column]: e.target.value,
                      }));
                    }}
                    value={selectedTypes[column] || ''}
                  >
                    <option value="">Select new data type</option>
                    <option value="int64">Integer (int64)</option>
                    <option value="float64">Float (float64)</option>
                    <option value="string">String</option>
                    <option value="category">Category</option>
                    <option value="datetime">DateTime</option>
                  </select>

                  <button
                    onClick={() => handleTypeCast(column)}
                    disabled={processing[column]}
                    className="flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg min-w-[120px]"
                  >
                    {processing[column] ? 'Converting...' : 'Convert Type'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
