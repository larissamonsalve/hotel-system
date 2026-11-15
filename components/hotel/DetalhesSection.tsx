'use client';

import { useState } from 'react';
import { Clock, MapPin, CheckCircle, ShieldAlert, Baby, PawPrint, X, FileText, Utensils } from 'lucide-react';

export default function DetalhesSection() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <section id="detalhes" className="py-24 bg-white scroll-mt-16 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#E55C42] uppercase mb-2">Informações Essenciais</p>
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">Detalhes da Estadia</h2>
          </div>
          <button onClick={() => setModalAberto(true)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#0f3c26] font-bold py-3 px-6 rounded-xl transition-colors text-sm">
            <FileText className="w-4 h-4" /> Ver regulamento completo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-[#0f3c26] text-white rounded-[32px] p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E55C42] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
            <Clock className="w-10 h-10 text-[#E55C42] mb-8" />
            <h3 className="text-2xl font-bold mb-6">Horários & Políticas</h3>
            <ul className="space-y-6 text-sm text-gray-200">
              <li className="flex items-start gap-4"><CheckCircle className="w-5 h-5 text-green-400 shrink-0"/> <span><strong>Check-in:</strong> 14h à meia-noite.</span></li>
              <li className="flex items-start gap-4"><CheckCircle className="w-5 h-5 text-green-400 shrink-0"/> <span><strong>Check-out:</strong> Até o meio-dia (12h).</span></li>
              <li className="flex items-start gap-4"><ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0"/> <span>Idade mínima: 18 anos.</span></li>
              <li className="flex items-start gap-4"><Baby className="w-5 h-5 text-[#E55C42] shrink-0"/> <span>Crianças: Obrigatório documento.</span></li>
              <li className="flex items-start gap-4"><PawPrint className="w-5 h-5 text-[#E55C42] shrink-0"/> <span>Apenas cães-guia permitidos.</span></li>
            </ul>
          </div>

          <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-[32px] overflow-hidden shadow-md flex flex-col group hover:shadow-xl transition-shadow">
            <div className="p-8 flex items-center justify-between bg-white border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nossa Localização</h3>
                <p className="text-sm text-gray-500">No coração de Itacoatiara, Amazonas.</p>
              </div>
              <MapPin className="w-10 h-10 text-[#0f3c26]" />
            </div>
            <div className="w-full h-80 relative bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.095752180436!2d-58.4526221!3d-3.1450226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x926f546e40ee671b%3A0x8e82bbbb8e885ab6!2sSerpa%20Hotel!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
                width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Documentação Completa */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm" onClick={() => setModalAberto(false)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl animate-in fade-in zoom-in duration-300 relative" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-[#0f3c26]">Informações & Políticas Completas</h3>
              <button onClick={() => setModalAberto(false)} className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-[#E55C42] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 text-gray-700">
              <section>
                <h4 className="text-lg font-bold text-[#E55C42] mb-3 flex items-center gap-2"><MapPin className="w-5 h-5"/> Arredores e Pontos de Interesse</h4>
                <p className="mb-2 text-sm">O Serpa Hotel fica em Itacoatiara. Entre os pontos de interesse estão:</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Praça da Polícia - 1 min de caminhada[cite: 26]</li>
                  <li>Mirante de Itacoatiara - 10 min de caminhada[cite: 26]</li>
                  <li>Orla de Itacoatiara - 11 min de caminhada[cite: 26]</li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-bold text-[#E55C42] mb-3 flex items-center gap-2"><Utensils className="w-5 h-5"/> Restaurantes Próximos</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Café e lanche Mais que Vencedor - 3 min de caminhada[cite: 26]</li>
                  <li>Tacacá da Nonata - 3 min de caminhada[cite: 26]</li>
                  <li>Batata Do Dudu - 5 min de caminhada[cite: 26]</li>
                  <li>Boca Livre - 5 min de caminhada[cite: 26]</li>
                  <li>Jojo Delícias - 5 min de caminhada[cite: 26]</li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-bold text-[#E55C42] mb-3 flex items-center gap-2"><Baby className="w-5 h-5"/> Políticas para Crianças e Viagens</h4>
                <p className="text-sm leading-relaxed mb-2">
                  Os responsáveis devem apresentar a certidão de nascimento e documento com foto da criança no momento do check-in[cite: 25, 26]. Não dispomos de berços ou camas infantis[cite: 25].
                </p>
                <p className="text-sm leading-relaxed">
                  Para viagens para fora do Brasil, se apenas um dos pais estiver viajando com a criança, ele deverá apresentar uma carta de autorização de viagem assinada por ambos os pais e com reconhecimento de assinaturas em cartório. As pessoas que pretendem viajar com crianças devem consultar o consulado brasileiro antes da viagem[cite: 26].
                </p>
              </section>

              <section>
                <h4 className="text-lg font-bold text-[#E55C42] mb-3 flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> Outras Informações e Taxas</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>A equipe da recepção vai receber os hóspedes no momento da chegada. Esta propriedade não realiza check-in após o horário comercial[cite: 25].</li>
                  <li>Cobranças por pessoas extras podem ser aplicadas[cite: 27].</li>
                  <li>Animais de estimação não são aceitos, com isenção de taxas apenas para cães-guia/serviço[cite: 25, 26].</li>
                  <li>Sem estacionamento no local[cite: 26].</li>
                  <li>Áreas para fumantes estão sujeitas a multas se não respeitadas[cite: 26].</li>
                  <li>Aceitamos dinheiro. Pagamento sem dinheiro em espécie também disponível[cite: 27].</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}