import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { dataApi } from '../../api';
import { preprocessApi } from '../../api';

type ImputationMethod = 'mean' | 'median' | 'mode' | 'remove' | 'value';

interface ImputationOptions {
  column: string;
  method: ImputationMethod;
  value?: string;
}

interface MissingValueData {
  column: string;
  missing_count: number;
}

interface ShapeData {
  columns: number;
  rows: number;
}

const dummyData = [
  { column: 'Age', missing_count: 10 },
  { column: 'Salary', missing_count: 15 },
  { column: 'Department', missing_count: 5 },
];

export function MissingValues() {
  const [expanded, setExpanded] = useState(false);
  const [selectedImputations, setSelectedImputations] = useState<Record<string, ImputationOptions>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [missingData, setMissingData] = useState<MissingValueData[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchMissingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const shapeResponse: ShapeData = await dataApi.getShape();
      const missingValuesResponse = await dataApi.getMissingValues();

      setTotalRows(shapeResponse.rows);
      const filteredMissingValues = missingValuesResponse.data.filter(
        (item: MissingValueData) => item.missing_count > 0
      );
      setMissingData(filteredMissingValues.length > 0 ? filteredMissingValues : dummyData);
      setDataLoaded(true);
    } catch (error) {
      setError('Failed to fetch missing values data');
      setMissingData(dummyData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImputation = async (column: string) => {
    if (!selectedImputations[column]) return;

    const { method } = selectedImputations[column];
    setProcessing((prev) => ({ ...prev, [column]: true }));

    try {
      await preprocessApi.handleMissingValues(column, method);
      await fetchMissingData();
    } catch (error) {
      setError('Failed to handle missing values');
    } finally {
      setProcessing((prev) => ({ ...prev, [column]: false }));
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg">
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (!dataLoaded && !isLoading) {
            fetchMissingData();
          }
        }}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Missing Values Analysis
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
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-gray-400 py-4">Loading missing values data...</div>
          ) : !dataLoaded ? (
            <div className="text-center py-4">
              <button
                onClick={fetchMissingData}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Load Missing Values Data
              </button>
            </div>
          ) : (
            missingData.map(({ column, missing_count }) => {
              const percentage = ((missing_count / totalRows) * 100).toFixed(2);

              return (
                <div key={column} className="bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-white font-medium">{column}</h4>
                      <p className="text-sm text-gray-400">
                        {missing_count} missing values ({percentage}%)
                      </p>
                    </div>
                    <AlertCircle className="text-yellow-500 w-5 h-5" />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <select
                      className="flex-1 min-w-[200px] bg-slate-700 text-white rounded-lg px-3 py-2"
                      onChange={(e) => {
                        setSelectedImputations((prev) => ({
                          ...prev,
                          [column]: {
                            column,
                            method: e.target.value as ImputationMethod,
                          },
                        }));
                      }}
                      value={selectedImputations[column]?.method || ''}
                    >
                      <option value="">Select imputation method</option>
                      <option value="mean">Replace with Mean</option>
                      <option value="median">Replace with Median</option>
                      <option value="mode">Replace with Mode</option>
                      <option value="value">Replace with Value</option>
                      <option value="remove">Remove Rows</option>
                    </select>

                    {selectedImputations[column]?.method === 'value' && (
                      <input
                        type="text"
                        className="flex-1 min-w-[200px] bg-slate-700 text-white rounded-lg px-3 py-2"
                        placeholder="Enter replacement value"
                        onChange={(e) => {
                          setSelectedImputations((prev) => ({
                            ...prev,
                            [column]: { ...prev[column], value: e.target.value },
                          }));
                        }}
                      />
                    )}

                    <button
                      onClick={() => handleImputation(column)}
                      disabled={processing[column]}
                      className="flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center min-w-[120px]"
                    >
                      {processing[column] ? (
                        'Processing...'
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Apply Fix
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}