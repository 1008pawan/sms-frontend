"use client";
import { useState } from "react";
import api from "../Api/PrivateApi";
import toast from "react-hot-toast";

export default function RazorpayButton({
  appointmentId,
  patientName,
  amount,
  isPaid = false,
  isRefunded = false,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(amount || null);

  if (isPaid && !isRefunded) {
    return (
      <button
        disabled
        className="w-full bg-emerald-50 text-emerald-700 font-bold py-4 rounded-2xl border-2 border-emerald-200 flex items-center justify-center gap-2 cursor-default"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Payment Already Completed
      </button>
    );
  }

  if (isRefunded) {
    return (
      <button
        disabled
        className="w-full bg-blue-50 text-blue-700 font-bold py-4 rounded-2xl border-2 border-blue-200 flex items-center justify-center gap-2 cursor-default"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
        Amount Refunded
      </button>
    );
  }

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/payment/create-order", {
        appointmentId,
      });

      if (!data.success) throw new Error(data.message);

      if (data.consultationFee) {
        setFee(data.consultationFee);
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Hospital Appointment",
        description: `Appointment for ${patientName}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId,
            });

            if (verifyRes.data.success) {
              toast.success("Payment done! Appointment confirmed.");
              onSuccess?.();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error("Verification error");
          }
        },
        prefill: {
          name: patientName,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Opening Razorpay...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Pay {fee ? `₹${fee.toLocaleString("en-IN")}` : ""} & Confirm
        </>
      )}
    </button>
  );
}
