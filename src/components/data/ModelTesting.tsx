import { useState } from 'react';
import {
  Target,
  TestTube,
  BarChart2,
  Search,
  PieChart,
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
  ScatterChart,
  Scatter,
} from 'recharts';

export function ModelTesting() {
  const [expanded, setExpanded] = useState(true);

  // Dummy metrics data
  const metrics = {
    accuracy: 0.95,
    precision: 0.93,
    recall: 0.94,
    f1: 0.935,
    confusion_matrix: [
      [45, 5],
      [3, 47],
    ],
  };

  // Dummy prediction vs actual data
  const predictionData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    actual: Math.random() * 100,
    predicted: Math.random() * 100 + Math.random() * 10 - 5, // Add some noise
  }));

  // Calculate R-squared
  const calculateR2 = () => {
    const actualMean = predictionData.reduce((sum, d) => sum + d.actual, 0) / predictionData.length;
    const totalSS = predictionData.reduce((sum, d) => sum + Math.pow(d.actual - actualMean, 2), 0);
    const residualSS = predictionData.reduce((sum, d) => sum + Math.pow(d.actual - d.predicted, 2), 0);
    return 1 - (residualSS / totalSS);
  };

  const r2Score = calculateR2();

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center space-x-3">
          <TestTube className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Model Testing</h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400">Accuracy</p>
                <p className="text-2xl font-bold text-white">
                  {(metrics.accuracy * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <PieChart className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400">Precision</p>
                <p className="text-2xl font-bold text-white">
                  {(metrics.precision * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <BarChart2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400">R² Score</p>
                <p className="text-2xl font-bold text-white">
                  {r2Score.toFixed(3)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-4">Confusion Matrix</h4>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
              {metrics.confusion_matrix.map((row, i) =>
                row.map((value, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`p-4 rounded-lg text-center ${
                      i === j
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    <span className="text-lg font-bold">{value}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-4">Predicted vs Actual Values</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="actual" 
                    name="Actual" 
                    type="number"
                    label={{ value: 'Actual Values', position: 'bottom', fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    dataKey="predicted" 
                    name="Predicted" 
                    type="number"
                    label={{ value: 'Predicted Values', angle: -90, position: 'left', fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Legend />
                  <Scatter
                    name="Predictions"
                    data={predictionData}
                    fill="#8884d8"
                  />
                  {/* Perfect prediction line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    data={[
                      { actual: 0, predicted: 0 },
                      { actual: 100, predicted: 100 },
                    ]}
                    stroke="#FF0000"
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                    name="Perfect Prediction"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-4">Residual Plot</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="predicted" 
                    name="Predicted" 
                    type="number"
                    label={{ value: 'Predicted Values', position: 'bottom', fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    dataKey="residual" 
                    name="Residual" 
                    type="number"
                    label={{ value: 'Residuals', angle: -90, position: 'left', fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Legend />
                  <Scatter
                    name="Residuals"
                    data={predictionData.map(d => ({
                      predicted: d.predicted,
                      residual: d.actual - d.predicted
                    }))}
                    fill="#82ca9d"
                  />
                  <Line
                    type="monotone"
                    data={[
                      { predicted: 0, residual: 0 },
                      { predicted: 100, residual: 0 },
                    ]}
                    stroke="#FF0000"
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                    name="Zero Line"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}