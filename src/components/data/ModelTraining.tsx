import { useState } from 'react';
import {
  Download,
  BarChart,
  Cpu,
  Search,
  Binary,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { useFeatures } from '../../Context/FeatureContext';
import { modelApi } from '../../api';

const modelTypes = {
  classification: [
    { name: 'Logistic Regression', type: 'Classification', accuracy: '85%', training_time: '2s', id: 'logistic' },
    { name: 'Decision Tree', type: 'Classification', accuracy: '82%', training_time: '3s', id: 'decision_tree' },
    { name: 'Random Forest', type: 'Classification', accuracy: '88%', training_time: '5s', id: 'random_forest' },
    { name: 'SVM', type: 'Classification', accuracy: '86%', training_time: '4s', id: 'svm' },
  ],
  regression: [
    { name: 'Linear Regression', type: 'Regression', r2_score: '0.78', training_time: '2s', id: 'linear' },
    { name: 'Decision Tree', type: 'Regression', r2_score: '0.75', training_time: '3s', id: 'decision_tree' },
    { name: 'Random Forest', type: 'Regression', r2_score: '0.82', training_time: '5s', id: 'random_forest' },
    { name: 'SVR', type: 'Regression', r2_score: '0.80', training_time: '4s', id: 'svm' },
  ],
};

export function ModelTraining() {
  const [expanded, setExpanded] = useState(true);
  const [selectedModel, setSelectedModel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modelTrained, setModelTrained] = useState(false);
  const [predictionType, setPredictionType] = useState<'classification' | 'regression'>('classification');
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedFeatures, targetFeature } = useFeatures();
  const [trainedModelData, setTrainedModelData] = useState<any>(null);

  const filteredModels = modelTypes[predictionType].filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTrain = async () => {
    if (!selectedModel || !selectedFeatures.length || !targetFeature) {
      setError('Please select a model, features, and target variable');
      return;
    }

    setIsTraining(true);
    setError(null);

    try {
      // Get split data from localStorage
      const splitData = JSON.parse(localStorage.getItem('splitData') || '{}');
      if (!splitData.X_train || !splitData.y_train) {
        throw new Error('No training data found. Please split your dataset first.');
      }

      // Initialize model
      const selectedModelConfig = modelTypes[predictionType].find(m => m.name === selectedModel);
      if (!selectedModelConfig) {
        throw new Error('Invalid model selected');
      }

      const initResponse = await modelApi.initializeModel(
        selectedModelConfig.id,
        predictionType,
        {}
      );

      if (initResponse.error) {
        throw new Error(initResponse.error);
      }

      // Train model
      const trainResponse = await modelApi.trainModel(
        splitData.X_train,
        splitData.y_train,
        selectedFeatures
      );

      if (trainResponse.error) {
        throw new Error(trainResponse.error);
      }

      setTrainedModelData({
        model_type: predictionType,
        algorithm: selectedModelConfig.id,
        features: selectedFeatures,
        target: targetFeature,
        training_samples: trainResponse.training_samples,
        features_shape: trainResponse.features_shape
      });

      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Model trained successfully with ${trainResponse.training_samples} samples and ${trainResponse.features_shape} features`
      }));

      setModelTrained(true);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to train model';
      setError(errorMessage);
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Error training model: ${errorMessage}`
      }));
    } finally {
      setIsTraining(false);
    }
  };

  const handleDownload = () => {
    if (!trainedModelData) return;

    const modelBlob = new Blob([JSON.stringify(trainedModelData, null, 2)], {
      type: 'application/json'
    });

    const url = window.URL.createObjectURL(modelBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trained_model_${trainedModelData.algorithm}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    window.dispatchEvent(new CustomEvent('console-message', {
      detail: 'Model downloaded successfully'
    }));
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-lg mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Model Training</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">Prediction Type</h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPredictionType('classification')}
                  className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-all duration-300 transform hover:scale-105 ${
                    predictionType === 'classification'
                      ? 'bg-purple-600/20 border-purple-600 border'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <Binary className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">Classification</span>
                </button>
                <button
                  onClick={() => setPredictionType('regression')}
                  className={`p-4 rounded-lg flex flex-col items-center space-y-2 transition-all duration-300 transform hover:scale-105 ${
                    predictionType === 'regression'
                      ? 'bg-purple-600/20 border-purple-600 border'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <BarChart className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">Regression</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Select Algorithm</h4>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search algorithms..."
                  className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredModels.map((model) => (
                  <div
                    key={model.name}
                    onClick={() => setSelectedModel(model.name)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                      selectedModel === model.name
                        ? 'bg-purple-600/20 border-purple-600 border'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-300">{model.name}</span>
                        <span className="text-sm text-gray-400 ml-2">
                          ({model.type})
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">
                          {predictionType === 'classification'
                            ? `Accuracy: ${model.accuracy}`
                            : `R²: ${model.r2_score}`}
                        </span>
                        <span className="text-sm text-gray-400">
                          {model.training_time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTrain}
              disabled={!selectedModel || isTraining || !selectedFeatures.length || !targetFeature}
              className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isTraining ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Training Model...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5" />
                  <span>Train Model</span>
                </>
              )}
            </button>

            {modelTrained && trainedModelData && (
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Model</span>
              </button>
            )}
          </div>

          {modelTrained && trainedModelData && (
            <div className="bg-slate-800 p-4 rounded-lg space-y-2">
              <h4 className="text-white font-medium">Training Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <span className="text-gray-400">Samples</span>
                  <p className="text-xl font-bold text-white">{trainedModelData.training_samples}</p>
                </div>
                <div className="bg-slate-700 p-3 rounded-lg">
                  <span className="text-gray-400">Features</span>
                  <p className="text-xl font-bold text-white">{trainedModelData.features_shape}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}