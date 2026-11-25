'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Download,
  CalendarPlus,
  Building2,
} from 'lucide-react';

interface ConfirmacaoVoucherProps {
  slug: string;
  codigoLocalizador: string;
  hospedeNome: string;
  hospedeEmail: string;
  cpfMascarado: string | null;
  hotelNome: string;
  hotelEndereco: string | null;
  hotelLogoUrl: string | null;
  corPrincipal: string;
  corSecundaria: string;
  quartoTipo: string;
  quartoImagemUrl: string | null;
  capacidade: number;
  checkInISO: string;
  checkOutISO: string;
  qtdDiarias: number;
  valorPago: number;
  saldoRestante: number;
  metodoLabel: string;
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDateLong(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function formatWeekday(iso: string) {
  const date = new Date(iso);
  const raw = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(date);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function getDatePartsUTC(iso: string) {
  const date = new Date(iso);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return { y, m, d };
}

function toCompactDateTime(iso: string, hour: string) {
  const { y, m, d } = getDatePartsUTC(iso);
  return `${y}${m}${d}T${hour}0000`;
}

function toIsoDateTime(iso: string, hour: string) {
  const { y, m, d } = getDatePartsUTC(iso);
  return `${y}-${m}-${d}T${hour}:00:00`;
}

function getCalendarWebUrl(props: ConfirmacaoVoucherProps): string | null {
  const domain = props.hospedeEmail.trim().toLowerCase().split('@')[1] || '';

  const title = `Estadia em ${props.hotelNome} (${props.codigoLocalizador})`;
  const details = `Código da reserva: ${props.codigoLocalizador}\nAcomodação: ${props.quartoTipo}\nTaxa de reserva paga: ${formatBRL(props.valorPago)}\nSaldo a pagar no hotel: ${formatBRL(props.saldoRestante)}`;
  const location = props.hotelEndereco || props.hotelNome;

  // Gmail / Google Workspace padrão
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${toCompactDateTime(props.checkInISO, '14')}/${toCompactDateTime(props.checkOutISO, '12')}`,
      details,
      location,
      authuser: props.hospedeEmail,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  // Outlook / Hotmail / Live / MSN
  if (
    domain.startsWith('outlook.') ||
    domain.startsWith('hotmail.') ||
    domain.startsWith('live.') ||
    domain === 'msn.com'
  ) {
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      startdt: toIsoDateTime(props.checkInISO, '14'),
      enddt: toIsoDateTime(props.checkOutISO, '12'),
      subject: title,
      body: details,
      location,
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  // Yahoo Mail
  if (domain.startsWith('yahoo.')) {
    const params = new URLSearchParams({
      v: '60',
      title,
      st: toCompactDateTime(props.checkInISO, '14'),
      et: toCompactDateTime(props.checkOutISO, '12'),
      desc: details,
      in_loc: location,
    });
    return `https://calendar.yahoo.com/?${params.toString()}`;
  }

  return null;
}

export default function ConfirmacaoVoucherCard(props: ConfirmacaoVoucherProps) {
  const primeiroNome = props.hospedeNome.split(' ')[0];

  const handleAddToCalendar = () => {
    const webCalendarUrl = getCalendarWebUrl(props);

    if (webCalendarUrl) {
      window.open(webCalendarUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Fallback universal (.ics) para iCloud e e-mails corporativos/outros domínios
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hotel System//Reserva//PT-BR',
      'BEGIN:VEVENT',
      `UID:${props.codigoLocalizador}@hotelsystem`,
      `DTSTART:${toCompactDateTime(props.checkInISO, '14')}`,
      `DTEND:${toCompactDateTime(props.checkOutISO, '12')}`,
      `SUMMARY:Estadia em ${props.hotelNome} (${props.codigoLocalizador})`,
      `DESCRIPTION:Acomodacao: ${props.quartoTipo} | Codigo da reserva: ${props.codigoLocalizador} | Saldo no hotel: ${formatBRL(props.saldoRestante)}`,
      ...(props.hotelEndereco ? [`LOCATION:${props.hotelEndereco}`] : []),
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reserva-${props.codigoLocalizador}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const voucherDownloadUrl = `/api/reservas/${encodeURIComponent(props.codigoLocalizador)}/voucher?email=${encodeURIComponent(props.hospedeEmail)}`;

  return (
    <main className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Coluna Esquerda (Desktop) / Topo Centralizado (Mobile) */}
        <div className="lg:col-span-5 lg:sticky lg:top-10 flex flex-col items-center text-center lg:items-start lg:text-left lg:pt-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: `${props.corPrincipal}18` }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: props.corPrincipal }}
            >
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <p
            className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2"
            style={{ color: props.corPrincipal }}
          >
            Pagamento aprovado
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-3">
            Reserva confirmada
            <br />
            com sucesso!
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-md leading-relaxed">
            Está tudo certo, <strong className="text-slate-700">{primeiroNome}</strong>. Enviamos os
            detalhes da sua reserva e o comprovante em PDF para o seu e-mail.
          </p>
        </div>

        {/* Coluna Direita (Desktop) / Abaixo (Mobile) */}
        <div className="lg:col-span-7">
          {/* Card do Voucher */}
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
            {/* Topo colorido com código da reserva */}
            <div
              className="px-6 sm:px-8 py-6 sm:py-7 text-white flex items-center justify-between gap-4"
              style={{ backgroundColor: props.corPrincipal }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 mb-1.5">
                  Seu código da reserva
                </p>
                <p className="text-3xl sm:text-4xl font-bold tracking-[0.18em] font-mono">
                  {props.codigoLocalizador}
                </p>
                <p className="text-xs text-white/75 mt-1.5">Apresente este código no check-in</p>
              </div>

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/12 flex items-center justify-center shrink-0">
                <QrCode className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Dados do Hotel */}
            <div className="px-6 sm:px-8 py-5 border-b border-dashed border-slate-200 flex items-center gap-4">
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative flex items-center justify-center border border-slate-200">
                {props.quartoImagemUrl ? (
                  <Image
                    src={props.quartoImagemUrl}
                    alt={props.hotelNome}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  {props.hotelNome}
                </h2>
                {props.hotelEndereco && (
                  <p className="text-xs sm:text-sm text-slate-500">{props.hotelEndereco}</p>
                )}
              </div>
            </div>

            {/* Datas, Acomodação e Hóspede */}
            <div className="px-6 sm:px-8 py-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center pb-6 border-b border-slate-100">
                <div className="sm:col-span-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Check-in
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    {formatDateLong(props.checkInISO)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatWeekday(props.checkInISO)} · após 14h
                  </p>
                </div>

                <div className="hidden sm:flex sm:col-span-1 justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>

                <div className="sm:col-span-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Check-out
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    {formatDateLong(props.checkOutISO)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatWeekday(props.checkOutISO)} · até 12h
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Acomodação
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    {props.quartoTipo}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {props.qtdDiarias} {props.qtdDiarias === 1 ? 'noite' : 'noites'} · até{' '}
                    {props.capacidade} hóspedes
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Hóspede principal
                  </p>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    {props.hospedeNome}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {props.cpfMascarado ? `CPF ${props.cpfMascarado}` : props.hospedeEmail}
                  </p>
                </div>
              </div>

              {/* Destaque da taxa de reserva paga */}
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-950">
                      Taxa de reserva paga via {props.metodoLabel}
                    </p>
                    <p className="text-xs text-emerald-700">30% do valor da estadia</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg font-bold text-emerald-950 whitespace-nowrap">
                  {formatBRL(props.valorPago)}
                </p>
              </div>
            </div>
          </div>

          {/* Ações abaixo do card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
            <a
              href={voucherDownloadUrl}
              className="w-full text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs hover:opacity-90 transition-all"
              style={{ backgroundColor: props.corSecundaria }}
            >
              <Download className="w-4 h-4" />
              Baixar comprovante em PDF
            </a>

            <button
              type="button"
              onClick={handleAddToCalendar}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-2xs transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              Adicionar ao calendário
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            O saldo de <strong className="text-slate-700">{formatBRL(props.saldoRestante)}</strong>{' '}
            será pago diretamente no hotel.{' '}
            <Link
              href={`/h/${props.slug}`}
              className="font-bold hover:underline"
              style={{ color: props.corPrincipal }}
            >
              Voltar ao site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}