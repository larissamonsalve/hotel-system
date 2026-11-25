'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import CheckoutHeader from './ui/CheckoutHeader';
import CheckoutStepper from './ui/CheckoutStepper';
import ReservaSummary from './ui/ReservaSummary';
import PagamentoMethodTabs, {
  CardFormState,
  MetodoSelecionado,
  PixChargeState,
} from './ui/PagamentoMethodTabs';

interface MercadoPagoCardTokenResponse {
  id: string;
}

interface MercadoPagoPaymentMethodsResponse {
  results?: Array<{ id: string; payment_type_id?: string }>;
}

interface MercadoPagoIssuerItem {
  id: string | number;
}

interface MercadoPagoInstance {
  createCardToken: (params: {
    cardNumber: string;
    cardholderName: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    identificationType: string;
    identificationNumber: string;
  }) => Promise<MercadoPagoCardTokenResponse>;
  getPaymentMethods: (params: { bin: string }) => Promise<MercadoPagoPaymentMethodsResponse>;
  getIssuers: (params: {
    paymentMethodId: string;
    bin: string;
  }) => Promise<MercadoPagoIssuerItem[]>;
}

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale?: string }
    ) => MercadoPagoInstance;
  }
}

interface HotelConfig {
  nome: string;
  logoUrl: string | null;
  corPrincipal: string;
  corSecundaria: string;
  politicaCancelamento: string | null;
}

interface QuartoInfo {
  id: string;
  tipo: string;
  capacidade: number;
  valorDiaria: number;
  imagemUrl: string;
}

interface PagamentoClientProps {
  slug: string;
  email: string;
  checkIn: string;
  checkOut: string;
  quarto: QuartoInfo;
  hotelConfig: HotelConfig;
}

const mascaraCpf = (valor: string) => {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  return n
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const mascaraCartao = (valor: string) =>
  valor
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

const mascaraValidade = (valor: string) =>
  valor
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, '$1/$2');

const validarLuhn = (cardNumber: string) => {
  let soma = 0;
  let dobrar = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digito = parseInt(cardNumber[i], 10);
    if (dobrar) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    soma += digito;
    dobrar = !dobrar;
  }
  return soma % 10 === 0;
};

