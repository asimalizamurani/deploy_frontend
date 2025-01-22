import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccess = () => {

  const [isProcessing, setIsProcessing] = useState(true);
  const {clearCart} = useCartStore();
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axios.post("payments/checkout-success", {
          sessionId
        })
        clearCart()
      } catch (error) {
        console.log("Error in purchaseSuccess page", error)
      } finally {
        setIsProcessing(false)
      }
    }

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId) {
      handleCheckoutSuccess(sessionId)
    } else {
      setIsProcessing(false)
      setError("No session ID found in the URL")
    }
  }, [clearCart])

  if(isProcessing) return "Processing";

  if(error) return `Error: ${error}`;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
      width={
        window.innerWidth
      }
      height={
        window.innerHeight
      }
      gravity={0.1}
      style={{zIndex: 99}}
      numberOfPieces={700}
      recycle={false}
      />

      <div
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden
      relative z-10"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center">
            <CheckCircle className="text-emerald-400 w-1/6 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Purchase successful!
          </h1>

          <p className="text-center text-gray-300 mb-4">
            Thank you for your purchase. Your order will be shipped soon.
          </p>

          {/* TODO: Add the email functionality when a user place an order then 
          send him an email. */}
          <p className="text-emerald-400 text-center mb-6 text-sm">
            You will receive an email confirmation shortly.
          </p>
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 text-sm">Order Number</p>
              <p className="text-emerald-400 text-sm font-semibold">#123456</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 text-sm">Estimated Delivery</p>
              <p className="text-emerald-400 text-sm font-semibold">
                3-5 business days
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl
            hover:bg-emerald-300 flex items-center justify-center"
            >
              <HandHeart className="m-2" size={18} />
              Thanks for shopping with us!
            </button>
            <Link
            to={"/"}
              className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-xl
            hover:bg-gray-600 transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
