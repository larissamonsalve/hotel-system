'use client';

import { useState } from 'react';
import { Clock, MapPin, ShieldAlert, Baby, PawPrint, FileText } from 'lucide-react';
import PoliticasModal from './PoliticasModal'; 

interface HotelConfig {
  nome: string;
  corPrincipal: string;
  corSecundaria: string;
}

interface DetalhesSectionProps {
  hotelConfig?: HotelConfig; // Marcado como opcional para segurança
}

export default function DetalhesSection({ hotelConfig }: DetalhesSectionProps) {
  const [modalAberto, setModalAberto] = useState(false);

  // Fallbacks de segurança
  const primaryColor = hotelConfig?.corPrincipal || '#1B2A41';
  const secondaryColor = hotelConfig?.corSecundaria || '#8B1E32';
  const hotelNome = hotelConfig?.nome || 'O Hotel';

  return (
    // Fundo do componente e iluminação dinamizados
    <section 
      id="detalhes" 
      className="min-h-screen flex flex-col justify-center py-16 scroll-mt-16 relative overflow-hidden"
      style={{ backgroundImage: `linear-gradient(to bottom, ${primaryColor}, ${primaryColor}E6)` }}
    >
      
      {/* 1. Textura de pontinhos (Dots) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ></div>
      
      {/* 2. Iluminação ambiente */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] z-0 transform translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      
      {/* 3. Iluminação bordô (secundária) */}
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] z-0 transform -translate-x-1/4 translate-y-1/4 pointer-events-none opacity-20"
        style={{ backgroundColor: secondaryColor }}
      ></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* Cabeçalho */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-1 rounded-full" style={{ backgroundColor: secondaryColor }}></span>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-white/80 uppercase">
              Regras & Facilidades
            </p>
          </div>
          <h2 className="text-3xl md:text-[2.5rem] font-medium text-white tracking-tight leading-tight drop-shadow-sm">
            Informações da Estadia
          </h2>
        </div>

        {/* Corpo: Esquerda (Políticas e Horários) / Direita (Mapa) */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-10">
          
          {/* Área Esquerda */}
          <div className="w-full lg:w-3/5 flex flex-col gap-6">
            
            {/* Horários de Check-in e Check-out */}
            <div className="group order-1 lg:order-2 bg-white border border-slate-100 shadow-lg px-6 py-5 rounded-[20px] flex flex-col sm:flex-row gap-5 sm:gap-8 mx-1 lg:mx-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-3 flex-1">
                <Clock className="w-5 h-5 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" style={{ color: secondaryColor }} />
                <div>
                  <strong className="block text-sm mb-0.5" style={{ color: primaryColor }}>Check-in (Entrada)</strong>
                  <span className="text-xs text-slate-500 leading-relaxed block">A partir das 14h até à meia-noite.</span>
                </div>
              </div>
              
              <div className="hidden sm:block w-px bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
              <div className="sm:hidden h-px w-full bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
              
              <div className="flex items-start gap-3 flex-1">
                <Clock className="w-5 h-5 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" style={{ color: secondaryColor }} />
                <div>
                  <strong className="block text-sm mb-0.5" style={{ color: primaryColor }}>Check-out (Saída)</strong>
                  <span className="text-xs text-slate-500 leading-relaxed block">Até às 12h (meio-dia).</span>
                </div>
              </div>
            </div>

            {/* Cards de Políticas em linha (Animados com group-hover) */}
            <div className="order-2 lg:order-1 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-5 w-max lg:w-full px-1 pt-1">
                
                {/* Card 1: Idade */}
                <div 
                  className="group bg-white p-6 rounded-[20px] border border-slate-100 shadow-lg w-[260px] lg:w-auto shrink-0 flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = `${secondaryColor}4D`} // 30% opacity
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f1f5f9'} // slate-100
                >
                  <ShieldAlert className="w-7 h-7 mb-4 transition-all duration-300 group-hover:scale-110" style={{ color: primaryColor }} />
                  <h4 className="font-semibold text-sm mb-1.5" style={{ color: primaryColor }}>Idade Mínima</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Check-in permitido apenas para maiores de 18 anos ou menores devidamente acompanhados.</p>
                </div>

                {/* Card 2: Menores */}
                <div 
                  className="group bg-white p-6 rounded-[20px] border border-slate-100 shadow-lg w-[260px] lg:w-auto shrink-0 flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = `${secondaryColor}4D`}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
                >
                  <Baby className="w-7 h-7 mb-4 transition-all duration-300 group-hover:scale-110" style={{ color: primaryColor }} />
                  <h4 className="font-semibold text-sm mb-1.5" style={{ color: primaryColor }}>Hóspedes Menores</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Obrigatória a apresentação de documento com foto ou certidão de nascimento no balcão.</p>
                </div>

                {/* Card 3: Animais */}
                <div 
                  className="group bg-white p-6 rounded-[20px] border border-slate-100 shadow-lg w-[260px] lg:w-auto shrink-0 flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = `${secondaryColor}4D`}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
                >
                  <PawPrint className="w-7 h-7 mb-4 transition-all duration-300 group-hover:scale-110" style={{ color: primaryColor }} />
                  <h4 className="font-semibold text-sm mb-1.5" style={{ color: primaryColor }}>Animais de Estimação</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Apenas cães-guia ou animais de serviço documentados são permitidos nas instalações.</p>
                </div>

              </div>
            </div>

          </div>

          {/* Área Direita: Mapa Interativo */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="group bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-lg flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mx-1 lg:mx-0">
              
              {/* Mapa do Google (mantido estático por enquanto) */}
              <div className="w-full h-48 md:h-[180px] relative bg-slate-100 shrink-0 overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.095752180436!2d-58.4526221!3d-3.1450226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926f546e40ee671b%3A0x8e82bbbb8e885ab6!2sSerpa%20Hotel!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
                  width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-700"
                ></iframe>
              </div>

              {/* Info Localização */}
              <div className="p-5 flex flex-col flex-1 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 transition-colors duration-300" style={{ color: primaryColor }} />
                  <h3 className="text-sm font-semibold" style={{ color: primaryColor }}>Localização Privilegiada</h3>
                </div>
                <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                  No coração da cidade, próximo aos melhores pontos turísticos, orla e comércio.
                </p>
                <div className="mt-auto space-y-2.5">
                  <div className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-2">
                    <span className="text-slate-600 font-medium">Praça Principal</span>
                    <span className="font-semibold bg-slate-50 px-2 py-1 rounded-md border border-slate-100" style={{ color: secondaryColor }}>1 min a pé</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-600 font-medium">Orla da Cidade</span>
                    <span className="font-semibold bg-slate-50 px-2 py-1 rounded-md border border-slate-100" style={{ color: secondaryColor }}>11 min a pé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Rodapé: Botão Regulamento */}
        <div className="flex justify-center mt-2">
          <button 
            onClick={() => setModalAberto(true)} 
            className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-50 text-xs sm:text-sm"
            style={{ color: primaryColor }}
          >
            <FileText className="w-4 h-4" style={{ color: secondaryColor }} /> 
            Ler regulamento completo
          </button>
        </div>

      </div>

      {modalAberto && (
        <PoliticasModal hotelConfig={hotelConfig} onClose={() => setModalAberto(false)} />
      )}
    </section>
  );
}