'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarrosselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  corPrincipal?: string;
  corSecundaria?: string;
}

export default function Carrossel({ children, autoPlay = true, corPrincipal = '#1B2A41', corSecundaria = '#8B1E32' }: CarrosselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Rolagem automática
  useEffect(() => {
    if (!autoPlay || isHovered) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Se chegou no final, volta para o começo
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Rola um card para a direita
          scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 3500); // Passa a cada 3.5 segundos

    return () => clearInterval(interval);
  }, [isHovered, autoPlay]);

  // Navegação pelos botões
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative group w-full"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Botão Voltar */}
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/95 p-3 md:p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
        style={{ color: corPrincipal }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = corSecundaria;
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.color = corPrincipal;
        }}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      {/* Container de Rolagem */}
      <div 
        ref={scrollRef} 
        className="flex overflow-x-auto gap-6 snap-x snap-mandatory px-6 pb-8 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {children}
      </div>

      {/* Botão Avançar */}
      <button 
        onClick={() => scroll('right')} 
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/95 p-3 md:p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
        style={{ color: corPrincipal }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = corSecundaria;
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.color = corPrincipal;
        }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}