"use client";
import React from "react";
import useNotificationStore from "@/store/notificationStore";

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto min-w-[320px] max-w-[400px] p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transition-all animate-in slide-in-from-right duration-500 ${
            n.isRead 
              ? "bg-bg-card/80 backdrop-blur-md border-border-color text-text-secondary"
              : "bg-accent/10 backdrop-blur-md border-accent/20 text-text-primary shadow-accent/5"
          }`}
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-accent mb-1 uppercase tracking-wider">{n.type || 'Notification'}</p>
            <p className="text-sm font-medium leading-relaxed">{n.content || n.message}</p>
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
