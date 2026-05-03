"use client";
import { useState } from "react";
import useAuthStore from "@/store/authStore";

export default function ProfileModal({ onClose }) {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");
    const result = await updateProfile(name, avatar);
    if (result.success) {
      setSuccess("Profile updated successfully!");
      setTimeout(() => onClose(), 1500);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-color rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Your Profile</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">{error}</div>}
          {success && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">{success}</div>}

          <div className="flex flex-col items-center justify-center">
            <label className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-border-color flex items-center justify-center overflow-hidden transition-all group-hover:border-accent">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-2xl opacity-20">👤</div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold uppercase">Change</span>
                </div>
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all font-medium"
            />
          </div>

          <div className="space-y-2 opacity-60">
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email}
              className="w-full bg-bg-secondary border border-border-color text-text-muted rounded-xl px-4 py-3 text-sm cursor-not-allowed font-medium"
            />
            <p className="text-[9px] text-text-muted italic ml-1">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-accent/25 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
