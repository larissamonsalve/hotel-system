'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Wifi, Coffee, X, BedDouble, Users } from 'lucide-react';

interface Quarto {
  id: string;
  tipo: string;
  capacidade: number;
  valorDiaria: number;
}

// Mapeia a descrição exata exigida pelo documento com base no tipo
const getDescricao = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('triplo')) return 'Acomoda até 3 hóspedes, geralmente configurado com uma cama de casal e uma cama de solteiro.';
  if (t.includes('casal')) return 'Possui 1 cama de casal (king-size), acomoda 2 hóspedes.';
  if (t.includes('duplo')) return 'Possui 2 camas de solteiro separadas no mesmo ambiente. Acomoda 2 hóspedes.';
  if (t.includes('padrão') || t.includes('padrao')) return 'Possui 1 cama king size. Acomoda 1 pessoa.';
  return `Acomodação estruturada para até ${tipo} hóspedes.`;
};

export default function AcomodacoesSection({ quartos }: { quartos: Quarto[] }) {
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);

  return (
    <section id="acomodacoes" className="min-h-screen flex flex-col justify-center bg-gray-50 py-16 scroll-mt-16">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center md:text-left">
          <p className="text-xs font-bold tracking-widest text-[#E55C42] uppercase mb-2">Acomodações</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">Quartos para todos os momentos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quartos.map((quarto, index) => (
            <div 
              key={quarto.id} 
              onClick={() => setQuartoSelecionado(quarto)}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0f3c26]/30 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group cursor-pointer"
            >
              <div className="h-52 relative overflow-hidden">
                <Image src="/quarto-serpa.jpg" alt={quarto.tipo} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                {index === 0 && (
                  <div className="absolute top-3 left-3 bg-[#E55C42] text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-md z-10 uppercase tracking-widest">
                    Mais reservado
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1 bg-white">
                <h3 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-2 group-hover:text-[#0f3c26] transition-colors">{quarto.tipo}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">{getDescricao(quarto.tipo)}</p>
                
                <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 font-medium mb-6 mt-auto">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Wifi className="w-3.5 h-3.5 text-[#0f3c26]"/> Wi-Fi</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><Coffee className="w-3.5 h-3.5 text-[#0f3c26]"/> Café</span>
                </div>
                
                <div className="pt-4 flex justify-between items-center border-t border-gray-50">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5 font-bold">A partir de</p>
                    <p className="text-2xl font-black text-gray-900 leading-none">R$ {quarto.valorDiaria.toFixed(2)}</p>
                  </div>
                  {/* Botão verde que muda para laranja/avermelhado no hover */}
                  <button className="bg-[#0f3c26] text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors duration-300 group-hover:bg-[#E55C42]">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes do Quarto */}
      {quartoSelecionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setQuartoSelecionado(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuartoSelecionado(null)} className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-[#E55C42] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="h-64 relative w-full">
              <Image src="/quarto-serpa.jpg" alt={quartoSelecionado.tipo} fill className="object-cover" />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-[#0f3c26] mb-2">{quartoSelecionado.tipo}</h3>
              <p className="text-gray-600 mb-6 text-lg">{getDescricao(quartoSelecionado.tipo)}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100"><Users className="text-[#E55C42] w-6 h-6"/> <span className="font-medium text-sm">Capacidade: {quartoSelecionado.capacidade} Hóspedes</span></div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100"><BedDouble className="text-[#E55C42] w-6 h-6"/> <span className="font-medium text-sm">Camas confortáveis</span></div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100"><Wifi className="text-[#E55C42] w-6 h-6"/> <span className="font-medium text-sm">Internet de Alta Velocidade</span></div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100"><Coffee className="text-[#E55C42] w-6 h-6"/> <span className="font-medium text-sm">Café da Manhã Incluso</span></div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Tarifa da Diária</p>
                  <p className="text-3xl font-black text-gray-900">R$ {quartoSelecionado.valorDiaria.toFixed(2)}</p>
                </div>
                <button onClick={() => { setQuartoSelecionado(null); document.getElementById('hero')?.scrollIntoView({behavior:'smooth'}) }} className="bg-[#0f3c26] hover:bg-[#E55C42] text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg">
                  Simular Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}