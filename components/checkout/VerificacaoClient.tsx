'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutHeader from './ui/CheckoutHeader';
import CheckoutStepper from './ui/CheckoutStepper';
import ReservaSummary from './ui/ReservaSummary';
import OtpFormCard from './ui/OtpFormCard';

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

interface VerificacaoClientProps {
  slug: string;
  email: string;
  checkIn: string;
  checkOut: string;
  quarto: QuartoInfo;
  hotelConfig: HotelConfig;
}

const RESEND_SECONDS = 60;

export default function VerificacaoClient({
  slug,
  email,
  checkIn,
  checkOut,
  quarto,
  hotelConfig,
}: VerificacaoClientProps) {
  const router = useRouter();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const qtdDiarias = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn + 'T12:00:00');
    const end = new Date(checkOut + 'T12:00:00');
    const diffTime = end.getTime() - start.getTime();
    const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  }, [checkIn, checkOut]);

  const valorTotal = qtdDiarias > 0 ? quarto.valorDiaria * qtdDiarias : 0;
  const taxaReserva = valorTotal * 0.3;
  const saldoNoHotel = valorTotal - taxaReserva;

  const handleDigitsChange = (nextDigits: string[]) => {
    setDigits(nextDigits);
    if (error) setError(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = digits.join('');

    if (codigo.length < 6) {
      setError('Digite os 6 dígitos enviados para o seu e-mail.');
      return;
    }

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch('/api/email/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-slug': slug,
        },
        body: JSON.stringify({ email, codigo }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Código inválido. Tente novamente.');
        return;
      }

      router.push(
        `/h/${slug}/pagamento?email=${encodeURIComponent(email)}&quartoId=${encodeURIComponent(quarto.id)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
      );
    } catch {
      setError('Erro de conexão ao validar o código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;

    setResending(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch('/api/email/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-slug': slug,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Não foi possível reenviar o código.');
        return;
      }

      setDigits(Array(6).fill(''));
      setCountdown(RESEND_SECONDS);
      setFeedback('Um novo código foi enviado para o seu e-mail.');
    } catch {
      setError('Erro de conexão ao reenviar o código.');
    } finally {
      setResending(false);
    }
  };

  const buildCheckoutParams = () =>
    new URLSearchParams({
      quartoId: quarto.id,
      tipo: quarto.tipo,
      valor: String(quarto.valorDiaria),
      capacidade: String(quarto.capacidade),
      checkIn,
      checkOut,
      img: quarto.imagemUrl,
    });

  const handleChangeEmail = () => {
    const params = buildCheckoutParams();
    params.set('email', email);
    params.set('modo', 'alterar-email');
    router.push(`/h/${slug}/checkout?${params.toString()}`);
  };

  const handleBackToStart = () => {
    const params = buildCheckoutParams();
    router.push(`/h/${slug}/checkout?${params.toString()}`);
  };

  const cssVars = {
    '--color-primary': hotelConfig.corPrincipal,
    '--color-secondary': hotelConfig.corSecundaria,
  } as React.CSSProperties;

  return (
    <div style={cssVars} className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <CheckoutHeader hotelConfig={hotelConfig} />

      <CheckoutStepper currentStep={2} hotelConfig={hotelConfig} />

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
          <OtpFormCard
            email={email}
            digits={digits}
            loading={loading}
            resending={resending}
            countdown={countdown}
            error={error}
            feedback={feedback}
            hotelConfig={hotelConfig}
            onDigitsChange={handleDigitsChange}
            onSubmit={handleVerify}
            onResend={handleResend}
            onChangeEmail={handleChangeEmail}
            onBackToStart={handleBackToStart}
          />
        </div>
      </div>
    </div>
  );
}