'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, BedDouble, Info, Image as ImageIcon, Phone, LogIn } from 'lucide-react';

interface TenantNavbarProps {
  hotelNome: string;
  isLoggedIn: boolean;
  logoSrc?: string;
}

export default function TenantNavbar({ hotelNome, isLoggedIn, logoSrc = '/logo-serpa.jpg' }: TenantNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const primeiraPalavra = hotelNome.split(' ')[0];
  const restoDoNome = hotelNome.split(' ').slice(1).join(' ');

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 hidden md:block ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className={`container mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16' : 'h-24'}`}>
          
          <div className="flex items-center gap-3">
            <div className={`rounded p-1 transition-colors ${!isScrolled ? 'bg-white/80 backdrop-blur-sm' : ''}`}>
              <Image 
                src={logoSrc} 
                alt={`Logo ${hotelNome}`} 
                width={30} 
                height={30} 
                className="rounded w-auto h-auto shadow-sm" 
              />
            </div>
            <span className={`text-lg tracking-tight uppercase transition-colors duration-300 ${isScrolled ? 'text-[#1B2A41]' : 'text-white drop-shadow-md'}`}>
              <span className="font-extrabold">{primeiraPalavra}</span>{' '}
              <span className="font-light">{restoDoNome}</span>
            </span>
          </div>

          <nav className={`flex gap-8 text-[13px] font-semibold transition-colors duration-300 ${isScrolled ? 'text-[#1B2A41]' : 'text-white drop-shadow-md'}`}>
            <a href="#hero" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[#8B1E32]' : 'hover:text-gray-200'}`}>
              Início
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[#8B1E32]' : 'bg-white'}`}></span>
            </a>
            <a href="#acomodacoes" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[#8B1E32]' : 'hover:text-gray-200'}`}>
              Quartos
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[#8B1E32]' : 'bg-white'}`}></span>
            </a>
            <a href="#detalhes" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[#8B1E32]' : 'hover:text-gray-200'}`}>
              Detalhes
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[#8B1E32]' : 'bg-white'}`}></span>
            </a>
            <a href="#fotos" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[#8B1E32]' : 'hover:text-gray-200'}`}>
              Galeria
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[#8B1E32]' : 'bg-white'}`}></span>
            </a>
            <a href="#contato" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[#8B1E32]' : 'hover:text-gray-200'}`}>
              Contatos
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[#8B1E32]' : 'bg-white'}`}></span>
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <Link 
                href="/admin" 
                className={`text-[11px] uppercase tracking-wider font-bold text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled ? 'bg-[#1B2A41] hover:bg-[#8B1E32]' : 'bg-[#8B1E32] hover:bg-[#1B2A41]'}`}
              >
                Painel Admin
              </Link>
            )}
          </div>

        </div>
      </header>

      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/70 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/50 px-5 py-2.5 flex justify-between items-center backdrop-blur-xl transition-all">
         <a href="#hero" className="flex flex-col items-center gap-0.5 text-[#1B2A41] hover:text-[#8B1E32] transition-colors">
           <Home className="w-5 h-5"/>
           <span className="text-[9px] font-semibold">Início</span>
         </a>
         <a href="#acomodacoes" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#1B2A41] transition-colors">
           <BedDouble className="w-5 h-5"/>
           <span className="text-[9px] font-medium">Quartos</span>
         </a>
         <a href="#detalhes" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#1B2A41] transition-colors">
           <Info className="w-5 h-5"/>
           <span className="text-[9px] font-medium">Detalhes</span>
         </a>
         <a href="#fotos" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#1B2A41] transition-colors">
           <ImageIcon className="w-5 h-5"/>
           <span className="text-[9px] font-medium">Galeria</span>
         </a>
         <a href="#contato" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[#1B2A41] transition-colors">
           <Phone className="w-5 h-5"/>
           <span className="text-[9px] font-medium">Contato</span>
         </a>
         {isLoggedIn && (
           <Link href="/admin" className="flex flex-col items-center gap-0.5 text-[#8B1E32] transition-transform relative">
             <LogIn className="w-5 h-5"/>
             <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#8B1E32] rounded-full animate-pulse"></span>
             <span className="text-[9px] font-bold">Admin</span>
           </Link>
         )}
      </nav>
    </>
  );
}