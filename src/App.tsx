import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './views/DashboardView';
import { KnowledgeView } from './views/KnowledgeView';
import { LeadsView } from './views/LeadsView';
import { OutreachView } from './views/OutreachView';
import { InboxView } from './views/InboxView';
import { ComplianceView } from './views/ComplianceView';
import { SettingsView } from './views/SettingsView';
import { MOCK_BUSINESSES } from './data/mock';
import { AppProvider } from './context/AppContext';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeBusinessId, setActiveBusinessId] = useState(MOCK_BUSINESSES[0].id);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView businessId={activeBusinessId} />;
      case 'knowledge':
        return <KnowledgeView businessId={activeBusinessId} />;
      case 'leads':
        return <LeadsView businessId={activeBusinessId} />;
      case 'outreach':
        return <OutreachView businessId={activeBusinessId} />;
      case 'inbox':
        return <InboxView businessId={activeBusinessId} />;
      case 'compliance':
        return <ComplianceView businessId={activeBusinessId} />;
      case 'settings':
        return <SettingsView businessId={activeBusinessId} />;
      default:
        return <DashboardView businessId={activeBusinessId} />;
    }
  };

  return (
    <AppProvider>
      <Layout
        activeView={activeView}
        setActiveView={setActiveView}
        activeBusinessId={activeBusinessId}
        setActiveBusinessId={setActiveBusinessId}
      >
        {renderView()}
      </Layout>
    </AppProvider>
  );
}
