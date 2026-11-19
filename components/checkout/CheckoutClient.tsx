'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { createLeadSchema } from '@/schemas/lead.schema';
import CheckoutHeader from './ui/CheckoutHeader';
import ReservaSummary from './ui/ReservaSummary';
import CheckoutStepper from './ui/CheckoutStepper';

interface CheckoutClientProps {
  slug: string;
}

const mascaraWhatsapp = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');
  if (numeros.length <= 10) return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export default function CheckoutClient({ slug }: CheckoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parâmetros de URL
  const quartoId = searchParams.get('quartoId') || '';
  const tipoQuarto = searchParams.get('tipo') || 'Acomodação Padrão';
  const valorDiaria = Number(searchParams.get('valor')) || 0;
  const capacidade = Number(searchParams.get('capacidade')) || 2;
  const checkInURL = searchParams.get('checkIn') || '';
  const checkOutURL = searchParams.get('checkOut') || '';

  // Estados
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [checkIn, setCheckIn] = useState(checkInURL);
  const [checkOut, setCheckOut] = useState(checkOutURL);
  const [aceitaOfertas, setAceitaOfertas] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<{ [key: string]: string }>({});

  // Lógica de Negócio (Calculos)
  const qtdDiarias = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn + 'T12:00:00');
    const end = new Date(checkOut + 'T12:00:00');
    const diffTime = end.getTime() - start.getTime();
    const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  }, [checkIn, checkOut]);

  const valorTotal = qtdDiarias > 0 ? (valorDiaria * qtdDiarias) : 0;
  const taxaReserva = valorTotal * 0.30;
  const saldoNoHotel = valorTotal - taxaReserva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErroGeral(null);
    setErrosCampo({});

    if (qtdDiarias <= 0) {
      setErroGeral('Por favor, selecione datas válidas para o Check-in e Check-out.');
      setLoading(false);
      return;
    }

    const result = createLeadSchema.safeParse({ nome, email, whatsapp });

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrosCampo(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-slug': slug },
        body: JSON.stringify({ 
          nome: result.data.nome, 
          email: result.data.email, 
          whatsapp: result.data.whatsapp, 
          aceitaOfertas 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const apiErros: { [key: string]: string } = {};
          data.details.forEach((err: any) => apiErros[err.campo] = err.mensagem);
          setErrosCampo(apiErros);
          throw new Error('Verifique os campos destacados e tente novamente.');
        }
        throw new Error(data.error || 'Ocorreu um erro ao processar sua requisição.');
      }

      router.push(`/h/${slug}/verificacao?email=${encodeURIComponent(result.data.email)}&quartoId=${quartoId}&checkIn=${checkIn}&checkOut=${checkOut}`);
      
    } catch (err: any) {
      setErroGeral(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <CheckoutHeader />

      <CheckoutStepper currentStep={1} />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA ESQUERDA: Resumo */}
        <div className="lg:col-span-5">
          <ReservaSummary 
            tipoQuarto={tipoQuarto} capacidade={capacidade}
            checkIn={checkIn} checkOut={checkOut} qtdDiarias={qtdDiarias}
            valorDiaria={valorDiaria} valorTotal={valorTotal}
            taxaReserva={taxaReserva} saldoNoHotel={saldoNoHotel}
          />
        </div>

        {/* COLUNA DIREITA: Formulário */}
        <div className="lg:col-span-7 bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 sm:p-8 md:p-10">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Passo 1 de 3</p>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#1B2A41] tracking-tight mb-2">Quem vai se hospedar?</h1>
          <p className="text-slate-500 mb-6 sm:mb-8 text-xs sm:text-sm">Preencha os dados do responsável pela reserva.</p>

          {erroGeral && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{erroGeral}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {(!checkInURL || !checkOutURL) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100 mb-6">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1B2A41] uppercase tracking-wide mb-2">Check-in</label>
                  <input type="date" required value={checkIn} min={new Date().toISOString().split('T')[0]} 
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#8B1E32]/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1B2A41] uppercase tracking-wide mb-2">Check-out</label>
                  <input type="date" required value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#8B1E32]/20 outline-none text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-[#1B2A41] uppercase tracking-wide mb-2">Nome Completo</label>
              <input type="text" value={nome} placeholder="Ex.: Maria da Silva" 
                onChange={e => { setNome(e.target.value); if (errosCampo.nome) setErrosCampo(p => ({...p, nome: ''})); }}
                className={`w-full px-4 py-3.5 bg-white border rounded-xl focus:ring-2 outline-none text-sm ${errosCampo.nome ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#8B1E32]/20'}`}
              />
              {errosCampo.nome && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-medium">{errosCampo.nome}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-[#1B2A41] uppercase tracking-wide mb-2">E-mail</label>
                <input type="email" value={email} placeholder="voce@email.com" 
                  onChange={e => { setEmail(e.target.value); if (errosCampo.email) setErrosCampo(p => ({...p, email: ''})); }}
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl focus:ring-2 outline-none text-sm ${errosCampo.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#8B1E32]/20'}`}
                />
                {errosCampo.email && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-medium">{errosCampo.email}</p>}
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-[#1B2A41] uppercase tracking-wide mb-2">WhatsApp</label>
                <input type="tel" maxLength={15} value={whatsapp} placeholder="(92) 99999-9999" 
                  onChange={e => { setWhatsapp(mascaraWhatsapp(e.target.value)); if (errosCampo.whatsapp) setErrosCampo(p => ({...p, whatsapp: ''})); }}
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl focus:ring-2 outline-none text-sm ${errosCampo.whatsapp ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-[#8B1E32]/20'}`}
                />
                {errosCampo.whatsapp && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-medium">{errosCampo.whatsapp}</p>}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={aceitaOfertas} onChange={e => setAceitaOfertas(e.target.checked)} className="w-5 h-5 rounded border-slate-300 accent-[#8B1E32]" />
                <span className="text-sm text-slate-600 select-none">Quero receber novidades e ofertas exclusivas por e-mail.</span>
              </label>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col items-center">
              <button type="submit" disabled={loading || qtdDiarias <= 0} className="w-full sm:w-auto min-w-[300px] bg-[#E05236] hover:bg-[#c24229] text-white font-bold py-3.5 sm:py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                {loading ? 'Processando...' : 'Continuar para verificação'} 
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-4"><Lock className="w-3 h-3" />Seus dados são protegidos pela LGPD.</p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}