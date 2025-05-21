import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import JsonViewerPage from './pages/JsonViewerPage';
import JsonComparePage from './pages/JsonComparePage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const [activePage, setActivePage] = useState<'viewer' | 'compare' | 'history'>('viewer');

  return (
    <ThemeProvider>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {activePage === 'viewer' && <JsonViewerPage />}
        {activePage === 'compare' && <JsonComparePage />}
        {activePage === 'history' && <HistoryPage />}
      </Layout>
    </ThemeProvider>
  );
}

export default App;