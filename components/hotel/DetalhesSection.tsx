'use client';

import { useState } from 'react';
import { Clock, MapPin, CheckCircle, ShieldAlert, Baby, PawPrint, X, FileText, Utensils, Info } from 'lucide-react';

export default function DetalhesSection() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <section id="detalhes" className="min-h-[100dvh] flex flex-col justify-center bg-gray-50/50 py-20 scroll-mt-16 relative overflow-hidden">
      {/* Elemento de fundo decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E55C42]/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-1 bg-[#E55C42] rounded-full"></span>
              <p className="text-xs font-bold tracking-widest text-[#E55C42] uppercase">Regras & Facilidades</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">Informações da Estadia</h2>
          </div>
          <button 
            onClick={() => setModalAberto(true)} 
            className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-[#0f3c26] text-[#0f3c26] font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 text-sm"
          >
            <FileText className="w-4 h-4 group-hover:text-[#E55C42] transition-colors" /> 
            Ver regulamento completo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card Horários (Verde) - Design Elevado */}
          <div className="lg:col-span-1 bg-gradient-to-br from-[#0f3c26] to-[#0a291a] text-white rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E55C42] rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 -mr-20 -mt-20"></div>
            
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-8 h-8 text-[#E55C42]" />
            </div>
            
            <h3 className="text-2xl font-bold mb-8 tracking-tight">Horários Oficiais</h3>
            <ul className="space-y-6 text-sm text-gray-200">
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0"/> 
                <div>
                  <strong className="block text-white mb-1">Check-in (Entrada)</strong>
                  <span className="opacity-80">A partir das 14h até à meia-noite.</span>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <CheckCircle className="w-6 h-6 text-yellow-400 shrink-0"/> 
                <div>
                  <strong className="block text-white mb-1">Check-out (Saída)</strong>
                  <span className="opacity-80">Encerra impreterivelmente ao meio-dia (12h).</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Políticas & Localização (Bento Grid) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Políticas Resumidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <ShieldAlert className="w-8 h-8 text-[#0f3c26] mb-4 group-hover:text-[#E55C42] transition-colors" />
                <h4 className="font-bold text-gray-900 mb-2">Idade Mínima</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Check-in permitido apenas para maiores de 18 anos ou menores acompanhados.</p>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <Baby className="w-8 h-8 text-[#0f3c26] mb-4 group-hover:text-[#E55C42] transition-colors" />
                <h4 className="font-bold text-gray-900 mb-2">Hóspedes Menores</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Obrigatória a apresentação de documento original ou certidão de nascimento.</p>
              </div>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <PawPrint className="w-8 h-8 text-[#0f3c26] mb-4 group-hover:text-[#E55C42] transition-colors" />
                <h4 className="font-bold text-gray-900 mb-2">Animais</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Apenas cães-guia/animais de serviço documentados são permitidos nas instalações.</p>
              </div>
            </div>

            {/* Mapa Interativo */}
            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:shadow-xl transition-all duration-500 flex-1">
              <div className="p-8 sm:w-1/2 flex flex-col justify-center bg-gray-50/50">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-6 h-6 text-[#0f3c26]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Localização Privilegiada</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">No coração de Itacoatiara, próximo aos melhores pontos turísticos, orla e comércios da cidade.</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2"><span className="text-gray-700 font-medium">Praça da Polícia</span><span className="text-[#E55C42] font-bold text-xs bg-[#E55C42]/10 px-2 py-1 rounded-md">1 min a pé</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-gray-700 font-medium">Orla de Itacoatiara</span><span className="text-[#E55C42] font-bold text-xs bg-[#E55C42]/10 px-2 py-1 rounded-md">11 min a pé</span></div>
                </div>
              </div>
              <div className="w-full sm:w-1/2 h-64 sm:h-auto relative bg-gray-200 overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.095752180436!2d-58.4526221!3d-3.1450226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926f546e40ee671b%3A0x8e82bbbb8e885ab6!2sSerpa%20Hotel!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
                  width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal de Documentação (Mantido e inalterado na funcionalidade, refinado no design) */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-sm" onClick={() => setModalAberto(false)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] shadow-2xl animate-in fade-in zoom-in duration-300 relative" onClick={e => e.stopPropagation()}>
            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 flex justify-between items-center z-10 rounded-t-[32px] shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#0f3c26] p-2 rounded-xl"><Info className="w-5 h-5 text-white" /></div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Políticas Completas</h3>
              </div>
              <button onClick={() => setModalAberto(false)} className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-10 overflow-y-auto space-y-10 text-gray-700 flex-1 custom-scrollbar">
              {/* O conteúdo do modal que já havíamos criado permanece aqui */}
              <section>
                <h4 className="text-lg font-bold text-[#E55C42] mb-3 flex items-center gap-2"><MapPin className="w-5 h-5"/> Arredores e Pontos de Interesse</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Praça da Polícia (1 min a pé)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Mirante de Itacoatiara (10 min a pé)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Orla de Itacoatiara (11 min a pé)</li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-bold text-[#E55C42] mb-3 flex items-center gap-2"><Utensils className="w-5 h-5"/> Restaurantes Próximos</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Café Mais que Vencedor (3 min)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Tacacá da Nonata (3 min)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Batata Do Dudu (5 min)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Jojo Delícias e Boca Livre (5 min)</li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-bold text-[#0f3c26] mb-3 flex items-center gap-2"><Baby className="w-5 h-5 text-[#E55C42]"/> Políticas para Crianças e Viagens</h4>
                <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl">
                  <p className="text-sm leading-relaxed mb-4">Os responsáveis devem apresentar a certidão de nascimento e documento com foto da criança no momento do check-in. Não dispomos de berços ou camas infantis.</p>
                  <p className="text-sm leading-relaxed text-gray-500">Para viagens fora do Brasil, se apenas um dos pais viajar com a criança, é exigida carta de autorização assinada e reconhecida em cartório.</p>
                </div>
              </section>

              <section>
                <h4 className="text-lg font-bold text-[#0f3c26] mb-3 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-[#E55C42]"/> Regras de Ouro e Taxas</h4>
                <ul className="list-disc pl-5 text-sm space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <li>A equipa da receção recebe os hóspedes presencialmente. Não há check-in após horário comercial (meia-noite).</li>
                  <li>Animais de estimação não são aceites, exceto cães-guia/serviço (isentos de taxas).</li>
                  <li>O hotel não possui estacionamento próprio no local.</li>
                  <li>Áreas para fumadores estão estritamente sujeitas a multas se não respeitadas.</li>
                  <li>Aceitamos pagamentos em dinheiro, cartões de crédito/débito e Pix.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}