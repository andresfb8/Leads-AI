import React from 'react';
import { LayoutDashboard, Users, Send, Settings, BookOpen, Inbox, LogOut, CheckSquare, Briefcase } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { MOCK_BUSINESSES } from '@/src/data/mock';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  activeBusinessId: string;
  setActiveBusinessId: (id: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'knowledge', label: 'Negocio e ICP', icon: BookOpen },
  { id: 'leads', label: 'Leads y CRM', icon: Users },
  { id: 'outreach', label: 'Alcance y Borradores', icon: Send },
  { id: 'inbox', label: 'Bandeja de Entrada', icon: Inbox },
  { id: 'compliance', label: 'Cumplimiento', icon: CheckSquare },
];

export function Layout({ children, activeView, setActiveView, activeBusinessId, setActiveBusinessId }: LayoutProps) {
  const activeBusiness = MOCK_BUSINESSES.find(b => b.id === activeBusinessId) || MOCK_BUSINESSES[0];

  return (
    <div className="flex h-screen w-full bg-[#F1F3F5] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#1E293B] text-white flex flex-col border-r border-slate-200">
        <div className="p-6 pb-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-blue-400">AI SDR <span className="text-white font-light">v1.0</span></h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Prospección Personal</p>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-2 border border-slate-700 hover:border-slate-600 transition-colors">
            <Briefcase size={16} className="text-blue-400 shrink-0 mx-1" />
            <select 
              value={activeBusinessId}
              onChange={(e) => setActiveBusinessId(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer appearance-none"
              title="Select Business"
            >
              {MOCK_BUSINESSES.map(b => (
                <option key={b.id} value={b.id} className="text-slate-900 bg-white">{b.name}</option>
              ))}
            </select>
            <div className="pointer-events-none text-slate-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase px-2 mb-2 mt-2">Estrategia y Ejecución</div>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    activeView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button 
            onClick={() => setActiveView('settings')}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-4",
              activeView === 'settings' ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Settings size={18} />
            <span>Ajustes</span>
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-medium text-white">Andres</p>
              <p className="text-[10px] text-slate-400">Plan Gratuito</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold capitalize">{navItems.find((i) => i.id === activeView)?.label || activeView}</h2>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Sistema Activo</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
