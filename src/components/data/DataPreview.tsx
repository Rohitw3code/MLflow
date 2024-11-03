import React, { useState } from 'react';
import { BarChart2, LineChart as LineChartIcon, ScatterChart, PieChart, Activity, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Scatter, Pie, Cell } from 'recharts';
import { Heatmap } from './Heatmap';

interface DataPreviewProps {
  data: any[];
  selectedFeatures: string[];
  onClose: () => void;
}

export function DataPreview({ data, selectedFeatures, onClose }: DataPreviewProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter' | 'pie' | 'heatmap'>('line');
  const [xAxis, setXAxis] = useState(selectedFeatures[0]);
  const [yAxis, setYAxis] = useState(selectedFeatures[1]);

  const renderChart = () => {
    const chartProps = {
      width: 500,
      height: 300,
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
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
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </LineChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...chartProps}>
            <CartesianGrid />
            <XAxis dataKey={xAxis} />
            <YAxis dataKey={yAxis} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={`${xAxis} vs ${yAxis}`} data={data} fill="#8884d8" />
          </ScatterChart>
        );
      case 'heatmap':
        return <Heatmap data={data} features={selectedFeatures} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-slate-800 p-6 rounded-lg w-[800px] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Data Visualization</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded transition-all transform hover:scale-105 ${
                chartType === 'line' ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <LineChartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded transition-all transform hover:scale-105 ${
                chartType === 'bar' ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('scatter')}
              className={`p-2 rounded transition-all transform hover:scale-105 ${
                chartType === 'scatter' ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <ScatterChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('heatmap')}
              className={`p-2 rounded transition-all transform hover:scale-105 ${
                chartType === 'heatmap' ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <Activity className="w-5 h-5" />
            </button>
          </div>

          {chartType !== 'heatmap' && (
            <div className="flex space-x-4">
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="bg-slate-700 text-white rounded px-3 py-2 transition-colors hover:bg-slate-600"
              >
                {selectedFeatures.map((feature) => (
                  <option key={feature} value={feature}>
                    {feature}
                  </option>
                ))}
              </select>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="bg-slate-700 text-white rounded px-3 py-2 transition-colors hover:bg-slate-600"
              >
                {selectedFeatures.map((feature) => (
                  <option key={feature} value={feature}>
                    {feature}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-slate-900 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={400}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}