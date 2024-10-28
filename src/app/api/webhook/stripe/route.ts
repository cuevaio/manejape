import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { id } from '@/lib/nanoid/id';
import { redis } from '@/lib/redis';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    const signature = headers().get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // verify Stripe event is legit
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    const eventType = event.type;

    switch (eventType) {
      case 'checkout.session.completed': {
        let email: string | null = event.data.object.customer_email;
        if (!email) {
          email = event.data.object.customer_details?.email ?? null;
        }

        if (!email) {
          throw new Error('No email');
        }

        if (event.data.object.payment_status !== 'paid') {
          throw new Error('Payment not successful');
        }

        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ['line_items'],
          },
        );

        const plan = session ? session.line_items?.data[0].description : null;
        if (!plan) {
          throw new Error('No plan');
        }

        const userId = await redis.get(`userIdByEmail:${email}`);
        const user = userId ? await redis.hgetall(`user:${userId}`) : null;

        if (!user) {
          const newUserId = id();
          await redis.hset(`user:${newUserId}`, {
            email,
            plan,
            createdAt: new Date().toISOString(),
          });
          await redis.set(`userIdByEmail:${email}`, newUserId);
        } else {
          await redis.hset(`user:${userId}`, {
            plan,
          });
        }

        // Extra: >>>>> send email to dashboard <<<<

        break;
      }

      default:
      // Unhandled event type
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
