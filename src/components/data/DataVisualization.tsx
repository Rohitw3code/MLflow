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
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { dataApi, preprocessApi } from '../../api';
import { RefreshButton } from '../RefreshButton';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

type ChartType = 'line' | 'bar' | 'pie' | 'scatter';

interface ChartConfig {
  type: ChartType;
  xAxis: string;
  yAxis?: string;
}

interface ColumnType {
  name: string;
  current_type: string;
}

export function DataVisualization() {
  const [expanded, setExpanded] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'line',
    xAxis: '',
    yAxis: '',
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadColumnTypes = async () => {
    try {
      const response = await dataApi.getColumnTypes();
      const numericColumns = response.columns
        .filter((col: ColumnType) =>
          col.current_type.includes('int') || col.current_type.includes('float')
        )
        .map((col: ColumnType) => col.name);
      
      setColumns(numericColumns);
      if (numericColumns.length > 1) {
        setChartConfig({
          ...chartConfig,
          xAxis: numericColumns[0],
          yAxis: numericColumns[1],
        });
      }
    } catch (err) {
      setError('Failed to load columns');
    }
  };

  const fetchVisualizationData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await preprocessApi.getColumnValues(
        chartConfig.xAxis,
        chartConfig.yAxis
      );

      const visualData = response.column1.map((value: any, index: number) => ({
        [chartConfig.xAxis]: value,
        [chartConfig.yAxis!]: response.column2[index],
      }));

      setChartData(visualData);
      setDataLoaded(true);
    } catch (err) {
      setError('Failed to fetch visualization data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && chartConfig.xAxis && chartConfig.yAxis) {
      fetchVisualizationData();
    }
  }, [chartConfig.xAxis, chartConfig.yAxis, chartConfig.type, expanded]);

  const renderChart = () => {
    const { type, xAxis, yAxis } = chartConfig;

    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xAxis} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={yAxis}
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xAxis} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
            <Bar
              dataKey={yAxis}
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xAxis} name={xAxis} stroke="#9CA3AF" />
            <YAxis dataKey={yAxis} name={yAxis} stroke="#9CA3AF" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
            <Scatter
              name={`${xAxis} vs ${yAxis}`}
              data={chartData}
              fill="#8B5CF6"
              shape="circle"
            />
          </ScatterChart>
        );

      case 'pie':
        const pieData = chartData.reduce((acc: any[], curr) => {
          const key = curr[xAxis];
          const existing = acc.find((item) => item.name === key);
          if (existing) {
            existing.value += yAxis ? curr[yAxis] : 1;
          } else {
            acc.push({
              name: key,
              value: yAxis ? curr[yAxis] : 1,
            });
          }
          return acc;
        }, []);

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8B5CF6"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
          </PieChart>
        );

      default:
        return null;
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
        <RefreshButton onClick={fetchVisualizationData} />
      </div>

      {expanded && (
        <div className="space-y-6 animate-fadeIn">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {!dataLoaded && !isLoading ? (
            <div className="text-center py-4">
              <button
                onClick={loadColumnTypes}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transform transition-all duration-300 hover:scale-105"
              >
                Load Data
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['line', 'bar', 'scatter', 'pie'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartConfig({ ...chartConfig, type: type as ChartType })}
                    className={`p-4 rounded-lg flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 ${
                      chartConfig.type === type
                        ? 'bg-purple-600/20 border-purple-600 border'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {type === 'line' && <LineChartIcon className="w-6 h-6 text-purple-400" />}
                    {type === 'bar' && <BarChart2 className="w-6 h-6 text-purple-400" />}
                    {type === 'pie' && <PieChartIcon className="w-6 h-6 text-purple-400" />}
                    {type === 'scatter' && <Activity className="w-6 h-6 text-purple-400" />}
                    <span className="capitalize text-white text-sm">{type} chart</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={chartConfig.xAxis}
                  onChange={(e) => setChartConfig({ ...chartConfig, xAxis: e.target.value })}
                  className="bg-slate-900 text-white p-2 rounded-lg"
                >
                  <option value="">Select X-Axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>

                <select
                  value={chartConfig.yAxis}
                  onChange={(e) => setChartConfig({ ...chartConfig, yAxis: e.target.value })}
                  className="bg-slate-900 text-white p-2 rounded-lg"
                >
                  <option value="">Select Y-Axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full h-96 mt-8 bg-slate-900 rounded-lg p-4 animate-fadeIn">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
