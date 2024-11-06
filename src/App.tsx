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
import { CodeGeneration } from './components/CodeGeneration';
import { Code2, BarChart2, Terminal } from 'lucide-react';
import { DataPreview } from './components/data/DataPreview';

export function App() {
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>('dashboard');
  const [showRightSidebar, setShowRightSidebar] = React.useState(false);
  const [showCodeGeneration, setShowCodeGeneration] = React.useState(false);
  const [showDataPreview, setShowDataPreview] = React.useState(false);

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
              <DashboardNav onMenuClick={() => setShowMobileMenu(!showMobileMenu)} />
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

              {/* Floating Action Buttons */}
              <div className="fixed right-6 bottom-24 flex flex-col items-center gap-6">
                <button
                  onClick={() => setShowCodeGeneration(true)}
                  className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                  title="Generate Code"
                >
                  <Code2 className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setShowDataPreview(true)}
                  className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                  title="Data Preview"
                >
                  <BarChart2 className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setShowRightSidebar(!showRightSidebar)}
                  className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                  title="Data Console"
                >
                  <Terminal className="w-6 h-6" />
                </button>
              </div>

              <ConsoleMessages />
              <CodeGeneration 
                isOpen={showCodeGeneration}
                onClose={() => setShowCodeGeneration(false)}
              />
              {showDataPreview && (
                <DataPreview
                  data={[]} // Pass your actual data here
                  selectedFeatures={[]} // Pass your selected features here
                  onClose={() => setShowDataPreview(false)}
                />
              )}
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