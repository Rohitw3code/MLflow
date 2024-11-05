import React, { useState, useEffect } from 'react';
import { Layers, ChevronDown, ChevronUp, Target, Search, Check, AlertCircle } from 'lucide-react';
import { preprocessApi } from '../../api';
import { RefreshButton } from '../RefreshButton';
import { useFeatures } from '../../Context/FeatureContext';

interface Feature {
  name: string;
  type: string;
  min?: number;
  max?: number;
}

export function FeatureSelection() {
  const [expanded, setExpanded] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFixed, setIsFixed] = useState(false);

  const {
    selectedFeatures,
    targetFeature,
    setSelectedFeatures,
    setTargetFeature,
  } = useFeatures();

  const fetchFeatures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [columnTypes, numericalColumns] = await Promise.all([
        preprocessApi.getColumnTypes(),
        preprocessApi.getNumericalColumns()
      ]);

      const numericalColumnsMap = numericalColumns.columns.reduce((acc: Record<string, { min: number; max: number }>, col: any) => {
        acc[col.name] = { min: col.min, max: col.max };
        return acc;
      }, {});

      const numericFeatures = columnTypes.columns
        .filter(col => col.current_type !== 'object')
        .map(col => ({
          name: col.name,
          type: col.current_type,
          min: numericalColumnsMap[col.name]?.min,
          max: numericalColumnsMap[col.name]?.max
        }));

      setFeatures(numericFeatures);
    } catch (err) {
      setError('Failed to fetch features');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixSelection = () => {
    if (selectedFeatures.length === 0 || !targetFeature) {
      setError('Please select at least one feature and a target variable');
      return;
    }
    setIsFixed(!isFixed);
    setError(null);
    if (!isFixed) {
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Features fixed: ${selectedFeatures.length} features and target "${targetFeature}"`
      }));
    }
  };

  const filteredFeatures = features.filter(
    (feature) =>
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setExpanded(!expanded);
            if (!features.length) {
              fetchFeatures();
            }
          }}
          className="flex items-center space-x-3"
        >
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Feature Selection</h3>
        </button>
        <div className="flex items-center space-x-2">
          {expanded && <RefreshButton onClick={fetchFeatures} loading={isLoading} />}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2"
                disabled={isFixed}
              />
            </div>
            <button
              onClick={handleFixSelection}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isFixed 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white transition-colors`}
            >
              <Check className="w-4 h-4" />
              <span>{isFixed ? 'Selection Fixed' : 'Fix Selection'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium flex items-center space-x-2 sticky top-0 bg-slate-900 py-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Features</span>
              </h4>
              <div className="h-[400px] overflow-y-auto pr-2 space-y-2">
                {filteredFeatures.map((feature) => (
                  <label
                    key={feature.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedFeatures.includes(feature.name)
                        ? 'bg-purple-600/20 border-purple-600 border'
                        : 'bg-slate-800 hover:bg-slate-700'
                    } ${isFixed ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature.name)}
                        onChange={(e) => {
                          if (!isFixed) {
                            if (e.target.checked) {
                              setSelectedFeatures([...selectedFeatures, feature.name]);
                            } else {
                              setSelectedFeatures(
                                selectedFeatures.filter((f) => f !== feature.name)
                              );
                            }
                          }
                        }}
                        disabled={isFixed}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-300">{feature.name}</span>
                    </div>
                    <div className="text-sm text-purple-400">
                      <div>{feature.type}</div>
                      {feature.min !== undefined && feature.max !== undefined && (
                        <div className="text-xs text-gray-400">
                          Range: [{feature.min.toFixed(2)}, {feature.max.toFixed(2)}]
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium flex items-center space-x-2 sticky top-0 bg-slate-900 py-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Target Variable</span>
              </h4>
              <div className="h-[400px] overflow-y-auto pr-2 space-y-2">
                {filteredFeatures.map((feature) => (
                  <label
                    key={feature.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      targetFeature === feature.name
                        ? 'bg-purple-600/20 border-purple-600 border'
                        : 'bg-slate-800 hover:bg-slate-700'
                    } ${isFixed ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="target"
                        checked={targetFeature === feature.name}
                        onChange={() => !isFixed && setTargetFeature(feature.name)}
                        disabled={isFixed}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-300">{feature.name}</span>
                    </div>
                    <div className="text-sm text-purple-400">
                      <div>{feature.type}</div>
                      {feature.min !== undefined && feature.max !== undefined && (
                        <div className="text-xs text-gray-400">
                          Range: [{feature.min.toFixed(2)}, {feature.max.toFixed(2)}]
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {(selectedFeatures.length > 0 || targetFeature) && (
            <div className="bg-slate-800 p-4 rounded-lg space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Selected Features ({selectedFeatures.length})</h4>
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
                <div>
                  <h4 className="text-white font-medium mb-2">Target Variable</h4>
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