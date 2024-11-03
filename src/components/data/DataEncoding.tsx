import React, { useState } from 'react';
import { Hash, ChevronDown, ChevronUp } from 'lucide-react';

// Dummy data for categorical columns
const dummyCategoricalColumns = {
  Category: ['A', 'B', 'C'],
  Status: ['Active', 'Inactive', 'Pending'],
  Type: ['Type1', 'Type2', 'Type3', 'Type4'],
};

type EncodingMethod = 'label' | 'onehot' | 'binary' | 'frequency' | 'target';

interface EncodingOptions {
  method: EncodingMethod;
  targetColumn?: string;
}

export function DataEncoding() {
  const [expanded, setExpanded] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, EncodingOptions>
  >({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const handleEncoding = async (column: string) => {
    if (!selectedColumns[column]?.method) return;

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
          <Hash className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Categorical Encoding
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {Object.entries(dummyCategoricalColumns).map(([column, values]) => (
            <div key={column} className="bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-white font-medium">{column}</h4>
                  <p className="text-sm text-gray-400">
                    {values.length} unique values
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <select
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                  onChange={(e) => {
                    setSelectedColumns((prev) => ({
                      ...prev,
                      [column]: { method: e.target.value as EncodingMethod },
                    }));
                  }}
                  value={selectedColumns[column]?.method || ''}
                >
                  <option value="">Select encoding method</option>
                  <option value="label">Label Encoding</option>
                  <option value="onehot">One-Hot Encoding</option>
                  <option value="binary">Binary Encoding</option>
                  <option value="frequency">Frequency Encoding</option>
                  <option value="target">Target Encoding</option>
                </select>

                {selectedColumns[column]?.method === 'target' && (
                  <select
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                    onChange={(e) => {
                      setSelectedColumns((prev) => ({
                        ...prev,
                        [column]: {
                          ...prev[column],
                          targetColumn: e.target.value,
                        },
                      }));
                    }}
                  >
                    <option value="">Select target column</option>
                    <option value="Score">Score</option>
                    <option value="Target">Target</option>
                  </select>
                )}

                <button
                  onClick={() => handleEncoding(column)}
                  disabled={processing[column]}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  {processing[column] ? 'Processing...' : 'Apply Encoding'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
