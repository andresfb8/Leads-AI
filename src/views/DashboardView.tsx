import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { MockMetrics } from '@/src/data/mock';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MailOpen, Calendar, Clock, Activity, Fingerprint } from 'lucide-react';

const funnelData = [
  { name: 'Leads Found', value: 145 },
  { name: 'Enriched', value: 120 },
  { name: 'Contacted', value: 85 },
  { name: 'Replies', value: 10 },
  { name: 'Meetings', value: 4 },
];

export function DashboardView({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 shrink-0">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Tiempo Ahorrado</p>
          <p className="text-2xl font-bold">{MockMetrics.timeSaved}</p>
          <div className="w-full bg-slate-100 h-1 mt-2 rounded-full">
            <div className="bg-blue-500 h-1 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Leads Encontrados</p>
          <p className="text-2xl font-bold">{MockMetrics.leadsFound}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">+12% vs sem. pasada</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Tasa De Respuesta</p>
          <p className="text-2xl font-bold">{MockMetrics.replyRate}</p>
          <p className="text-[10px] text-slate-400 mt-1">Objetivo: 15.0%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Reuniones Agendadas</p>
          <p className="text-2xl font-bold">{MockMetrics.meetingsBooked}</p>
          <p className="text-[10px] text-blue-600 font-medium mt-1">2 ptentes. confirmación</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-40 flex-1">
        <Card className="lg:col-span-8 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Embudo de Conversión</CardTitle>
          </CardHeader>
          <CardContent className="pl-4 pb-4 pr-10 pt-4 flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px'}} />
                <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1E293B] text-white p-5 rounded-xl border border-slate-800 shadow-lg shrink-0">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Próximas Reuniones</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Mar</p>
                  <p className="text-lg font-bold">18</p>
                </div>
                <div className="flex-1 border-l border-slate-700 pl-4">
                  <p className="text-xs font-bold">Escalando SDR con IA</p>
                  <p className="text-[10px] text-slate-400">10:30 AM • Mark Stevenson</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-60">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Jue</p>
                  <p className="text-lg font-bold">20</p>
                </div>
                <div className="flex-1 border-l border-slate-700 pl-4">
                  <p className="text-xs font-bold">Intro y Feedback ICP</p>
                  <p className="text-[10px] text-slate-400">14:00 PM • Alice Wong</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
