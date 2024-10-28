'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { CircleCheckIcon, Loader2Icon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { PLANS } from '@/lib/plans';
import { cn } from '@/lib/utils';

import { pay } from './pay.action';

export function Pricing() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (plan: string) => {
      const formData = new FormData();
      formData.set('plan', plan);

      const result = await pay(formData);

      if (!result.success) throw new Error(result.error);

      return result.data;
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: ({ url }) => {
      router.push(url);
    },
  });

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4">
      {PLANS.map((plan) => (
        <Card
          key={plan.name}
          className={cn('p-6', plan.highlight && 'bg-muted')}
        >
          <CardHeader className="mt-4 flex h-12 flex-row items-center justify-between py-0">
            <CardTitle>{plan.name}</CardTitle>
            {plan.highlight && <Badge>Más popular</Badge>}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-1">
              <p className="text-3xl font-bold">
                {plan.price > 0 ? `$${plan.price}` : 'Gratis'}
              </p>
              <p className="text-xs tracking-wide text-muted-foreground">
                {plan.price > 0
                  ? 'Pago único'
                  : 'No se requiere tarjeta de crédito'}
              </p>
            </div>
            <Button
              className="my-6 w-full font-bold"
              size="lg"
              disabled={isPending}
              onClick={() => {
                setSelectedPlan(plan.name);
                mutate(plan.name);
              }}
            >
              {isPending && selectedPlan === plan.name && (
                <Loader2Icon className="size-4 animate-spin" />
              )}
              {plan.price > 0 ? 'Comprar' : 'Empezar'}
            </Button>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <CircleCheckIcon className="mr-2 size-4 rounded-full bg-muted text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
