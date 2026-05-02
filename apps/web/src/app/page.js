"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  return null;

  return null;
}
