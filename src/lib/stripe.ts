import Stripe from 'stripe';

import { singleton } from './singleton';

const createStripe = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '');
};

export const stripe = singleton('stripe', createStripe);
