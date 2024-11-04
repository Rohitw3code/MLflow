import React, { useState, useEffect } from 'react';
import { Wand2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { dataApi, preprocessApi } from '../../api';

interface ColumnType {
  name: string;
  current_type: string;
}

const dummyData = [
  { name: 'Age', current_type: 'int64' },
  { name: 'Name', current_type: 'object' },
  { name: 'Salary', current_type: 'float64' },
];

export function DataTypeCasting() {
  const [expanded, setExpanded] = useState(false);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
  const [columnTypes, setColumnTypes] = useState<ColumnType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const showSearch = columnTypes.length > 3;
  const showScroll = columnTypes.length > 3;

  const fetchColumnTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dataApi.getColumnTypes();
      setColumnTypes(response.columns);
      setDataLoaded(true);
    } catch (err) {
      setError('Failed to fetch column types');
      setColumnTypes(dummyData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeCast = async (column: string) => {
    if (!selectedTypes[column]) return;

    setProcessing((prev) => ({ ...prev, [column]: true }));
    setError(null);

    try {
      const response = await dataApi.updateColumnType(column, selectedTypes[column]);
      if (!response.success) {
        throw new Error(response.message);
      }
      await fetchColumnTypes();
      setSelectedTypes((prev) => {
        const updated = { ...prev };
        delete updated[column];
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update column type');
    } finally {
      setProcessing((prev) => ({ ...prev, [column]: false }));
    }
  };

  const filteredColumns = columnTypes.filter(
    (column) =>
      column.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      column.current_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg">
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (!dataLoaded && !isLoading) {
            fetchColumnTypes();
          }
        }}
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

          {isLoading ? (
            <div className="text-center text-gray-400 py-4">Loading data types...</div>
          ) : !dataLoaded ? (
            <div className="text-center py-4">
              <button
                onClick={fetchColumnTypes}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Load Data Types
              </button>
            </div>
          ) : (
            <>
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
                {filteredColumns.map((column) => (
                  <div key={column.name} className="bg-slate-800 p-4 rounded-lg transform transition-all duration-200 hover:scale-[1.02] hover:bg-slate-700">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="text-white font-medium">{column.name}</h4>
                        <p className="text-sm">
                          <span className="text-purple-400 font-medium">
                            {column.current_type}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        className="flex-1 min-w-[200px] bg-slate-700 text-white rounded-lg px-3 py-2 transition-colors hover:bg-slate-600"
                        onChange={(e) => {
                          setSelectedTypes((prev) => ({
                            ...prev,
                            [column.name]: e.target.value,
                          }));
                        }}
                        value={selectedTypes[column.name] || ''}
                      >
                        <option value="">Convert to type...</option>
                        <option value="int64">Integer (int64)</option>
                        <option value="float64">Float (float64)</option>
                        <option value="string">String</option>
                        <option value="category">Category</option>
                        <option value="datetime">DateTime</option>
                      </select>

                      <button
                        onClick={() => handleTypeCast(column.name)}
                        disabled={processing[column.name] || !selectedTypes[column.name]}
                        className="flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors transform hover:scale-105"
                      >
                        {processing[column.name] ? 'Converting...' : 'Convert'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}