export default function PagamentoClient({
  slug,
  email,
  checkIn,
  checkOut,
  quarto,
  hotelConfig,
}: PagamentoClientProps) {
  const router = useRouter();

  const [metodo, setMetodo] = useState<MetodoSelecionado>('PIX');
  const [cpf, setCpf] = useState('');
  const [pixData, setPixData] = useState<PixChargeState | null>(null);
  const [pixSecondsLeft, setPixSecondsLeft] = useState(15 * 60);
  const [copiedPix, setCopiedPix] = useState(false);
  const [checkingPix, setCheckingPix] = useState(false);

  const [cardForm, setCardForm] = useState<CardFormState>({
    numero: '',
    nomeTitular: '',
    validade: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const qtdDiarias = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(`${checkIn}T12:00:00`);
    const end = new Date(`${checkOut}T12:00:00`);
    const diffTime = end.getTime() - start.getTime();
    const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  }, [checkIn, checkOut]);

  const valorTotal = qtdDiarias > 0 ? quarto.valorDiaria * qtdDiarias : 0;
  const taxaReserva = Math.round(valorTotal * 0.3 * 100) / 100;
  const saldoNoHotel = Math.round((valorTotal - taxaReserva) * 100) / 100;

  const redirecionarConfirmacao = useCallback(
    (codigoLocalizador: string) => {
      try {
        sessionStorage.removeItem(`checkout_draft_${slug}`);
      } catch {
      }
      router.push(
        `/h/${slug}/confirmacao?codigo=${encodeURIComponent(codigoLocalizador)}&email=${encodeURIComponent(email)}`
      );
    },
    [email, router, slug]
  );

  // Timer regressivo do Pix
  useEffect(() => {
    if (!pixData) return;
    const timer = setInterval(() => {
      setPixSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [pixData]);

  // Polling silencioso para detectar confirmação via Webhook automaticamente
  useEffect(() => {
    if (!pixData) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/payments/${encodeURIComponent(pixData.reservaId)}/status?email=${encodeURIComponent(email)}`,
          { headers: { 'x-tenant-slug': slug } }
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          status?: string;
          codigoLocalizador?: string;
        };
        if (data.status === 'APROVADO' && data.codigoLocalizador) {
          redirecionarConfirmacao(data.codigoLocalizador);
        }
      } catch {
        // Ignora erro transitório de polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [email, pixData, redirecionarConfirmacao, slug]);

  const handleGeneratePix = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setAviso(null);

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-slug': slug,
        },
        body: JSON.stringify({
          metodo: 'PIX',
          email,
          quartoId: quarto.id,
          checkIn,
          checkOut,
          cpf: cpfLimpo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Não foi possível gerar o QR Code Pix.');
        return;
      }

      setPixSecondsLeft(15 * 60);
      setPixData({
        reservaId: data.reservaId,
        codigoLocalizador: data.codigoLocalizador,
        qrCode: data.pix?.qrCode || '',
        qrCodeBase64: data.pix?.qrCodeBase64 || '',
      });
    } catch {
      setErro('Erro de conexão ao gerar o Pix. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixData?.qrCode) return;
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } catch {
      setAviso('Não foi possível copiar automaticamente. Selecione o código manualmente.');
    }
  };

  const handleCheckPixStatus = async () => {
    if (!pixData) return;
    setCheckingPix(true);
    setErro(null);
    setAviso(null);

    try {
      const res = await fetch(
        `/api/payments/${encodeURIComponent(pixData.reservaId)}/status?email=${encodeURIComponent(email)}`,
        { headers: { 'x-tenant-slug': slug } }
      );
      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || 'Erro ao verificar o status do pagamento.');
        return;
      }

      if (data.status === 'APROVADO' && data.codigoLocalizador) {
        redirecionarConfirmacao(data.codigoLocalizador);
        return;
      }

      if (data.status === 'CANCELADO' || data.status === 'REJEITADO') {
        setErro('Este Pix foi cancelado ou expirou. Gere um novo código.');
        setPixData(null);
        return;
      }

      setAviso(
        'Ainda não identificamos a confirmação do seu Pix. Assim que o banco aprovar, a tela avançará automaticamente.'
      );
    } catch {
      setErro('Erro de conexão ao consultar o pagamento.');
    } finally {
      setCheckingPix(false);
    }
  };

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setAviso(null);

    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (!publicKey || !window.MercadoPago) {
      setErro('O módulo de pagamento ainda está carregando. Aguarde um segundo e tente novamente.');
      return;
    }

    const cardNumber = cardForm.numero.replace(/\D/g, '');
    const cpfLimpo = cpf.replace(/\D/g, '');
    const [expMonth, expYearShort] = cardForm.validade.split('/');
    const securityCode = cardForm.cvv.replace(/\D/g, '');

    if (cardNumber.length < 13 || !validarLuhn(cardNumber)) {
      setErro('Número do cartão inválido. Confira os dígitos informados.');
      return;
    }

    if (!expMonth || !expYearShort || securityCode.length < 3) {
      setErro('Preencha corretamente a validade e o CVV do cartão.');
      return;
    }

    if (cpfLimpo.length !== 11) {
      setErro('Informe um CPF válido com 11 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });
      const bin = cardNumber.slice(0, 6);

      const methodsResponse = await mp.getPaymentMethods({ bin });
      const creditMethod =
        methodsResponse.results?.find((m) => m.payment_type_id === 'credit_card') ??
        methodsResponse.results?.[0];
      const paymentMethodId = creditMethod?.id;

      if (!paymentMethodId) {
        setErro('Não foi possível identificar a bandeira do cartão informado.');
        return;
      }

      const issuers = await mp.getIssuers({ paymentMethodId, bin }).catch(() => []);
      const issuerId = issuers?.[0]?.id ? String(issuers[0].id) : undefined;

      const cardToken = await mp.createCardToken({
        cardNumber,
        cardholderName: cardForm.nomeTitular.trim(),
        cardExpirationMonth: expMonth,
        cardExpirationYear: expYearShort.length === 2 ? `20${expYearShort}` : expYearShort,
        securityCode,
        identificationType: 'CPF',
        identificationNumber: cpfLimpo,
      });

      if (!cardToken?.id) {
        setErro('Não foi possível validar os dados do cartão. Confira validade e CVV.');
        return;
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-slug': slug,
        },
        body: JSON.stringify({
          metodo: 'CARTAO_CREDITO',
          email,
          quartoId: quarto.id,
          checkIn,
          checkOut,
          cpf: cpfLimpo,
          token: cardToken.id,
          paymentMethodId,
          ...(issuerId ? { issuerId } : {}),
          installments: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Pagamento não autorizado. Verifique os dados do cartão.');
        return;
      }

      if (data.status === 'APROVADO' && data.codigoLocalizador) {
        redirecionarConfirmacao(data.codigoLocalizador);
        return;
      }

      setAviso(
        'Pagamento em análise pela operadora. Você receberá o comprovante por e-mail assim que for aprovado.'
      );
    } catch {
      setErro('Erro ao validar os dados do cartão. Confira as informações e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const cssVars = {
    '--color-primary': hotelConfig.corPrincipal,
    '--color-secondary': hotelConfig.corSecundaria,
  } as React.CSSProperties;

  return (
    <div style={cssVars} className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" />

      <CheckoutHeader hotelConfig={hotelConfig} />

      <CheckoutStepper currentStep={3} hotelConfig={hotelConfig} />

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <ReservaSummary
            tipoQuarto={quarto.tipo}
            capacidade={quarto.capacidade}
            checkIn={checkIn}
            checkOut={checkOut}
            qtdDiarias={qtdDiarias}
            valorDiaria={quarto.valorDiaria}
            valorTotal={valorTotal}
            taxaReserva={taxaReserva}
            saldoNoHotel={saldoNoHotel}
            imagemUrl={quarto.imagemUrl}
            hotelConfig={hotelConfig}
          />
        </div>

        <div className="lg:col-span-7">
          <PagamentoMethodTabs
            metodo={metodo}
            onSelectMetodo={(m) => {
              setMetodo(m);
              setErro(null);
              setAviso(null);
            }}
            cpf={cpf}
            onCpfChange={(val) => setCpf(mascaraCpf(val))}
            pixData={pixData}
            pixSecondsLeft={pixSecondsLeft}
            copiedPix={copiedPix}
            onCopyPix={handleCopyPix}
            onGeneratePix={handleGeneratePix}
            onCheckPixStatus={handleCheckPixStatus}
            checkingPix={checkingPix}
            cardForm={cardForm}
            onCardFormChange={(next) =>
              setCardForm({
                numero: mascaraCartao(next.numero),
                nomeTitular: next.nomeTitular,
                validade: mascaraValidade(next.validade),
                cvv: next.cvv.replace(/\D/g, '').slice(0, 4),
              })
            }
            onSubmitCard={handleSubmitCard}
            valorTaxaReserva={taxaReserva}
            loading={loading}
            erro={erro}
            aviso={aviso}
            hotelConfig={hotelConfig}
          />
        </div>
      </div>
    </div>
  );
}