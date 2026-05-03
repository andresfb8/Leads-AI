import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/Table';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { MOCK_LEADS, Lead, LeadStatus } from '@/src/data/mock';
import { Search, Plus, Filter, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LocalSearchModal } from '@/src/components/LocalSearchModal';

export function LeadsView({ businessId }: { businessId: string }) {
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) || 
    lead.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleLocalSearch = (keyword: string, location: string) => {
    setIsSearching(true);
    // Simulate API Call to Google Maps Places API via backend
    setTimeout(() => {
      const mockNewLeads: Lead[] = [
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
        }
      ];
      setLeads(prev => [...mockNewLeads, ...prev]);
      setIsSearching(false);
      setIsModalOpen(false);
    }, 2000); // 2 second delay to simulate extraction
  };

  const getStatusVariant = (status: LeadStatus) => {
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
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 font-bold';
    if (score >= 50) return 'text-amber-600 font-medium';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads y CRM</h2>
          <p className="text-xs text-slate-500 mt-1">Descubre, filtra y revisa leads enriquecidos antes del contacto.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline"><Download className="mr-2 h-3.5 w-3.5" /> Importar CSV</Button>
          <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-3.5 w-3.5" /> Buscar Leads (Maps)</Button>
        </div>
      </div>

      <Card className="flex-1 mt-6">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white rounded-t-xl shrink-0">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar leads o empresas..." 
              className="pl-9 h-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-2 h-3.5 w-3.5" /> Filtros</Button>
        </div>
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
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="font-bold text-slate-900">{lead.name}</div>
                  <div className="text-[10px] text-slate-500">{lead.title}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{lead.company}</div>
                  <div className="text-[10px] text-blue-600 hover:underline cursor-pointer">{lead.linkedin}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn('px-2 py-1 rounded font-bold', lead.fitScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700')}>{lead.fitScore}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn('px-2 py-1 rounded font-bold', lead.intentScore >= 80 ? 'bg-emerald-50 text-emerald-700' : lead.intentScore >= 40 ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-500')}>{lead.intentScore}</span>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{lead.lastAction}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
