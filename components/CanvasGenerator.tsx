import React, { useEffect, useRef, useState } from 'react';
import { SalesData } from '../types';

interface CanvasGeneratorProps {
  data: SalesData;
  templateImageSrc: string | null;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

const CanvasGenerator: React.FC<CanvasGeneratorProps> = ({ data, templateImageSrc, onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !templateImageSrc) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = templateImageSrc;

    img.onload = () => {
      // Set canvas size to match image resolution
      canvas.width = img.width;
      canvas.height = img.height;
      
      const w = canvas.width;
      const h = canvas.height;
      // Scale factor based on 1080px width reference
      const s = w / 1080; 

      // 1. Draw Original Base Image
      ctx.drawImage(img, 0, 0);

      // --- LAYOUT OVERLAYS ---
      
      // 2. Top Header (Red Banner)
      // Covers the top ~16% of the image to write the name fresh.
      const headerHeight = 180 * s;
      
      // Gradient for header
      const headerGrad = ctx.createLinearGradient(0, 0, 0, headerHeight);
      headerGrad.addColorStop(0, '#dc2626'); // Red-600
      headerGrad.addColorStop(1, '#991b1b'); // Red-800
      ctx.fillStyle = headerGrad;
      ctx.fillRect(0, 0, w, headerHeight);

      // Header Bottom Border (White line for style)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, headerHeight - (5 * s), w, 5 * s);

      // 3. Content Mask (White Area)
      // We need to clear the area where "META 30" might be on the original image.
      // Extended width to 920 to cover potential background text.
      const maskY = headerHeight;
      const maskH = 420 * s; // Height of the white area
      const maskW = 940 * s; // Wide mask to cover everything on the left/center
      
      // Draw White Mask
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, maskY, maskW, maskH);

      // Gradient fade at the edge to blend with potential bottle background
      const fadeGrad = ctx.createLinearGradient(maskW, maskY, maskW + (100 * s), maskY);
      fadeGrad.addColorStop(0, '#ffffff');
      fadeGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(maskW, maskY, 100 * s, maskH);

      // --- TEXT & GRAPHICS ---

      // 1. Vendedora Name (In Header)
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${75 * s}px 'Montserrat'`; // Slightly larger
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Add Drop Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 15 * s;
      ctx.shadowOffsetY = 4 * s;
      ctx.fillText(data.vendedora.toUpperCase(), w / 2, headerHeight / 2);
      
      // Reset Shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 2. "PROGRESSO" Title
      const contentStartX = 60 * s;
      const contentStartY = headerHeight + (90 * s);

      // Matches the "DILATAMAX" red branding
      ctx.fillStyle = '#b91c1c'; 
      ctx.font = `900 ${110 * s}px 'Montserrat'`; // Big Impact
      ctx.textAlign = 'left';
      ctx.fillText('PROGRESSO', contentStartX, contentStartY);

      // 3. Stats Row
      const statsY = contentStartY + (85 * s);
      
      // "15 AGENDAMENTOS"
      // Both numbers and text should be dark red to match original reference style better
      const darkRedColor = '#7f1d1d'; // Dark Red like the bottle text
      
      ctx.fillStyle = darkRedColor; 
      ctx.font = `800 ${55 * s}px 'Montserrat'`;
      ctx.fillText(`${data.agendamentos}`, contentStartX, statsY);
      
      const textWidth = ctx.measureText(`${data.agendamentos}`).width;
      ctx.fillStyle = darkRedColor; 
      ctx.font = `700 ${45 * s}px 'Montserrat'`; // Slightly lighter weight for label
      ctx.fillText(' AGENDAMENTOS', contentStartX + textWidth, statsY);

      // 4. Meta Display (Restored)
      const metaX = 850 * s; // Position towards the right edge of the white mask
      
      ctx.textAlign = 'center';
      
      // Label "META"
      ctx.fillStyle = darkRedColor; 
      ctx.font = `700 ${35 * s}px 'Montserrat'`;
      ctx.fillText('META', metaX, statsY - (50 * s));

      // Value
      ctx.fillStyle = darkRedColor;
      ctx.font = `900 ${75 * s}px 'Montserrat'`;
      ctx.fillText(`${data.meta}`, metaX, statsY + (15 * s));

      // Reset align
      ctx.textAlign = 'left';

      // 5. Progress Bar
      const barY = statsY + (60 * s);
      const barHeight = 70 * s; // Thicker bar
      const barWidth = 840 * s; 
      const radius = barHeight / 2;

      // Track (Background) - Inner Shadow look
      ctx.fillStyle = '#e5e7eb'; // Slightly darker gray for depth
      roundRect(ctx, contentStartX, barY, barWidth, barHeight, radius);
      ctx.fill();
      
      // Inner shadow top
      const trackGrad = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
      trackGrad.addColorStop(0, '#d1d5db');
      trackGrad.addColorStop(0.3, '#f3f4f6');
      trackGrad.addColorStop(1, '#f3f4f6');
      ctx.fillStyle = trackGrad;
      ctx.fill();

      // Progress Fill
      const ratio = Math.min(Math.max(data.agendamentos / data.meta, 0), 1);
      const fillWidth = Math.max(barWidth * ratio, barHeight); // Min width is circle

      // 3D Cylinder Gradient (Vertical)
      const barGrad = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
      barGrad.addColorStop(0, '#ef4444'); // Lighter top
      barGrad.addColorStop(0.5, '#dc2626'); // Mid
      barGrad.addColorStop(1, '#991b1b'); // Dark bottom
      ctx.fillStyle = barGrad;

      // Draw Fill with Clipping for proper rounded ends
      ctx.save();
      roundRect(ctx, contentStartX, barY, barWidth, barHeight, radius);
      ctx.clip(); // Clip to track shape
      roundRect(ctx, contentStartX, barY, fillWidth, barHeight, 0); // Draw rect
      ctx.fill();
      
      // Top Highlight (Gloss)
      ctx.beginPath();
      ctx.ellipse(
        contentStartX + (fillWidth / 2), 
        barY + (barHeight * 0.25), 
        fillWidth * 0.9, 
        barHeight * 0.15, 
        0, 0, Math.PI * 2
      );
      const glossGrad = ctx.createLinearGradient(0, barY, 0, barY + (barHeight * 0.5));
      glossGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
      glossGrad.addColorStop(1, 'rgba(255,255,255,0.0)');
      ctx.fillStyle = glossGrad;
      ctx.fill();
      
      ctx.restore();

      onCanvasReady(canvas);
    };

    img.onerror = () => {
      setError("Erro ao carregar imagem.");
    };

  }, [data, templateImageSrc, onCanvasReady]);

  // Helper for Rounded Rect
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  if (error) {
    return <div className="text-red-500 font-bold p-4">{error}</div>;
  }

  return (
    <div className="w-full aspect-square bg-white rounded-lg overflow-hidden shadow-2xl border-4 border-white flex items-center justify-center relative">
        {!templateImageSrc && (
            <div className="text-gray-400 text-center p-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🖼️</span>
                </div>
                <p className="font-bold text-gray-700 text-lg mb-2">Aguardando Base</p>
                <p className="text-sm max-w-xs">Por favor, carregue a imagem enviada no chat no painel ao lado.</p>
            </div>
        )}
      <canvas 
        ref={canvasRef} 
        className={`max-w-full max-h-full object-contain ${!templateImageSrc ? 'hidden' : ''}`}
      />
    </div>
  );
};

export default CanvasGenerator;