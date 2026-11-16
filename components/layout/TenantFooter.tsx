import Image from 'next/image';

interface TenantFooterProps {
  hotelNome: string;
  logoSrc?: string;
  telefone?: string | null;
  email?: string;
  endereco?: string | null;
}

export default function TenantFooter({ 
  hotelNome, 
  logoSrc = '/logo-serpa.jpg',
  telefone = '+55 (92) 3011-7217',
  email = 'reservas@hotelserpa.com.br',
  endereco = 'R. Floriano Peixoto, 80, Colônia, Itacoatiara - AM'
}: TenantFooterProps) {
  return (
    // Fundo com gradiente suave do Azul Marinho para um tom mais escuro, gerando profundidade
    <footer className="relative bg-gradient-to-b from-[#1B2A41] to-[#0a121c] text-white overflow-hidden">
      
      {/* Faixa superior elegante em Bordô */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8B1E32] via-[#a3273e] to-[#8B1E32]"></div>

      {/* Luz ambiente de fundo (Glow sutil) para quebrar a textura lisa */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white-[0.02] rounded-full blur-[120px] pointer-events-none opacity-20"></div>
      
      <div className="container mx-auto max-w-7xl px-6 pt-16 pb-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: Marca e Descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2.5 rounded-xl shadow-lg">
                <Image 
                  src={logoSrc} 
                  alt={`Logo ${hotelNome}`} 
                  width={36} 
                  height={36} 
                  className="rounded-md w-auto h-auto" 
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">{hotelNome}</span>
            </div>
            <p className="text-slate-300/90 text-sm leading-relaxed">
              Hospitalidade que acolhe, experiências que ficam. Seu conforto no coração da cidade, abertos 24 horas.
            </p>
          </div>
          
          {/* Coluna 2: Contato */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white flex items-center gap-2.5">
              <span className="w-4 h-1 bg-[#8B1E32] rounded-full"></span> Contato
            </h4>
            <div className="text-sm text-slate-300/90 space-y-3 flex flex-col">
              <a href={`tel:${telefone?.replace(/\D/g,'')}`} className="hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                {telefone}
              </a>
              <a href={`mailto:${email}`} className="hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                {email}
              </a>
            </div>
          </div>
          
          {/* Coluna 3: Endereço */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white flex items-center gap-2.5">
              <span className="w-4 h-1 bg-[#8B1E32] rounded-full"></span> Endereço
            </h4>
            <div className="text-sm text-slate-300/90 space-y-3 flex flex-col">
              <span className="leading-relaxed">{endereco}</span>
              <span className="font-medium text-slate-400">CEP 69100-000</span>
            </div>
          </div>

          {/* Coluna 4: Informações */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white flex items-center gap-2.5">
              <span className="w-4 h-1 bg-[#8B1E32] rounded-full"></span> Informações
            </h4>
            <div className="text-sm text-slate-300/90 space-y-3 flex flex-col">
              <a href="#detalhes" className="hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                Políticas do hotel
              </a>
              <span className="cursor-pointer hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                Privacidade
              </span>
            </div>
          </div>
          
        </div>

        {/* Linha de Copyright (Ancora o design e dá acabamento final) */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {hotelNome}. Todos os direitos reservados.</p>
          <p className="hover:text-slate-300 transition-colors cursor-pointer">
            Desenvolvido com excelência
          </p>
        </div>

      </div>
    </footer>
  );
}