'use client';

import Image from 'next/image';
import { X, Users, BedDouble, Tv, Wind, Bath, ConciergeBell } from 'lucide-react';

interface Quarto {
  id: string;
  tipo: string;
  capacidade: number;
  valorDiaria: number;
  esgotado?: boolean;
}

interface QuartoModalProps {
  quarto: Quarto;
  imagem: string;
  descricao: string;
  onClose: () => void;
  onReservar: () => void;
}

export default function QuartoModal({ quarto, imagem, descricao, onClose, onReservar }: QuartoModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#0d1520]/80 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl max-h-[95vh] flex flex-col md:flex-row rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          aria-label="Fechar detalhes"
          className="absolute top-3 right-3 md:top-4 md:right-4 z-30 bg-black/50 md:bg-slate-100 text-white md:text-slate-600 p-2 md:p-2.5 rounded-full hover:bg-[#8B1E32] hover:text-white transition-colors"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className="w-full md:w-1/2 h-40 sm:h-48 md:h-auto relative shrink-0 bg-[#1B2A41]">
          <Image 
            src={imagem} 
            alt={quarto.tipo} 
            fill 
            className="object-cover opacity-90" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A41]/95 via-[#1B2A41]/30 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white hidden md:flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#8B1E32] w-max px-2.5 py-1 rounded-md">
              Acomodação Disponível
            </span>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-200 mt-1">
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <Users className="w-4 h-4 text-[#8B1E32]" /> Até {quarto.capacidade} hóspede(s)
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <BedDouble className="w-4 h-4 text-[#8B1E32]" /> Conforto Garantido
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between overflow-y-auto md:overflow-visible">
          <div>
            <p className="text-[9px] md:text-[11px] font-bold tracking-widest text-[#8B1E32] uppercase mb-1">
              Detalhes da Suíte
            </p>
            <h3 className="text-lg md:text-3xl font-bold text-[#1B2A41] mb-1 md:mb-3 pr-8 leading-tight">
              {quarto.tipo}
            </h3>
            <p className="text-slate-600 text-[11px] md:text-base leading-snug mb-3 md:mb-5 line-clamp-2 md:line-clamp-none">
              {descricao}
            </p>

            <div className="mb-2 md:mb-6">
              <p className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 md:mb-3">
                Comodidades do Quarto
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] md:text-[13px] text-slate-700">
                
                <div className="flex flex-col bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                  <span className="font-bold text-[#1B2A41] mb-0.5 flex items-center gap-1.5 text-[10px] md:text-sm">
                    <Bath className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B1E32]"/> Banheiro
                  </span>
                  <span className="text-slate-500 text-[9px] md:text-[11px] leading-tight">Chuveiro, Toalhas</span>
                </div>

                <div className="flex flex-col bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                  <span className="font-bold text-[#1B2A41] mb-0.5 flex items-center gap-1.5 text-[10px] md:text-sm">
                    <Wind className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B1E32]"/> Quarto
                  </span>
                  <span className="text-slate-500 text-[9px] md:text-[11px] leading-tight">Ar-condicionado</span>
                </div>

                <div className="flex flex-col bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                  <span className="font-bold text-[#1B2A41] mb-0.5 flex items-center gap-1.5 text-[10px] md:text-sm">
                    <Tv className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B1E32]"/> Entret.
                  </span>
                  <span className="text-slate-500 text-[9px] md:text-[11px] leading-tight">TV via satélite</span>
                </div>

                <div className="flex flex-col bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                  <span className="font-bold text-[#1B2A41] mb-0.5 flex items-center gap-1.5 text-[10px] md:text-sm">
                    <ConciergeBell className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B1E32]"/> Serviço
                  </span>
                  <span className="text-slate-500 text-[9px] md:text-[11px] leading-tight">Limpeza</span>
                </div>

              </div>
            </div>
          </div>

          <div className="pt-2 md:pt-5 border-t border-slate-100 flex items-center justify-between gap-3 md:gap-4 mt-2 md:mt-0">
            <div>
              <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">
                A partir de
              </p>
              <p className="text-lg md:text-3xl font-black text-slate-900 leading-none">
                R$ {quarto.valorDiaria.toFixed(2)}
              </p>
            </div>
            <button 
              onClick={onReservar} 
              className="bg-[#1B2A41] hover:bg-[#8B1E32] text-white text-xs md:text-sm font-bold py-2.5 px-4 md:py-3.5 md:px-6 rounded-lg md:rounded-xl transition-all duration-300 shadow-md hover:shadow-xl shrink-0"
            >
              Reservar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}