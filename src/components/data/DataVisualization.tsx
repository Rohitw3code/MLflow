import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
} from 'recharts';
import { preprocessApi } from '../../api';
import { RefreshButton } from '../RefreshButton';

interface Column {
  name: string;
  current_type: string;
}

export function DataVisualization() {
  const [expanded, setExpanded] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter'>('line');
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedColumn1, setSelectedColumn1] = useState('');
  const [selectedColumn2, setSelectedColumn2] = useState('');
  const [visualizationData, setVisualizationData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(100);
  const [totalRows, setTotalRows] = useState(0);

  const loadColumnTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await preprocessApi.getColumnTypes();
      if (response?.columns && Array.isArray(response.columns)) {
        setColumns(response.columns);
        if (response.columns.length > 0) {
          setSelectedColumn1(response.columns[0].name);
          setSelectedColumn2(response.columns[1]?.name || '');
        }
        setDataLoaded(true);
      } else {
        throw new Error('Invalid column data received');
      }
    } catch (err) {
      setError('Failed to load column types');
      setColumns([]);
      setSelectedColumn1('');
      setSelectedColumn2('');
    } finally {
      setIsLoading(false);
    }
  };

  const loadVisualizationData = async () => {
    if (!selectedColumn1) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await preprocessApi.getColumnValues(
        selectedColumn1,
        selectedColumn2,
        startIndex,
        endIndex
      );
      
      if (response) {
        if (selectedColumn2 && response.column1_data && response.column2_data) {
          const combinedData = response.column1_data.map((val1: any, idx: number) => ({
            [selectedColumn1]: val1,
            [selectedColumn2]: response.column2_data[idx],
          }));
          setVisualizationData(combinedData);
        } else if (response.column1_data) {
          const singleData = response.column1_data.map((val: any, idx: number) => ({
            index: idx,
            [selectedColumn1]: val,
          }));
          setVisualizationData(singleData);
        } else {
          throw new Error('Invalid visualization data received');
        }
        
        setTotalRows(response.total_rows || 0);
      } else {
        throw new Error('No data received');
      }
    } catch (err) {
      setError('Failed to load visualization data');
      setVisualizationData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && !dataLoaded && !isLoading) {
      loadColumnTypes();
    }
  }, [expanded]);

  useEffect(() => {
    if (selectedColumn1 && expanded) {
      loadVisualizationData();
    }
  }, [selectedColumn1, selectedColumn2, startIndex, endIndex, expanded]);

  const renderChart = () => {
    if (!visualizationData.length) return null;

    const commonProps = {
      width: 500,
      height: 300,
      data: visualizationData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    try {
      switch (chartType) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedColumn2 ? selectedColumn1 : 'index'}
                label={{ value: selectedColumn2 ? selectedColumn1 : 'Index', position: 'bottom' }}
              />
              <YAxis 
                dataKey={selectedColumn2 || selectedColumn1}
                label={{ value: selectedColumn2 || selectedColumn1, angle: -90, position: 'left' }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedColumn2 || selectedColumn1}
                stroke="#8884d8"
              />
            </LineChart>
          );
        case 'bar':
          return (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedColumn2 ? selectedColumn1 : 'index'}
                label={{ value: selectedColumn2 ? selectedColumn1 : 'Index', position: 'bottom' }}
              />
              <YAxis 
                dataKey={selectedColumn2 || selectedColumn1}
                label={{ value: selectedColumn2 || selectedColumn1, angle: -90, position: 'left' }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedColumn2 || selectedColumn1} fill="#8884d8" />
            </BarChart>
          );
        case 'scatter':
          if (!selectedColumn2) {
            return (
              <div className="text-center text-gray-400 py-4">
                Please select a second column for scatter plot
              </div>
            );
          }
          return (
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={selectedColumn1}
                label={{ value: selectedColumn1, position: 'bottom' }}
              />
              <YAxis 
                dataKey={selectedColumn2}
                label={{ value: selectedColumn2, angle: -90, position: 'left' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Data Points" data={visualizationData} fill="#8884d8" />
            </ScatterChart>
          );
        default:
          return null;
      }
    } catch (err) {
      console.error('Chart rendering error:', err);
      return (
        <div className="text-center text-red-400 py-4">
          Failed to render chart. Please check your data.
        </div>
      );
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg transform transition-all duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setExpanded(!expanded);
            if (!dataLoaded && !isLoading) {
              loadColumnTypes();
            }
          }}
          className="flex items-center space-x-3"
        >
          <BarChart2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Data Visualization</h3>
        </button>
        <div className="flex items-center space-x-2">
          {expanded && <RefreshButton onClick={loadVisualizationData} loading={isLoading} />}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Column (X-Axis)
                </label>
                <select
                  value={selectedColumn1}
                  onChange={(e) => setSelectedColumn1(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                >
                  {columns.length === 0 && (
                    <option value="">No columns available</option>
                  )}
                  {columns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name} ({col.current_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Second Column (Y-Axis)
                </label>
                <select
                  value={selectedColumn2}
                  onChange={(e) => setSelectedColumn2(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                >
                  <option value="">None (Single Column Visualization)</option>
                  {columns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name} ({col.current_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Range (Total Rows: {totalRows})
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={startIndex}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value < totalRows) {
                        setStartIndex(value);
                      }
                    }}
                    min={0}
                    max={totalRows - 1}
                    className="w-24 bg-slate-700 text-white rounded-lg px-3 py-2"
                    placeholder="Start"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    value={endIndex}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > startIndex && value <= totalRows) {
                        setEndIndex(value);
                      }
                    }}
                    min={startIndex + 1}
                    max={totalRows}
                    className="w-24 bg-slate-700 text-white rounded-lg px-3 py-2"
                    placeholder="End"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chart Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-4 rounded-lg flex flex-col items-center space-y-2 ${
                    chartType === 'line'
                      ? 'bg-purple-600/20 border-purple-600 border'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <LineChartIcon className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">Line</span>
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-4 rounded-lg flex flex-col items-center space-y-2 ${
                    chartType === 'bar'
                      ? 'bg-purple-600/20 border-purple-600 border'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <BarChart2 className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">Bar</span>
                </button>
                <button
                  onClick={() => setChartType('scatter')}
                  className={`p-4 rounded-lg flex flex-col items-center space-y-2 ${
                    chartType === 'scatter'
                      ? 'bg-purple-600/20 border-purple-600 border'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <Activity className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">Scatter</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : visualizationData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No data available to visualize
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}