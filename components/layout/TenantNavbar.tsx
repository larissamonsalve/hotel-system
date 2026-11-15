import Image from 'next/image';
import Link from 'next/link';
import { Home, BedDouble, Info, Image as ImageIcon, LogIn } from 'lucide-react';

interface TenantNavbarProps {
  hotelNome: string;
  isLoggedIn: boolean;
  logoSrc?: string;
}

export default function TenantNavbar({ hotelNome, isLoggedIn, logoSrc = '/logo-serpa.jpg' }: TenantNavbarProps) {
  return (
    <>
      {/* Desktop Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all hidden md:block">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logoSrc} alt={`Logo ${hotelNome}`} width={32} height={32} className="rounded" />
            <span className="text-lg font-bold text-[#0f3c26] tracking-tight">{hotelNome}</span>
          </div>
          <nav className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#hero" className="hover:text-[#0f3c26] transition-colors">Início</a>
            <a href="#acomodacoes" className="hover:text-[#0f3c26] transition-colors">Quartos</a>
            <a href="#detalhes" className="hover:text-[#0f3c26] transition-colors">Detalhes</a>
            <a href="#fotos" className="hover:text-[#0f3c26] transition-colors">Galeria</a>
          </nav>
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <Link href="/admin" className="text-xs font-bold bg-[#0f3c26] text-white px-4 py-2 rounded-lg hover:bg-[#0a2a1a] transition-colors shadow-md">
                Painel Admin
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Navbar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-6 py-3 flex justify-between items-center backdrop-blur-lg">
         <a href="#hero" className="flex flex-col items-center text-[#0f3c26]"><Home className="w-5 h-5"/></a>
         <a href="#acomodacoes" className="flex flex-col items-center text-gray-400 hover:text-[#0f3c26]"><BedDouble className="w-5 h-5"/></a>
         <a href="#detalhes" className="flex flex-col items-center text-gray-400 hover:text-[#0f3c26]"><Info className="w-5 h-5"/></a>
         <a href="#fotos" className="flex flex-col items-center text-gray-400 hover:text-[#0f3c26]"><ImageIcon className="w-5 h-5"/></a>
         {isLoggedIn && <Link href="/admin" className="flex flex-col items-center text-[#E55C42]"><LogIn className="w-5 h-5"/></Link>}
      </nav>
    </>
  );
}