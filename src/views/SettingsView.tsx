import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Key, User, Bell, Palette } from 'lucide-react';

type Section = 'profile' | 'api' | 'notifications' | 'appearance';

const sections: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'api', label: 'Claves API', icon: Key },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
];

export function SettingsView({ businessId }: { businessId: string }) {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ajustes</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configuración general de la plataforma y la cuenta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                activeSection === s.id
                  ? 'bg-white border border-slate-200 text-slate-900 shadow-sm'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <s.icon className="mr-2 h-4 w-4" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Actualiza tu nombre e información de contacto.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      Nombre
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={profile.firstName}
                      onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="Tu nombre"
                      className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Apellidos
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={profile.lastName}
                      onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="Tus apellidos"
                      className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    placeholder="tu@correo.com"
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button onClick={handleSave} variant={saved ? 'success' : 'default'}>
                  {saved ? '✓ Guardado' : 'Guardar Cambios'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'api' && (
            <Card>
              <CardHeader>
                <CardTitle>Integraciones API</CardTitle>
                <CardDescription>
                  Configura las claves de servicios de terceros para habilitar funciones extra.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>Google Gemini API Key (IA)</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        import.meta.env.VITE_GEMINI_API_KEY
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {import.meta.env.VITE_GEMINI_API_KEY ? 'Conectado' : 'No configurado'}
                    </span>
                  </label>
                  <p className="text-xs text-slate-500">
                    Configura <code>VITE_GEMINI_API_KEY</code> en tu archivo <code>.env</code>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>Google Maps API Key (Búsqueda local)</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Conectado' : 'No configurado'}
                    </span>
                  </label>
                  <p className="text-xs text-slate-500">
                    Configura <code>VITE_GOOGLE_MAPS_API_KEY</code> en tu archivo <code>.env</code>.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura cuándo y cómo recibes alertas.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">Próximamente disponible.</p>
              </CardContent>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>Personaliza el aspecto visual de la plataforma.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">Próximamente disponible.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
