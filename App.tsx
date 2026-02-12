import React, { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import CanvasGenerator from './components/CanvasGenerator';
import { SalesData, Vendedora } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<SalesData>({
    vendedora: Vendedora.BEA_LADY,
    agendamentos: 15,
    meta: 30
  });

  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setTemplateImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (canvasRef) {
      const link = document.createElement('a');
      link.download = `meta-${data.vendedora.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvasRef.toDataURL('image/png');
      link.click();
    }
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCanvasRef(canvas);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Gerador de Metas <span className="text-red-600">DILATAMAX</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Crie cards de progresso de vendas profissionais em segundos.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 h-fit">
            <ControlPanel 
              data={data}
              onChange={setData}
              onImageUpload={handleImageUpload}
              hasImage={!!templateImage}
              onDownload={handleDownload}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-700">Pré-visualização</h3>
                {templateImage && (
                  <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Template Ativo
                  </span>
                )}
              </div>
              
              <CanvasGenerator 
                data={data} 
                templateImageSrc={templateImage}
                onCanvasReady={handleCanvasReady}
              />

              <p className="text-center text-xs text-gray-400 mt-4">
                A imagem gerada mantém a resolução original do template enviado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;