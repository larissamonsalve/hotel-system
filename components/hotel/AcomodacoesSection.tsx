'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Wifi, Coffee } from 'lucide-react';
import QuartoModal from './QuartoModal'; // <-- Importando o novo componente

interface Quarto {
  id: string;
  tipo: string;
  capacidade: number;
  valorDiaria: number;
  esgotado: boolean;
}

const getDescricao = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('triplo')) return 'Acomoda até 3 hóspedes, configurado com uma cama de casal e uma cama de solteiro.';
  if (t.includes('casal')) return 'Possui 1 cama de casal (king-size), acomoda 2 hóspedes.';
  if (t.includes('duplo')) return 'Possui 2 camas de solteiro separadas no mesmo ambiente. Acomoda 2 hóspedes.';
  if (t.includes('padrão') || t.includes('padrao')) return 'Possui 1 cama king size. Acomoda 1 pessoa.';
  return `Acomodação estruturada para até ${tipo} hóspedes.`;
};

const getImagemQuarto = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('triplo')) return '/quarto-triplo.jpg';
  if (t.includes('casal')) return '/quarto-casal.jpg';
  if (t.includes('padrão') || t.includes('padrao')) return '/quarto-padrão.jpg';
  return '/quarto-serpa.jpg'; 
};

export default function AcomodacoesSection({ quartos }: { quartos: Quarto[] }) {
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);

  const rolarParaSimulador = () => {
    setQuartoSelecionado(null);
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="acomodacoes" className="min-h-screen flex flex-col justify-center bg-gray-50 py-16 scroll-mt-16 relative">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center md:text-left">
          <p className="text-xs font-bold tracking-widest text-[#E55C42] uppercase mb-2">Acomodações</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">Quartos para todos os momentos</h2>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {quartos.map((quarto, index) => (
            <div 
              key={quarto.id} 
              className={`min-w-[85vw] md:min-w-[300px] lg:min-w-0 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 flex flex-col h-full snap-center group ${quarto.esgotado ? 'opacity-80' : 'hover:shadow-xl hover:-translate-y-1'}`}
            >
              {/* Foto do Quarto */}
              <div className="h-52 relative overflow-hidden bg-gray-200">
                <Image 
                  src={getImagemQuarto(quarto.tipo)} 
                  alt={quarto.tipo} 
                  fill 
                  className={`object-cover transition-transform duration-700 ${quarto.esgotado ? 'grayscale' : 'group-hover:scale-110'}`} 
                />
                
                {quarto.esgotado && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <span className="bg-red-600 text-white font-black px-4 py-2 rounded-xl tracking-widest text-sm shadow-xl transform -rotate-12 border-2 border-red-500/50">
                      ESGOTADO
                    </span>
                  </div>
                )}

                {!quarto.esgotado && index === 0 && (
                  <div className="absolute top-3 left-3 bg-[#E55C42] text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-md z-10 uppercase tracking-widest">
                    Mais reservado
                  </div>
                )}
              </div>

              {/* Corpo do Card */}
              <div className="p-6 flex flex-col flex-1 relative z-20 bg-white">
                <h3 className={`text-[1.3rem] font-bold tracking-tight mb-2 ${quarto.esgotado ? 'text-gray-500 line-through' : 'text-[#0f3c26]'}`}>
                  {quarto.tipo}
                </h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">{getDescricao(quarto.tipo)}</p>
                
                <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 font-medium mb-6 mt-auto">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100"><Wifi className="w-3.5 h-3.5 text-gray-400"/> Wi-Fi</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100"><Coffee className="w-3.5 h-3.5 text-gray-400"/> Café</span>
                </div>
                
                <div className="pt-4 flex flex-col gap-3 border-t border-gray-100 mt-auto">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5 font-bold">
                      {quarto.esgotado ? 'Tarifa' : 'A partir de'}
                    </p>
                    <p className={`text-2xl font-black leading-none ${quarto.esgotado ? 'text-gray-400' : 'text-gray-900'}`}>
                      R$ {quarto.valorDiaria.toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Botões */}
                  <div className="flex gap-2 w-full mt-2">
                    {quarto.esgotado ? (
                      <button disabled className="w-full bg-gray-100 text-gray-400 text-xs font-bold py-3 px-2 rounded-xl text-center cursor-not-allowed">
                        Indisponível
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setQuartoSelecionado(quarto)} className="flex-1 bg-gray-100 text-[#0f3c26] hover:bg-gray-200 text-xs font-bold py-3 px-2 rounded-xl transition-colors text-center">
                          Ver detalhes
                        </button>
                        <button onClick={rolarParaSimulador} className="flex-1 bg-[#0f3c26] hover:bg-[#E55C42] text-white text-xs font-bold py-3 px-2 rounded-xl transition-colors duration-300 text-center shadow-md hover:shadow-lg">
                          Reservar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Renderização do Novo Componente de Modal */}
      {quartoSelecionado && (
        <QuartoModal 
          quarto={quartoSelecionado}
          imagem={getImagemQuarto(quartoSelecionado.tipo)}
          descricao={getDescricao(quartoSelecionado.tipo)}
          onClose={() => setQuartoSelecionado(null)}
          onReservar={rolarParaSimulador}
        />
      )}
    </section>
  );
}