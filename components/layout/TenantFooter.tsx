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
    <footer className="bg-[#0b2b1c] text-white py-16">
      <div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-2 rounded-xl">
              <Image src={logoSrc} alt={`Logo ${hotelNome}`} width={32} height={32} className="rounded-md" />
            </div>
            <span className="text-xl font-bold tracking-tight">{hotelNome}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Hospitalidade que acolhe, experiências que ficam. Abertos 24 horas.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-white">Contato</h4>
          <div className="text-sm text-gray-300 space-y-2 flex flex-col">
            <a href={`tel:${telefone?.replace(/\D/g,'')}`} className="hover:text-white transition-colors">{telefone}</a>
            <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-white">Endereço</h4>
          <div className="text-sm text-gray-300 space-y-2 flex flex-col">
            <span>{endereco}</span>
            <span>CEP 69100-000</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">Informações</h4>
          <div className="text-sm text-gray-300 space-y-2 flex flex-col">
            <a href="#detalhes" className="hover:text-white transition-colors">Políticas do hotel</a>
            <span className="cursor-pointer hover:text-white transition-colors">Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}