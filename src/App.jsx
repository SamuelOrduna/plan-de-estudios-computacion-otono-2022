import React from 'react';
import { PlanProvider } from './context/PlanContext';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { DetailsPanel } from './components/DetailsPanel';
import { usePlan } from './hooks/usePlan';
import './App.css';

function AppContent() {
  const { selectedSubject } = usePlan();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <MainContent />
      {selectedSubject && <DetailsPanel />}
    </div>
  );
}

function App() {
  return (
    <PlanProvider>
      <AppContent />
    </PlanProvider>
  );
}

export default App;
