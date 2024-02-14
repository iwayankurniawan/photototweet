import Stripe from "stripe";

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const host = process.env.NEXT_PUBLIC_HOST;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  const user_session: any = await getServerSession(req, res, authOptions)
  
  if (method === "POST") {
    try {
      const date = new Date().toISOString();
      const params = {
        customer_email: user_session.user.email,
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "INV-" + date,
              },
              unit_amount: body?.amount * 100 || 100,
            },
            quantity: 1 ,
          },
        ],
        metadata: {
          "uniqueId": user_session.id,
          "quantity": body?.amount / parseFloat(process.env.PRICE_PER_CREDITS ?? "0.2") 
        },
        cancel_url: `${host}`,
        success_url: `${host}/checkout/success`
      }

      const checkoutSession = await stripe.checkout.sessions.create(params as any);

      res.status(200).json({ sessionId: checkoutSession.id });
    } catch (err) {
      res.status(500).json({ error: "Error checkout session" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}