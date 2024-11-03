import React, { useState } from 'react';
import { Table, BarChart2, X, Save, Download } from 'lucide-react';
import { DataPreview } from './data/DataPreview';
import { useLocation } from '../hooks/useLocation';

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  const [showVisualization, setShowVisualization] = useState(false);
  const location = useLocation();

  // Only show in data science tool
  if (!location.includes('data-science')) {
    return null;
  }

  // Dummy data for visualization with more realistic column names
  const data = [
    { timestamp: '2024-01', sales: 4000, revenue: 2400, profit: 2400, customer_satisfaction: 4.5, churn_rate: 0.12 },
    { timestamp: '2024-02', sales: 3000, revenue: 1398, profit: 2210, customer_satisfaction: 4.2, churn_rate: 0.15 },
    { timestamp: '2024-03', sales: 2000, revenue: 9800, profit: 2290, customer_satisfaction: 4.7, churn_rate: 0.08 },
    { timestamp: '2024-04', sales: 2780, revenue: 3908, profit: 2000, customer_satisfaction: 4.4, churn_rate: 0.11 },
  ];

  const features = [
    'sales', 
    'revenue', 
    'profit', 
    'customer_satisfaction', 
    'churn_rate',
    'customer_lifetime_value',
    'acquisition_cost',
    'conversion_rate',
    'average_order_value',
    'monthly_recurring_revenue'
  ];

  return (
    <>
      <div className="fixed right-6 bottom-6 flex flex-col space-y-2">
        <button
          onClick={() => setShowVisualization(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          title="Data Visualization"
        >
          <BarChart2 className="w-6 h-6" />
        </button>
        <button
          onClick={onClick}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          title="Data Preview"
        >
          <Table className="w-6 h-6" />
        </button>
      </div>

      {showVisualization && (
        <DataPreview
          data={data}
          selectedFeatures={features}
          onClose={() => setShowVisualization(false)}
        />
      )}
    </>
  );
}