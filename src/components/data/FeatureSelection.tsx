import React, { useState, useEffect } from 'react';
import { Layers, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { preprocessApi } from '../../api';

interface Feature {
  name: string;
  min: number;
  max: number;
}

export function FeatureSelection() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [targetFeature, setTargetFeature] = useState<string>('');
  const [expanded, setExpanded] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await preprocessApi.getNumericalColumns();
      setFeatures(response.columns);
      
      // If we have features, select the first one by default
      if (response.columns.length > 0) {
        setSelectedFeatures([response.columns[0].name]);
      }
    } catch (err) {
      setError('Failed to fetch features');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchFeatures();
    }
  }, [expanded]);

  const handleFeatureSelect = (featureName: string) => {
    if (featureName === targetFeature) {
      setTargetFeature('');
    }
    
    setSelectedFeatures(prev => {
      if (prev.includes(featureName)) {
        return prev.filter(f => f !== featureName);
      }
      return [...prev, featureName];
    });
  };

  const handleTargetSelect = (featureName: string) => {
    if (selectedFeatures.includes(featureName)) {
      setSelectedFeatures(prev => prev.filter(f => f !== featureName));
    }
    setTargetFeature(featureName);
  };

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
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-gray-400 py-4">
              Loading features...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="text-white font-medium">Select Features</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {features.map((feature) => (
                    <div
                      key={feature.name}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={feature.name}
                          checked={selectedFeatures.includes(feature.name)}
                          onChange={() => handleFeatureSelect(feature.name)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          disabled={feature.name === targetFeature}
                        />
                        <label htmlFor={feature.name} className="text-gray-300">
                          {feature.name}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          Range: {feature.min.toFixed(2)} - {feature.max.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-medium">Select Target Variable</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {features.map((feature) => (
                    <div
                      key={feature.name}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        targetFeature === feature.name
                          ? 'bg-purple-600/20 border-purple-600 border'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                      onClick={() => handleTargetSelect(feature.name)}
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
                          Range: {feature.min.toFixed(2)} - {feature.max.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(selectedFeatures.length > 0 || targetFeature) && (
            <div className="bg-slate-800 p-4 rounded-lg space-y-4">
              <div className="space-y-2">
                <h4 className="text-white font-medium">Selected Features:</h4>
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
              {targetFeature && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Target Variable:</h4>
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {targetFeature}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}