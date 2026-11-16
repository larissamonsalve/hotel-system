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
  
  const primeiraPalavra = hotelNome.split(' ')[0];
  const restoDoNome = hotelNome.split(' ').slice(1).join(' ');

  return (
    <footer id="contato" className="relative bg-gradient-to-b from-[#1B2A41] to-[#0a121c] text-white overflow-hidden">
      
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8B1E32] via-[#a3273e] to-[#8B1E32]"></div>

      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white-[0.02] rounded-full blur-[120px] pointer-events-none opacity-20"></div>
      
      {/* Redução de padding no mobile e adição de pb-24 para não conflitar com o dock do menu mobile */}
      <div className="container mx-auto max-w-7xl px-6 pt-10 pb-24 md:pt-16 md:pb-8 relative z-10">
        
        {/* Compactação do grid no mobile (gap-8) e criação de grid 2x2 (sm:grid-cols-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          
          {/* Coluna 1: Marca e Descrição */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="bg-white p-2.5 rounded-xl shadow-lg shrink-0">
                <Image 
                  src={logoSrc} 
                  alt={`Logo ${hotelNome}`} 
                  width={36} 
                  height={36} 
                  className="rounded-md w-auto h-auto" 
                />
              </div>
              <span className="text-xl md:text-2xl tracking-tight uppercase">
                <span className="font-extrabold">{primeiraPalavra}</span>{' '}
                <span className="font-light">{restoDoNome}</span>
              </span>
            </div>
            <p className="text-slate-300/90 text-xs md:text-sm leading-relaxed max-w-md sm:max-w-none">
              Hospitalidade que acolhe, experiências que ficam. Seu conforto no coração da cidade, abertos 24 horas.
            </p>
          </div>
          
          {/* Coluna 2: Contato */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-5 text-white flex items-center gap-2.5">
              <span className="w-3 md:w-4 h-1 bg-[#8B1E32] rounded-full"></span> Contato
            </h4>
            <div className="text-xs md:text-sm text-slate-300/90 space-y-2.5 md:space-y-3 flex flex-col">
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
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-5 text-white flex items-center gap-2.5">
              <span className="w-3 md:w-4 h-1 bg-[#8B1E32] rounded-full"></span> Endereço
            </h4>
            <div className="text-xs md:text-sm text-slate-300/90 space-y-2.5 md:space-y-3 flex flex-col">
              <span className="leading-relaxed">{endereco}</span>
              <span className="font-medium text-slate-400">CEP 69100-000</span>
            </div>
          </div>

          {/* Coluna 4: Informações */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-5 text-white flex items-center gap-2.5">
              <span className="w-3 md:w-4 h-1 bg-[#8B1E32] rounded-full"></span> Informações
            </h4>
            <div className="text-xs md:text-sm text-slate-300/90 space-y-2.5 md:space-y-3 flex flex-col">
              <a href="#detalhes" className="hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                Políticas do hotel
              </a>
              <span className="cursor-pointer hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                Privacidade
              </span>
            </div>
          </div>
          
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-[10px] md:text-[11px] text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {hotelNome}. Todos os direitos reservados.</p>
          <p className="hover:text-slate-300 transition-colors cursor-pointer">
            Desenvolvido com excelência
          </p>
        </div>

      </div>
    </footer>
  );
}