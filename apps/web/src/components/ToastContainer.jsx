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
          className={`pointer-events-auto min-w-[300px] p-4 rounded-2xl shadow-2xl border flex items-center justify-between transition-all animate-in slide-in-from-right duration-300 ${
            n.type === "error"
              ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300"
              : "bg-white border-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          }`}
        >
          <p className="text-sm font-semibold">{n.message}</p>
          <button
            onClick={() => removeNotification(n.id)}
            className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
