import React, { useState } from 'react';
import { Scale, ChevronDown, ChevronUp } from 'lucide-react';

// Dummy data for numerical columns
const dummyNumericalColumns = {
  Age: { min: 20, max: 70 },
  Income: { min: 30000, max: 130000 },
  Score: { min: 0, max: 100 },
};

type ScalingMethod =
  | 'minmax'
  | 'standard'
  | 'robust'
  | 'normalizer'
  | 'quantile';

interface ScalingOptions {
  method: ScalingMethod;
  params?: Record<string, number>;
}

export function DataScaling() {
  const [expanded, setExpanded] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, ScalingOptions>
  >({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const handleScaling = async (column: string) => {
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
          <Scale className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Feature Scaling</h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {Object.entries(dummyNumericalColumns).map(([column, range]) => (
            <div key={column} className="bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-white font-medium">{column}</h4>
                  <p className="text-sm text-gray-400">
                    Range: {range.min.toLocaleString()} -{' '}
                    {range.max.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <select
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                  onChange={(e) => {
                    setSelectedColumns((prev) => ({
                      ...prev,
                      [column]: { method: e.target.value as ScalingMethod },
                    }));
                  }}
                  value={selectedColumns[column]?.method || ''}
                >
                  <option value="">Select scaling method</option>
                  <option value="minmax">Min-Max Scaling (0-1)</option>
                  <option value="standard">Standard Scaling (Z-score)</option>
                  <option value="robust">Robust Scaling (IQR)</option>
                  <option value="normalizer">Normalizer (Unit norm)</option>
                  <option value="quantile">Quantile Transformation</option>
                </select>

                {selectedColumns[column]?.method === 'minmax' && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min (default: 0)"
                      className="bg-slate-700 text-white rounded-lg px-3 py-2"
                      onChange={(e) => {
                        setSelectedColumns((prev) => ({
                          ...prev,
                          [column]: {
                            ...prev[column],
                            params: {
                              ...prev[column].params,
                              min: Number(e.target.value),
                            },
                          },
                        }));
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Max (default: 1)"
                      className="bg-slate-700 text-white rounded-lg px-3 py-2"
                      onChange={(e) => {
                        setSelectedColumns((prev) => ({
                          ...prev,
                          [column]: {
                            ...prev[column],
                            params: {
                              ...prev[column].params,
                              max: Number(e.target.value),
                            },
                          },
                        }));
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={() => handleScaling(column)}
                  disabled={processing[column]}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  {processing[column] ? 'Processing...' : 'Apply Scaling'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
