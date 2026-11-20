'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Carrossel from './Carrossel';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

type Foto = {
  src: string;
  label: string;
};

interface HotelConfig {
  corPrincipal: string;
  corSecundaria: string;
}

interface GaleriaSectionProps {
  hotelConfig?: HotelConfig;
}

export default function GaleriaSection({ hotelConfig }: GaleriaSectionProps) {
  const [indexAmpliado, setIndexAmpliado] = useState<number | null>(null);

  // Fallbacks
  const primaryColor = hotelConfig?.corPrincipal || '#1B2A41';
  const secondaryColor = hotelConfig?.corSecundaria || '#8B1E32';

  // No futuro (SaaS), estas fotos virão do banco de dados (tabela FotosGaleria relacionada ao Hotel)
  const fotosGaleria: Foto[] = [
    { src: '/frente-hotel-lateral.webp', label: 'Frente do Hotel' },
    { src: '/area-externa.jpg', label: 'Fachada' },
    { src: '/recepcao.avif', label: 'Recepção' },
    { src: '/sala-recepcao.webp', label: 'Salão de Espera' },
    { src: '/area-comum.avif', label: 'Área Comum' },
    { src: '/cafe_2.avif', label: 'Café da Manhã' },
    { src: '/piscina.webp', label: 'Piscina' },
    { src: '/quarto-padrão.jpg', label: 'Acomodações' },
  ];
  
  const duplicarArray = (arr: Foto[]) => [...arr, ...arr];

  const proximaFoto = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e) e.stopPropagation(); 
    if (indexAmpliado !== null) {
      setIndexAmpliado((prev) => (prev !== null ? (prev + 1) % fotosGaleria.length : null));
    }
  }, [indexAmpliado, fotosGaleria.length]);

  const fotoAnterior = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e) e.stopPropagation();
    if (indexAmpliado !== null) {
      setIndexAmpliado((prev) => (prev !== null ? (prev - 1 + fotosGaleria.length) % fotosGaleria.length : null));
    }
  }, [indexAmpliado, fotosGaleria.length]);

  const fecharModal = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    if (e) e.stopPropagation();
    setIndexAmpliado(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (indexAmpliado === null) return;
      
      if (e.key === 'ArrowRight') {
        proximaFoto(e);
      } else if (e.key === 'ArrowLeft') {
        fotoAnterior(e);
      } else if (e.key === 'Escape') {
        fecharModal(e);
      }
    };

    if (indexAmpliado !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [indexAmpliado, proximaFoto, fotoAnterior, fecharModal]);

  const fotoAtual = indexAmpliado !== null ? fotosGaleria[indexAmpliado] : null;

  return (
    <section id="fotos" className="min-h-[100dvh] flex flex-col justify-center bg-gray-50 py-12 md:py-16 scroll-mt-16 overflow-hidden relative">
      
      <div className="container mx-auto px-6 mb-6 md:mb-8 max-w-7xl">
        <p 
          className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase mb-2"
          style={{ color: secondaryColor }}
        >
          Nossos Ambientes
        </p>
        <h2 
          className="text-3xl md:text-[2.5rem] font-medium tracking-tight leading-tight"
          style={{ color: primaryColor }}
        >
          Galeria de Fotos
        </h2>
      </div>
      
      {/* O Carrossel recebe as cores do hotel para customizar as setas de navegação */}
      <Carrossel corPrincipal={primaryColor} corSecundaria={secondaryColor}>
        {duplicarArray(fotosGaleria).map((foto, i) => (
          <div 
            key={i} 
            onClick={() => setIndexAmpliado(i % fotosGaleria.length)}
            className="min-w-[70vw] sm:min-w-[320px] md:min-w-[380px] h-[280px] md:h-[350px] relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 snap-center group/card cursor-pointer"
          >
            <Image 
              src={foto.src} 
              alt={foto.label} 
              fill 
              sizes="(max-width: 768px) 75vw, 380px"
              priority={i === 0}
              className="object-cover group-hover/card:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" />
            
            <div 
              className="absolute top-5 right-5 p-2.5 rounded-full text-white opacity-0 group-hover/card:opacity-100 transition-all duration-300 backdrop-blur-sm shadow-md"
              style={{ backgroundColor: `${primaryColor}CC` }} // 80% opacity
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${primaryColor}CC`}
            >
              <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
            </div>

            <div className="absolute bottom-6 left-6 text-white transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
              <p className="font-semibold text-xl md:text-2xl drop-shadow-md">{foto.label}</p>
            </div>
          </div>
        ))}
      </Carrossel>

      {/* MODAL FULLSCREEN */}
      {fotoAtual && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0d1520]/95 backdrop-blur-md" 
          onClick={fecharModal}
          role="dialog"
          aria-modal="true"
        >
          
          <button 
            onClick={fecharModal} 
            aria-label="Fechar"
            className="absolute top-4 right-4 md:top-6 md:right-6 z-30 text-slate-300 bg-white/10 p-2.5 md:p-3 rounded-full transition-colors border border-white/10"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = secondaryColor;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button 
            onClick={fotoAnterior}
            aria-label="Foto anterior"
            className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/10"
            style={{ backgroundColor: `${primaryColor}99` }} // 60% opacity
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${primaryColor}99`}
          >
            <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
          </button>
          
          <div 
            className="relative w-full max-w-4xl h-[55vh] md:h-[70vh] flex items-center justify-center animate-in fade-in zoom-in duration-300 px-12 md:px-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={fotoAtual.src} 
              alt={fotoAtual.label} 
              fill 
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain" 
            />
            <div className="absolute -bottom-10 text-center text-white/90 font-medium text-sm md:text-base w-full tracking-wider bg-black/50 py-1.5 px-4 rounded-full max-w-max mx-auto left-0 right-0 backdrop-blur-sm">
              {fotoAtual.label} <span className="text-white/60 ml-2">({indexAmpliado! + 1} / {fotosGaleria.length})</span>
            </div>
          </div>

          <button 
            onClick={proximaFoto}
            aria-label="Próxima foto"
            className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/10"
            style={{ backgroundColor: `${primaryColor}99` }} // 60% opacity
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${primaryColor}99`}
          >
            <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
          </button>

        </div>
      )}
    </section>
  );
}