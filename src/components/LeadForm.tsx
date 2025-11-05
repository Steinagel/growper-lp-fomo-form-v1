'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadFormData } from '@/lib/zodSchemas';
import { Input } from './ui/Input';
import { Checkbox } from './ui/Checkbox';
import { Button } from './ui/Button';
import { maskPhone, unmaskPhone } from '@/lib/mask';
import { CheckCircle2 } from 'lucide-react';

export function LeadForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const whatsappValue = watch('whatsapp');

  const onSubmit = async (data: LeadFormData) => {
    if (data.website) {
      return;
    }

    const payload = {
      ...data,
      whatsapp: unmaskPhone(data.whatsapp),
      contexto: {
        source: 'lp-fomo-form-v1',
        timestamp: new Date().toISOString(),
      },
    };

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enviar formulário');
      }

      setIsSubmitted(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao enviar formulário');
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-lg">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
        <h3 className="mb-2 text-2xl font-semibold text-gray-900">Cadastro realizado!</h3>
        <p className="mb-6 text-gray-600">
          Entraremos em contato em até 48 horas para realizar sua análise gratuita.
        </p>
        <Button
          variant="accent"
          size="lg"
          onClick={() =>
            window.open(
              `https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Acabei de me cadastrar e gostaria de mais informações.')}`,
              '_blank',
            )
          }
        >
          Falar agora no WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nome completo"
        {...register('nome')}
        error={errors.nome?.message}
        placeholder="Digite seu nome completo"
        required
      />

      <Input
        label="WhatsApp"
        {...register('whatsapp')}
        value={maskPhone(whatsappValue || '')}
        onChange={(e) => setValue('whatsapp', unmaskPhone(e.target.value))}
        error={errors.whatsapp?.message}
        placeholder="(11) 99999-9999"
        required
      />

      <Input
        label="E-mail"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="seu@email.com"
      />

      <Checkbox
        label="Aceito receber contato e concordo com o tratamento dos meus dados conforme a Política de Privacidade"
        {...register('consent')}
        error={errors.consent?.message}
        required
      />

      <input type="text" {...register('website')} className="hidden" tabIndex={-1} />

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full" variant="accent">
        {isSubmitting ? 'Enviando...' : 'Garantir minha vaga agora'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        🔒 Seus dados estão seguros e protegidos
      </p>
    </form>
  );
}

