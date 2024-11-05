import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { SideNav } from './components/SideNav';
import { DashboardNav } from './components/DashboardNav';
import { Dashboard } from './components/Dashboard';
import { DataScience } from './Tools/DataScience';
import { SideNavProvider } from './Context/SideNavContext';
import { FeatureProvider } from './Context/FeatureContext';
import { RightSidebar } from './components/RightSidebar';
import { FloatingButton } from './components/FloatingButton';
import { CustomCursor } from './components/CustomCursor';
import { ConsoleMessages } from './components/ConsoleMessages';

export function App() {
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(
    'dashboard'
  );
  const [showRightSidebar, setShowRightSidebar] = React.useState(false);

  const handleStartClick = () => {
    setShowDashboard(true);
  };

  const handleSectionChange = (section: string | null) => {
    setActiveSection(section);
  };

  return (
    <SideNavProvider>
      <FeatureProvider>
        <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${!showDashboard ? 'custom-cursor' : ''}`}>
          <CustomCursor />
          {showDashboard ? (
            <>
              <DashboardNav
                onMenuClick={() => setShowMobileMenu(!showMobileMenu)}
              />
              <div className="flex justify-around">
                <SideNav
                  isOpen={showMobileMenu}
                  onClose={() => setShowMobileMenu(false)}
                  onSectionChange={handleSectionChange}
                />
                {activeSection === 'dashboard' && <Dashboard />}
                {activeSection === 'data-science' && <DataScience />}
                <RightSidebar 
                  isOpen={showRightSidebar} 
                  onClose={() => setShowRightSidebar(false)} 
                />
              </div>
              <FloatingButton onClick={() => setShowRightSidebar(!showRightSidebar)} />
              <ConsoleMessages />
            </>
          ) : (
            <>
              <Navbar onMenuClick={() => setShowMobileMenu(!showMobileMenu)} />
              <main className="relative">
                <Hero onStartClick={handleStartClick} />
                <Features />
              </main>
            </>
          )}
        </div>
      </FeatureProvider>
    </SideNavProvider>
  );
}