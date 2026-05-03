"use client";
import { useEffect, useState } from "react";
import useToastStore from "@/store/toastStore";

const ICONS = {
  error:   "❌",
  success: "✅",
  info:    "ℹ️",
  warning: "⚠️",
};

const COLORS = {
  error:   "bg-red-500/10 border-red-500/30 text-red-400",
  success: "bg-green-500/10 border-green-500/30 text-green-400",
  info:    "bg-accent/10 border-accent/30 text-accent",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
};

function ToastItem({ toast }) {
  const { removeToast } = useToastStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => removeToast(toast.id), 300);
    }, toast.duration || 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm
        transition-all duration-300 ease-out max-w-sm w-full
        ${COLORS[toast.type] || COLORS.info}
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
      `}
    >
      <span className="text-base shrink-0 mt-0.5">{ICONS[toast.type] || ICONS.info}</span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-xs font-black uppercase tracking-widest mb-0.5 opacity-80">{toast.title}</p>
        )}
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => removeToast(toast.id), 300);
        }}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
