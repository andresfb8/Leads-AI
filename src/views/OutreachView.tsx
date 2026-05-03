import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Textarea } from '@/src/components/ui/Textarea';
import { Input } from '@/src/components/ui/Input';
import { MOCK_DRAFTS, MOCK_LEADS, OutreachDraft } from '@/src/data/mock';
import { Badge } from '@/src/components/ui/Badge';
import { Sparkles, Send, Edit2, RotateCcw, Check, UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function OutreachView({ businessId }: { businessId: string }) {
  const [drafts, setDrafts] = useState(MOCK_DRAFTS);

  const handleApprove = (id: string) => {
    setDrafts(drafts.map(d => d.id === id ? { ...d, status: 'Aprobado' } : d));
  };

  const pendingDrafts = drafts.filter(d => d.status === 'Borrador');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alcance y Aprobaciones</h2>
          <p className="text-xs text-slate-500 mt-1">Revisión humana. Aprueba o modifica borradores de IA antes de enviar.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline"><RotateCcw className="mr-2 h-3.5 w-3.5" /> Regenerar Todo</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drafts List */}
        <div className="lg:col-span-2 space-y-4">
          {pendingDrafts.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
              <Check className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">¡Todo al día!</h3>
              <p className="text-slate-500">No hay borradores pendientes de revisión.</p>
            </div>
          ) : null}

          {pendingDrafts.map(draft => {
            const lead = MOCK_LEADS.find(l => l.id === draft.leadId);
            if (!lead) return null;

            return (
              <Card key={draft.id} className="overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-700">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Borrador de IA para {lead.name}</span>
                      <span className="text-xs text-slate-500 ml-2">({lead.company} - {lead.title})</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    Sugerido hace {formatDistanceToNow(new Date(draft.suggestedAt))}
                  </span>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Asunto</label>
                    <Input defaultValue={draft.subject} className="font-medium" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                      <span>Cuerpo del Mensaje</span>
                      <span className="text-indigo-600 font-normal normal-case flex items-center">
                        <Edit2 size={12} className="mr-1" /> Clic para editar
                      </span>
                    </label>
                    <Textarea 
                      defaultValue={draft.body} 
                      className="min-h-[160px] font-sans leading-relaxed resize-y"
                    />
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex space-x-3 text-sm text-amber-800">
                    <div>
                      <strong>¿Por qué este mensaje?</strong> La IA detectó que están contratando activamente ingenieros. El enfoque está en el ahorro de tiempo para onboardings.
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between">
                  <Button variant="ghost" className="text-slate-500"><RotateCcw className="mr-2 h-4 w-4" /> Reescribir</Button>
                  <div className="space-x-2">
                    <Button 
                      onClick={() => handleApprove(draft.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="mr-2 h-4 w-4" /> Aprobar y Programar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Lead Context Panel */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Ejecución de Secuencia</CardTitle>
              <CardDescription>Campañas activas y límites de envío.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Límite Diario</span>
                <span className="font-medium">45 / 50</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-slate-100">
                <h4 className="text-sm font-semibold mb-2">Secuencias Activas</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                    <span>Q3 SaaS Founders</span>
                    <Badge variant="success">Activa</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                    <span>Fintech CTO Intro</span>
                    <Badge variant="success">Activa</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
