import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Badge } from '@/src/components/ui/Badge';
import { UploadCloud, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import {
  KnowledgeConfig,
  KNOWLEDGE_STORAGE_KEY,
  DEFAULT_KNOWLEDGE_CONFIG,
} from '@/src/lib/gemini';

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

export function KnowledgeView({ businessId }: { businessId: string }) {
  const [config, setConfig] = useState<KnowledgeConfig>(() => {
    try {
      const stored = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
      if (stored) return JSON.parse(stored) as KnowledgeConfig;
    } catch {
      // ignore
    }
    return DEFAULT_KNOWLEDGE_CONFIG;
  });
  const [saved, setSaved] = useState(false);

  const update = (field: keyof KnowledgeConfig) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setConfig(prev => ({ ...prev, [field]: e.target.value }));

  const toggle = (field: keyof KnowledgeConfig) => () =>
    setConfig(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSave = () => {
    localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración de Negocio e ICP</h2>
          <p className="text-xs text-slate-500 mt-1">
            Entrena a tu SDR de IA proporcionando el contexto de tu negocio y definiendo tu Perfil
            de Cliente Ideal.
          </p>
        </div>
        <Button onClick={handleSave} variant={saved ? 'success' : 'default'}>
          {saved ? '✓ Guardado' : 'Guardar Configuración'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Knowledge */}
        <Card>
          <CardHeader>
            <CardTitle>Contexto del Negocio</CardTitle>
            <CardDescription>¿Qué vendes y qué problemas resuelves?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="valueProposition">
                Propuesta de Valor
              </label>
              <Textarea
                id="valueProposition"
                placeholder="Ayudamos a empresas B2B SaaS a reducir la rotación mediante..."
                value={config.valueProposition}
                onChange={update('valueProposition')}
                className="h-24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="painPoints">
                Principales Puntos de Dolor
              </label>
              <Textarea
                id="painPoints"
                value={config.painPoints}
                onChange={update('painPoints')}
                className="h-24"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="text-sm font-medium mb-2 block">Documentos de Conocimiento</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium">Arrastra PDFs, documentos o URLs</p>
                <p className="text-xs text-slate-500 mb-4">
                  Casos de éxito, presentaciones, guías de objeciones
                </p>
                <Button variant="outline" size="sm">
                  Explorar Archivos
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> sales_deck_2026.pdf
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> website_scrape.txt
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ICP & Scoring */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle>Perfil de Cliente Ideal (ICP)</CardTitle>
              <CardDescription>
                Define a quién debe contactar tu IA y cómo puntuarlos.
              </CardDescription>
            </div>
            <SlidersHorizontal className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="roles">
                  Cargos / Roles
                </label>
                <Input
                  id="roles"
                  value={config.roles}
                  onChange={update('roles')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="companySize">
                  Tamaño Empresa
                </label>
                <Input
                  id="companySize"
                  value={config.companySize}
                  onChange={update('companySize')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="industries">
                Industrias Objetivo
              </label>
              <Input
                id="industries"
                value={config.industries}
                onChange={update('industries')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="geographies">
                Zonas Geográficas
              </label>
              <Input
                id="geographies"
                value={config.geographies}
                onChange={update('geographies')}
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold mb-3">Fuentes de Enriquecimiento (IA)</h4>
              <p className="text-xs text-slate-500 mb-4 text-balance">
                La IA actuará como tu SDR buscando más información sobre tus leads (ej. rastreando
                perfiles o Google Maps) para hiper-personalizar sus mensajes de outreach.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <div>
                    <span className="font-medium inline-block text-slate-800 mb-1">
                      Análisis de Sitio Web (Scraping)
                    </span>
                    <p className="text-slate-500 text-xs text-balance">
                      La IA navegará y resumirá a qué se dedica exactamente tu cliente.
                    </p>
                  </div>
                  <Toggle
                    enabled={config.enrichWebsite}
                    onToggle={toggle('enrichWebsite')}
                  />
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <div>
                    <span className="font-medium inline-block text-slate-800 mb-1">
                      Lectura de Google Maps (Local)
                    </span>
                    <p className="text-slate-500 text-xs text-balance">
                      Detecta horarios, opiniones y descripciones de Google Maps y MyBusiness.
                    </p>
                  </div>
                  <Toggle
                    enabled={config.enrichMaps}
                    onToggle={toggle('enrichMaps')}
                  />
                </div>

                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium inline-block text-slate-800 mb-1">
                      Análisis de Instagram de Empresa
                    </span>
                    <p className="text-slate-500 text-xs text-balance">
                      Lee los últimos posts y descripción para encontrar noticias recientes.
                    </p>
                  </div>
                  <Toggle
                    enabled={config.enrichInstagram}
                    onToggle={toggle('enrichInstagram')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold mb-3">Reglas de Puntuación</h4>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium inline-block text-indigo-700 mb-1">
                      Pesos para "Fit Score"
                    </span>
                    <p className="text-slate-500 text-xs text-balance">
                      Cargo coincide (40%), Industria (30%), Tamaño (30%)
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium inline-block text-emerald-700 mb-1">
                      Señales de Intención
                    </span>
                    <p className="text-slate-500 text-xs text-balance">
                      Contratando Ventas (Alta), Dinero Reciente (Acudió a Ronda) (Media), Visita a
                      Precios (Alta)
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>

                <div className="flex justify-between items-center bg-red-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium inline-block text-red-700 mb-1">
                      Señales Negativas (Blocklist)
                    </span>
                    <p className="text-slate-500 text-xs">
                      Agencias, Cargo incluye "Estudiante" o "Becario"
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
