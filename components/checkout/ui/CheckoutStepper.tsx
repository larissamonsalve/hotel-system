'use client';

import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-4 flex justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm font-medium min-w-max">
        
        <div className={`flex items-center gap-1.5 sm:gap-2 transition-colors duration-300 ${currentStep >= 1 ? 'text-[#1B2A41]' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${currentStep >= 1 ? 'bg-[#1B2A41] text-white shadow-sm' : 'bg-slate-100 border border-slate-200'}`}>
            {currentStep > 1 ? <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" /> : '1'}
          </span>
          Seus dados
        </div>
        
        <div className={`w-6 sm:w-16 h-px transition-colors duration-500 ${currentStep >= 2 ? 'bg-[#1B2A41]' : 'bg-slate-300'}`}></div>

        <div className={`flex items-center gap-1.5 sm:gap-2 transition-colors duration-300 ${currentStep >= 2 ? 'text-[#1B2A41]' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${currentStep >= 2 ? 'bg-[#1B2A41] text-white shadow-sm' : 'bg-slate-100 border border-slate-200'}`}>
            {currentStep > 2 ? <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" /> : '2'}
          </span>
          Verificação
        </div>
        
        <div className={`w-6 sm:w-16 h-px transition-colors duration-500 ${currentStep >= 3 ? 'bg-[#1B2A41]' : 'bg-slate-300'}`}></div>

        <div className={`flex items-center gap-1.5 sm:gap-2 transition-colors duration-300 ${currentStep >= 3 ? 'text-[#1B2A41]' : 'text-slate-400'}`}>
          <span className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${currentStep >= 3 ? 'bg-[#1B2A41] text-white shadow-sm' : 'bg-slate-100 border border-slate-200'}`}>
            3
          </span>
          Pagamento
        </div>

      </div>
    </div>
  );
}