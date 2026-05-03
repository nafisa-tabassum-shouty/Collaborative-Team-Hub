"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(formData.name, formData.email, formData.password, avatar);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 transition-colors relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 -right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      {/* Theme Toggle fixed top-right */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle compact />
      </div>

      <div className="w-full max-w-md relative z-0">
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6 group">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/30 transition-colors" />
            <div className="relative w-full h-full bg-white rounded-full p-4 shadow-xl border border-gray-100 flex items-center justify-center transition-transform group-hover:scale-110 duration-500 overflow-hidden">
              <img 
                src="/professional_hub_logo_1777675686020.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Start collaborating with your team today</p>
        </div>

        {/* Card */}
        <div className="bg-bg-card border border-border-color rounded-3xl p-8 shadow-2xl shadow-black/5 transition-colors">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <label className="relative group cursor-pointer">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-border-color flex items-center justify-center overflow-hidden transition-all group-hover:border-accent">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-text-muted group-hover:text-accent">
                      <span className="text-xl">📷</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="absolute -bottom-1 -right-1 bg-accent text-white p-1.5 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              </label>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">Upload Profile Picture</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-[0.98]"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-color"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-bg-card px-2 text-text-muted">Or</span>
            </div>
          </div>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
