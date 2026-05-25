import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Textarea } from '@/src/components/ui/Textarea';
import { Input } from '@/src/components/ui/Input';
import { OutreachDraft } from '@/src/data/mock';
import { Badge } from '@/src/components/ui/Badge';
import { Sparkles, RotateCcw, Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { rewriteEmail } from '@/src/lib/gemini';
import { useAppContext } from '@/src/context/AppContext';

interface DraftEdit {
  subject: string;
  body: string;
}

export function OutreachView({ businessId }: { businessId: string }) {
  const { getDrafts, getLeads, approveDraft, rejectDraft } = useAppContext();
  const drafts = getDrafts(businessId);
  const leads = getLeads(businessId);

  const [draftEdits, setDraftEdits] = useState<Record<string, DraftEdit>>(() =>
    Object.fromEntries(drafts.map(d => [d.id, { subject: d.subject, body: d.body }]))
  );
  const [rewritingIds, setRewritingIds] = useState<Set<string>>(new Set());

  // Sync edits when new drafts arrive (e.g. after reloading from context)
  useEffect(() => {
    setDraftEdits(prev => {
      const next = { ...prev };
      drafts.forEach(d => {
        if (!next[d.id]) next[d.id] = { subject: d.subject, body: d.body };
      });
      return next;
    });
  }, [drafts]);

  const handleRewrite = async (draft: OutreachDraft) => {
    const lead = leads.find(l => l.id === draft.leadId);
    if (!lead) return;

    setRewritingIds(prev => new Set(prev).add(draft.id));
    try {
      const current = draftEdits[draft.id] ?? { subject: draft.subject, body: draft.body };
      const result = await rewriteEmail(lead, current);
      setDraftEdits(prev => ({ ...prev, [draft.id]: result }));
    } finally {
      setRewritingIds(prev => {
        const next = new Set(prev);
        next.delete(draft.id);
        return next;
      });
    }
  };

  const handleApprove = (draft: OutreachDraft) => {
    const edit = draftEdits[draft.id] ?? { subject: draft.subject, body: draft.body };
    approveDraft(businessId, draft.id, edit.subject, edit.body);
  };

  const handleRewriteAll = async () => {
    const pending = pendingDrafts;
    await Promise.all(pending.map(handleRewrite));
  };

  const pendingDrafts = drafts.filter(d => d.status === 'Borrador');
  const approvedDrafts = drafts.filter(d => d.status === 'Aprobado');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alcance y Aprobaciones</h2>
          <p className="text-xs text-slate-500 mt-1">
            Revisión humana. Aprueba o modifica borradores de IA antes de enviar.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRewriteAll}
            isLoading={rewritingIds.size > 0}
            disabled={pendingDrafts.length === 0}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" /> Regenerar Todo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drafts List */}
        <div className="lg:col-span-2 space-y-4">
          {pendingDrafts.length === 0 && (
            <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
              <Check className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">¡Todo al día!</h3>
              <p className="text-slate-500">No hay borradores pendientes de revisión.</p>
            </div>
          )}

          {pendingDrafts.map(draft => {
            const lead = leads.find(l => l.id === draft.leadId);
            if (!lead) return null;
            const edit = draftEdits[draft.id] ?? { subject: draft.subject, body: draft.body };
            const isRewriting = rewritingIds.has(draft.id);

            return (
              <Card key={draft.id} className="overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-700">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Borrador para {lead.name}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        ({lead.company} · {lead.title})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    hace {formatDistanceToNow(new Date(draft.suggestedAt))}
                  </span>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Asunto
                    </label>
                    <Input
                      value={edit.subject}
                      onChange={e =>
                        setDraftEdits(prev => ({
                          ...prev,
                          [draft.id]: { ...prev[draft.id], subject: e.target.value },
                        }))
                      }
                      className="font-medium"
                      disabled={isRewriting}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Cuerpo del Mensaje
                    </label>
                    <Textarea
                      value={edit.body}
                      onChange={e =>
                        setDraftEdits(prev => ({
                          ...prev,
                          [draft.id]: { ...prev[draft.id], body: e.target.value },
                        }))
                      }
                      className="min-h-[160px] font-sans leading-relaxed resize-y"
                      disabled={isRewriting}
                    />
                  </div>

                  {lead.painPoint && lead.painPoint !== 'N/A' && (
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-sm text-amber-800">
                      <strong>Pain point:</strong> {lead.painPoint}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-slate-500"
                      onClick={() => handleRewrite(draft)}
                      isLoading={isRewriting}
                      disabled={isRewriting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Reescribir con IA
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-400 hover:text-red-600"
                      onClick={() => rejectDraft(businessId, draft.id)}
                      disabled={isRewriting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleApprove(draft)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isRewriting}
                  >
                    <Check className="mr-2 h-4 w-4" /> Aprobar y Programar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}

          {/* Approved drafts summary */}
          {approvedDrafts.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                Aprobados y en cola ({approvedDrafts.length})
              </h4>
              <div className="space-y-2">
                {approvedDrafts.map(draft => {
                  const lead = leads.find(l => l.id === draft.leadId);
                  return (
                    <div key={draft.id} className="flex items-center justify-between text-sm">
                      <span className="text-emerald-700">
                        {lead?.name} — <em>{draft.subject}</em>
                      </span>
                      <Badge variant="success">Programado</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sequence Panel */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Ejecución de Secuencia</CardTitle>
              <CardDescription>Campañas activas y límites de envío.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Pendientes</span>
                <span className="font-bold text-amber-600">{pendingDrafts.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Aprobados</span>
                <span className="font-bold text-emerald-600">{approvedDrafts.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                <span className="text-slate-500">Límite Diario</span>
                <span className="font-medium">45 / 50</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>

              <div className="pt-3 border-t border-slate-100">
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
