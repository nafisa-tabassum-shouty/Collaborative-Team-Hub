"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";

const PUBLIC_PATHS = ["/login", "/register"];

export default function AuthProvider({ children }) {
  const { isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("🔐 AuthProvider: Initializing...");
    
    let isDone = false;
    const done = () => {
      if (isDone) return;
      isDone = true;
      console.log("🔐 AuthProvider: Initialization complete.");
      setIsInitialized(true);
    };

    // Safety timeout
    const timeout = setTimeout(() => {
      console.warn("🔐 AuthProvider: Timeout reached, forcing initialization.");
      done();
    }, 5000);

    fetchMe()
      .then(() => console.log("🔐 AuthProvider: fetchMe success."))
      .catch((err) => console.error("🔐 AuthProvider: fetchMe error:", err))
      .finally(() => {
        clearTimeout(timeout);
        done();
      });
  }, [fetchMe]);

  useEffect(() => {
    if (!isInitialized) return;

    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!isAuthenticated && !isPublic) {
      router.replace("/login");
    }
    if (isAuthenticated && isPublic) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, pathname, isInitialized, router]);

  // Show spinner ONLY until first fetchMe completes
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-xs font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  return children;
}
