'use client';

import { Check } from 'lucide-react';

interface HotelConfig {
  corPrincipal: string;
}

interface CheckoutStepperProps {
  currentStep: number;
  hotelConfig: HotelConfig;
}

export default function CheckoutStepper({ currentStep, hotelConfig }: CheckoutStepperProps) {
  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 px-4 flex justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm font-medium min-w-max">
        
        <div 
          className="flex items-center gap-1.5 sm:gap-2 transition-colors duration-300"
          style={{ color: currentStep >= 1 ? hotelConfig.corPrincipal : '#94a3b8' }}
        >
          <span 
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors duration-300"
            style={currentStep >= 1 ? { backgroundColor: hotelConfig.corPrincipal, color: '#fff', boxShadow: 'var(--tw-shadow)' } : { backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
          >
            {currentStep > 1 ? <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" /> : '1'}
          </span>
          Seus dados
        </div>
        
        <div 
          className="w-6 sm:w-16 h-px transition-colors duration-500"
          style={{ backgroundColor: currentStep >= 2 ? hotelConfig.corPrincipal : '#cbd5e1' }}
        ></div>

        <div 
          className="flex items-center gap-1.5 sm:gap-2 transition-colors duration-300"
          style={{ color: currentStep >= 2 ? hotelConfig.corPrincipal : '#94a3b8' }}
        >
          <span 
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors duration-300"
            style={currentStep >= 2 ? { backgroundColor: hotelConfig.corPrincipal, color: '#fff', boxShadow: 'var(--tw-shadow)' } : { backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
          >
            {currentStep > 2 ? <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" /> : '2'}
          </span>
          Verificação
        </div>
        
        <div 
          className="w-6 sm:w-16 h-px transition-colors duration-500"
          style={{ backgroundColor: currentStep >= 3 ? hotelConfig.corPrincipal : '#cbd5e1' }}
        ></div>

        <div 
          className="flex items-center gap-1.5 sm:gap-2 transition-colors duration-300"
          style={{ color: currentStep >= 3 ? hotelConfig.corPrincipal : '#94a3b8' }}
        >
          <span 
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors duration-300"
            style={currentStep >= 3 ? { backgroundColor: hotelConfig.corPrincipal, color: '#fff', boxShadow: 'var(--tw-shadow)' } : { backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
          >
            3
          </span>
          Pagamento
        </div>

      </div>
    </div>
  );
}