'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import SimuladorCliente from './SimuladorCliente';

interface HotelConfig {
  endereco: string | null;
  corPrincipal: string;
  corSecundaria: string;
}

interface HeroSectionProps {
  hotelConfig: HotelConfig;
}

// No futuro, essas imagens poderão vir de uma tabela "Galeria" do banco de dados
const imagensFundo = [
  '/home.jpg',
  '/piscina.webp',
  '/area-externa.jpg',
  '/sala-recepcao.webp'
];

export default function HeroSection({ hotelConfig }: HeroSectionProps) {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % imagensFundo.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Extrai apenas a cidade/estado se possível (ou exibe o endereço completo caso seja curto)
  // Como o seu banco salva o endereço todo, pegamos um pedaço genérico caso o campo exista
  const localizacao = hotelConfig.endereco 
    ? hotelConfig.endereco.split(',').slice(-2).join(',').replace(' CEP', '').trim()
    : 'Localização Privilegiada';

  return (
    <section 
      id="hero" 
      className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: hotelConfig.corPrincipal }}
    >
      
      {imagensFundo.map((src, index) => (
        <div 
          key={src} 
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image 
            src={src} 
            alt={`Fundo ${index}`} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="object-cover" 
            priority={index === 0} 
          />
          {/* Overlay gradiente usando a cor principal do hotel para misturar com a imagem */}
          <div 
            className="absolute inset-0 mix-blend-multiply" 
            style={{ backgroundImage: `linear-gradient(to top, ${hotelConfig.corPrincipal}, ${hotelConfig.corPrincipal}B3, ${hotelConfig.corPrincipal}33)` }}
          />
        </div>
      ))}

      {/* Sombra de topo dinâmica */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 z-0 pointer-events-none"
        style={{ backgroundImage: `linear-gradient(to bottom, ${hotelConfig.corPrincipal}CC, transparent)` }}
      ></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-white flex-1 flex flex-col justify-between pt-32 md:pt-36 pb-6 md:pb-10">
        
        <div className="max-w-2xl my-auto">
          {/* Badge dinâmica com a cor secundária e 90% de opacidade (E6 em Hex) */}
          <p 
            className="text-[9px] md:text-[10px] text-white font-bold tracking-[0.2em] uppercase mb-3 md:mb-4 flex items-center gap-2 backdrop-blur-sm w-max px-3 py-1.5 rounded-full shadow-lg"
            style={{ backgroundColor: `${hotelConfig.corSecundaria}E6` }}
          >
            <MapPin className="w-3 h-3" /> {localizacao}
          </p>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-3 md:mb-4 drop-shadow-xl tracking-tight text-white/95">
            Seu descanso<br/>começa aqui.
          </h1>
          
          <p className="text-xs md:text-base lg:text-lg text-gray-200 mb-6 max-w-lg font-light drop-shadow-md leading-relaxed">
            Hospitalidade genuína, conforto e o melhor da cultura local em uma experiência inesquecível.
          </p>
        </div>
        
        <div className="w-full shrink-0">
          <SimuladorCliente hotelConfig={hotelConfig} />
        </div>

      </div>
    </section>
  );
}