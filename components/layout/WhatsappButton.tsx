'use client';

import React from 'react';

interface HotelConfig {
  nome: string;
  telefone?: string | null;
  corPrincipal?: string;
  corSecundaria?: string;
}

interface WhatsappButtonProps {
  hotelConfig?: HotelConfig;
  mensagemCustomizada?: string;
  temMenuMobile?: boolean;
}

function formatarNumeroWhatsapp(numero: string): string {
  const apenasDigitos = numero.replace(/\D/g, '');
  if (apenasDigitos.length === 10 || apenasDigitos.length === 11) {
    return `55${apenasDigitos}`;
  }
  return apenasDigitos;
}

export default function WhatsappButton({
  hotelConfig,
  mensagemCustomizada,
  temMenuMobile = true,
}: WhatsappButtonProps) {
  if (!hotelConfig?.telefone) {
    return null;
  }

  const numeroLimpo = formatarNumeroWhatsapp(hotelConfig.telefone);

  if (numeroLimpo.length < 12) {
    return null;
  }

  const primaryColor = hotelConfig.corPrincipal || '#1B2A41';
  const secondaryColor = hotelConfig.corSecundaria || '#8B1E32';

  const mensagem =
    mensagemCustomizada ||
    `Olá! Estava no site do ${hotelConfig.nome} e gostaria de tirar uma dúvida sobre hospedagem.`;

  const whatsappUrl = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;

  const cssVars = {
    '--btn-primary': primaryColor,
    '--btn-secondary': secondaryColor,
  } as React.CSSProperties;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={cssVars}
      aria-label={`Conversar com ${hotelConfig.nome} no WhatsApp`}
      className={`fixed ${
        temMenuMobile ? 'bottom-[84px]' : 'bottom-5'
      } right-4 md:bottom-7 md:right-7 z-40 group flex items-center rounded-full bg-white/95 backdrop-blur-xl p-1 md:p-1.5 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.2)] hover:shadow-[0_18px_42px_-5px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5 hover:ring-slate-900/15 transition-all duration-500 hover:-translate-y-0.5`}
    >
      <div className="hidden md:grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        <div className="overflow-hidden min-w-0">
          <div className="pl-4 pr-3 py-0.5 flex flex-col justify-center whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 group-hover:delay-75">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.16em] leading-none mb-1"
              style={{ color: secondaryColor }}
            >
              Recepção Online
            </span>
            <span
              className="text-xs font-semibold leading-none tracking-tight"
              style={{ color: primaryColor }}
            >
              Falar no WhatsApp
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--btn-primary)] group-hover:bg-[var(--btn-secondary)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.22)] shrink-0 transition-colors duration-500">
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-5 h-5 md:w-[21px] md:h-[21px] relative z-10"
          aria-hidden="true"
        >
          <path d="M16.004 3.2c-7.068 0-12.8 5.732-12.8 12.8 0 2.256.588 4.46 1.706 6.404L3.09 28.8l6.558-1.72a12.748 12.748 0 0 0 6.356 1.688h.006c7.066 0 12.796-5.732 12.796-12.8 0-3.42-1.332-6.636-3.75-9.054A12.716 12.716 0 0 0 16.004 3.2Zm0 23.408h-.004a10.61 10.61 0 0 1-5.408-1.48l-.388-.23-4.022 1.055 1.074-3.92-.252-.402a10.588 10.588 0 0 1-1.628-5.631c0-5.862 4.77-10.632 10.634-10.632 2.84 0 5.51 1.106 7.516 3.116a10.566 10.566 0 0 1 3.112 7.52c0 5.864-4.772 10.604-10.634 10.604Zm5.832-7.958c-.32-.16-1.892-.934-2.186-1.04-.292-.108-.506-.16-.72.16-.212.32-.826 1.04-1.012 1.252-.186.214-.374.24-.694.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.592-1.896-1.778-2.216-.186-.32-.02-.492.14-.652.144-.144.32-.374.48-.56.16-.186.212-.32.32-.534.106-.212.054-.4-.026-.56-.08-.16-.72-1.734-.986-2.374-.26-.624-.524-.54-.72-.55-.186-.008-.4-.01-.612-.01-.214 0-.56.08-.854.4-.292.32-1.12 1.094-1.12 2.668 0 1.572 1.146 3.094 1.306 3.308.16.212 2.256 3.444 5.466 4.83.764.33 1.36.526 1.824.674.766.244 1.464.21 2.016.128.614-.092 1.892-.774 2.158-1.52.266-.748.266-1.388.186-1.52-.08-.134-.292-.214-.612-.374Z" />
        </svg>
      </div>

      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white z-20 pointer-events-none"></span>
    </a>
  );
}