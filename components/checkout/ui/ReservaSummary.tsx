'use client';

import Image from 'next/image';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface HotelConfig {
  corPrincipal: string;
  corSecundaria: string;
  politicaCancelamento: string | null;
}

interface ReservaSummaryProps {
  tipoQuarto: string;
  capacidade: number;
  checkIn: string;
  checkOut: string;
  qtdDiarias: number;
  valorDiaria: number;
  valorTotal: number;
  taxaReserva: number;
  saldoNoHotel: number;
  imagemUrl: string;
  hotelConfig: HotelConfig;
}

const formatarDataResumo = (dataStr: string) => {
  if (!dataStr) return '--';
  const date = new Date(dataStr + 'T12:00:00');
  const dia = date.getDate();
  const mes = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
  const sem = date.toLocaleString('pt-BR', { weekday: 'short' }).replace('.', '');
  return `${dia} ${mes}, ${sem}`;
};

export default function ReservaSummary({
  tipoQuarto, capacidade, checkIn, checkOut, qtdDiarias, valorDiaria, valorTotal, taxaReserva, saldoNoHotel, imagemUrl, hotelConfig
}: ReservaSummaryProps) {
  
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 sm:p-8">
      <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: hotelConfig.corSecundaria }}>Sua Estadia</p>
      <h2 className="text-xl sm:text-2xl font-medium mb-5" style={{ color: hotelConfig.corPrincipal }}>Resumo da reserva</h2>
      
      <div className="relative w-full h-36 sm:h-48 rounded-xl overflow-hidden mb-5 bg-slate-100 border border-slate-100">
        <Image src={imagemUrl || '/quarto-padrão.jpg'} alt={tipoQuarto} fill className="object-cover" />
      </div>

      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold" style={{ color: hotelConfig.corPrincipal }}>{tipoQuarto}</h3>
        <p className="text-sm text-slate-500 mt-1">
          Para até {capacidade} {capacidade === 1 ? 'hóspede' : 'hóspedes'} • 1 quarto
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-5 mb-5">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Check-in</p>
          <p className="font-semibold" style={{ color: hotelConfig.corPrincipal }}>{checkIn ? formatarDataResumo(checkIn) : 'A definir'}</p>
          <p className="text-xs text-slate-500">A partir das 14h</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Check-out</p>
          <p className="font-semibold" style={{ color: hotelConfig.corPrincipal }}>{checkOut ? formatarDataResumo(checkOut) : 'A definir'}</p>
          <p className="text-xs text-slate-500">Até as 12h</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 items-start mb-6">
        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-800">Cancelamento gratuito</p>
          <p className="text-[11px] sm:text-xs text-emerald-600/80 mt-0.5">{hotelConfig.politicaCancelamento}</p>
        </div>
      </div>

      {valorTotal > 0 && (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
          <div className="flex justify-between">
            <span>{qtdDiarias} diárias × R$ {valorDiaria.toFixed(2)}</span>
            <span className="font-medium" style={{ color: hotelConfig.corPrincipal }}>R$ {valorTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de serviço</span>
            <span className="font-medium" style={{ color: hotelConfig.corPrincipal }}>Inclusa</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-100">
            <span className="font-semibold" style={{ color: hotelConfig.corPrincipal }}>Total da estadia</span>
            <span className="font-semibold" style={{ color: hotelConfig.corPrincipal }}>R$ {valorTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="bg-[#fff1f2] rounded-xl p-4 sm:p-5 border border-[#ffe4e6] relative overflow-hidden">
        <ShieldAlert className="absolute -right-4 -bottom-4 w-24 h-24 text-[#e11d48] opacity-5 rotate-12 pointer-events-none" />
        <p className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider mb-2">Garantia de Vaga</p>
        <div className="flex justify-between items-end mb-3 border-b border-[#fecdd3] pb-3">
          <span className="font-bold text-[#9f1239] text-sm sm:text-base leading-tight w-1/2">Taxa de reserva (30%)</span>
          <span className="font-black text-[#e11d48] text-xl sm:text-2xl text-right">R$ {taxaReserva.toFixed(2)}</span>
        </div>
        <p className="text-[11px] sm:text-xs text-[#be123c] leading-relaxed">
          Você paga apenas a taxa de reserva agora. O saldo restante de <strong className="font-bold text-[#9f1239]">R$ {saldoNoHotel.toFixed(2)}</strong> será pago diretamente no balcão do hotel.
        </p>
      </div>
    </div>
  );
}