import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/Table';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Lead, LeadStatus } from '@/src/data/mock';
import { Search, Plus, Filter, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LocalSearchModal } from '@/src/components/LocalSearchModal';
import { useAppContext } from '@/src/context/AppContext';

const ALL_STATUSES: LeadStatus[] = [
  'Nuevo',
  'Enriquecido',
  'Contactado',
  'Respondido',
  'Reunión Agendada',
  'Suscripción Cancelada',
  'Rechazado',
];

function getStatusVariant(status: LeadStatus) {
  switch (status) {
    case 'Nuevo': return 'secondary';
    case 'Enriquecido': return 'default';
    case 'Contactado': return 'warning';
    case 'Respondido': return 'success';
    case 'Reunión Agendada': return 'success';
    case 'Suscripción Cancelada': return 'destructive';
    case 'Rechazado': return 'outline';
    default: return 'default';
  }
}

export function LeadsView({ businessId }: { businessId: string }) {
  const { getLeads, updateLeadStatus, addLeads } = useAppContext();
  const leads = getLeads(businessId);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'Todos'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);

  const filtered = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (lead: Lead, newStatus: LeadStatus) => {
    updateLeadStatus(businessId, lead.id, newStatus, `Estado cambiado a ${newStatus}`);
    setEditingStatusId(null);
  };

  const handleLocalSearch = (keyword: string, location: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const newLeads: Lead[] = [
        {
          id: `l_${Date.now()}_1`,
          name: 'Gerente / Recepción',
          title: 'General',
          company: `${keyword} Los Olivos`,
          linkedin: `Maps: ${location}`,
          email: 'contacto@ejemplo.com',
          fitScore: 85,
          intentScore: 40,
          status: 'Nuevo',
          painPoint: 'Gestión manual de reservas',
          lastAction: 'Extraído de Google Maps',
        },
        {
          id: `l_${Date.now()}_2`,
          name: 'Propietario',
          title: 'Owner',
          company: `${keyword} ${location.split(',')[0]} Center`,
          linkedin: `Maps: ${location}`,
          email: 'admin@ejemplo.com',
          fitScore: 92,
          intentScore: 60,
          status: 'Nuevo',
          painPoint: 'Baja asistencia en mañanas',
          lastAction: 'Extraído de Google Maps',
        },
      ];
      addLeads(businessId, newLeads);
      setIsSearching(false);
      setIsModalOpen(false);
    }, 2000);
  };

  const statusCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads y CRM</h2>
          <p className="text-xs text-slate-500 mt-1">
            Descubre, filtra y revisa leads enriquecidos antes del contacto.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-3.5 w-3.5" /> Importar CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Buscar Leads (Maps)
          </Button>
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('Todos')}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
            statusFilter === 'Todos'
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
          )}
        >
          Todos ({leads.length})
        </button>
        {ALL_STATUSES.filter(s => statusCounts[s] > 0).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
              statusFilter === s
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            )}
          >
            {s} ({statusCounts[s]})
          </button>
        ))}
      </div>

      <Card className="flex-1">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white rounded-t-xl shrink-0">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar leads o empresas..."
              className="pl-9 h-9 text-xs"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-slate-400">{filtered.length} leads</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">No hay leads que coincidan con los filtros.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prospecto</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Fit</TableHead>
                <TableHead className="text-center">Intención</TableHead>
                <TableHead>Última Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-bold text-slate-900">{lead.name}</div>
                    <div className="text-[10px] text-slate-500">{lead.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{lead.company}</div>
                    <div className="text-[10px] text-blue-600 hover:underline cursor-pointer">
                      {lead.linkedin}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingStatusId === lead.id ? (
                      <select
                        autoFocus
                        value={lead.status}
                        onChange={e => handleStatusChange(lead, e.target.value as LeadStatus)}
                        onBlur={() => setEditingStatusId(null)}
                        className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingStatusId(lead.id)}
                        title="Clic para cambiar estado"
                        className="focus:outline-none group"
                      >
                        <Badge variant={getStatusVariant(lead.status)}>
                          {lead.status}
                        </Badge>
                        <span className="ml-1 text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          ▼
                        </span>
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        'px-2 py-1 rounded font-bold',
                        lead.fitScore >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-orange-50 text-orange-700'
                      )}
                    >
                      {lead.fitScore}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        'px-2 py-1 rounded font-bold',
                        lead.intentScore >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : lead.intentScore >= 40
                          ? 'bg-orange-50 text-orange-700'
                          : 'bg-slate-50 text-slate-500'
                      )}
                    >
                      {lead.intentScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-600">{lead.lastAction}</div>
                    {lead.painPoint && lead.painPoint !== 'N/A' && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Pain: {lead.painPoint}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {isModalOpen && (
        <LocalSearchModal
          onClose={() => setIsModalOpen(false)}
          onSearch={handleLocalSearch}
          isSearching={isSearching}
        />
      )}
    </div>
  );
}
