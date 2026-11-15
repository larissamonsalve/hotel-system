'use client';

import Image from 'next/image';
import { X, Users, BedDouble, Wifi, Coffee, CheckCircle2 } from 'lucide-react';

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          aria-label="Fechar detalhes"
          className="absolute top-4 right-4 z-30 bg-black/50 md:bg-gray-100 text-white md:text-gray-600 p-2.5 rounded-full hover:bg-[#E55C42] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 h-56 md:h-auto relative shrink-0 bg-gray-900">
          <Image 
            src={imagem} 
            alt={quarto.tipo} 
            fill 
            className="object-cover opacity-90" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white hidden md:flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#E55C42] w-max px-2.5 py-1 rounded-md">
              Acomodação Disponível
            </span>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-200 mt-1">
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <Users className="w-4 h-4 text-[#E55C42]" /> Até {quarto.capacidade} hóspede(s)
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <BedDouble className="w-4 h-4 text-[#E55C42]" /> Conforto Garantido
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto md:overflow-visible">
          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#E55C42] uppercase mb-1">
              Detalhes da Suíte
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-[#0f3c26] mb-3 pr-8">
              {quarto.tipo}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
              {descricao}
            </p>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                O que está incluso
              </p>
              <div className="grid grid-cols-2 gap-2.5 text-xs md:text-sm text-gray-700">
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Wifi className="text-[#0f3c26] w-4 h-4 shrink-0" />
                  <span className="font-medium">Wi-Fi Grátis</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Coffee className="text-[#0f3c26] w-4 h-4 shrink-0" />
                  <span className="font-medium">Café da Manhã</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Users className="text-[#0f3c26] w-4 h-4 shrink-0" />
                  <span className="font-medium">Até {quarto.capacidade} Pessoas</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <CheckCircle2 className="text-[#0f3c26] w-4 h-4 shrink-0" />
                  <span className="font-medium">Recepção 24h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                Tarifa Diária
              </p>
              <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
                R$ {quarto.valorDiaria.toFixed(2)}
              </p>
            </div>
            <button 
              onClick={onReservar} 
              className="bg-[#0f3c26] hover:bg-[#E55C42] text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl shrink-0"
            >
              Reservar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}