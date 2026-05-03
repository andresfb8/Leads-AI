import React, { useState } from 'react';
import { Search, MapPin, X, Loader2, Store } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';

interface LocalSearchModalProps {
  onClose: () => void;
  onSearch: (keyword: string, location: string) => void;
  isSearching: boolean;
}

export function LocalSearchModal({ onClose, onSearch, isSearching }: LocalSearchModalProps) {
  const [keyword, setKeyword] = useState('Club de Padel');
  const [location, setLocation] = useState('Madrid, España');

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl bg-white flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Store size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Búsqueda Local</h2>
              <p className="text-xs text-slate-500">Extrae negocios desde Google Maps</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800">
            <strong>Nota de Integración:</strong> Esta función requiere una <code className="bg-indigo-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> configurada en tu archivo <code>.env</code> para funcionar con datos reales de la API de Google Places.
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Tipo de Negocio o Palabra Clave</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ej. Club de Padel, Dentista, Gimnasio..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ciudad, barrio o código postal"
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={() => onSearch(keyword, location)} 
            disabled={isSearching || !keyword || !location}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Extraer Negocios
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
