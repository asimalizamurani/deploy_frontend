import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

const MAX_RETRIES = 6; // Try for up to 6 times (about 12 seconds)
const RETRY_DELAY = 2000; // 2 seconds between tries

const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { forceRefreshCart } = useCartStore();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const verifyPayment = async (attempt = 1) => {
      try {
        const { data } = await axios.get(`payments/verify/${sessionId}`);
        if (data.success) {
          await forceRefreshCart();
          if (isMounted) {
            setStatus('success');
            toast.success('Payment successful! Cart cleared');
          }
        } else if (attempt < MAX_RETRIES) {
          setTimeout(() => verifyPayment(attempt + 1), RETRY_DELAY);
          setRetries(attempt);
        } else {
          if (isMounted) setStatus('failed');
        }
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          setTimeout(() => verifyPayment(attempt + 1), RETRY_DELAY);
          setRetries(attempt);
        } else {
          if (isMounted) setStatus('failed');
        }
      }
    };
    if (sessionId) {
      verifyPayment();
    }
    return () => { isMounted = false; };
  }, [sessionId, forceRefreshCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {sessionId ? (
          status === 'processing' ? (
            <>
              <h2 className="text-2xl font-bold text-emerald-600 mb-4">
                <Loader className="animate-spin inline-block mr-2" />
                Finalizing Order... (Attempt {retries + 1} of {MAX_RETRIES})
              </h2>
              <p className="text-gray-600">Clearing your cart and completing purchase</p>
            </>
          ) : status === 'success' ? (
            <>
              <h2 className="text-2xl font-bold text-emerald-600 mb-4">Payment Successful!</h2>
              <p className="text-gray-600">Thank you for your purchase. Your order is complete.</p>
            </>
          ) : (
            <div className="text-red-500">
              Payment verification failed. If you paid, please contact support.
            </div>
          )
        ) : (
          <div className="text-red-500">
            Invalid session ID - No payment to verify
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseSuccess;