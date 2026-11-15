'use client';

import { useState } from 'react';
import Image from 'next/image';
import Carrossel from './Carrossel';
import { X, ZoomIn } from 'lucide-react';

export default function GaleriaSection() {
  const [imagemAmpliada, setImagemAmpliada] = useState<{src: string, label: string} | null>(null);

  const fotosGaleria = [
    { src: '/area-externa.jpg', label: 'Fachada' },
    { src: '/recepcao.avif', label: 'Recepção' },
    { src: '/sala-recepcao.webp', label: 'Salão de Espera' },
    { src: '/area-comum.avif', label: 'Área Comum' },
    { src: '/cafe_2.avif', label: 'Café da Manhã' },
    { src: '/piscina.webp', label: 'Piscina' },
    { src: '/quarto-serpa.jpg', label: 'Acomodações' },
  ];
  
  const duplicarArray = (arr: any[]) => [...arr, ...arr];

  return (
    <section id="fotos" className="py-24 bg-gray-50 scroll-mt-16 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-10 max-w-7xl">
        <p className="text-xs font-bold tracking-widest text-[#E55C42] uppercase mb-2">Nossos Ambientes</p>
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">Galeria de Fotos</h2>
      </div>
      
      <Carrossel>
        {duplicarArray(fotosGaleria).map((foto, i) => (
          <div 
            key={i} 
            onClick={() => setImagemAmpliada(foto)}
            className="min-w-[75vw] md:min-w-[450px] h-[450px] relative rounded-3xl overflow-hidden shadow-sm border border-gray-200 snap-center group cursor-pointer"
          >
            <Image src={foto.src} alt={foto.label} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-6 right-6 bg-black/50 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <ZoomIn className="w-5 h-5" />
            </div>

            <div className="absolute bottom-8 left-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <p className="font-bold text-2xl drop-shadow-lg">{foto.label}</p>
            </div>
          </div>
        ))}
      </Carrossel>

      {/* Lightbox Modal (Imagem em Tela Cheia) */}
      {imagemAmpliada && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={() => setImagemAmpliada(null)}>
          <button 
            onClick={() => setImagemAmpliada(null)} 
            className="absolute top-6 right-6 z-20 text-white bg-white/10 p-3 rounded-full hover:bg-[#E55C42] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <Image 
              src={imagemAmpliada.src} 
              alt={imagemAmpliada.label} 
              fill 
              className="object-contain" 
            />
            <div className="absolute bottom-[-40px] text-center text-white/80 font-medium text-lg w-full tracking-wider">
              {imagemAmpliada.label}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}