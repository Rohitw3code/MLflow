import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FeatureContextType {
  selectedFeatures: string[];
  targetFeature: string;
  setSelectedFeatures: (features: string[]) => void;
  setTargetFeature: (feature: string) => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [targetFeature, setTargetFeature] = useState<string>('');

  return (
    <FeatureContext.Provider
      value={{
        selectedFeatures,
        targetFeature,
        setSelectedFeatures,
        setTargetFeature,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
}