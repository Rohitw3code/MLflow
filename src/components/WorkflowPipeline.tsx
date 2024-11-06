import React, { useState } from 'react';
import {
  Database,
  FileInput,
  AlertCircle,
  Code2,
  Split,
  Cpu,
  TestTube,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useSideNav } from '../Context/SideNavContext';

interface WorkflowStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  component: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'load',
    icon: <Database className="w-5 h-5" />,
    title: 'Load Dataset',
    description: 'Import your training data',
    component: 'DataUpload',
  },
  {
    id: 'preprocess',
    icon: <FileInput className="w-5 h-5" />,
    title: 'Data Preprocessing',
    description: 'Clean and prepare your data',
    component: 'DataTable',
  },
  {
    id: 'missing',
    icon: <AlertCircle className="w-5 h-5" />,
    title: 'Missing Data',
    description: 'Handle missing values',
    component: 'MissingValues',
  },
  {
    id: 'encoding',
    icon: <Code2 className="w-5 h-5" />,
    title: 'Data Encoding',
    description: 'Encode categorical variables',
    component: 'DataEncoding',
  },
  {
    id: 'split',
    icon: <Split className="w-5 h-5" />,
    title: 'Train-Test Split',
    description: 'Split your dataset',
    component: 'TrainTestSplit',
  },
  {
    id: 'train',
    icon: <Cpu className="w-5 h-5" />,
    title: 'Train',
    description: 'Train your model',
    component: 'ModelTraining',
  },
  {
    id: 'test',
    icon: <TestTube className="w-5 h-5" />,
    title: 'Test',
    description: 'Evaluate model performance',
    component: 'ModelTesting',
  },
  {
    id: 'predict',
    icon: <PlayCircle className="w-5 h-5" />,
    title: 'Predict',
    description: 'Make predictions',
    component: 'Predictions',
  },
];

interface WorkflowStepProps extends WorkflowStep {
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  isLast: boolean;
}

function WorkflowStepComponent({
  icon,
  title,
  description,
  isActive,
  isCompleted,
  onClick,
  isLast,
}: WorkflowStepProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`w-full flex items-start p-3 space-x-2 transition-colors ${
          isActive
            ? 'bg-purple-600/20 border-r-2 border-purple-600'
            : 'hover:bg-white/5'
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${
            isCompleted
              ? 'bg-green-500/20 text-green-400'
              : isActive
              ? 'bg-purple-500/20 text-purple-400'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3
            className={`font-medium text-sm ${
              isActive ? 'text-white' : 'text-gray-300'
            }`}
          >
            {title}
          </h3>
          <p className="text-xs text-gray-400 hidden md:block">{description}</p>
        </div>
      </button>

      {!isLast && (
        <div className="absolute left-7 top-12 bottom-0 w-0.5 bg-gray-700 hidden md:block" />
      )}
    </div>
  );
}

interface WorkflowPipelineProps {
  onStepClick: (id: string) => void;
}

export function WorkflowPipeline({ onStepClick }: WorkflowPipelineProps) {
  const [activeStep, setActiveStep] = useState<string>('load');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isSubNavCollapsed, setIsSubNavCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCollapsed } = useSideNav();

  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId);
    if (!completedSteps.has(stepId)) {
      setCompletedSteps(new Set([...completedSteps, stepId]));
    }
    onStepClick(stepId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-4 right-4 md:hidden z-50 bg-purple-600 p-3 rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 bg-slate-800 z-50 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        <div className="overflow-y-auto p-4">
          {workflowSteps.map((step, index) => (
            <WorkflowStepComponent
              key={step.id}
              {...step}
              isActive={activeStep === step.id}
              isCompleted={completedSteps.has(step.id)}
              onClick={() => handleStepClick(step.id)}
              isLast={index === workflowSteps.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`fixed top-16 mr-2 bg-slate-800 h-[calc(100vh-64px)] z-30 transition-all duration-300 hidden md:block
        ${isSubNavCollapsed ? 'w-12' : 'w-64'} 
        ${isCollapsed ? 'left-16' : 'left-64'}`}
      >
        {isSubNavCollapsed ? (
          <div className="h-full flex flex-col items-center py-4 bg-gradient-to-b from-purple-600/20 via-slate-800 to-slate-800">
            <button
              onClick={() => setIsSubNavCollapsed(false)}
              className="text-gray-400 hover:text-white mb-2"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-white font-semibold text-sm">Workflow</h2>
              <button
                onClick={() => setIsSubNavCollapsed(true)}
                className="text-gray-400 hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {workflowSteps.map((step, index) => (
                <WorkflowStepComponent
                  key={step.id}
                  {...step}
                  isActive={activeStep === step.id}
                  isCompleted={completedSteps.has(step.id)}
                  onClick={() => handleStepClick(step.id)}
                  isLast={index === workflowSteps.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WorkflowPipeline;