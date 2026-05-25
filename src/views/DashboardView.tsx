import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '@/src/context/AppContext';

export function DashboardView({ businessId }: { businessId: string }) {
  const { getLeads, getDrafts, getInbox } = useAppContext();
  const leads = getLeads(businessId);
  const drafts = getDrafts(businessId);
  const inbox = getInbox(businessId);

  const contacted = leads.filter(l =>
    ['Contactado', 'Respondido', 'Reunión Agendada'].includes(l.status)
  );
  const replied = leads.filter(l =>
    ['Respondido', 'Reunión Agendada'].includes(l.status)
  );
  const meetings = leads.filter(l => l.status === 'Reunión Agendada');
  const enriched = leads.filter(l => l.status !== 'Nuevo');
  const replyRate =
    contacted.length > 0
      ? ((replied.length / contacted.length) * 100).toFixed(1) + '%'
      : '—';

  const pendingDrafts = drafts.filter(d => d.status === 'Borrador');
  const unreadInbox = inbox.filter(m => !m.isRead);

  const funnelData = [
    { name: 'Leads', value: leads.length },
    { name: 'Enriquecidos', value: enriched.length },
    { name: 'Contactados', value: contacted.length },
    { name: 'Respuestas', value: replied.length },
    { name: 'Reuniones', value: meetings.length },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 shrink-0">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Leads Totales</p>
          <p className="text-2xl font-bold">{leads.length}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">
            {enriched.length} enriquecidos
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Tasa de Respuesta</p>
          <p className="text-2xl font-bold">{replyRate}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {replied.length} de {contacted.length} contactados
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Reuniones Agendadas</p>
          <p className="text-2xl font-bold">{meetings.length}</p>
          <p className="text-[10px] text-blue-600 font-medium mt-1">
            {pendingDrafts.length} borradores pendientes
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Bandeja Sin Leer</p>
          <p className="text-2xl font-bold">{unreadInbox.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">{inbox.length} respuestas totales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-40 flex-1">
        {/* Funnel Chart */}
        <Card className="lg:col-span-8 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Embudo de Conversión</CardTitle>
          </CardHeader>
          <CardContent className="pl-4 pb-4 pr-10 pt-4 flex-1">
            {leads.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                Aún no hay leads para este negocio.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '10px',
                    }}
                  />
                  <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex-1">
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-4 tracking-widest">
              Actividad Reciente
            </h3>
            {leads.length === 0 ? (
              <p className="text-xs text-slate-400">Sin actividad todavía.</p>
            ) : (
              <div className="space-y-3">
                {leads
                  .filter(l => l.lastAction)
                  .slice(0, 5)
                  .map(lead => (
                    <div key={lead.id} className="flex gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 text-[10px]">
                        {lead.name[0]}
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">{lead.name}</span>
                        <span className="text-slate-500"> · {lead.lastAction}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Upcoming meetings */}
          <div className="bg-[#1E293B] text-white p-5 rounded-xl border border-slate-800 shadow-lg shrink-0">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">
              Próximas Reuniones
            </h3>
            {meetings.length === 0 ? (
              <p className="text-xs text-slate-500">No hay reuniones agendadas aún.</p>
            ) : (
              <div className="space-y-4">
                {meetings.slice(0, 2).map((lead, i) => (
                  <div key={lead.id} className={`flex gap-4 ${i > 0 ? 'opacity-60' : ''}`}>
                    <div className="text-center shrink-0">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Próx.</p>
                      <p className="text-lg font-bold">—</p>
                    </div>
                    <div className="flex-1 border-l border-slate-700 pl-4">
                      <p className="text-xs font-bold">{lead.name}</p>
                      <p className="text-[10px] text-slate-400">{lead.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
