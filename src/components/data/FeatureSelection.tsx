import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Target } from 'lucide-react';

// Dummy data for features
const dummyFeatures = [
  { name: 'Age', type: 'numeric', importance: 0.85 },
  { name: 'Income', type: 'numeric', importance: 0.92 },
  { name: 'Score', type: 'numeric', importance: 0.78 },
  { name: 'Category', type: 'categorical', importance: 0.65 },
  { name: 'Status', type: 'categorical', importance: 0.71 },
];

export function FeatureSelection() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [targetFeature, setTargetFeature] = useState<string>('');
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center space-x-3">
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Feature Selection
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-white font-medium">Select Features</h4>
              <div className="space-y-2">
                {dummyFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={feature.name}
                        checked={selectedFeatures.includes(feature.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFeatures([
                              ...selectedFeatures,
                              feature.name,
                            ]);
                          } else {
                            setSelectedFeatures(
                              selectedFeatures.filter((f) => f !== feature.name)
                            );
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor={feature.name} className="text-gray-300">
                        {feature.name}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {feature.type}
                      </span>
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${feature.importance * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Select Target Variable</h4>
              <div className="space-y-2">
                {dummyFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      targetFeature === feature.name
                        ? 'bg-purple-600/20 border-purple-600 border'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    onClick={() => setTargetFeature(feature.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target
                          className={`w-4 h-4 ${
                            targetFeature === feature.name
                              ? 'text-purple-400'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="text-gray-300">{feature.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {feature.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
