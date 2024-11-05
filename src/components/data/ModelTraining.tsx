import { useState } from 'react';
import {
  Download,
  BarChart,
  Cpu,
  Search,
  Binary,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useFeatures } from '../../Context/FeatureContext';
import { modelApi } from '../../api';

// Extended model types with more algorithms
const modelTypes = {
  classification: [
    {
      name: 'Random Forest',
      accuracy: '94%',
      training_time: 'Fast',
      type: 'ensemble',
    },
    {
      name: 'Gradient Boosting',
      accuracy: '96%',
      training_time: 'Medium',
      type: 'ensemble',
    },
    { name: 'SVM', accuracy: '92%', training_time: 'Slow', type: 'kernel' },
    {
      name: 'Neural Network',
      accuracy: '95%',
      training_time: 'Very Slow',
      type: 'deep',
    },
    {
      name: 'Decision Tree',
      accuracy: '89%',
      training_time: 'Very Fast',
      type: 'tree',
    },
    { name: 'KNN', accuracy: '88%', training_time: 'Fast', type: 'instance' },
    {
      name: 'Naive Bayes',
      accuracy: '87%',
      training_time: 'Very Fast',
      type: 'probabilistic',
    },
    {
      name: 'XGBoost',
      accuracy: '97%',
      training_time: 'Medium',
      type: 'ensemble',
    },
  ],
  regression: [
    {
      name: 'Linear Regression',
      r2_score: '0.89',
      training_time: 'Very Fast',
      type: 'linear',
    },
    {
      name: 'Random Forest',
      r2_score: '0.93',
      training_time: 'Fast',
      type: 'ensemble',
    },
    {
      name: 'XGBoost',
      r2_score: '0.95',
      training_time: 'Medium',
      type: 'ensemble',
    },
    {
      name: 'Neural Network',
      r2_score: '0.94',
      training_time: 'Slow',
      type: 'deep',
    },
    { name: 'SVR', r2_score: '0.91', training_time: 'Medium', type: 'kernel' },
    {
      name: 'Elastic Net',
      r2_score: '0.88',
      training_time: 'Fast',
      type: 'linear',
    },
    { name: 'Lasso', r2_score: '0.87', training_time: 'Fast', type: 'linear' },
    { name: 'Ridge', r2_score: '0.86', training_time: 'Fast', type: 'linear' },
  ],
};

// Metrics for model evaluation
const evaluationMetrics = {
  classification: [
    { name: 'Accuracy', description: 'Overall correctness of predictions' },
    {
      name: 'Precision',
      description: 'Ratio of true positives to predicted positives',
    },
    {
      name: 'Recall',
      description: 'Ratio of true positives to actual positives',
    },
    { name: 'F1 Score', description: 'Harmonic mean of precision and recall' },
    { name: 'ROC AUC', description: 'Area under ROC curve' },
  ],
  regression: [
    {
      name: 'R² Score',
      description: 'Proportion of variance explained by the model',
    },
    { name: 'MSE', description: 'Mean squared error' },
    { name: 'RMSE', description: 'Root mean squared error' },
    { name: 'MAE', description: 'Mean absolute error' },
    { name: 'MAPE', description: 'Mean absolute percentage error' },
  ],
};

export function ModelTraining() {
  const [expanded, setExpanded] = useState(true);
  const [selectedModel, setSelectedModel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modelTrained, setModelTrained] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [predictionType, setPredictionType] = useState<'classification' | 'regression'>('classification');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const { selectedFeatures, targetFeature } = useFeatures();

  const filteredModels = modelTypes[predictionType].filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const simulateTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    const steps = [15, 35, 55, 75, 90, 100];
    const messages = [
      'Initializing model...',
      'Loading training data...',
      'Training model...',
      'Optimizing parameters...',
      'Validating model...',
      'Training complete!'
    ];

    for (let i = 0; i < steps.length; i++) {
      setTrainingProgress(steps[i]);
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: messages[i]
      }));
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsTraining(false);
    setModelTrained(true);
  };

  const handleTrain = async () => {
    if (!selectedModel || !selectedFeatures.length || !targetFeature) return;

    try {
      // Initialize model
      await modelApi.initializeModel(
        selectedModel.toLowerCase().replace(/\s+/g, '_'),
        predictionType,
        {}
      );

      await simulateTraining();

    } catch (error) {
      window.dispatchEvent(new CustomEvent('console-message', {
        detail: `Error training model: ${error}`
      }));
      setIsTraining(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent('Model data')
    );
    element.setAttribute('download', `trained_model_${selectedModel}.pkl`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

          {isTraining && (
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Training Progress</span>
                <span>{trainingProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
            </div>
          )}

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

            {modelTrained && (
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Model</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}