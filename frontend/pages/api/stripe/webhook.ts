import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from "raw-body";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const URL = process.env.NEXT_PUBLIC_BACKEND_URL
// Make sure to add this, otherwise you will get a stream.not.readable error
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const buf =  await getRawBody(req);
      const sig = req.headers['stripe-signature'];

      let event;
      try {
        event = stripe.webhooks.constructEvent(buf, sig as string, endpointSecret);
      } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      
      switch (event.type) {
        case 'checkout.session.completed':
          updateDatabaseCredits(event.data.object.metadata?.quantity as string, event.data.object.metadata?.uniqueId as string)
          break;
        case 'payment_intent.succeeded':
          // Handle successful payment
          break;
        case 'payment_intent.payment_failed':
          // Handle failed payment
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
  
      res.json({ received: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }
  }
}

async function updateDatabaseCredits(num_images: string, user_id: string) {
  try {
    const data = {
      "uniqueId": user_id,
      "num_images": num_images
    }
    
    const response = await fetch(URL + '/api/update-credit', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const final_result = await response.json();

    return final_result
  } catch (error) {
    console.log(error)
    console.error('Error posting data:', error);
  }
}