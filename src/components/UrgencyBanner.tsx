'use client';

import { AlertCircle } from 'lucide-react';

export function UrgencyBanner() {
  return (
    <div className="bg-accent-600 py-3 text-white">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-2 text-center text-sm font-medium md:text-base">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            <strong>Atenção:</strong> Vagas limitadas para análise gratuita. Apenas{' '}
            <strong>12 vagas</strong> disponíveis esta semana.
          </p>
        </div>
      </div>
    </div>
  );
}

