'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import SimuladorCliente from './SimuladorCliente';

const imagensFundo = [
  '/home.jpg',
  '/piscina.webp',
  '/area-externa.jpg',
  '/sala-recepcao.webp'
];

export default function HeroSection() {
  const [bgIndex, setBgIndex] = useState(0);

  // Troca a imagem de fundo a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % imagensFundo.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#1B2A41]">
      
      {/* Background Images */}
      {imagensFundo.map((src, index) => (
        <div 
          key={src} 
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image src={src} alt={`Fundo ${index}`} fill className="object-cover" priority={index === 0} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A41] via-[#1B2A41]/70 to-[#1B2A41]/20 mix-blend-multiply" />
        </div>
      ))}
      
      {/* Container Principal */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-white flex-1 flex flex-col justify-between pt-32 md:pt-36 pb-6 md:pb-10">
        
        {/* Bloco de Textos */}
        <div className="max-w-2xl my-auto">
          <p className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase mb-3 md:mb-4 flex items-center gap-2 bg-[#8B1E32]/90 backdrop-blur-sm w-max px-3 py-1.5 rounded-full shadow-lg">
            <MapPin className="w-3 h-3" /> Itacoatiara, AM, Brasil
          </p>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-3 md:mb-4 drop-shadow-xl tracking-tight text-white/95">
            Seu descanso<br/>começa aqui.
          </h1>
          
          <p className="text-xs md:text-base lg:text-lg text-gray-200 mb-6 max-w-lg font-light drop-shadow-md leading-relaxed">
            Hospitalidade genuína, conforto e o melhor da cultura local em uma experiência inesquecível.
          </p>
        </div>
        
        {/* Bloco Inferior: Simulador */}
        <div className="w-full shrink-0">
          <SimuladorCliente />
        </div>

      </div>
    </section>
  );
}