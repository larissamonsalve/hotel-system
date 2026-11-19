'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, User, ArrowRight, Check, ShieldCheck, Zap } from 'lucide-react';

export default function SimuladorCliente() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dataCheckIn, setDataCheckIn] = useState<string>(searchParams.get('checkIn') || '');
  const [dataCheckOut, setDataCheckOut] = useState<string>(searchParams.get('checkOut') || '');
  const [hospedes, setHospedes] = useState<string>(searchParams.get('hospedes') || '');

  const buscarQuartos = () => {
    const params = new URLSearchParams();
    
    if (dataCheckIn) params.set('checkIn', dataCheckIn);
    if (dataCheckOut) params.set('checkOut', dataCheckOut);
    if (hospedes) params.set('hospedes', hospedes);

    router.push(`?${params.toString()}#acomodacoes`, { scroll: false });
    
    setTimeout(() => {
      document.getElementById('acomodacoes')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto relative z-20">
      <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 w-full border border-slate-100 flex flex-col md:flex-row gap-2.5 items-end">
        
        <div className="w-full md:w-1/4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]} // Impede datas no passado
              className="w-full pl-9 pr-3 h-11 md:h-12 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A41] outline-none text-xs md:text-sm text-slate-700 transition-all"
              value={dataCheckIn}
              onChange={(e) => setDataCheckIn(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              min={dataCheckIn || new Date().toISOString().split('T')[0]} // Impede check-out antes do check-in
              className="w-full pl-9 pr-3 h-11 md:h-12 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A41] outline-none text-xs md:text-sm text-slate-700 transition-all"
              value={dataCheckOut}
              onChange={(e) => setDataCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Hóspedes</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              className="w-full pl-9 pr-8 h-11 md:h-12 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1B2A41] outline-none text-xs md:text-sm text-slate-700 appearance-none transition-all cursor-pointer"
              value={hospedes}
              onChange={(e) => setHospedes(e.target.value)}
            >
              <option value="" disabled>Selecione...</option>
              <option value="1">1 Hóspede</option>
              <option value="2">2 Hóspedes</option>
              <option value="3">3 Hóspedes</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-1/4 mt-1 md:mt-0">
          <button 
            type="button"
            onClick={buscarQuartos}
            className="w-full bg-[#1B2A41] hover:bg-[#8B1E32] text-white font-bold h-11 md:h-12 px-4 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-lg"
          >
            <span className="text-xs md:text-sm">Ver quartos disponíveis</span> <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 md:mt-5 text-[10px] md:text-xs font-medium text-white/90 drop-shadow-md">
        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0"/> Melhor tarifa garantida</span>
        <span className="hidden sm:block w-1 h-1 rounded-full bg-white/40"></span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0"/> Sem taxas escondidas</span>
        <span className="hidden sm:block w-1 h-1 rounded-full bg-white/40"></span>
        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400 shrink-0"/> Confirmação imediata</span>
      </div>
    </div>
  );
}