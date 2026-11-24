'use client';

import { useState, useMemo, useEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldAlert, ArrowLeft, Pencil } from 'lucide-react';
import { createLeadSchema } from '@/schemas/lead.schema';
import CheckoutHeader from './ui/CheckoutHeader';
import ReservaSummary from './ui/ReservaSummary';
import CheckoutStepper from './ui/CheckoutStepper';

interface HotelConfig {
  nome: string;
  logoUrl: string | null;
  corPrincipal: string;
  corSecundaria: string;
  politicaCancelamento: string | null;
}

interface CheckoutClientProps {
  slug: string;
  hotelConfig: HotelConfig;
}

interface CheckoutDraft {
  nome: string;
  email: string;
  whatsapp: string;
}

const subscribeNoop = () => () => {};
const getServerDraftSnapshot = () => null;

const mascaraWhatsapp = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');
  if (numeros.length <= 10) return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export default function CheckoutClient({ slug, hotelConfig }: CheckoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const quartoId = searchParams.get('quartoId') || '';
  const tipoQuarto = searchParams.get('tipo') || 'Acomodação Padrão';
  const valorDiaria = Number(searchParams.get('valor')) || 0;
  const capacidade = Number(searchParams.get('capacidade')) || 2;
  const checkInURL = searchParams.get('checkIn') || '';
  const checkOutURL = searchParams.get('checkOut') || '';
  const imagemUrl = searchParams.get('img') || '';
  const emailURL = searchParams.get('email') || '';
  const modoAlterarEmailURL = searchParams.get('modo') === 'alterar-email';

  const draftStorageKey = `checkout_draft_${slug}`;

  // Leitura segura do sessionStorage sem erro de hidratação e sem setState em useEffect
  const rawDraft = useSyncExternalStore(
    subscribeNoop,
    () => {
      try {
        return sessionStorage.getItem(draftStorageKey);
      } catch {
        return null;
      }
    },
    getServerDraftSnapshot
  );

  const parsedDraft = useMemo<Partial<CheckoutDraft> | null>(() => {
    if (!rawDraft) return null;
    try {
      return JSON.parse(rawDraft) as Partial<CheckoutDraft>;
    } catch {
      return null;
    }
  }, [rawDraft]);

  const [nomeEditado, setNomeEditado] = useState<string | null>(null);
  const [emailEditado, setEmailEditado] = useState<string | null>(null);
  const [whatsappEditado, setWhatsappEditado] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState(checkInURL);
  const [checkOut, setCheckOut] = useState(checkOutURL);
  const [modoCompletoManual, setModoCompletoManual] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<{ [key: string]: string }>({});

  const nomeSalvo = parsedDraft?.nome?.trim() || '';
  const whatsappSalvo = parsedDraft?.whatsapp ? mascaraWhatsapp(parsedDraft.whatsapp) : '';
  const emailSalvo = emailURL || parsedDraft?.email || '';

  const nome = nomeEditado ?? nomeSalvo;
  const whatsapp = whatsappEditado ?? whatsappSalvo;
  const email = emailEditado ?? emailSalvo;

  const somenteEmailEditavel =
    !modoCompletoManual && modoAlterarEmailURL && Boolean(nomeSalvo && whatsappSalvo);

  useEffect(() => {
    if (somenteEmailEditavel) {
      emailInputRef.current?.focus();
      emailInputRef.current?.select();
    }
  }, [somenteEmailEditavel]);

  const qtdDiarias = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn + 'T12:00:00');
    const end = new Date(checkOut + 'T12:00:00');
    const diffTime = end.getTime() - start.getTime();
    const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  }, [checkIn, checkOut]);

  const valorTotal = qtdDiarias > 0 ? valorDiaria * qtdDiarias : 0;
  const taxaReserva = valorTotal * 0.3;
  const saldoNoHotel = valorTotal - taxaReserva;

  const handleVoltarEtapaInicialCompleta = () => {
    setModoCompletoManual(true);
    setErroGeral(null);
    setErrosCampo({});

    const params = new URLSearchParams({
      quartoId,
      tipo: tipoQuarto,
      valor: String(valorDiaria),
      capacidade: String(capacidade),
      checkIn,
      checkOut,
      img: imagemUrl,
    });
    router.replace(`/h/${slug}/checkout?${params.toString()}`);
  };

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
      try {
        const draft: CheckoutDraft = {
          nome: result.data.nome,
          email: result.data.email,
          whatsapp: result.data.whatsapp,
        };
        sessionStorage.setItem(draftStorageKey, JSON.stringify(draft));
      } catch {
        // Segue o fluxo caso o navegador bloqueie sessionStorage
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-slug': slug },
        body: JSON.stringify({
          nome: result.data.nome,
          email: result.data.email,
          whatsapp: result.data.whatsapp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const apiErros: { [key: string]: string } = {};
          data.details.forEach((err: { campo: string; mensagem: string }) => {
            if (err.campo) apiErros[err.campo] = err.mensagem;
          });
          setErrosCampo(apiErros);
          throw new Error('Verifique os campos destacados e tente novamente.');
        }
        throw new Error(data.error || 'Ocorreu um erro ao processar sua requisição.');
      }

      const otpResponse = await fetch('/api/email/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-slug': slug },
        body: JSON.stringify({ email: result.data.email }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        throw new Error(otpData.error || 'Não foi possível enviar o código de verificação.');
      }

      router.push(
        `/h/${slug}/verificacao?email=${encodeURIComponent(result.data.email)}&quartoId=${encodeURIComponent(quartoId)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErroGeral(err.message);
      } else {
        setErroGeral('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cssVars = {
    '--color-primary': hotelConfig.corPrincipal,
    '--color-secondary': hotelConfig.corSecundaria,
  } as React.CSSProperties;

  const hojeISO = new Date().toISOString().split('T')[0];

  return (
    <div style={cssVars} className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <CheckoutHeader hotelConfig={hotelConfig} />

      <CheckoutStepper currentStep={1} hotelConfig={hotelConfig} />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <ReservaSummary
            tipoQuarto={tipoQuarto}
            capacidade={capacidade}
            checkIn={checkIn}
            checkOut={checkOut}
            qtdDiarias={qtdDiarias}
            valorDiaria={valorDiaria}
            valorTotal={valorTotal}
            taxaReserva={taxaReserva}
            saldoNoHotel={saldoNoHotel}
            imagemUrl={imagemUrl}
            hotelConfig={hotelConfig}
          />
        </div>

        <div className="lg:col-span-7 bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Passo 1 de 3
            </p>
            {somenteEmailEditavel && (
              <button
                type="button"
                onClick={handleVoltarEtapaInicialCompleta}
                className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer"
                style={{ color: hotelConfig.corPrincipal }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar à etapa inicial (editar tudo)
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium text-[var(--color-primary)] tracking-tight mb-2">
            {somenteEmailEditavel ? 'Altere seu e-mail' : 'Quem vai se hospedar?'}
          </h1>
          <p className="text-slate-500 mb-6 sm:mb-8 text-xs sm:text-sm">
            {somenteEmailEditavel
              ? 'Informe o endereço de e-mail correto para reenviarmos o código de verificação.'
              : 'Preencha ou ajuste as datas e os dados do responsável pela reserva.'}
          </p>

          {erroGeral && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{erroGeral}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-100">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  min={hojeISO}
                  disabled={somenteEmailEditavel}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className={`w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent ${
                    somenteEmailEditavel
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : 'bg-white'
                  }`}
                  style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  min={checkIn || hojeISO}
                  disabled={somenteEmailEditavel}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className={`w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent ${
                    somenteEmailEditavel
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : 'bg-white'
                  }`}
                  style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={nome}
                disabled={somenteEmailEditavel}
                placeholder="Ex.: Maria da Silva"
                onChange={(e) => {
                  setNomeEditado(e.target.value);
                  if (errosCampo.nome) setErrosCampo((p) => ({ ...p, nome: '' }));
                }}
                className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent ${
                  somenteEmailEditavel
                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                    : errosCampo.nome
                      ? 'bg-white border-red-400 focus:ring-red-200'
                      : 'bg-white border-slate-200'
                }`}
                style={
                  !errosCampo.nome && !somenteEmailEditavel
                    ? ({ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties)
                    : undefined
                }
              />
              {errosCampo.nome && (
                <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-medium">
                  {errosCampo.nome}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide mb-2">
                  <span>E-mail</span>
                  {somenteEmailEditavel && (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold normal-case tracking-normal"
                      style={{ color: hotelConfig.corSecundaria }}
                    >
                      <Pencil className="w-3 h-3" /> Editável
                    </span>
                  )}
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  placeholder="voce@email.com"
                  onChange={(e) => {
                    setEmailEditado(e.target.value);
                    if (errosCampo.email) setErrosCampo((p) => ({ ...p, email: '' }));
                  }}
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent ${
                    errosCampo.email
                      ? 'border-red-400 focus:ring-red-200'
                      : somenteEmailEditavel
                        ? 'ring-2 border-transparent'
                        : 'border-slate-200'
                  }`}
                  style={
                    !errosCampo.email
                      ? ({ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties)
                      : undefined
                  }
                />
                {errosCampo.email && (
                  <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-medium">
                    {errosCampo.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  maxLength={15}
                  value={whatsapp}
                  disabled={somenteEmailEditavel}
                  placeholder="(92) 99999-9999"
                  onChange={(e) => {
                    setWhatsappEditado(mascaraWhatsapp(e.target.value));
                    if (errosCampo.whatsapp) setErrosCampo((p) => ({ ...p, whatsapp: '' }));
                  }}
                  className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent ${
                    somenteEmailEditavel
                      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                      : errosCampo.whatsapp
                        ? 'bg-white border-red-400 focus:ring-red-200'
                        : 'bg-white border-slate-200'
                  }`}
                  style={
                    !errosCampo.whatsapp && !somenteEmailEditavel
                      ? ({ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties)
                      : undefined
                  }
                />
                {errosCampo.whatsapp && (
                  <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-medium">
                    {errosCampo.whatsapp}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col items-center">
              <button
                type="submit"
                disabled={loading || qtdDiarias <= 0}
                className="w-full sm:w-auto min-w-[300px] text-white font-bold py-3.5 sm:py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: hotelConfig.corSecundaria }}
              >
                {loading
                  ? 'Enviando código...'
                  : somenteEmailEditavel
                    ? 'Enviar novo código'
                    : 'Continuar para verificação'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-4">
                <Lock className="w-3 h-3" />
                Seus dados são protegidos pela LGPD.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}