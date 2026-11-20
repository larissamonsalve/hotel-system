'use client';

import { X, MapPin, CheckCircle, Utensils, Baby, ShieldAlert, Info, Coffee, ConciergeBell, Waves } from 'lucide-react';

interface HotelConfig {
  corPrincipal: string;
  corSecundaria: string;
}

interface PoliticasModalProps {
  hotelConfig?: HotelConfig;
  onClose: () => void;
}

export default function PoliticasModal({ hotelConfig, onClose }: PoliticasModalProps) {
  const primaryColor = hotelConfig?.corPrincipal || '#1B2A41';
  const secondaryColor = hotelConfig?.corSecundaria || '#8B1E32';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0d1520]/80 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl max-h-[90svh] flex flex-col rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="bg-white border-b border-slate-100 p-5 md:p-6 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: primaryColor }}>
              <Info className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold" style={{ color: primaryColor }}>
              Regulamento & Políticas
            </h3>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Fechar modal"
            className="bg-slate-50 text-slate-500 p-2 md:p-2.5 rounded-full transition-colors border border-slate-100 shrink-0"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = secondaryColor;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'; // slate-50
              e.currentTarget.style.color = '#64748b'; // slate-500
            }}
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        {/* Corpo do Modal */}
        <div className="p-5 md:p-8 overflow-y-auto overflow-x-hidden space-y-6 md:space-y-8 text-slate-600 flex-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          <section>
            <h4 className="text-[13px] md:text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor }}>
              <ShieldAlert className="w-4 h-4 shrink-0" style={{ color: secondaryColor }}/> Regras Gerais e Taxas
            </h4>
            <ul className="list-disc pl-5 text-[12px] md:text-sm space-y-2.5 bg-slate-50 p-5 md:p-6 rounded-[16px] border border-slate-100 leading-relaxed">
              <li>A equipe da recepção recebe os hóspedes presencialmente. Não há check-in após horário comercial (meia-noite).</li>
              <li>O hotel não possui estacionamento próprio no local.</li>
              <li>Áreas para fumantes estão restritas. Multas serão aplicadas em caso de infração dentro dos quartos.</li>
              <li>Aceitamos pagamentos em dinheiro, cartões de crédito/débito e Pix.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-[13px] md:text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor }}>
              <Baby className="w-4 h-4 shrink-0" style={{ color: secondaryColor }}/> Políticas para Menores
            </h4>
            <div className="bg-slate-50 border border-slate-100 p-5 md:p-6 rounded-[16px]">
              <p className="text-[12px] md:text-sm leading-relaxed mb-3">
                Os responsáveis devem apresentar a certidão de nascimento e documento com foto da criança no momento do check-in. Não dispomos de berços ou camas extras.
              </p>
              <p className="text-[11px] md:text-sm leading-relaxed text-slate-500 font-medium">
                Nota: Para viagens de fora do Brasil, se apenas um dos pais viajar com a criança, é exigida carta de autorização assinada e reconhecida em cartório.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            <section className="flex flex-col">
              <h4 className="text-[13px] md:text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor }}>
                <Coffee className="w-4 h-4 shrink-0" style={{ color: secondaryColor }}/> Alimentação
              </h4>
              <ul className="space-y-3 text-[12px] md:text-sm bg-slate-50 p-5 md:p-6 rounded-[16px] border border-slate-100 flex-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Café da manhã completo grátis disponível todos os dias, entre 6h30 e 9h30</span>
                </li>
              </ul>
            </section>

            <section className="flex flex-col">
              <h4 className="text-[13px] md:text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor }}>
                <ConciergeBell className="w-4 h-4 shrink-0" style={{ color: secondaryColor }}/> Serviços
              </h4>
              <ul className="space-y-3 text-[12px] md:text-sm bg-slate-50 p-5 md:p-6 rounded-[16px] border border-slate-100 flex-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Balcão de recepção 24 horas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Lavanderia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Armazenamento para bagagem</span>
                </li>
              </ul>
            </section>

            <section className="flex flex-col">
              <h4 className="text-[13px] md:text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor }}>
                <Waves className="w-4 h-4 shrink-0" style={{ color: secondaryColor }}/> Instalações
              </h4>
              <ul className="space-y-3 text-[12px] md:text-sm bg-slate-50 p-5 md:p-6 rounded-[16px] border border-slate-100 flex-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Piscina externa</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <section className="flex flex-col">
              <h4 className="text-[13px] md:text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor }}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: secondaryColor }}/> Pontos de Interesse
              </h4>
              <ul className="space-y-3 text-[12px] md:text-sm bg-slate-50 p-5 md:p-6 rounded-[16px] border border-slate-100 flex-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Praça Principal (1 min a pé)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Mirante (10 min a pé)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Orla da Cidade (11 min a pé)</span>
                </li>
              </ul>
            </section>

            <section className="flex flex-col">
              <h4 className="text-[13px] md:text-sm font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: primaryColor }}>
                <Utensils className="w-4 h-4 shrink-0" style={{ color: secondaryColor }}/> Gastronomia Próxima
              </h4>
              <ul className="space-y-3 text-[12px] md:text-sm bg-slate-50 p-5 md:p-6 rounded-[16px] border border-slate-100 flex-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Café Local (3 min a pé)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Restaurante Regional (3 min a pé)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }}/> 
                  <span className="leading-relaxed">Lanchonete (5 min a pé)</span>
                </li>
              </ul>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}