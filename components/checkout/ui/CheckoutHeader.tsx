'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

interface HotelConfig {
  nome: string;
  logoUrl: string | null;
  corPrincipal: string;
}

export default function CheckoutHeader({ hotelConfig }: { hotelConfig: HotelConfig }) {
  const router = useRouter();
  
  const primeiraPalavra = hotelConfig.nome.split(' ')[0];
  const restoDoNome = hotelConfig.nome.split(' ').slice(1).join(' ');

  return (
    <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 grid grid-cols-3 items-center sticky top-0 z-50 shadow-sm">
      <div className="flex justify-start">
        <button 
          onClick={() => router.back()} 
          className="text-slate-500 text-xs sm:text-sm font-medium transition-colors"
          onMouseEnter={(e) => e.currentTarget.style.color = hotelConfig.corPrincipal}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          ← Voltar
        </button>
      </div>
      
      <div className="flex justify-center items-center gap-3">
        <div className="rounded p-1 bg-slate-50 border border-slate-100 hidden sm:block">
          <Image 
            src={hotelConfig.logoUrl || '/logo-serpa.jpg'} 
            alt="Logo" 
            width={24} 
            height={24} 
            className="rounded w-auto h-auto object-contain" 
          />
        </div>
        <span className="text-sm sm:text-lg tracking-tight uppercase" style={{ color: hotelConfig.corPrincipal }}>
          <span className="font-extrabold">{primeiraPalavra}</span>{' '}
          <span className="font-light">{restoDoNome}</span>
        </span>
      </div>

      <div className="flex justify-end items-center gap-1.5 text-emerald-600 text-xs sm:text-sm">
        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:block font-medium">Ambiente Seguro</span>
        <span className="block sm:hidden font-medium">Seguro</span>
      </div>
    </header>
  );
}