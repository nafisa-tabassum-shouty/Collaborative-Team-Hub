"use client";
import { useState } from "react";
import useAuthStore from "@/store/authStore";

export default function ProfileModal({ onClose }) {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [isCustomAvatar, setIsCustomAvatar] = useState(!!user?.avatarUrl && !user.avatarUrl.includes("dicebear"));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setAvatar(url);
    setAvatarPreview(url);
    setIsCustomAvatar(false);
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

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Change Avatar</label>
            <div className="flex flex-wrap gap-2 justify-center">
              {DEFAULT_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDefaultAvatar(url)}
                  className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden hover:scale-110 ${
                    avatarPreview === url ? "border-accent shadow-lg scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
              
              <label className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 ${
                isCustomAvatar ? "border-accent bg-accent/10" : "border-border-color text-text-muted"
              }`}>
                {isCustomAvatar && avatarPreview && !avatarPreview.startsWith("https://api.dicebear.com") ? (
                  <img src={avatarPreview} alt="Custom" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-lg">📷</span>
                )}
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>

            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-accent/20 p-1">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Selected" className="w-full h-full object-cover rounded-full bg-white shadow-xl" />
                ) : (
                  <div className="w-full h-full bg-bg-secondary rounded-full flex items-center justify-center text-2xl">👤</div>
                )}
              </div>
            </div>
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
