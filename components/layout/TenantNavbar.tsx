'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, BedDouble, Info, Image as ImageIcon, Phone, LogIn, Globe, Moon, Sun } from 'lucide-react';

interface HotelConfig {
  nome: string;
  logoUrl?: string | null;
  corPrincipal: string;
  corSecundaria: string;
}

interface TenantNavbarProps {
  hotelNome: string;
  isLoggedIn: boolean;
  logoSrc?: string;
  hotelConfig?: HotelConfig;
}

export default function TenantNavbar({ 
  hotelNome, 
  isLoggedIn, 
  logoSrc = '/logo-serpa.jpg', 
  hotelConfig 
}: TenantNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(lang === 'pt' ? 'en' : 'pt');

  // Variáveis White-label
  const nomeReal = hotelConfig?.nome || hotelNome;
  const logoReal = hotelConfig?.logoUrl || logoSrc;
  const primaryColor = hotelConfig?.corPrincipal || '#1B2A41';
  const secondaryColor = hotelConfig?.corSecundaria || '#8B1E32';

  const primeiraPalavra = nomeReal.split(' ')[0];
  const restoDoNome = nomeReal.split(' ').slice(1).join(' ');

  // Objeto de variáveis CSS que será injetado nos containers
  const cssVars = {
    '--color-primary': primaryColor,
    '--color-secondary': secondaryColor
  } as React.CSSProperties;

  return (
    <>
      {/* =========================================
          DESKTOP NAVBAR
      ============================================= */}
      <header 
        style={cssVars}
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
                src={logoReal} 
                alt={`Logo ${nomeReal}`} 
                width={30} 
                height={30} 
                className="rounded w-auto h-auto shadow-sm" 
              />
            </div>
            <span className={`text-lg tracking-tight uppercase transition-colors duration-300 ${isScrolled ? 'text-[var(--color-primary)]' : 'text-white drop-shadow-md'}`}>
              <span className="font-extrabold">{primeiraPalavra}</span>{' '}
              <span className="font-light">{restoDoNome}</span>
            </span>
          </div>

          {/* Nav original usando tailwind JIT para hover */}
          <nav className={`flex gap-8 text-[13px] font-semibold transition-colors duration-300 ${isScrolled ? 'text-[var(--color-primary)]' : 'text-white drop-shadow-md'}`}>
            <a href="#hero" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[var(--color-secondary)]' : 'hover:text-gray-200'}`}>
              {lang === 'pt' ? 'Início' : 'Home'}
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[var(--color-secondary)]' : 'bg-white'}`}></span>
            </a>
            <a href="#acomodacoes" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[var(--color-secondary)]' : 'hover:text-gray-200'}`}>
              {lang === 'pt' ? 'Quartos' : 'Rooms'}
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[var(--color-secondary)]' : 'bg-white'}`}></span>
            </a>
            <a href="#detalhes" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[var(--color-secondary)]' : 'hover:text-gray-200'}`}>
              {lang === 'pt' ? 'Detalhes' : 'Details'}
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[var(--color-secondary)]' : 'bg-white'}`}></span>
            </a>
            <a href="#fotos" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[var(--color-secondary)]' : 'hover:text-gray-200'}`}>
              {lang === 'pt' ? 'Galeria' : 'Gallery'}
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[var(--color-secondary)]' : 'bg-white'}`}></span>
            </a>
            <a href="#contato" className={`relative group py-1.5 transition-colors ${isScrolled ? 'hover:text-[var(--color-secondary)]' : 'hover:text-gray-200'}`}>
              {lang === 'pt' ? 'Contatos' : 'Contact'}
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] group-hover:w-full transition-all duration-300 ${isScrolled ? 'bg-[var(--color-secondary)]' : 'bg-white'}`}></span>
            </a>
          </nav>

          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={toggleLang}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase transition-all duration-300 ${isScrolled ? 'text-[var(--color-primary)] hover:bg-slate-100' : 'text-white hover:bg-white/20'}`}
            >
              <Globe className="w-4 h-4" />
              <span>{lang}</span>
            </button>

            <button 
              onClick={toggleTheme}
              className={`p-1.5 rounded-md transition-all duration-300 ${isScrolled ? 'text-[var(--color-primary)] hover:bg-slate-100' : 'text-white hover:bg-white/20'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn && (
              <Link 
                href="/admin" 
                className={`ml-2 text-[11px] uppercase tracking-wider font-bold text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${isScrolled ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' : 'bg-[var(--color-secondary)] hover:bg-[var(--color-primary)]'}`}
              >
                Admin
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* =========================================
          MOBILE TOP NAVBAR (Logo & Utilitários)
      ============================================= */}
      <header style={cssVars} className={`md:hidden fixed top-0 w-full z-40 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm py-3' : 'bg-transparent py-4'}`}>
        <div className="px-5 flex items-center justify-between">
          <div className={`rounded p-1 transition-colors ${!isScrolled ? 'bg-white/80 backdrop-blur-sm' : ''}`}>
            <Image src={logoReal} alt={`Logo`} width={24} height={24} className="rounded w-auto h-auto" />
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className={`flex items-center gap-1 transition-colors ${isScrolled ? 'text-[var(--color-primary)]' : 'text-white drop-shadow-md'}`}>
              <Globe className="w-[18px] h-[18px]" />
              <span className="text-[10px] font-bold uppercase">{lang}</span>
            </button>
            <button onClick={toggleTheme} className={`transition-colors ${isScrolled ? 'text-[var(--color-primary)]' : 'text-white drop-shadow-md'}`}>
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================
          MOBILE BOTTOM DOCK (Navegação Principal)
      ============================================= */}
      <nav style={cssVars} className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/70 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/50 px-5 py-2.5 flex justify-between items-center backdrop-blur-xl transition-all">
         <a href="#hero" className="flex flex-col items-center gap-0.5 text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
           <Home className="w-5 h-5"/>
           <span className="text-[9px] font-semibold">{lang === 'pt' ? 'Início' : 'Home'}</span>
         </a>
         <a href="#acomodacoes" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
           <BedDouble className="w-5 h-5"/>
           <span className="text-[9px] font-medium">{lang === 'pt' ? 'Quartos' : 'Rooms'}</span>
         </a>
         <a href="#detalhes" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
           <Info className="w-5 h-5"/>
           <span className="text-[9px] font-medium">{lang === 'pt' ? 'Detalhes' : 'Details'}</span>
         </a>
         <a href="#fotos" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
           <ImageIcon className="w-5 h-5"/>
           <span className="text-[9px] font-medium">{lang === 'pt' ? 'Galeria' : 'Gallery'}</span>
         </a>
         <a href="#contato" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
           <Phone className="w-5 h-5"/>
           <span className="text-[9px] font-medium">{lang === 'pt' ? 'Contato' : 'Contact'}</span>
         </a>
         {isLoggedIn && (
           <Link href="/admin" className="flex flex-col items-center gap-0.5 text-[var(--color-secondary)] transition-transform relative">
             <LogIn className="w-5 h-5"/>
             <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full animate-pulse"></span>
             <span className="text-[9px] font-bold">Admin</span>
           </Link>
         )}
      </nav>
    </>
  );
}