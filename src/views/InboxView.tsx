import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { MOCK_INBOX, MOCK_LEADS } from '@/src/data/mock';
import { Badge } from '@/src/components/ui/Badge';
import { Calendar, CheckCircle2, Clock, Inbox as InboxIcon, MapPin, XCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export function InboxView({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bandeja de Entrada y Reuniones</h2>
          <p className="text-xs text-slate-500 mt-1">Respuestas clasificadas por IA y coordinación de calendario.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inbox / Replies */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center">
                <InboxIcon className="mr-2 h-5 w-5 text-indigo-500" /> Respuestas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {MOCK_INBOX.map((msg) => {
                  const lead = MOCK_LEADS.find(l => l.id === msg.leadId);
                  const isInterested = msg.classification === 'Interested';
                  return (
                    <div key={msg.id} className={`p-4 hover:bg-slate-50 transition-colors ${!msg.isRead ? 'bg-indigo-50/30' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${!msg.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                            {msg.from}
                          </span>
                          <span className="text-xs text-slate-500">({lead?.company})</span>
                          <Badge variant={isInterested ? 'success' : 'destructive'} className="ml-2">
                            {msg.classification}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-400">
                          hace {formatDistanceToNow(new Date(msg.date))}
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-1">{msg.subject}</div>
                      <div className="text-sm text-slate-600 mb-3">{msg.snippet}</div>
                      
                      {isInterested ? (
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-indigo-600 text-white">
                            <Calendar className="mr-2 h-3 w-3" /> Proponer Horarios
                          </Button>
                          <Button size="sm" variant="outline">Responder Manualmente</Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Ignorar/Reconocer</Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings / Calendar */}
        <div className="space-y-4">
          <Card className="bg-indigo-50 border-indigo-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <InboxIcon size={64} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-indigo-900">Configuración de Envío</CardTitle>
              <CardDescription className="text-indigo-700">Conecta tu cuenta de correo real.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-indigo-800 mb-4 text-balance">
                Para que la IA pueda enviar mensajes y leer las respuestas, necesitas autorizar el acceso mediante OAuth (Ej. Google Workspace o Microsoft 365).
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                Conectar Cuenta de Correo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" /> Próximas Reuniones
              </CardTitle>
              <CardDescription>Obtenidas desde Google Calendar API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-white relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900">Intro Call: OmniCorp</h4>
                  <Badge variant="success">Confirmada</Badge>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="mr-2 h-3.5 w-3.5" /> 
                    Mañana, 2:00 PM - 2:30 PM (CET)
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPin className="mr-2 h-3.5 w-3.5" /> 
                    Google Meet
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex justify-center items-center text-xs font-bold text-slate-500">DC</div>
                  <span className="text-sm">David Chen</span>
                </div>
              </div>

              <div className="border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 text-center">
                <p className="text-sm text-slate-500 mb-2">Sincronizando por OAuth 2.0</p>
                <Button variant="outline" size="sm">Gestionar Calendario</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
