import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(body: any, headers: any): Promise<Stripe.Checkout.Session> {
    console.log(body)
    
    const session = await this.stripe.checkout.sessions.create({
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: body.map((item) => {
        const img = item.image[0].asset._ref;
        const newImage = img.replace('image-', 'https://cdn.sanity.io/images/vfxfwnaw/production/').replace('-webp', '.webp');
  
        return {
          price_data: { 
            currency: 'INR',
            product_data: { 
              name: item.name,
              images: [newImage],
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity
        };
      }),
      success_url: `${headers.origin}/success`,
      cancel_url: `http://localhost:3001`,
    });
  
    return session;
  }
  async createCharge(amount: number, currency: string, source: string, description: string) {
    return this.stripe.charges.create({
        amount,
        currency,
        source,
        description,
    });
}
  
}
