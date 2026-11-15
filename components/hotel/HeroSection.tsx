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
    <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-[#0f3c26]">
      {/* Background Images com transição suave */}
      {imagensFundo.map((src, index) => (
        <div 
          key={src} 
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image src={src} alt={`Fundo ${index}`} fill className="object-cover" priority={index === 0} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f3c26]/95 via-[#0f3c26]/60 to-[#0f3c26]/30 mix-blend-multiply" />
        </div>
      ))}
      
      <div className="container mx-auto px-6 relative z-10 text-white flex-1 flex flex-col justify-center pt-28 md:pt-32 pb-16 md:pb-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2 bg-[#E55C42] w-max px-3 py-1.5 rounded-lg shadow-lg">
            <MapPin className="w-3.5 h-3.5" /> Itacoatiara, AM, Brasil
          </p>
          <h1 className="text-4xl md:text-7xl font-extrabold leading-[1.05] mb-4 md:mb-6 drop-shadow-xl tracking-tight">
            Seu descanso<br/>começa aqui.
          </h1>
          <p className="text-base md:text-xl text-gray-100 mb-8 max-w-lg font-light drop-shadow-md">
            Hospitalidade genuína, conforto e o melhor da cultura local em uma experiência inesquecível.
          </p>
        </div>
        <SimuladorCliente />
      </div>
    </section>
  );
}