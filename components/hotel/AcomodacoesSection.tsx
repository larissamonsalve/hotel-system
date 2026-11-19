'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Wifi, Coffee, Eye } from 'lucide-react';
import QuartoModal from './QuartoModal';

interface Quarto {
  id: string;
  tipo: string;
  capacidade: number;
  valorDiaria: number;
  esgotado: boolean;
}

const getDescricao = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('triplo')) return 'Acomoda até 3 hóspedes, geralmente configurado com uma cama de casal e uma cama de solteiro.';
  if (t.includes('casal')) return 'Possui 1 cama de casal (king-size), acomoda 2 hóspedes.';
  if (t.includes('duplo')) return 'Possui 2 camas de solteiro separadas no mesmo ambiente. Acomoda 2 hóspedes.';
  if (t.includes('padrão') || t.includes('padrao')) return 'Possui 1 cama king size. Acomoda 1 pessoa.';
  return `Acomodação estruturada para até ${tipo} hóspedes.`;
};

const getImagemQuarto = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('triplo')) return '/quarto-triplo.jpg';
  if (t.includes('casal') || t.includes('duplo')) return '/quarto-casal.jpg';
  return '/quarto-padrão.jpg'; 
};

export default function AcomodacoesSection({ quartos }: { quartos: Quarto[] }) {
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const checkInURL = searchParams.get('checkIn') || '';
  const checkOutURL = searchParams.get('checkOut') || '';

  const iniciarReserva = (quarto: Quarto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQuartoSelecionado(null);
    
    const url = `/h/${slug}/checkout?quartoId=${quarto.id}&tipo=${encodeURIComponent(quarto.tipo)}&valor=${quarto.valorDiaria}&capacidade=${quarto.capacidade}&checkIn=${checkInURL}&checkOut=${checkOutURL}`;
    router.push(url);
  };

  return (
    <section id="acomodacoes" className="min-h-screen flex flex-col justify-center bg-white py-16 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-widest text-[#8B1E32] uppercase mb-3">Acomodações</p>
            <h2 className="text-3xl md:text-[2.5rem] font-medium text-[#1B2A41] tracking-tight leading-tight">
              Quartos para todos os momentos
            </h2>
          </div>
          <div className="max-w-sm pb-2 hidden md:block">
            <p className="text-slate-500 text-sm leading-relaxed">
              Ambientes claros, confortáveis e preparados com carinho para você se sentir em casa.
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-5 md:gap-6 pb-8 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {quartos.map((quarto) => (
            <div 
              key={quarto.id}
              onClick={() => !quarto.esgotado && setQuartoSelecionado(quarto)}
              className={`w-[85vw] sm:w-[300px] md:w-[340px] shrink-0 flex flex-col bg-white rounded-[20px] border border-slate-200 overflow-hidden snap-center cursor-pointer transition-all duration-300 group ${quarto.esgotado ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'}`}
            >
              <div className="w-full aspect-[16/10] relative overflow-hidden bg-slate-100 shrink-0">
                <Image 
                  src={getImagemQuarto(quarto.tipo)} 
                  alt={quarto.tipo} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-transform duration-700 ${quarto.esgotado ? 'grayscale' : 'group-hover:scale-105'}`} 
                />
                
                {quarto.esgotado && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <span className="bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg tracking-wider text-xs shadow-lg">
                      ESGOTADO
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-1">
                <h3 className={`text-lg font-medium mb-1 ${quarto.esgotado ? 'text-slate-400 line-through' : 'text-[#1B2A41]'}`}>
                  {quarto.tipo}
                </h3>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed line-clamp-2">
                  {getDescricao(quarto.tipo)}
                </p>
                
                <div className="flex gap-4 text-[11px] text-slate-500 mb-6">
                  <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5"/> Wi-Fi</span>
                  <span className="flex items-center gap-1.5"><Coffee className="w-3.5 h-3.5"/> Café</span>
                  <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5"/> Vista</span>
                </div>
                
                <div className="mt-auto flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-slate-400 mb-0.5">
                      {quarto.esgotado ? 'Tarifa' : 'A partir de'}
                    </p>
                    <p className={`font-semibold flex items-baseline gap-1 ${quarto.esgotado ? 'text-slate-400' : 'text-[#1B2A41]'}`}>
                      <span className="text-lg md:text-xl leading-none">R$ {quarto.valorDiaria.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-500 font-normal">/ noite</span>
                    </p>
                  </div>
                  
                  {quarto.esgotado ? (
                    <button disabled className="bg-slate-100 text-slate-400 text-[11px] font-medium py-2 px-3 rounded-xl cursor-not-allowed">
                      Indisponível
                    </button>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setQuartoSelecionado(quarto); }} 
                        className="text-[11px] font-medium text-slate-400 hover:text-[#8B1E32] transition-colors underline underline-offset-2"
                      >
                        Detalhes
                      </button>
                      <button 
                        onClick={(e) => iniciarReserva(quarto, e)} 
                        className="bg-[#1B2A41] hover:bg-[#8B1E32] text-white text-[11px] font-medium py-2.5 px-3.5 rounded-xl transition-colors duration-300 shadow-sm"
                      >
                        Reservar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {quartoSelecionado && (
        <QuartoModal 
          quarto={quartoSelecionado}
          imagem={getImagemQuarto(quartoSelecionado.tipo)}
          descricao={getDescricao(quartoSelecionado.tipo)}
          onClose={() => setQuartoSelecionado(null)}
          onReservar={() => iniciarReserva(quartoSelecionado)}
        />
      )}
    </section>
  );
}