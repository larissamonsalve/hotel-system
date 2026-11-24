import Image from 'next/image';

interface HotelConfig {
  nome: string;
  logoUrl?: string | null;
  corPrincipal: string;
  corSecundaria: string;
  telefone?: string | null;
  endereco?: string | null;
}

interface TenantFooterProps {
  hotelNome: string;
  logoSrc?: string;
  telefone?: string | null;
  email?: string;
  endereco?: string | null;
  hotelConfig?: HotelConfig;
}

function formatarNumeroWhatsapp(numero: string): string {
  const apenasDigitos = numero.replace(/\D/g, '');
  if (apenasDigitos.length === 10 || apenasDigitos.length === 11) {
    return `55${apenasDigitos}`;
  }
  return apenasDigitos;
}

export default function TenantFooter({ 
  hotelNome, 
  logoSrc = '/logo-serpa.jpg',
  telefone = '+55 (92) 99473-7897',
  email = 'reservas@hotelserpa.com.br',
  endereco = 'R. Floriano Peixoto, 80, Colônia, Itacoatiara - AM',
  hotelConfig
}: TenantFooterProps) {
  
  const nomeReal = hotelConfig?.nome || hotelNome;
  const logoReal = hotelConfig?.logoUrl || logoSrc;
  const telReal = hotelConfig ? hotelConfig.telefone : telefone;
  const endReal = hotelConfig?.endereco || endereco;
  
  const primaryColor = hotelConfig?.corPrincipal || '#1B2A41';
  const secondaryColor = hotelConfig?.corSecundaria || '#8B1E32';

  const primeiraPalavra = nomeReal.split(' ')[0];
  const restoDoNome = nomeReal.split(' ').slice(1).join(' ');

  const mensagemWhatsapp = `Olá! Estava no site do ${nomeReal} e gostaria de tirar uma dúvida sobre hospedagem.`;
  const whatsappUrl = telReal
    ? `https://wa.me/${formatarNumeroWhatsapp(telReal)}?text=${encodeURIComponent(mensagemWhatsapp)}`
    : null;

  return (
    <footer 
      id="contato" 
      className="relative text-white overflow-hidden"
      style={{ backgroundImage: `linear-gradient(to bottom, ${primaryColor}, #0a121c)` }}
    >
      
      <div 
        className="h-1.5 w-full"
        style={{ backgroundImage: `linear-gradient(to right, ${secondaryColor}, #a3273e, ${secondaryColor})` }}
      ></div>

      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none opacity-20"></div>
      
      <div className="container mx-auto max-w-7xl px-6 pt-10 pb-24 md:pt-16 md:pb-8 relative z-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="bg-white p-2.5 rounded-xl shadow-lg shrink-0">
                <Image 
                  src={logoReal} 
                  alt={`Logo ${nomeReal}`} 
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
          
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-5 text-white flex items-center gap-2.5">
              <span className="w-3 md:w-4 h-1 rounded-full" style={{ backgroundColor: secondaryColor }}></span> Contato
            </h4>
            <div className="text-xs md:text-sm text-slate-300/90 space-y-2.5 md:space-y-3 flex flex-col">
              {telReal && whatsappUrl && (
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  {telReal}
                </a>
              )}
              <a href={`mailto:${email}`} className="hover:text-white hover:translate-x-1 transition-all duration-300 w-fit">
                {email}
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-5 text-white flex items-center gap-2.5">
              <span className="w-3 md:w-4 h-1 rounded-full" style={{ backgroundColor: secondaryColor }}></span> Endereço
            </h4>
            <div className="text-xs md:text-sm text-slate-300/90 space-y-2.5 md:space-y-3 flex flex-col">
              <span className="leading-relaxed">{endReal}</span>
              <span className="font-medium text-slate-400">CEP 69100-000</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-5 text-white flex items-center gap-2.5">
              <span className="w-3 md:w-4 h-1 rounded-full" style={{ backgroundColor: secondaryColor }}></span> Informações
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
          <p>© {new Date().getFullYear()} {nomeReal}. Todos os direitos reservados.</p>
          <p className="hover:text-slate-300 transition-colors cursor-pointer">
            Desenvolvido com excelência
          </p>
        </div>

      </div>
    </footer>
  );
}