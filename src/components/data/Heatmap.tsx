import React from 'react';
import { ResponsiveContainer, Tooltip } from 'recharts';

interface HeatmapProps {
  data: any[];
  features: string[];
}

export function Heatmap({ data, features }: HeatmapProps) {
  // Calculate correlation matrix
  const correlationMatrix = features.map((feature1) =>
    features.map((feature2) => {
      if (feature1 === feature2) return 1;
      
      const values1 = data.map((d) => d[feature1]);
      const values2 = data.map((d) => d[feature2]);
      
      const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
      const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
      
      const variance1 = values1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
      const variance2 = values2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);
      
      const correlation = values1.reduce((a, b, i) => 
        a + (b - mean1) * (values2[i] - mean2), 0
      ) / Math.sqrt(variance1 * variance2);
      
      return correlation;
    })
  );

  return (
    <div className="w-full h-full p-4">
      <div className="grid" style={{ 
        gridTemplateColumns: `auto ${features.map(() => '1fr').join(' ')}`,
        gap: '2px'
      }}>
        <div /> {/* Empty corner cell */}
        {features.map((feature) => (
          <div key={feature} className="text-white text-sm rotate-45 p-2">
            {feature}
          </div>
        ))}
        
        {correlationMatrix.map((row, i) => (
          <React.Fragment key={i}>
            <div className="text-white text-sm p-2">{features[i]}</div>
            {row.map((correlation, j) => (
              <div
                key={j}
                className="aspect-square relative group"
                style={{
                  backgroundColor: `rgba(147, 51, 234, ${Math.abs(correlation)})`,
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/75 transition-opacity">
                  <span className="text-white text-xs">
                    {correlation.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}