import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import JsonViewerPage from "./pages/JsonViewerPage";
import JsonComparePage from "./pages/JsonComparePage";
import HistoryPage from "./pages/HistoryPage";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [activePage, setActivePage] = useState<
    "viewer" | "compare" | "history"
  >("viewer");

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Layout activePage={activePage} setActivePage={setActivePage}>
          {activePage === "viewer" && <JsonViewerPage />}
          {activePage === "compare" && <JsonComparePage />}
          {activePage === "history" && <HistoryPage />}
        </Layout>
        <Analytics />
      </div>
    </ThemeProvider>
  );
}

export default App;
