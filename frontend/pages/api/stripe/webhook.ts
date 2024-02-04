import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const body = JSON.stringify(req.body, null, 2);

  const header = stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret: endpointSecret,
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, header, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      console.log(
        `Payment success for session ID: ${checkoutSessionCompleted.id}`
      );
      break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  res.status(200).end();
}