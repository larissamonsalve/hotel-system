'use client';

import React from 'react';
import Image from 'next/image';
import {
  QrCode,
  CreditCard,
  Lock,
  Copy,
  Check,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

export type MetodoSelecionado = 'PIX' | 'CARTAO_CREDITO';

export interface PixChargeState {
  reservaId: string;
  codigoLocalizador: string;
  qrCode: string;
  qrCodeBase64: string;
}

export interface CardFormState {
  numero: string;
  nomeTitular: string;
  validade: string;
  cvv: string;
}

interface HotelConfig {
  nome: string;
  corPrincipal: string;
  corSecundaria: string;
}

interface PagamentoMethodTabsProps {
  metodo: MetodoSelecionado;
  onSelectMetodo: (metodo: MetodoSelecionado) => void;
  cpf: string;
  onCpfChange: (value: string) => void;
  pixData: PixChargeState | null;
  pixSecondsLeft: number;
  copiedPix: boolean;
  onCopyPix: () => void;
  onGeneratePix: (e: React.FormEvent) => void;
  onCheckPixStatus: () => void;
  checkingPix: boolean;
  cardForm: CardFormState;
  onCardFormChange: (next: CardFormState) => void;
  onSubmitCard: (e: React.FormEvent) => void;
  valorTaxaReserva: number;
  loading: boolean;
  erro: string | null;
  aviso: string | null;
  hotelConfig: HotelConfig;
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const mins = Math.floor(safe / 60).toString().padStart(2, '0');
  const secs = (safe % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function PagamentoMethodTabs({
  metodo,
  onSelectMetodo,
  cpf,
  onCpfChange,
  pixData,
  pixSecondsLeft,
  copiedPix,
  onCopyPix,
  onGeneratePix,
  onCheckPixStatus,
  checkingPix,
  cardForm,
  onCardFormChange,
  onSubmitCard,
  valorTaxaReserva,
  loading,
  erro,
  aviso,
  hotelConfig,
}: PagamentoMethodTabsProps) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 sm:p-8 md:p-10">
      <p
        className="text-[10px] font-bold tracking-widest uppercase mb-2"
        style={{ color: hotelConfig.corPrincipal }}
      >
        Passo 3 de 3
      </p>

      <h1 className="text-2xl sm:text-3xl font-medium text-[var(--color-primary)] tracking-tight mb-2">
        Pagamento seguro
      </h1>
      <p className="text-slate-500 mb-6 text-xs sm:text-sm">
        Pague apenas a taxa de reserva de 30% para confirmar sua estadia.
      </p>

      {/* Seletor Pix / Cartão */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <button
          type="button"
          onClick={() => onSelectMetodo('PIX')}
          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
            metodo === 'PIX' ? 'bg-slate-50/70' : 'border-slate-200 hover:border-slate-300'
          }`}
          style={
            metodo === 'PIX'
              ? { borderColor: hotelConfig.corPrincipal, borderWidth: '2px' }
              : undefined
          }
        >
          <QrCode
            className="w-5 h-5 mt-0.5 shrink-0"
            style={{ color: hotelConfig.corPrincipal }}
          />
          <div>
            <p className="font-bold text-sm text-slate-900">Pix</p>
            <p className="text-[11px] sm:text-xs text-slate-500">Aprovação imediata</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMetodo('CARTAO_CREDITO')}
          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
            metodo === 'CARTAO_CREDITO'
              ? 'bg-slate-50/70'
              : 'border-slate-200 hover:border-slate-300'
          }`}
          style={
            metodo === 'CARTAO_CREDITO'
              ? { borderColor: hotelConfig.corPrincipal, borderWidth: '2px' }
              : undefined
          }
        >
          <CreditCard
            className="w-5 h-5 mt-0.5 shrink-0"
            style={{ color: hotelConfig.corPrincipal }}
          />
          <div>
            <p className="font-bold text-sm text-slate-900">Cartão</p>
            <p className="text-[11px] sm:text-xs text-slate-500">Crédito</p>
          </div>
        </button>
      </div>

      {erro && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{erro}</span>
        </div>
      )}

      {aviso && (
        <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs sm:text-sm font-medium">
          {aviso}
        </div>
      )}

      {/* ABA PIX */}
      {metodo === 'PIX' && (
        <div>
          {!pixData ? (
            <form onSubmit={onGeneratePix} className="space-y-5">
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/40">
                <p className="text-xs font-semibold text-slate-600 mb-4">
                  Dados para emissão do Pix
                </p>

                <label className="block text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide mb-2">
                  CPF do pagador
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  required
                  value={cpf}
                  onChange={(e) => onCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent"
                  style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Necessário para emissão segura do QR Code Pix da taxa de reserva.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: hotelConfig.corSecundaria }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando QR Code Pix...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    Gerar QR Code Pix de {formatBRL(valorTaxaReserva)}
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center">
                {pixData.qrCodeBase64 ? (
                  <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-xs mb-4">
                    <Image
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                      alt="QR Code Pix para pagamento da taxa de reserva"
                      width={196}
                      height={196}
                      unoptimized
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-16 h-16 text-slate-400" />
                  </div>
                )}

                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
                  Escaneie o QR Code
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Abra o app do seu banco e escolha pagar com Pix.
                </p>

                <button
                  type="button"
                  onClick={onCopyPix}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-800 shadow-2xs transition-all cursor-pointer"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Código Pix copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      Copiar código Pix
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 mt-4">
                  Este código expira em{' '}
                  <strong className="text-slate-600 tabular-nums">
                    {formatCountdown(pixSecondsLeft)}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={onCheckPixStatus}
                disabled={checkingPix}
                className="w-full text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: hotelConfig.corSecundaria }}
              >
                {checkingPix ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirmando pagamento...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Já realizei o pagamento
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ABA CARTÃO DE CRÉDITO */}
      {metodo === 'CARTAO_CREDITO' && (
        <form onSubmit={onSubmitCard} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Número do cartão
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={19}
              required
              value={cardForm.numero}
              onChange={(e) =>
                onCardFormChange({ ...cardForm, numero: e.target.value })
              }
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent"
              style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nome impresso no cartão
            </label>
            <input
              type="text"
              required
              value={cardForm.nomeTitular}
              onChange={(e) =>
                onCardFormChange({
                  ...cardForm,
                  nomeTitular: e.target.value.toUpperCase(),
                })
              }
              placeholder="NOME COMPLETO"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent uppercase"
              style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Validade
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                required
                value={cardForm.validade}
                onChange={(e) =>
                  onCardFormChange({ ...cardForm, validade: e.target.value })
                }
                placeholder="MM/AA"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent"
                style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                CVV
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                required
                value={cardForm.cvv}
                onChange={(e) =>
                  onCardFormChange({ ...cardForm, cvv: e.target.value })
                }
                placeholder="123"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent"
                style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              CPF do titular
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={14}
              required
              value={cpf}
              onChange={(e) => onCpfChange(e.target.value)}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none text-sm focus:border-transparent"
              style={{ '--tw-ring-color': hotelConfig.corSecundaria } as React.CSSProperties}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: hotelConfig.corSecundaria }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando pagamento...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pagar taxa de reserva ({formatBRL(valorTaxaReserva)})
              </>
            )}
          </button>
        </form>
      )}

      {/* Rodapé de segurança */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          Seus dados de pagamento são criptografados e protegidos.
        </span>
      </div>
    </div>
  );
}