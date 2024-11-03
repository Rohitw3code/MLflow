import { useState } from 'react';
import { PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function Predictions() {
  const [expanded, setExpanded] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [features, setFeatures] = useState({
    feature1: '',
    feature2: '',
    feature3: '',
  });

  const handlePredict = async () => {
    // Simulate prediction
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPrediction(Math.random());
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center space-x-3">
          <PlayCircle className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Make Predictions</h3>
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
            {Object.keys(features).map((feature) => (
              <div key={feature} className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  {feature}
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                  value={features[feature as keyof typeof features]}
                  onChange={(e) =>
                    setFeatures({ ...features, [feature]: e.target.value })
                  }
                  placeholder="Enter value"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handlePredict}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Make Prediction</span>
          </button>

          {prediction !== null && (
            <div className="bg-slate-800 p-4 rounded-lg text-center animate-fadeIn">
              <h4 className="text-white font-medium mb-2">Prediction Result</h4>
              <p className="text-2xl font-bold text-purple-400">
                {prediction.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
