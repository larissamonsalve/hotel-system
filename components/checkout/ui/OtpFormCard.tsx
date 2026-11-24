'use client';

import React, { useRef, useEffect } from 'react';
import { Mail, ArrowRight, ArrowLeft, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HotelConfig {
  nome: string;
  corPrincipal: string;
  corSecundaria: string;
}

interface OtpFormCardProps {
  email: string;
  digits: string[];
  loading: boolean;
  resending: boolean;
  countdown: number;
  error: string | null;
  feedback: string | null;
  hotelConfig: HotelConfig;
  onDigitsChange: (nextDigits: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onChangeEmail: () => void;
  onBackToStart: () => void;
}

const OTP_LENGTH = 6;

export default function OtpFormCard({
  email,
  digits,
  loading,
  resending,
  countdown,
  error,
  feedback,
  hotelConfig,
  onDigitsChange,
  onSubmit,
  onResend,
  onChangeEmail,
  onBackToStart,
}: OtpFormCardProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleChange = (index: number, value: string) => {
    const onlyDigits = value.replace(/\D/g, '');
    const updated = [...digits];

    if (!onlyDigits) {
      updated[index] = '';
      onDigitsChange(updated);
      return;
    }

    updated[index] = onlyDigits[onlyDigits.length - 1];
    onDigitsChange(updated);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const updated = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, idx) => {
      updated[idx] = char;
    });
    onDigitsChange(updated);

    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  const isComplete = digits.join('').length === OTP_LENGTH;

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 sm:p-10 md:p-12 flex flex-col items-center text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
        style={{
          backgroundColor: `${hotelConfig.corPrincipal}14`,
          color: hotelConfig.corPrincipal,
        }}
      >
        <Mail className="w-6 h-6" />
      </div>

      <p
        className="text-[10px] font-bold tracking-widest uppercase mb-2"
        style={{ color: hotelConfig.corPrincipal }}
      >
        Passo 2 de 3
      </p>

      <h1 className="text-2xl sm:text-3xl font-medium text-[var(--color-primary)] tracking-tight mb-2">
        Confirme seu e-mail
      </h1>

      <p className="text-slate-500 text-xs sm:text-sm max-w-md mb-8">
        Enviamos um código de 6 dígitos para{' '}
        <strong className="font-semibold text-slate-700 break-all">{email}</strong>
      </p>

      <form onSubmit={onSubmit} className="w-full max-w-md flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-7 w-full">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Dígito ${index + 1} do código`}
              className="w-11 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold text-slate-800 bg-white border rounded-xl outline-none focus:ring-2 focus:border-transparent transition-all"
              style={
                {
                  borderColor: digit ? hotelConfig.corPrincipal : '#cbd5e1',
                  '--tw-ring-color': hotelConfig.corSecundaria,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {error && (
          <div className="w-full mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {feedback && (
          <div className="w-full mb-5 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isComplete}
          className="w-full text-white font-bold py-3.5 sm:py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: hotelConfig.corSecundaria }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Validando código...
            </>
          ) : (
            <>
              Validar código
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-xs sm:text-sm">
        {countdown > 0 ? (
          <p className="text-slate-500">
            Não recebeu? Reenvie em{' '}
            <strong className="font-semibold text-slate-700 tabular-nums">
              {formatTimer(countdown)}
            </strong>
          </p>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={resending}
            className="font-semibold hover:underline cursor-pointer disabled:opacity-50"
            style={{ color: hotelConfig.corPrincipal }}
          >
            {resending ? 'Reenviando código...' : 'Não recebeu? Reenviar código'}
          </button>
        )}

        <button
          type="button"
          onClick={onChangeEmail}
          className="font-bold hover:underline cursor-pointer"
          style={{ color: hotelConfig.corPrincipal }}
        >
          Alterar e-mail
        </button>

        <div className="pt-2 border-t border-slate-100 w-full flex justify-center">
          <button
            type="button"
            onClick={onBackToStart}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para a etapa inicial
          </button>
        </div>
      </div>
    </div>
  );
}