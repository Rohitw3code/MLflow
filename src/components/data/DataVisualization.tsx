import React, { useState } from 'react';
import {
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Box,
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

// Dummy data for visualization
const dummyData = {
  numerical: ['Age', 'Income', 'Score', 'Sales', 'Profit'],
  categorical: ['Category', 'Region', 'Status'],
  data: Array.from({ length: 50 }, (_, i) => ({
    Age: Math.floor(Math.random() * 50) + 20,
    Income: Math.floor(Math.random() * 100000) + 30000,
    Score: Math.floor(Math.random() * 100),
    Sales: Math.floor(Math.random() * 1000) + 100,
    Profit: Math.floor(Math.random() * 500) + 50,
    Category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    Region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
    Status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)],
  })),
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'box' | 'area';

interface ChartConfig {
  type: ChartType;
  xAxis: string;
  yAxis?: string;
  groupBy?: string;
}

export function DataVisualization() {
  const [expanded, setExpanded] = useState(true);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'line',
    xAxis: dummyData.numerical[0],
    yAxis: dummyData.numerical[1],
  });

  const renderChart = () => {
    const { type, xAxis, yAxis, groupBy } = chartConfig;

    switch (type) {
      case 'line':
        return (
          <LineChart data={dummyData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={dummyData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </BarChart>
        );

      case 'pie':
        const pieData = dummyData.data.reduce((acc: any[], curr) => {
          const key = curr[xAxis as keyof typeof curr];
          const existing = acc.find((item) => item.name === key);
          if (existing) {
            existing.value += yAxis ? curr[yAxis as keyof typeof curr] : 1;
          } else {
            acc.push({
              name: key,
              value: yAxis ? curr[yAxis as keyof typeof curr] : 1,
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
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} name={xAxis} />
            <YAxis dataKey={yAxis} name={yAxis} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter
              name={`${xAxis} vs ${yAxis}`}
              data={dummyData.data}
              fill="#8884d8"
            />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center space-x-3">
          <BarChart2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Data Visualization
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setChartConfig({ ...chartConfig, type: 'line' })}
              className={`p-4 rounded-lg flex flex-col items-center space-y-2 ${
                chartConfig.type === 'line'
                  ? 'bg-purple-600/20 border-purple-600 border'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <LineChartIcon className="w-6 h-6 text-purple-400" />
              <span className="text-gray-300">Line Chart</span>
            </button>

            <button
              onClick={() => setChartConfig({ ...chartConfig, type: 'bar' })}
              className={`p-4 rounded-lg flex flex-col items-center space-y-2 ${
                chartConfig.type === 'bar'
                  ? 'bg-purple-600/20 border-purple-600 border'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <BarChart2 className="w-6 h-6 text-purple-400" />
              <span className="text-gray-300">Bar Chart</span>
            </button>

            <button
              onClick={() => setChartConfig({ ...chartConfig, type: 'pie' })}
              className={`p-4 rounded-lg flex flex-col items-center space-y-2 ${
                chartConfig.type === 'pie'
                  ? 'bg-purple-600/20 border-purple-600 border'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <PieChartIcon className="w-6 h-6 text-purple-400" />
              <span className="text-gray-300">Pie Chart</span>
            </button>

            <button
              onClick={() => setChartConfig({ ...chartConfig, type: 'scatter' })}
              className={`p-4 rounded-lg flex flex-col items-center space-y-2 ${
                chartConfig.type === 'scatter'
                  ? 'bg-purple-600/20 border-purple-600 border'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Activity className="w-6 h-6 text-purple-400" />
              <span className="text-gray-300">Scatter Plot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                X-Axis
              </label>
              <select
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                value={chartConfig.xAxis}
                onChange={(e) =>
                  setChartConfig({ ...chartConfig, xAxis: e.target.value })
                }
              >
                {[...dummyData.numerical, ...dummyData.categorical].map(
                  (column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  )
                )}
              </select>
            </div>

            {chartConfig.type !== 'pie' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Y-Axis
                </label>
                <select
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                  value={chartConfig.yAxis}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, yAxis: e.target.value })
                  }
                >
                  {dummyData.numerical.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="bg-slate-800 p-4 rounded-lg" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}