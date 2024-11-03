// SideNavContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface SideNavContextProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNavContext = createContext<SideNavContextProps | undefined>(
  undefined
);

export const SideNavProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <SideNavContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SideNavContext.Provider>
  );
};

export const useSideNav = () => {
  const context = useContext(SideNavContext);
  if (context === undefined) {
    throw new Error('useSideNav must be used within a SideNavProvider');
  }
  return context;
};
