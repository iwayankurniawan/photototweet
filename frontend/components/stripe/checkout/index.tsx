import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutButton = ({ amount = 1 }) => {
  const router = useRouter();

  const handler = async () => {
    try {
      const stripe = await asyncStripe;
      const res = await fetch("/api/stripe/session", {
        method: "POST",
        body: JSON.stringify({
          amount,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const { sessionId } = await res.json();

      const { error } = await (stripe as Stripe).redirectToCheckout({ sessionId });
      console.log(error);
      if (error) {
        router.push("/checkout/error");
      }
    } catch (err) {
      console.log(err);
      router.push("/checkout/error");
    }
  };

  return (
    <button
      onClick={handler}
      className="bg-blue-700 hover:bg-blue-800 duration-200 text-white mt-8 inline-block w-full rounded-full py-4 text-sm font-bold text-white shadow-xl"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;