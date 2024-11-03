import React, { useRef, useState } from 'react';
import { WorkflowPipeline } from '../components/WorkflowPipeline';
import { Maximize2 } from 'lucide-react';
import { DataUpload } from '../components/data/DataUpload';
import { DataSummary } from '../components/data/DataSummary';
import { MissingValues } from '../components/data/MissingValues';
import { DataTypeCasting } from '../components/data/DataTypeCasting';
import { DataTable } from '../components/data/DataTable';
import { DataEncoding } from '../components/data/DataEncoding';
import { DataScaling } from '../components/data/DataScaling';
import { DataVisualization } from '../components/data/DataVisualization';
import { FeatureSelection } from '../components/data/FeatureSelection';
import { DataPreview } from '../components/data/DataPreview';
import { SaveProjectDialog } from '../components/data/SaveProjectDialog';
import { TrainTestSplit } from '../components/data/TrainTestSplit';
import { ModelTraining } from '../components/data/ModelTraining';
import { ModelTesting } from '../components/data/ModelTesting';
import { Predictions } from '../components/data/Predictions';

export function DataScience() {
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cardRefs = {
    load: useRef<HTMLDivElement>(null),
    preprocess: useRef<HTMLDivElement>(null),
    missing: useRef<HTMLDivElement>(null),
    visualization: useRef<HTMLDivElement>(null),
    encoding: useRef<HTMLDivElement>(null),
    split: useRef<HTMLDivElement>(null),
    train: useRef<HTMLDivElement>(null),
    test: useRef<HTMLDivElement>(null),
    predict: useRef<HTMLDivElement>(null),
  };

  const scrollToCard = (id: string) => {
    cardRefs[id as keyof typeof cardRefs].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleDataLoaded = (data: any[], newColumns: string[]) => {
    setTableData(data);
    setColumns(newColumns);
    setSelectedFeatures(newColumns);
  };

  const handleSaveProject = (name: string) => {
    console.log('Saving project:', name);
  };

  return (
    <div className="flex-1 px-4 md:px-8 py-6 ml-12 md:ml-48">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowPreview(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Preview Data</span>
        </button>
      </div>

      <WorkflowPipeline onStepClick={scrollToCard} />

      <div className="max-w-4xl mx-auto space-y-8">
        <div ref={cardRefs.load}>
          <h2 className="text-2xl font-bold text-white mb-6">Load Dataset</h2>
          <DataUpload onDataLoaded={handleDataLoaded} setIsLoading={setIsLoading} />
        </div>

        <div ref={cardRefs.preprocess}>
          <h2 className="text-2xl font-bold text-white mb-6">
            Data Preprocessing
          </h2>
          <DataTable data={tableData} columns={columns} isLoading={isLoading} />
          <DataSummary />
        </div>

        <div ref={cardRefs.missing}>
          <h2 className="text-2xl font-bold text-white mb-6">Data Cleaning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MissingValues />
            <DataTypeCasting />
          </div>
        </div>

        <div ref={cardRefs.visualization}>
          <h2 className="text-2xl font-bold text-white mb-6">
            Data Visualization
          </h2>
          <DataVisualization />
        </div>

        <div ref={cardRefs.encoding}>
          <h2 className="text-2xl font-bold text-white mb-6">
            Feature Engineering
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataEncoding />
            <DataScaling />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Feature Selection
          </h2>
          <FeatureSelection />
        </div>

        <div ref={cardRefs.split}>
          <h2 className="text-2xl font-bold text-white mb-6">
            Train-Test Split
          </h2>
          <TrainTestSplit />
        </div>

        <div ref={cardRefs.train}>
          <h2 className="text-2xl font-bold text-white mb-6">Model Training</h2>
          <ModelTraining />
        </div>

        <div ref={cardRefs.test}>
          <h2 className="text-2xl font-bold text-white mb-6">Model Testing</h2>
          <ModelTesting />
        </div>

        <div ref={cardRefs.predict}>
          <h2 className="text-2xl font-bold text-white mb-6">
            Make Predictions
          </h2>
          <Predictions />
        </div>
      </div>

      {showPreview && (
        <DataPreview
          data={tableData || []}
          selectedFeatures={columns}
          onClose={() => setShowPreview(false)}
        />
      )}

      <SaveProjectDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}

export default DataScience;