import { useState, useEffect } from 'react';
import {
  Target,
  TestTube,
  BarChart2,
  Search,
  PieChart,
  ChevronDown,
  ChevronUp,
  AlertCircle,
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
import { modelApi } from '../../api';

interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  mse?: number;
  rmse?: number;
  mae?: number;
  r2?: number;
  confusion_matrix?: number[][];
  predictions?: number[];
  actual?: number[];
}

export function ModelTesting() {
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [predictionData, setPredictionData] = useState<any[]>([]);

  const handleTest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get split data from localStorage
      const splitData = JSON.parse(localStorage.getItem('splitData') || '{}');
      if (!splitData.X_test || !splitData.y_test) {
        throw new Error('No test data found. Please split your dataset first.');
      }

      const response = await modelApi.evaluateModel(
        splitData.X_test,
        splitData.y_test,
        splitData.features
      );
      
      if (response.error) {
        throw new Error(response.error);
      }

      setMetrics(response.metrics);
      
      // Create prediction vs actual data for visualization
      if (response.metrics.predictions && response.metrics.actual) {
        const vizData = response.metrics.predictions.map((pred: number, i: number) => ({
          id: i + 1,
          predicted: pred,
          actual: response.metrics.actual[i],
          residual: response.metrics.actual[i] - pred
        }));
        setPredictionData(vizData);
      }

      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Model evaluation complete. ${
          response.metrics.accuracy 
            ? `Accuracy: ${(response.metrics.accuracy * 100).toFixed(2)}%`
            : `R² Score: ${response.metrics.r2?.toFixed(3)}`
        }`
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to evaluate model';
      setError(errorMessage);
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Error evaluating model: ${errorMessage}`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfusionMatrix = () => {
    if (!metrics?.confusion_matrix) return null;

    const total = metrics.confusion_matrix.reduce(
      (sum, row) => sum + row.reduce((a, b) => a + b, 0),
      0
    );

    return (
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
              <br />
              <span className="text-xs">
                {((value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))
        )}
      </div>
    );
  };

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
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleTest}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Testing Model...</span>
              </>
            ) : (
              <>
                <TestTube className="w-5 h-5" />
                <span>Test Model</span>
              </>
            )}
          </button>

          {metrics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.accuracy && (
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
                )}

                {metrics.precision && (
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
                )}

                {metrics.r2 !== undefined && (
                  <div className="bg-slate-800 p-4 rounded-lg flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/20 rounded-full">
                      <BarChart2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400">R² Score</p>
                      <p className="text-2xl font-bold text-white">
                        {metrics.r2.toFixed(3)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {metrics.confusion_matrix && (
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-4">Confusion Matrix</h4>
                  {renderConfusionMatrix()}
                </div>
              )}

              {predictionData.length > 0 && (
                <>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-4">Predicted vs Actual Values</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                          <Scatter name="Predictions" data={predictionData} fill="#8884d8" />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            data={[
                              { actual: Math.min(...predictionData.map(d => d.actual)), predicted: Math.min(...predictionData.map(d => d.actual)) },
                              { actual: Math.max(...predictionData.map(d => d.actual)), predicted: Math.max(...predictionData.map(d => d.actual)) }
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
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                          <Scatter name="Residuals" data={predictionData} fill="#82ca9d" />
                          <Line
                            type="monotone"
                            data={[
                              { predicted: Math.min(...predictionData.map(d => d.predicted)), residual: 0 },
                              { predicted: Math.max(...predictionData.map(d => d.predicted)), residual: 0 }
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
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}