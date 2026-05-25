import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/src/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Shield, ShieldAlert, FileText, Search } from 'lucide-react';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`h-5 w-9 rounded-full relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        enabled ? 'bg-indigo-600' : 'bg-slate-200'
      }`}
      aria-checked={enabled}
      role="switch"
    >
      <div
        className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function ComplianceView({ businessId }: { businessId: string }) {
  const [guardrails, setGuardrails] = useState({
    autoUnsubscribe: true,
    blockClients: false,
    mandatoryReview: true,
  });

  const toggle = (key: keyof typeof guardrails) =>
    setGuardrails(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cumplimiento y Lista de Exclusión</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestiona bajas, listas negras y registros de auditoría.
          </p>
        </div>
        <Button variant="outline">
          <FileText className="mr-2 h-3.5 w-3.5" /> Exportar Registro RGPD
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5 text-red-500" /> Lista de Exclusión
                (Blocklist)
              </CardTitle>
            </CardHeader>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar correos o dominios..."
                  className="pl-9 bg-white"
                />
              </div>
              <Button size="sm">Añadir manualmente</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Añadido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">amelia@tardistech.uk</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Correo</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">Baja solicitada</TableCell>
                  <TableCell className="text-slate-500 text-sm">Oct 24, 2026</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">*@omnicorp.com</TableCell>
                  <TableCell>
                    <Badge variant="outline">Dominio</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">Cliente</TableCell>
                  <TableCell className="text-slate-500 text-sm">Sep 10, 2026</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">legal@*</TableCell>
                  <TableCell>
                    <Badge variant="outline">Patrón</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">Buzón alto riesgo</TableCell>
                  <TableCell className="text-slate-500 text-sm">Por Defecto</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-indigo-500" /> Salvedades (Guardrails)
              </CardTitle>
              <CardDescription>Reglas para asegurar tu reputación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <div>
                  <div className="font-medium text-sm">Categorizar Bajas Aut. (IA)</div>
                  <div className="text-xs text-slate-500">Detecta "dar baja" o "eliminarme"</div>
                </div>
                <Toggle
                  enabled={guardrails.autoUnsubscribe}
                  onToggle={() => toggle('autoUnsubscribe')}
                />
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <div>
                  <div className="font-medium text-sm">Bloquear Clientes</div>
                  <div className="text-xs text-slate-500">Comparado con CSV de Stripe</div>
                </div>
                <Toggle
                  enabled={guardrails.blockClients}
                  onToggle={() => toggle('blockClients')}
                />
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <div className="font-medium text-sm">Revisión Obligatoria</div>
                  <div className="text-xs text-slate-500">Aprobar primeros toques enviados</div>
                </div>
                <Toggle
                  enabled={guardrails.mandatoryReview}
                  onToggle={() => toggle('mandatoryReview')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
