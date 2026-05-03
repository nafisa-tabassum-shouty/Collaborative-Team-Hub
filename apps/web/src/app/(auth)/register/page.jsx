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
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);
  const [error, setError] = useState("");

  const DEFAULT_AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Molly",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Willow",
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setIsCustomAvatar(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectDefaultAvatar = (url) => {
    setAvatar(url); // Storing the URL string as 'avatar'
    setAvatarPreview(url);
    setIsCustomAvatar(false);
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
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Select Avatar</label>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {DEFAULT_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectDefaultAvatar(url)}
                    className={`w-12 h-12 rounded-full border-2 transition-all overflow-hidden hover:scale-110 active:scale-95 ${
                      avatarPreview === url ? "border-accent shadow-lg scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                
                <label className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 ${
                  isCustomAvatar ? "border-accent bg-accent/10" : "border-border-color text-text-muted"
                }`}>
                  {isCustomAvatar && avatarPreview ? (
                    <img src={avatarPreview} alt="Custom" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xl">📷</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {avatarPreview && (
                <div className="flex justify-center animate-in zoom-in-50 duration-300">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-accent/20 p-1">
                      <img src={avatarPreview} alt="Selected Avatar" className="w-full h-full object-cover rounded-full bg-white shadow-xl" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-accent text-white p-1.5 rounded-full shadow-lg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </div>
                </div>
              )}
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
