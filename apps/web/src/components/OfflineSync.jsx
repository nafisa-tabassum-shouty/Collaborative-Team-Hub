"use client";
import { useEffect } from "react";
import useOfflineStore from "@/store/offlineStore";
import useNotificationStore from "@/store/notificationStore";

export default function OfflineSync() {
  const { setOnlineStatus, processQueue } = useOfflineStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    setOnlineStatus(navigator.onLine);

    const handleOnline = () => {
      setOnlineStatus(true);
      addNotification("Back online! Syncing your changes...", "success");
      processQueue();
    };
    const handleOffline = () => {
      setOnlineStatus(false);
      addNotification("You are offline. Changes will be saved locally.", "error");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus, processQueue, addNotification]);

  return null;
}
