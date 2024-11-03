import React, { useState, useEffect } from 'react';
import { Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { dataApi } from '../../api';

interface ColumnType {
  name: string;
  current_type: string;
  suggested_type: string;
}

export function DataTypeCasting() {
  const [expanded, setExpanded] = useState(false);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
  const [columnTypes, setColumnTypes] = useState<ColumnType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColumnTypes = async () => {
      try {
        const response = await dataApi.getColumnTypes();
        setColumnTypes(response.columns);
      } catch (err) {
        setError('Failed to fetch column types');
        console.error('Error fetching column types:', err);
      }
    };

    if (expanded) {
      fetchColumnTypes();
    }
  }, [expanded]);

  const handleTypeCast = async (column: string) => {
    if (!selectedTypes[column]) return;

    setProcessing((prev) => ({ ...prev, [column]: true }));
    setError(null);

    try {
      const response = await dataApi.updateColumnType(column, selectedTypes[column]);
      if (!response.success) {
        throw new Error(response.message);
      }
      
      // Refresh column types after successful update
      const typesResponse = await dataApi.getColumnTypes();
      setColumnTypes(typesResponse.columns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update column type');
    } finally {
      setProcessing((prev) => ({ ...prev, [column]: false }));
    }
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
        <div className="mt-4 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {columnTypes.map((column) => (
            <div key={column.name} className="bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-white font-medium">{column.name}</h4>
                  <p className="text-sm text-gray-400">
                    Current: {column.current_type}
                    {column.current_type !== column.suggested_type && (
                      <span className="text-yellow-500">
                        {' '}
                        (Suggested: {column.suggested_type})
                      </span>
                    )}
                  </p>
                </div>
                {column.current_type !== column.suggested_type && (
                  <Wand2 className="text-yellow-500 w-5 h-5" />
                )}
              </div>

              {column.current_type !== column.suggested_type && (
                <div className="flex flex-wrap gap-3">
                  <select
                    className="flex-1 min-w-[200px] bg-slate-700 text-white rounded-lg px-3 py-2"
                    onChange={(e) => {
                      setSelectedTypes((prev) => ({
                        ...prev,
                        [column.name]: e.target.value,
                      }));
                    }}
                    value={selectedTypes[column.name] || ''}
                  >
                    <option value="">Select new data type</option>
                    <option value="int64">Integer (int64)</option>
                    <option value="float64">Float (float64)</option>
                    <option value="string">String</option>
                    <option value="category">Category</option>
                    <option value="datetime">DateTime</option>
                  </select>

                  <button
                    onClick={() => handleTypeCast(column.name)}
                    disabled={processing[column.name] || !selectedTypes[column.name]}
                    className="flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing[column.name] ? 'Converting...' : 'Convert Type'}
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