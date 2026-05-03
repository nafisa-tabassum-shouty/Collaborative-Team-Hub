"use client";
import { useEffect, useState } from "react";
import useAnnouncementStore from "@/store/announcementStore";
import useAuthStore from "@/store/authStore";
import useWorkspaceStore from "@/store/workspaceStore";
import { connectSocket, joinWorkspaceRoom, leaveWorkspaceRoom } from "@/lib/socket";

const EMOJIS = ["👍", "❤️", "🔥", "🎉", "😮", "👏"];

export default function AnnouncementsFeed({ workspaceId }) {
  const { 
    announcements, 
    fetchAnnouncements, 
    createAnnouncement, 
    addReaction, 
    removeReaction, 
    addLiveAnnouncement, 
    liveUpdateReaction, 
    liveUpdateComment,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    isLoading 
  } = useAnnouncementStore();
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const isAdmin = activeWorkspace?.members?.find(m => m.userId === user?.id)?.role === 'ADMIN';
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;
    
    console.log("AnnouncementsFeed: Fetching for", workspaceId);
    fetchAnnouncements(workspaceId);
    
    const socket = connectSocket();
    joinWorkspaceRoom(workspaceId);

    socket.on("announcement:new", addLiveAnnouncement);
    socket.on("reaction:update", liveUpdateReaction);
    socket.on("comment:new", ({ announcementId, comment }) => {
      liveUpdateComment(announcementId, comment);
    });

    return () => {
      leaveWorkspaceRoom(workspaceId);
      socket.off("announcement:new");
      socket.off("reaction:update");
      socket.off("comment:new");
    };
  }, [workspaceId, fetchAnnouncements, addLiveAnnouncement, liveUpdateReaction, liveUpdateComment, joinWorkspaceRoom, leaveWorkspaceRoom]);

  const { uploadFile } = useAnnouncementStore();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim() || isUploading) return;
    
    let attachmentUrl = null;
    let attachmentType = null;

    if (attachment) {
      setIsUploading(true);
      const uploadResult = await uploadFile(attachment);
      if (uploadResult.success) {
        attachmentUrl = uploadResult.data.url;
        attachmentType = uploadResult.data.format === 'pdf' ? 'pdf' : 'image';
      }
      setIsUploading(false);
    }

    await createAnnouncement(workspaceId, { content, isPinned, attachmentUrl, attachmentType });
    setContent("");
    setIsPinned(false);
    setAttachment(null);
    setShowForm(false);
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
          className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm active:scale-95"
        >
          {showForm ? "Cancel" : "+ Post"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-bg-card border border-border-color rounded-xl p-5 mb-6 space-y-3 shadow-sm animate-in slide-in-from-top-2 duration-300">
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
                className="accent-accent w-4 h-4 rounded border-border-color focus:ring-accent"
              />
              📌 Pin this post
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer text-text-muted hover:text-accent transition-colors p-2 hover:bg-bg-secondary rounded-lg" title="Add attachment">
                <span className="text-xl">📎</span>
                <input type="file" onChange={(e) => setAttachment(e.target.files[0])} className="hidden" />
              </label>
              <button
                type="submit"
                disabled={isUploading || !content.trim()}
                className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Post"}
              </button>
            </div>
          </div>
          {attachment && (
            <div className="flex items-center justify-between bg-bg-secondary/50 rounded-lg px-3 py-2 mt-2 border border-border-color/50">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-sm">📄</span>
                <span className="text-xs text-text-secondary truncate font-medium">{attachment.name}</span>
              </div>
              <button onClick={() => setAttachment(null)} className="text-text-muted hover:text-red-500 p-1">×</button>
            </div>
          )}
        </form>
      )}

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
      ) : (announcements || []).length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border-color rounded-2xl bg-bg-secondary/10">
          <p className="text-5xl mb-4 grayscale opacity-50">📢</p>
          <p className="text-text-secondary font-medium">No announcements yet.</p>
          <p className="text-text-muted text-xs mt-1">Be the first to share an update!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onReact={(emoji) => {
                const alreadyReacted = ann.reactions?.[emoji]?.userReacted;
                if (alreadyReacted) removeReaction(ann.id, emoji);
                else addReaction(ann.id, emoji);
              }}
              fetchComments={() => fetchComments(ann.id)}
              onAddComment={(text, parentId) => addComment(ann.id, text, parentId)}
              onUpdateComment={(commentId, text) => updateComment(ann.id, commentId, text)}
              onDeleteComment={(commentId) => deleteComment(ann.id, commentId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({ announcement, currentUserId, isAdmin, onReact, fetchComments, onAddComment, onUpdateComment, onDeleteComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (showComments && !announcement.comments) {
      fetchComments();
    }
  }, [showComments, announcement.comments, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await onAddComment(commentText, replyingTo?.id);
    setCommentText("");
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  const rootComments = (announcement.comments || []).filter(c => !c.parentId);
  const getReplies = (parentId) => (announcement.comments || []).filter(c => c.parentId === parentId);

  return (
    <div className={`bg-bg-card border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${announcement.isPinned ? "border-accent/40 bg-accent/5" : "border-border-color"}`}>
      {announcement.isPinned && (
        <div className="flex items-center gap-1.5 text-[10px] text-accent font-black uppercase tracking-widest mb-4 bg-accent/10 w-fit px-2 py-0.5 rounded">
          📌 Pinned
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm overflow-hidden">
             {announcement.author?.avatarUrl ? (
               <img src={announcement.author.avatarUrl} alt="" className="w-full h-full object-cover" />
             ) : (
               announcement.author?.name?.charAt(0).toUpperCase()
             )}
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">{announcement.author?.name}</p>
            <p className="text-[10px] text-text-muted font-medium">
              {new Date(announcement.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap mb-4 px-1">
        {announcement.content.split(/(@\w+)/g).map((part, i) => 
          part.startsWith('@') ? (
            <span key={i} className="text-accent font-bold bg-accent/10 px-1.5 py-0.5 rounded-md mx-0.5">{part}</span>
          ) : part
        )}
      </div>

      {announcement.attachmentUrl && (
        <div className="mb-5 border border-border-color rounded-2xl overflow-hidden bg-bg-secondary/10 group">
          {announcement.attachmentType === 'image' ? (
            <a href={announcement.attachmentUrl} target="_blank" rel="noopener noreferrer" className="block relative">
              <img src={announcement.attachmentUrl} alt="Attachment" className="max-w-full h-auto max-h-[500px] object-contain mx-auto" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </a>
          ) : (
            <a href={announcement.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 hover:bg-bg-secondary transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-2xl shadow-inner">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate">View Document</p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Open PDF in new tab</p>
              </div>
              <div className="text-text-muted group-hover:text-accent transform group-hover:translate-x-1 transition-all">→</div>
            </a>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-border-color/50">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {Object.entries(announcement.reactions || {}).map(([emoji, data]) => data.count > 0 && (
            <button
              key={emoji}
              onClick={() => onReact(emoji)}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
                data.userReacted ? "bg-accent/10 border-accent text-accent font-bold" : "bg-bg-secondary/50 border-border-color text-text-secondary hover:border-text-muted"
              }`}
            >
              <span>{emoji}</span> <span>{data.count}</span>
            </button>
          ))}
          <div className="relative group">
            <button className="w-8 h-8 rounded-full border border-border-color flex items-center justify-center text-sm text-text-muted hover:text-text-primary hover:border-text-secondary transition-all">
              +
            </button>
            {/* Hover bridge to prevent menu from disappearing */}
            <div className="absolute bottom-full left-0 pb-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="bg-bg-card border border-border-color shadow-2xl rounded-2xl p-2 flex gap-1">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => onReact(e)} className="text-xl hover:scale-150 transition-transform p-1.5">
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            showComments ? "bg-accent text-white" : "text-text-muted hover:text-text-secondary hover:bg-bg-secondary"
          }`}
        >
          💬 {announcement._count?.comments || 0}
        </button>
      </div>

      {showComments && (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-300">
          {!announcement.comments ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-xs text-text-muted">Loading comments...</span>
            </div>
          ) : rootComments.length === 0 ? (
            <div className="text-center py-4 bg-bg-secondary/20 rounded-xl border border-dashed border-border-color/50">
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {rootComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <CommentItem 
                    comment={comment}
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    onReply={() => {
                      setReplyingTo({ id: comment.id, name: comment.author?.name });
                      setCommentText(`@${comment.author?.name} `);
                    }}
                    onEdit={(text) => {
                      setEditingCommentId(comment.id);
                      setEditingCommentText(text);
                    }}
                    onDelete={() => onDeleteComment(comment.id)}
                    isEditing={editingCommentId === comment.id}
                    editingText={editingCommentText}
                    setEditingText={setEditingCommentText}
                    onUpdate={async () => {
                      await onUpdateComment(comment.id, editingCommentText);
                      setEditingCommentId(null);
                    }}
                    onCancelEdit={() => setEditingCommentId(null)}
                  />
                  
                  <div className="ml-10 space-y-4 border-l-2 border-border-color/30 pl-6">
                    {getReplies(comment.id).map(reply => (
                      <CommentItem 
                        key={reply.id}
                        comment={reply}
                        currentUserId={currentUserId}
                        isAdmin={isAdmin}
                        onReply={() => {
                          setReplyingTo({ id: comment.id, name: reply.author?.name });
                          setCommentText(`@${reply.author?.name} `);
                        }}
                        onEdit={(text) => {
                          setEditingCommentId(reply.id);
                          setEditingCommentText(text);
                        }}
                        onDelete={() => onDeleteComment(reply.id)}
                        isEditing={editingCommentId === reply.id}
                        editingText={editingCommentText}
                        setEditingText={setEditingCommentText}
                        onUpdate={async () => {
                          await onUpdateComment(reply.id, editingCommentText);
                          setEditingCommentId(null);
                        }}
                        onCancelEdit={() => setEditingCommentId(null)}
                        isReply
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="relative pt-2">
            {replyingTo && (
              <div className="flex items-center justify-between mb-3 px-4 py-2 bg-accent/5 border border-accent/20 rounded-xl animate-in slide-in-from-bottom-1">
                <span className="text-[10px] text-accent font-black uppercase tracking-widest">Replying to {replyingTo.name}</span>
                <button type="button" onClick={() => setReplyingTo(null)} className="text-accent hover:text-red-500 font-bold p-1">×</button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                className="flex-1 bg-input-bg border border-border-color text-text-primary rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-text-muted transition-all"
                autoFocus={!!replyingTo}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="bg-accent hover:bg-accent-hover disabled:opacity-30 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-lg shadow-accent/20 active:scale-95"
              >
                {replyingTo ? "Reply" : "Post"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function CommentItem({ 
  comment, currentUserId, isAdmin, onReply, onEdit, onDelete, 
  isEditing, editingText, setEditingText, onUpdate, onCancelEdit, isReply = false 
}) {
  return (
    <div className="flex gap-4 group/comment">
      <div className={`rounded-full bg-bg-secondary flex items-center justify-center font-bold text-text-secondary flex-shrink-0 shadow-inner ${isReply ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs'}`}>
        {comment.author?.avatarUrl ? (
          <img src={comment.author.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          comment.author?.name?.charAt(0).toUpperCase()
        )}
      </div>
      <div className={`flex-1 bg-bg-secondary/30 rounded-2xl px-5 py-3 hover:bg-bg-secondary/50 transition-all border border-transparent hover:border-border-color/30 ${comment._optimistic ? 'opacity-50 grayscale' : ''}`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-primary hover:text-accent cursor-pointer transition-colors">{comment.author?.name}</span>
            {comment.authorId === currentUserId && (
              <span className="text-[8px] bg-accent text-white px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">You</span>
            )}
          </div>
          <span className="text-[9px] text-text-muted font-medium">
            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); onUpdate(); }} className="mt-3 space-y-2">
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="w-full bg-input-bg border border-accent/30 text-text-primary rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent ring-2 ring-accent/10"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onCancelEdit} className="text-[10px] text-text-muted hover:text-text-primary font-bold">Cancel</button>
              <button type="submit" className="text-[10px] text-accent hover:text-accent-hover font-black uppercase tracking-widest">Save Changes</button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed px-0.5">
            {comment.content.split(/(@\w+)/g).map((part, i) => 
              part.startsWith('@') ? (
                <span key={i} className="text-accent font-bold hover:underline cursor-pointer">{part}</span>
              ) : part
            )}
          </p>
        )}

        {!isEditing && !comment._optimistic && (
          <div className="mt-3 flex items-center gap-4 opacity-0 group-hover/comment:opacity-100 transition-all duration-300">
            <button onClick={onReply} className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent">Reply</button>
            {(comment.authorId === currentUserId || isAdmin) && (
              <>
                {comment.authorId === currentUserId && (
                  <button onClick={() => onEdit(comment.content)} className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent">Edit</button>
                )}
                <button onClick={onDelete} className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-red-500">Delete</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
