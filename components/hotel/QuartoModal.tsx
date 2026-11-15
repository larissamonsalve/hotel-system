'use client';

import Image from 'next/image';
import { X, Users, BedDouble, Wifi, Coffee } from 'lucide-react';

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Botão Fechar Flutuante (Fixo) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-[#E55C42] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-48 md:h-64 relative w-full shrink-0 bg-gray-200">
          <Image src={imagem} alt={quarto.tipo} fill className="object-cover" />
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-[#0f3c26] mb-2">{quarto.tipo}</h3>
          <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed">{descricao}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Users className="text-[#E55C42] w-5 h-5 md:w-6 md:h-6 shrink-0"/> 
              <span className="font-medium text-sm">Até {quarto.capacidade} Hóspedes</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <BedDouble className="text-[#E55C42] w-5 h-5 md:w-6 md:h-6 shrink-0"/> 
              <span className="font-medium text-sm">Camas confortáveis</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Wifi className="text-[#E55C42] w-5 h-5 md:w-6 md:h-6 shrink-0"/> 
              <span className="font-medium text-sm">Internet Alta Vel.</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Coffee className="text-[#E55C42] w-5 h-5 md:w-6 md:h-6 shrink-0"/> 
              <span className="font-medium text-sm">Café da Manhã</span>
            </div>
          </div>
          
          {/* Rodapé Interno do Modal */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Tarifa Diária</p>
              <p className="text-3xl font-black text-gray-900">R$ {quarto.valorDiaria.toFixed(2)}</p>
            </div>
            <button 
              onClick={onReservar} 
              className="w-full sm:w-auto bg-[#0f3c26] hover:bg-[#E55C42] text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg"
            >
              Reservar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}