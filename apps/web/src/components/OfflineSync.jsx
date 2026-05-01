"use client";
import { useEffect } from "react";
import useOfflineStore from "@/store/offlineStore";
import toast, { Toaster } from "react-hot-toast";

export default function OfflineSync() {
  const { setOnlineStatus, processQueue } = useOfflineStore();

  useEffect(() => {
    setOnlineStatus(navigator.onLine);

    const handleOnline = () => {
      setOnlineStatus(true);
      toast.success("Back online! Syncing your changes...", { id: "online-toast" });
      processQueue();
    };
    const handleOffline = () => {
      setOnlineStatus(false);
      toast.error("You are offline. Changes will be saved locally.", { id: "offline-toast" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus, processQueue]);

  return <Toaster position="top-right" />;
}
