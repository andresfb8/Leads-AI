import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './views/DashboardView';
import { KnowledgeView } from './views/KnowledgeView';
import { LeadsView } from './views/LeadsView';
import { OutreachView } from './views/OutreachView';
import { InboxView } from './views/InboxView';
import { ComplianceView } from './views/ComplianceView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { isFirebaseConfigured } from './lib/firebase';

function AppShell() {
  const { user, isDemoMode, isLoading, businesses } = useAuthContext();
  const { syncBusinessFromFirebase: syncBusiness } = useAppContext();

  const isAuthenticated = isDemoMode || Boolean(user);
  const defaultBusinessId = businesses[0]?.id ?? 'b_1';

  const [activeView, setActiveView] = useState('dashboard');
  const [activeBusinessId, setActiveBusinessId] = useState(defaultBusinessId);

  // Keep activeBusinessId in sync if businesses load asynchronously
  useEffect(() => {
    if (businesses.length > 0 && !businesses.find(b => b.id === activeBusinessId)) {
      setActiveBusinessId(businesses[0].id);
    }
  }, [businesses]);

  // When business changes and Firebase is configured, load its data
  useEffect(() => {
    if (isFirebaseConfigured && user) {
      syncBusiness(activeBusinessId);
    }
  }, [activeBusinessId, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-sm animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView businessId={activeBusinessId} />;
      case 'knowledge': return <KnowledgeView businessId={activeBusinessId} />;
      case 'leads':     return <LeadsView businessId={activeBusinessId} />;
      case 'outreach':  return <OutreachView businessId={activeBusinessId} />;
      case 'inbox':     return <InboxView businessId={activeBusinessId} />;
      case 'compliance':return <ComplianceView businessId={activeBusinessId} />;
      case 'settings':  return <SettingsView businessId={activeBusinessId} />;
      default:          return <DashboardView businessId={activeBusinessId} />;
    }
  };

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      activeBusinessId={activeBusinessId}
      setActiveBusinessId={setActiveBusinessId}
      businesses={businesses}
    >
      {renderView()}
    </Layout>
  );
}

function AppWithAuth() {
  const { isDemoMode } = useAuthContext();
  return (
    <AppProvider isDemoMode={isDemoMode}>
      <AppShell />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}
