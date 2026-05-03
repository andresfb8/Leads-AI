import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Key, User, Bell, Palette } from 'lucide-react';

export function SettingsView({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ajustes</h2>
          <p className="text-xs text-slate-500 mt-1">Configuración general de la plataforma y la cuenta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-md bg-white border border-slate-200 text-sm font-medium text-slate-900 shadow-sm flex items-center">
            <User className="mr-2 h-4 w-4" /> Perfil
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-600 flex items-center">
            <Key className="mr-2 h-4 w-4" /> Claves API
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-600 flex items-center">
            <Bell className="mr-2 h-4 w-4" /> Notificaciones
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-sm font-medium text-slate-600 flex items-center">
            <Palette className="mr-2 h-4 w-4" /> Apariencia
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
              <CardDescription>Actualiza tu nombre e información de contacto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre</label>
                  <input type="text" defaultValue="Andres" className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Apellidos</label>
                  <input type="text" defaultValue="Usuario" className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo Electrónico</label>
                <input type="email" defaultValue="andresfb8@gmail.com" className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm" />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integraciones API</CardTitle>
              <CardDescription>Configura las claves de servicios de terceros para habilitar funciones extra.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Google Maps API Key (Búsqueda local)</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Conectado (Si existe .env)</span>
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="password" 
                    value="••••••••••••••••••••••••" 
                    onChange={() => {}}
                    disabled 
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm shadow-sm opacity-50"
                  />
                </div>
                <p className="text-xs text-slate-500">Configurada a través de la variable de entorno <code>VITE_GOOGLE_MAPS_API_KEY</code>.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
