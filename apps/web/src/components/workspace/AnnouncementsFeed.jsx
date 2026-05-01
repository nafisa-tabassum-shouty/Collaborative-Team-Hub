"use client";
import { useEffect, useState } from "react";
import useAnnouncementStore from "@/store/announcementStore";
import useAuthStore from "@/store/authStore";

const EMOJIS = ["👍", "❤️", "🔥", "🎉", "😮", "👏"];

export default function AnnouncementsFeed({ workspaceId }) {
  const { announcements, fetchAnnouncements, createAnnouncement, addReaction, removeReaction, isLoading } =
    useAnnouncementStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    fetchAnnouncements(workspaceId);
  }, [workspaceId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await createAnnouncement(workspaceId, { content, isPinned });
    setContent("");
    setIsPinned(false);
    setShowForm(false);
  };

  const handleReaction = async (announcementId, emoji, reactions) => {
    const alreadyReacted = reactions?.[emoji]?.userReacted;
    if (alreadyReacted) {
      await removeReaction(announcementId, emoji);
    } else {
      await addReaction(announcementId, emoji);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Announcements</h2>
          <p className="text-text-secondary text-sm mt-1">Team-wide updates and news</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? "Cancel" : "+ Post"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-bg-card border border-border-color rounded-xl p-5 mb-6 space-y-3 shadow-sm"
        >
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement..."
            rows={4}
            className="w-full bg-input-bg border border-border-color text-text-primary rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-muted resize-none transition-colors"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="accent-accent"
              />
              📌 Pin this post
            </label>
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      )}

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-color rounded-xl p-5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 bg-bg-secondary rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-bg-secondary rounded w-1/4" />
                  <div className="h-3 bg-bg-secondary rounded w-1/3" />
                </div>
              </div>
              <div className="h-4 bg-bg-secondary rounded w-full" />
            </div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-color rounded-xl">
          <p className="text-4xl mb-3">📢</p>
          <p className="text-text-secondary">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              currentUserId={user?.id}
              onReact={(emoji) => handleReaction(ann.id, emoji, ann.reactions)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({ announcement, currentUserId, onReact }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div
      className={`bg-bg-card border rounded-xl p-5 shadow-sm transition-all ${
        announcement.isPinned ? "border-accent/40 bg-accent/5" : "border-border-color"
      }`}
    >
      {/* Pin indicator */}
      {announcement.isPinned && (
        <div className="flex items-center gap-1.5 text-xs text-accent font-semibold mb-3">
          <span>📌</span> Pinned
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm">
          {announcement.author?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{announcement.author?.name}</p>
          <p className="text-xs text-text-muted">
            {new Date(announcement.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{announcement.content}</p>

      {/* Reactions */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {/* Existing reactions */}
        {announcement.reactions && Object.entries(announcement.reactions).map(([emoji, data]) =>
          data.count > 0 ? (
            <button
              key={emoji}
              onClick={() => onReact(emoji)}
              className={`flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full border transition-all ${
                data.userReacted
                  ? "bg-accent/10 border-accent text-accent shadow-sm"
                  : "bg-bg-secondary border-border-color text-text-secondary hover:border-text-muted"
              }`}
            >
              <span>{emoji}</span> <span className="text-xs font-medium">{data.count}</span>
            </button>
          ) : null
        )}
        {/* Add reaction picker */}
        <div className="relative group">
          <button className="text-sm px-2.5 py-1 rounded-full border border-border-color text-text-muted hover:text-text-primary hover:border-text-secondary transition-all">
            + 😊
          </button>
          <div className="absolute bottom-full left-0 mb-2 bg-bg-card border border-border-color shadow-xl rounded-lg p-2 flex gap-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-1 group-hover:translate-y-0 z-10">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => onReact(e)}
                className="text-lg hover:scale-125 transition-transform p-1"
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Comments toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="ml-auto text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          💬 {announcement._count?.comments || 0} comments
        </button>
      </div>
    </div>
  );
}
