import React, { ChangeEvent } from 'react';
import { Vendedora, SalesData } from '../types';
import { Upload, User, Target, BarChart3, ChevronRight } from 'lucide-react';

interface ControlPanelProps {
  data: SalesData;
  onChange: (data: SalesData) => void;
  onImageUpload: (file: File) => void;
  hasImage: boolean;
  onDownload: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  data, 
  onChange, 
  onImageUpload,
  hasImage,
  onDownload
}) => {
  
  const handleInputChange = (field: keyof SalesData, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-8 bg-red-600 rounded-full"></div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            CONFIGURAÇÃO
          </h2>
        </div>
        <p className="text-sm text-gray-500 pl-5">Preencha os dados da meta</p>
      </div>

      {/* Upload - Highlighted as Step 1 */}
      <div className={`p-5 rounded-xl border-2 transition-all group ${hasImage ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200 border-dashed'}`}>
        <label className="cursor-pointer w-full block">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${hasImage ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
              <Upload className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-800">1. Imagem Base</span>
          </div>
          
          <div className="pl-12">
            <p className="text-sm text-gray-600 mb-2">
              {hasImage ? 'Imagem carregada com sucesso!' : 'Carregue a imagem anexada no chat aqui.'}
            </p>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${hasImage ? 'bg-white text-green-700 border border-green-200' : 'bg-red-600 text-white shadow-sm group-hover:bg-red-700'}`}>
              {hasImage ? 'Trocar Arquivo' : 'Selecionar Arquivo'}
            </span>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
          />
        </label>
      </div>

      {/* Form Fields */}
      <div className="space-y-5 flex-1">
        
        <div className="group">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
            <User className="w-4 h-4" /> Vendedora
          </label>
          <div className="relative">
            <select
              value={data.vendedora}
              onChange={(e) => handleInputChange('vendedora', e.target.value)}
              className="w-full appearance-none bg-gray-50 text-gray-900 font-bold text-lg px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
            >
              {Object.values(Vendedora).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Realizado
            </label>
            <input
              type="number"
              min="0"
              value={data.agendamentos}
              onChange={(e) => handleInputChange('agendamentos', parseInt(e.target.value) || 0)}
              className="w-full bg-gray-50 text-gray-900 font-bold text-2xl px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Target className="w-4 h-4" /> Meta
            </label>
            <input
              type="number"
              min="1"
              value={data.meta}
              onChange={(e) => handleInputChange('meta', parseInt(e.target.value) || 0)}
              className="w-full bg-gray-50 text-gray-900 font-bold text-2xl px-4 py-3 rounded-xl border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onDownload}
        disabled={!hasImage}
        className={`w-full py-4 rounded-xl font-black text-lg shadow-lg shadow-red-500/20 transition-all transform active:scale-[0.98]
          ${hasImage 
            ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-600/30' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        BAIXAR CARD
      </button>
    </div>
  );
};

export default ControlPanel;