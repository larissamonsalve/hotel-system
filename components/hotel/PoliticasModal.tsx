'use client';

import { X, MapPin, CheckCircle, Utensils, Baby, ShieldAlert, Info } from 'lucide-react';

interface PoliticasModalProps {
  onClose: () => void;
}

export default function PoliticasModal({ onClose }: PoliticasModalProps) {
  return (
    <div 
      // Padding reduzido no mobile (p-3) para aproveitar o máximo da tela
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#0d1520]/80 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        // max-h-[85dvh] garante que o final da caixa fique sempre visível, sem ser coberto pelas barras do navegador no celular
        className="bg-white w-full max-w-4xl max-h-[85dvh] flex flex-col rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Cabeçalho Fixo do Modal */}
        <div className="bg-white border-b border-slate-100 p-4 md:p-6 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#1B2A41] p-2 rounded-lg">
              <Info className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-[#1B2A41]">
              Regulamento & Políticas
            </h3>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Fechar modal"
            className="bg-slate-50 text-slate-500 p-2 md:p-2.5 rounded-full hover:bg-[#8B1E32] hover:text-white transition-colors border border-slate-100"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        {/* Corpo Rolável do Modal (Rolagem apenas do conteúdo interno) */}
        {/* Redução de espaçamentos: p-4 no mobile, space-y-5 no mobile */}
        <div className="p-4 sm:p-5 md:p-8 overflow-y-auto space-y-5 md:space-y-8 text-slate-600 flex-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          <section>
            <h4 className="text-[13px] md:text-sm font-bold text-[#1B2A41] mb-2.5 flex items-center gap-2 uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-[#8B1E32]"/> Regras Gerais e Taxas
            </h4>
            <ul className="list-disc pl-5 text-[11px] md:text-sm space-y-2 bg-slate-50 p-4 md:p-5 rounded-[16px] border border-slate-100 leading-relaxed">
              <li>A equipe da recepção recebe os hóspedes presencialmente. Não há check-in após horário comercial (meia-noite).</li>
              <li>O hotel não possui estacionamento próprio no local.</li>
              <li>Áreas para fumantes estão restritas. Multas serão aplicadas em caso de infração dentro dos quartos.</li>
              <li>Aceitamos pagamentos em dinheiro, cartões de crédito/débito e Pix.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-[13px] md:text-sm font-bold text-[#1B2A41] mb-2.5 flex items-center gap-2 uppercase tracking-wide">
              <Baby className="w-4 h-4 text-[#8B1E32]"/> Políticas para Menores
            </h4>
            <div className="bg-slate-50 border border-slate-100 p-4 md:p-5 rounded-[16px]">
              <p className="text-[11px] md:text-sm leading-relaxed mb-2.5">
                Os responsáveis devem apresentar a certidão de nascimento e documento com foto da criança no momento do check-in. Não dispomos de berços ou camas extras.
              </p>
              <p className="text-[11px] md:text-sm leading-relaxed text-slate-500 font-medium">
                Nota: Para viagens de fora do Brasil, se apenas um dos pais viajar com a criança, é exigida carta de autorização assinada e reconhecida em cartório.
              </p>
            </div>
          </section>

          {/* Grid mais compacta no mobile (gap-5) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            <section>
              <h4 className="text-[13px] md:text-sm font-bold text-[#1B2A41] mb-2.5 flex items-center gap-2 uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-[#8B1E32]"/> Pontos de Interesse
              </h4>
              <ul className="space-y-2 text-[11px] md:text-sm bg-slate-50 p-4 md:p-5 rounded-[16px] border border-slate-100 h-full">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#1B2A41] shrink-0"/> Praça da Polícia (1 min)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#1B2A41] shrink-0"/> Mirante (10 min)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#1B2A41] shrink-0"/> Orla de Itacoatiara (11 min)</li>
              </ul>
            </section>

            <section>
              <h4 className="text-[13px] md:text-sm font-bold text-[#1B2A41] mb-2.5 flex items-center gap-2 uppercase tracking-wide">
                <Utensils className="w-4 h-4 text-[#8B1E32]"/> Gastronomia Próxima
              </h4>
              <ul className="space-y-2 text-[11px] md:text-sm bg-slate-50 p-4 md:p-5 rounded-[16px] border border-slate-100 h-full">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#1B2A41] shrink-0"/> Café Mais que Vencedor (3 min)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#1B2A41] shrink-0"/> Tacacá da Nonata (3 min)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#1B2A41] shrink-0"/> Jojo Delícias (5 min)</li>
              </ul>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}