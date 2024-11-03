import { useState } from 'react';
import { Split, ChevronDown, ChevronUp } from 'lucide-react';

export function TrainTestSplit() {
  const [splitRatio, setSplitRatio] = useState(0.2);
  const [stratify, setStratify] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [randomState, setRandomState] = useState(42);
  const [expanded, setExpanded] = useState(true);

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

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Split className="w-4 h-4" />
                <span>Split Dataset</span>
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
        </div>
      )}
    </div>
  );
}

export default TrainTestSplit;
