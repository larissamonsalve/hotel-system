'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadSchema, CreateLeadDTO } from '@/schemas/lead.schema';
import { differenceInDays } from 'date-fns';
import { Calendar, User, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Quarto {
  id: string;
  tipo: string;
  capacidade: number;
  valorDiaria: number;
}

interface SimuladorProps {
  hotelSlug: string;
  quartos: Quarto[];
}

export default function SimuladorCliente({ hotelSlug, quartos }: SimuladorProps) {
  const [dataCheckIn, setDataCheckIn] = useState<string>('');
  const [dataCheckOut, setDataCheckOut] = useState<string>('');
  const [quartoSelecionado, setQuartoSelecionado] = useState<Quarto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSucesso, setLeadSucesso] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateLeadDTO>({
    resolver: zodResolver(createLeadSchema),
  });

  const calcularValores = () => {
    if (!dataCheckIn || !dataCheckOut || !quartoSelecionado) return null;
    const dias = differenceInDays(new Date(dataCheckOut), new Date(dataCheckIn));
    if (dias <= 0) return null;

    const valorTotal = dias * quartoSelecionado.valorDiaria;
    const taxaReserva = valorTotal * 0.30;

    return { dias, valorTotal, taxaReserva };
  };

  const valores = calcularValores();

  const onSubmit = async (data: CreateLeadDTO) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-slug': hotelSlug,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar lead');
      }

      setLeadSucesso(true);
      // O próximo passo do funil será disparar a tela de OTP aqui
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao iniciar a reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (leadSucesso) {
    return (
      <div className="bg-green-50 p-8 rounded-xl border border-green-200 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">Tudo certo!</h3>
        <p className="text-green-700">
          Enviamos um código de confirmação (OTP) para o seu e-mail. 
          Em breve implementaremos a tela de validação.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Simule sua Reserva</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="date" 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={dataCheckIn}
              onChange={(e) => setDataCheckIn(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="date" 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={dataCheckOut}
              onChange={(e) => setDataCheckOut(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecione a Acomodação</label>
        <div className="grid grid-cols-1 gap-3">
          {quartos.map((quarto) => (
            <div 
              key={quarto.id}
              onClick={() => setQuartoSelecionado(quarto)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${quartoSelecionado?.id === quarto.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">{quarto.tipo}</h4>
                  <p className="text-sm text-gray-500">Até {quarto.capacidade} pessoas</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">R$ {quarto.valorDiaria.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 block">/ noite</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {valores && (
        <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Total ({valores.dias} noites)</span>
            <span>R$ {valores.valorTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
            <span>Taxa de Reserva (30%)</span>
            <span className="text-blue-600">R$ {valores.taxaReserva.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">Pagamento online. O saldo de 70% será pago no balcão.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-6">
        <h3 className="font-semibold text-gray-800 mb-4">Seus Dados</h3>
        
        <div>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Nome Completo"
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              {...register('nome')}
            />
          </div>
          {errors.nome && <span className="text-red-500 text-xs mt-1">{errors.nome.message}</span>}
        </div>

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email')}
            />
          </div>
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>

        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="WhatsApp (com DDD)"
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              {...register('whatsapp')}
            />
          </div>
          {errors.whatsapp && <span className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !valores}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? 'Processando...' : 'Avançar para Pagamento'}
          {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
        </button>
      </form>
    </div>
  );
}