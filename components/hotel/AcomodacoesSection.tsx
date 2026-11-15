'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Wifi, Coffee, X, BedDouble, Users } from 'lucide-react';

interface Quarto {
  id: string;
  tipo: string;
  capacidade: number;
  valorDiaria: number;
  esgotado: boolean; // Nova propriedade para controlar o visual
}

const getDescricao = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('triplo')) return 'Acomoda até 3 hóspedes, configurado com uma cama de casal e uma cama de solteiro.';
  if (t.includes('casal')) return 'Possui 1 cama de casal (king-size), acomoda 2 hóspedes.';
  if (t.includes('duplo')) return 'Possui 2 camas de solteiro separadas no mesmo ambiente. Acomoda 2 hóspedes.';
  if (t.includes('padrão') || t.includes('padrao')) return 'Possui 1 cama king size. Acomoda 1 pessoa.';
  return `Acomodação estruturada para até ${tipo} hóspedes.`;
};

// Mapeamento exato dos nomes dos seus arquivos de imagem
const getImagemQuarto = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('triplo')) return '/quarto-triplo.jpg';
  if (t.includes('casal')) return '/quarto-casal.jpg';
  if (t.includes('padrão') || t.includes('padrao')) return '/quarto-padrão.jpg';
  return '/quarto-serpa.jpg'; // Usado para o Quarto Duplo
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
                
                {/* Badge de Esgotado OBRIGATÓRIO por cima da foto */}
                {quarto.esgotado && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <span className="bg-red-600 text-white font-black px-4 py-2 rounded-xl tracking-widest text-sm shadow-xl transform -rotate-12 border-2 border-red-500/50">
                      ESGOTADO
                    </span>
                  </div>
                )}

                {/* Badge "Mais Reservado" só aparece se não estiver esgotado */}
                {!quarto.esgotado && index === 0 && (
                  <div className="absolute top-3 left-3 bg-[#E55C42] text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-md z-10 uppercase tracking-widest">
                    Mais reservado
                  </div>
                )}
              </div>

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
                  
                  {/* Troca de Botões caso o quarto esteja esgotado */}
                  <div className="flex gap-2 w-full mt-2">
                    {quarto.esgotado ? (
                      <button disabled className="w-full bg-gray-100 text-gray-400 text-xs font-bold py-3 px-2 rounded-xl text-center cursor-not-allowed">
                        Indisponível para sua busca
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

      {/* Modal de Detalhes do Quarto */}
      {quartoSelecionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setQuartoSelecionado(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setQuartoSelecionado(null)} className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-[#E55C42] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="h-64 relative w-full">
              <Image src={getImagemQuarto(quartoSelecionado.tipo)} alt={quartoSelecionado.tipo} fill className="object-cover" />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-[#0f3c26] mb-2">{quartoSelecionado.tipo}</h3>
              <p className="text-gray-600 mb-6 text-lg">{getDescricao(quartoSelecionado.tipo)}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100"><Users className="text-[#E55C42] w-6 h-6"/> <span className="font-medium text-sm">Até {quartoSelecionado.capacidade} Hóspedes</span></div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100"><BedDouble className="text-[#E55C42] w-6 h-6"/> <span className="font-medium text-sm">Camas confortáveis</span></div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Tarifa Diária</p>
                  <p className="text-3xl font-black text-gray-900">R$ {quartoSelecionado.valorDiaria.toFixed(2)}</p>
                </div>
                <button onClick={rolarParaSimulador} className="bg-[#0f3c26] hover:bg-[#E55C42] text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg">
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