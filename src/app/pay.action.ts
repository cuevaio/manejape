'use server';

import { z } from 'zod';

import { auth } from '@/lib/auth';
import { PLANS } from '@/lib/plans';
import { stripe } from '@/lib/stripe';

export async function pay(formData: FormData): Promise<
  | {
      success: true;
      data: { url: string };
    }
  | { success: false; error: string }
> {
  try {
    const user = await auth();

    const rawPlan = z.enum(['Pro', 'Pro+']).safeParse(formData.get('plan'));

    if (!rawPlan.success) {
      return { success: false, error: 'Invalid plan' };
    }

    const plan = PLANS.find((p) => p.name === rawPlan.data);

    if (!plan) {
      return { success: false, error: 'Invalid plan' };
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      discounts: [
        {
          coupon: process.env.STRIPE_LAUNCH_COUPON,
        },
      ],
      customer_email: user?.email,
      locale: 'es',
    });

    if (!session.url) {
      return { success: false, error: 'Failed to create checkout session' };
    }

    return { success: true, data: { url: session.url } };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error' };
  }
}
