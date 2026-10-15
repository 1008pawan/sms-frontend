"use client";
import {
  X,
  Copy,
  CheckCircle2,
  Clock,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PaymentDetailsModal({ open, onClose, appointment }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!open || !appointment) return null;

  const payment = appointment.payment || {};
  const isPaid = payment.isPaid;
  const isRefunded = payment.isRefunded;
  const amount = (payment.amount || 0) / 100;
  const refundAmount = (payment.refundAmount || payment.amount || 0) / 100;

  const copyToClipboard = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied!");
    setTimeout(() => setCopiedField(null), 1500);
  };

  // 👇 Payment status config
  const statusConfig = isRefunded
    ? {
        label: "Refunded",
        icon: <RotateCcw className="w-5 h-5" />,
        gradient: "from-blue-500 to-cyan-500",
        textColor: "text-blue-600",
        bg: "bg-blue-50",
      }
    : isPaid
      ? {
          label: "Paid",
          icon: <CheckCircle2 className="w-5 h-5" />,
          gradient: "from-emerald-500 to-teal-500",
          textColor: "text-emerald-600",
          bg: "bg-emerald-50",
        }
      : {
          label: "Unpaid",
          icon: <Clock className="w-5 h-5" />,
          gradient: "from-orange-500 to-amber-500",
          textColor: "text-orange-600",
          bg: "bg-orange-50",
        };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* ==================== HEADER ==================== */}
        <div
          className={`relative bg-gradient-to-br ${statusConfig.gradient} px-6 pt-6 pb-20 text-white overflow-hidden shrink-0`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/10" />

          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors backdrop-blur-sm z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
              {statusConfig.icon}
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              Payment Details
            </h3>
            <p className="text-sm opacity-90 mt-1">
              Complete transaction record
            </p>
          </div>
        </div>

        {/* ==================== AMOUNT CARD ==================== */}
        <div className="relative px-6 -mt-12 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {isRefunded ? "Refunded Amount" : "Amount Paid"}
                </p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  ₹
                  {(isRefunded ? refundAmount : amount).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 mt-1">Consultation Fee</p>
              </div>
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.textColor} inline-flex items-center gap-1.5`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    statusConfig.gradient.replace("from-", "bg-").split(" ")[0]
                  }`}
                />
                {statusConfig.label}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== DETAILS ==================== */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
            Transaction Details
          </p>

          <div className="space-y-2.5">
            {payment.razorpayPaymentId && (
              <DetailRow
                label="Payment ID"
                value={payment.razorpayPaymentId}
                icon="💳"
                onCopy={() =>
                  copyToClipboard(payment.razorpayPaymentId, "payment")
                }
                copied={copiedField === "payment"}
              />
            )}

            {payment.razorpayOrderId && (
              <DetailRow
                label="Order ID"
                value={payment.razorpayOrderId}
                icon="📋"
                onCopy={() => copyToClipboard(payment.razorpayOrderId, "order")}
                copied={copiedField === "order"}
              />
            )}

            {payment.currency && (
              <DetailRow label="Currency" value={payment.currency} icon="🌐" />
            )}

            {payment.paidAt && (
              <DetailRow
                label="Payment Date"
                value={new Date(payment.paidAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                icon="📅"
              />
            )}

            {!isPaid && (
              <DetailRow
                label="Status"
                value="Payment pending — not completed yet"
                icon="⏳"
              />
            )}
          </div>

          {/* Refund section */}
          {isRefunded && (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 mt-6">
                Refund Details
              </p>

              <div className="space-y-2.5">
                {payment.refundId && (
                  <DetailRow
                    label="Refund ID"
                    value={payment.refundId}
                    icon="↩️"
                    onCopy={() => copyToClipboard(payment.refundId, "refund")}
                    copied={copiedField === "refund"}
                  />
                )}

                <DetailRow
                  label="Refund Amount"
                  value={`₹${refundAmount.toLocaleString("en-IN")}`}
                  icon="💰"
                />

                {payment.refundedAt && (
                  <DetailRow
                    label="Refunded On"
                    value={new Date(payment.refundedAt).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                    icon="📆"
                  />
                )}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <b>Note:</b> Refunds take 5-7 business days to reflect in your
                  original payment method.
                </p>
              </div>
            </>
          )}

          {/* Unpaid info */}
          {!isPaid && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-700 leading-relaxed">
                <b>Note:</b> This appointment hasn't been paid for yet. Complete
                the payment to confirm your booking.
              </p>
            </div>
          )}
        </div>

        {/* ==================== FOOTER ==================== */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== SUB COMPONENT ==================== */
const DetailRow = ({ label, value, icon, onCopy, copied }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition group">
    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-sm shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
    </div>
    {onCopy && (
      <button
        onClick={onCopy}
        className="shrink-0 w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
        title="Copy"
      >
        {copied ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    )}
  </div>
);
