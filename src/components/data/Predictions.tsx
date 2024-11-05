import { useState, useEffect } from 'react';
import { PlayCircle, ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';
import { modelApi } from '../../api';
import { useFeatures } from '../../Context/FeatureContext';

export function Predictions() {
  const [expanded, setExpanded] = useState(true);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedFeatures } = useFeatures();
  const [featureRanges, setFeatureRanges] = useState<Record<string, { min: number; max: number }>>({});

  useEffect(() => {
    // Get feature ranges from localStorage
    const splitData = JSON.parse(localStorage.getItem('splitData') || '{}');
    if (splitData.X_train && splitData.X_train.length > 0) {
      const ranges: Record<string, { min: number; max: number }> = {};
      selectedFeatures.forEach(feature => {
        const values = splitData.X_train.map((row: any) => row[feature]);
        ranges[feature] = {
          min: Math.min(...values),
          max: Math.max(...values)
        };
      });
      setFeatureRanges(ranges);
    }
  }, [selectedFeatures]);

  const handleInputChange = (feature: string, value: string) => {
    const numValue = value === '' ? '' : Number(value);
    setInputValues(prev => ({
      ...prev,
      [feature]: numValue
    }));
  };

  const handlePredict = async () => {
    setError(null);
    setIsLoading(true);

    // Validate all inputs are provided
    const missingInputs = selectedFeatures.filter(feature => inputValues[feature] === undefined || inputValues[feature] === '');
    if (missingInputs.length > 0) {
      setError(`Please provide values for: ${missingInputs.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      const features = [selectedFeatures.map(feature => inputValues[feature])];
      const response = await modelApi.predict(features,selectedFeatures);
      
      if (response.error) {
        throw new Error(response.error);
      }

      setPrediction(response.predictions[0]);
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Prediction made successfully: ${response.predictions[0]}`
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to make prediction';
      setError(errorMessage);
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Error making prediction: ${errorMessage}`
      }));
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex items-start space-x-2 mb-4">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 text-sm">
                Enter values for each feature to make a prediction. Values should be within the suggested ranges for best results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedFeatures.map((feature) => (
                <div key={feature} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {feature}
                    {featureRanges[feature] && (
                      <span className="text-xs text-gray-400 ml-2">
                        (Range: {featureRanges[feature].min.toFixed(2)} - {featureRanges[feature].max.toFixed(2)})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={inputValues[feature] || ''}
                    onChange={(e) => handleInputChange(feature, e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                    placeholder={`Enter ${feature} value`}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={isLoading || selectedFeatures.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Making Prediction...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                <span>Make Prediction</span>
              </>
            )}
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