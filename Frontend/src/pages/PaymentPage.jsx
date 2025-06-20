import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

// Log the environment variable to check if it is being loaded correctly
// console.log('Stripe Public Key:', import.meta.REACT_APP_STRIPE_PUBLIC_KEY);

const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const redirectToCheckout = async () => {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
      }
    };

    if (sessionId) {
      redirectToCheckout();
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-2xl font-bold">Redirecting to payment...</h2>
    </div>
  );
};

export default PaymentPage;