"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";

const PUBLIC_PATHS = ["/login", "/register"];

export default function AuthProvider({ children }) {
  const { isAuthenticated, fetchMe } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!isAuthenticated && !isPublic) {
      router.push("/login");
    }
    if (isAuthenticated && isPublic) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, pathname]);

  return children;
}
