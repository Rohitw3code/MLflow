import { useState } from 'react';
import { Split, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { preprocessApi } from '../../api';
import { useFeatures } from '../../Context/FeatureContext';

export function TrainTestSplit() {
  const [splitRatio, setSplitRatio] = useState(0.2);
  const [stratify, setStratify] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [randomState, setRandomState] = useState(42);
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [splitInfo, setSplitInfo] = useState<any>(null);

  const { selectedFeatures, targetFeature } = useFeatures();

  const handleSplitDataset = async () => {
    if (selectedFeatures.length === 0) {
      setError('Please select features for training in the Feature Selection section above');
      return;
    }

    if (!targetFeature) {
      setError('Please select a target variable in the Feature Selection section above');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await preprocessApi.splitDataset({
        test_size: splitRatio,
        random_state: randomState,
        shuffle: shuffle,
        stratify: stratify,
        features: selectedFeatures,
        target: targetFeature
      });
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Save split data to localStorage
      localStorage.setItem('splitData', JSON.stringify({
        X_train: response.X_train,
        X_test: response.X_test,
        y_train: response.y_train,
        y_test: response.y_test,
        features: response.features,
        target: response.target
      }));

      setSplitInfo(response);
      setSuccess(true);
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Dataset split successfully - Training: ${response.train_size} samples, Test: ${response.test_size} samples`
      }));

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to split dataset');
      setSuccess(false);
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
          <Split className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Train-Test Split</h3>
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
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Test Size: {splitRatio * 100}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={splitRatio}
                  onChange={(e) => setSplitRatio(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={stratify}
                    onChange={(e) => setStratify(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Stratify</span>
                </label>

                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={shuffle}
                    onChange={(e) => setShuffle(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Shuffle</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Random State
                </label>
                <input
                  type="number"
                  value={randomState}
                  onChange={(e) => setRandomState(parseInt(e.target.value))}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2"
                />
              </div>

              <button
                onClick={handleSplitDataset}
                disabled={isLoading || selectedFeatures.length === 0 || !targetFeature}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Splitting Dataset...</span>
                ) : (
                  <>
                    <Split className="w-4 h-4" />
                    <span>Split Dataset</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Training Set: {((1 - splitRatio) * 100).toFixed(0)}%</span>
              <span>Test Set: {(splitRatio * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(1 - splitRatio) * 100}%` }}
              />
            </div>
          </div>

          {success && splitInfo && (
            <div className="mt-4 bg-green-500/10 text-green-400 p-4 rounded-lg flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>Dataset split successfully!</p>
                <p className="text-sm">
                  Training set: {splitInfo.train_size} samples ({((1 - splitRatio) * 100).toFixed(1)}%)
                  <br />
                  Test set: {splitInfo.test_size} samples ({(splitRatio * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          )}

          {selectedFeatures.length > 0 && targetFeature && (
            <div className="bg-slate-800 p-4 rounded-lg space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Selected Features</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Target Variable</h4>
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  {targetFeature}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
