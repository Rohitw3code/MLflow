import React, { useState, useEffect } from 'react';
import { Hash, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { preprocessApi } from '../../api';

interface EncodingColumn {
  name: string;
  type: string;
  uniqueValues: number;
}

type EncodingMethod = 'label' | 'onehot' | 'binary' | 'frequency' | 'target';

interface EncodingOptions {
  method: EncodingMethod;
  targetColumn?: string;
}

export function DataEncoding() {
  const [expanded, setExpanded] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, EncodingOptions>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [categoricalColumns, setCategoricalColumns] = useState<EncodingColumn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showSearch = categoricalColumns.length > 3;
  const showScroll = categoricalColumns.length > 3;

  const fetchCategoricalColumns = async () => {
    setIsLoading(true);
    try {
      const response = await preprocessApi.getCategoricalColumns();
      setCategoricalColumns(response.columns);
    } catch (err) {
      setError('Failed to fetch categorical columns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchCategoricalColumns();
    }
  }, [expanded]);

  const handleEncoding = async (column: string) => {
    if (!selectedColumns[column]?.method) return;

    setProcessing((prev) => ({ ...prev, [column]: true }));
    try {
      await preprocessApi.encodeCategorical(column, selectedColumns[column].method);
      await fetchCategoricalColumns(); // Refresh the list
    } catch (err) {
      setError('Failed to encode column');
    } finally {
      setProcessing((prev) => ({ ...prev, [column]: false }));
    }
  };

  const filteredColumns = categoricalColumns.filter((column) =>
    column.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Hash className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Categorical Encoding</h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

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
                        {column.uniqueValues} unique values
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <select
                      className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                      onChange={(e) => {
                        setSelectedColumns((prev) => ({
                          ...prev,
                          [column.name]: { method: e.target.value as EncodingMethod },
                        }));
                      }}
                      value={selectedColumns[column.name]?.method || ''}
                    >
                      <option value="">Select encoding method</option>
                      <option value="label">Label Encoding</option>
                      <option value="onehot">One-Hot Encoding</option>
                      <option value="binary">Binary Encoding</option>
                      <option value="frequency">Frequency Encoding</option>
                      <option value="target">Target Encoding</option>
                    </select>

                    {selectedColumns[column.name]?.method === 'target' && (
                      <select
                        className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                        onChange={(e) => {
                          setSelectedColumns((prev) => ({
                            ...prev,
                            [column.name]: {
                              ...prev[column.name],
                              targetColumn: e.target.value,
                            },
                          }));
                        }}
                      >
                        <option value="">Select target column</option>
                        {categoricalColumns.map((col) => (
                          <option key={col.name} value={col.name}>
                            {col.name}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      onClick={() => handleEncoding(column.name)}
                      disabled={processing[column.name]}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                    >
                      {processing[column.name] ? 'Processing...' : 'Apply Encoding'}
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