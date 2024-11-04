import React, { useState, useEffect } from 'react';
import { Scale, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { preprocessApi } from '../../api';
import { RefreshButton } from '../RefreshButton';

interface NumericalColumn {
  name: string;
  min: number;
  max: number;
}

type ScalingMethod = 'minmax' | 'standard' | 'robust' | 'normalizer' | 'quantile';

interface ScalingOptions {
  method: ScalingMethod;
  params?: Record<string, number>;
}

export function DataScaling() {
  const [expanded, setExpanded] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, ScalingOptions>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [numericalColumns, setNumericalColumns] = useState<NumericalColumn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showSearch = numericalColumns.length > 3;
  const showScroll = numericalColumns.length > 3;

  const fetchNumericalColumns = async () => {
    setIsLoading(true);
    try {
      const response = await preprocessApi.getNumericalColumns();
      setNumericalColumns(response.columns);
    } catch (err) {
      setError('Failed to fetch numerical columns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && !numericalColumns.length) {
      fetchNumericalColumns();
    }
  }, [expanded]);

  const handleScaling = async (column: string) => {
    if (!selectedColumns[column]?.method) return;

    setProcessing((prev) => ({ ...prev, [column]: true }));
    try {
      await preprocessApi.scaleFeatures([column], selectedColumns[column].method);
      await fetchNumericalColumns();
    } catch (err) {
      setError('Failed to scale column');
    } finally {
      setProcessing((prev) => ({ ...prev, [column]: false }));
    }
  };

  const filteredColumns = numericalColumns.filter((column) =>
    column.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-3"
        >
          <Scale className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Feature Scaling</h3>
        </button>
        <div className="flex items-center space-x-2">
          {expanded && <RefreshButton onClick={fetchNumericalColumns} loading={isLoading} />}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2"
              />
            </div>
          )}

          <div className={`space-y-4 ${showScroll ? 'max-h-[400px] overflow-y-auto pr-2' : ''}`}>
            {isLoading ? (
              <div className="text-center text-gray-400 py-4">Loading columns...</div>
            ) : (
              filteredColumns.map((column) => (
                <div key={column.name} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-white font-medium">{column.name}</h4>
                      <p className="text-sm text-gray-400">
                        Range: {column.min.toLocaleString()} - {column.max.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <select
                      className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                      onChange={(e) => {
                        setSelectedColumns((prev) => ({
                          ...prev,
                          [column.name]: { method: e.target.value as ScalingMethod },
                        }));
                      }}
                      value={selectedColumns[column.name]?.method || ''}
                    >
                      <option value="">Select scaling method</option>
                      <option value="minmax">Min-Max Scaling (0-1)</option>
                      <option value="standard">Standard Scaling (Z-score)</option>
                      <option value="robust">Robust Scaling (IQR)</option>
                      <option value="normalizer">Normalizer (Unit norm)</option>
                      <option value="quantile">Quantile Transformation</option>
                    </select>

                    {selectedColumns[column.name]?.method === 'minmax' && (
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Min (default: 0)"
                          className="bg-slate-700 text-white rounded-lg px-3 py-2"
                          onChange={(e) => {
                            setSelectedColumns((prev) => ({
                              ...prev,
                              [column.name]: {
                                ...prev[column.name],
                                params: {
                                  ...prev[column.name].params,
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
                              [column.name]: {
                                ...prev[column.name],
                                params: {
                                  ...prev[column.name].params,
                                  max: Number(e.target.value),
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                    )}

                    <button
                      onClick={() => handleScaling(column.name)}
                      disabled={processing[column.name]}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                    >
                      {processing[column.name] ? 'Processing...' : 'Apply Scaling'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
