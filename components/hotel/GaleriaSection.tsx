'use client';

import { useState } from 'react';
import Image from 'next/image';
import Carrossel from './Carrossel';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

type Foto = {
  src: string;
  label: string;
};

export default function GaleriaSection() {
  const [indexAmpliado, setIndexAmpliado] = useState<number | null>(null);

  const fotosGaleria: Foto[] = [
    { src: '/frente-hotel-lateral.webp', label: 'Frente do Hotel' },
    { src: '/area-externa.jpg', label: 'Fachada' },
    { src: '/recepcao.avif', label: 'Recepção' },
    { src: '/sala-recepcao.webp', label: 'Salão de Espera' },
    { src: '/area-comum.avif', label: 'Área Comum' },
    { src: '/cafe_2.avif', label: 'Café da Manhã' },
    { src: '/piscina.webp', label: 'Piscina' },
    { src: '/quarto-serpa.jpg', label: 'Acomodações' },
  ];
  
  const duplicarArray = (arr: Foto[]) => [...arr, ...arr];

  // Funções de Navegação do Lightbox
  const proximaFoto = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique feche o modal
    if (indexAmpliado !== null) {
      setIndexAmpliado((indexAmpliado + 1) % fotosGaleria.length);
    }
  };

  const fotoAnterior = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (indexAmpliado !== null) {
      setIndexAmpliado((indexAmpliado - 1 + fotosGaleria.length) % fotosGaleria.length);
    }
  };

  const fotoAtual = indexAmpliado !== null ? fotosGaleria[indexAmpliado] : null;

  return (
    <section id="fotos" className="min-h-[100dvh] flex flex-col justify-center bg-gray-50 py-20 scroll-mt-16 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-10 max-w-7xl">
        <p className="text-xs font-bold tracking-widest text-[#E55C42] uppercase mb-2">Nossos Ambientes</p>
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">Galeria de Fotos</h2>
      </div>
      
      <Carrossel>
        {duplicarArray(fotosGaleria).map((foto, i) => (
          <div 
            key={i} 
            // O operador % (módulo) garante que o índice corresponda à foto original, mesmo no array duplicado
            onClick={() => setIndexAmpliado(i % fotosGaleria.length)}
            className="min-w-[75vw] md:min-w-[450px] h-[380px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-sm border border-gray-200 snap-center group cursor-pointer"
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

      {/* Lightbox Modal com Navegação */}
      {fotoAtual && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={() => setIndexAmpliado(null)}>
          
          {/* Botão Fechar */}
          <button 
            onClick={() => setIndexAmpliado(null)} 
            className="absolute top-6 right-6 z-30 text-white bg-white/10 p-3 rounded-full hover:bg-[#E55C42] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Botão Anterior */}
          <button 
            onClick={fotoAnterior}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 text-white bg-white/10 p-3 md:p-4 rounded-full hover:bg-[#E55C42] transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          {/* Imagem Central */}
          <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <Image 
              src={fotoAtual.src} 
              alt={fotoAtual.label} 
              fill 
              className="object-contain" 
            />
            <div className="absolute -bottom-10 text-center text-white/80 font-medium text-lg w-full tracking-wider">
              {fotoAtual.label} ({indexAmpliado! + 1} / {fotosGaleria.length})
            </div>
          </div>

          {/* Botão Próximo */}
          <button 
            onClick={proximaFoto}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 text-white bg-white/10 p-3 md:p-4 rounded-full hover:bg-[#E55C42] transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

        </div>
      )}
    </section>
  );
}