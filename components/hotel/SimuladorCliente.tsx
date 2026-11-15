'use client';

import { useState } from 'react';
import { Calendar, User, ArrowRight, Check, ShieldCheck, Zap } from 'lucide-react';

export default function SimuladorCliente() {
  const [dataCheckIn, setDataCheckIn] = useState<string>('');
  const [dataCheckOut, setDataCheckOut] = useState<string>('');
  const [hospedes, setHospedes] = useState<string>('');

  const scrollToQuartos = () => {
    document.getElementById('acomodacoes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto relative z-20 mt-4 md:mt-8 pb-4">
      <div className="bg-white rounded-2xl shadow-xl p-3 md:p-4 w-full border border-gray-100 flex flex-col md:flex-row gap-2 items-end">
        <div className="w-full md:w-1/4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="date" 
              className="w-full pl-10 pr-3 h-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f3c26] outline-none text-sm text-gray-700 transition-all"
              value={dataCheckIn}
              onChange={(e) => setDataCheckIn(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="date" 
              className="w-full pl-10 pr-3 h-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f3c26] outline-none text-sm text-gray-700 transition-all"
              value={dataCheckOut}
              onChange={(e) => setDataCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">Hóspedes</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select 
              className="w-full pl-10 pr-8 h-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f3c26] outline-none text-sm text-gray-700 appearance-none transition-all cursor-pointer"
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

        <div className="w-full md:w-1/4 mt-2 md:mt-0">
          <button 
            type="button"
            onClick={scrollToQuartos}
            className="w-full bg-[#E55C42] hover:bg-[#d14b33] text-white font-bold h-12 px-4 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-[#E55C42]/20 hover:shadow-[#E55C42]/40"
          >
            <span className="text-sm">Ver quartos disponíveis</span> <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-6 text-xs font-medium text-white/90 drop-shadow-md">
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-400"/> Melhor tarifa garantida</span>
        <span className="hidden md:block w-1 h-1 rounded-full bg-white/50"></span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-400"/> Sem taxas escondidas</span>
        <span className="hidden md:block w-1 h-1 rounded-full bg-white/50"></span>
        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-400"/> Confirmação imediata</span>
      </div>
    </div>
  );
}