import React, { useEffect, useRef, useState } from "react";
import useSocketStore from "@/store/socketStore";
import useGoalStore from "@/store/goalStore";
import useAuthStore from "@/store/authStore";
import { User } from "lucide-react";

const CollaborativeEditor = ({ goalId }) => {
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  const { 
    liveDescription, 
    setLiveDescription, 
    collaborators, 
    setCollaborators, 
    remoteCursors, 
    setRemoteCursor,
    updateGoal 
  } = useGoalStore();
  
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  
  // Join room on mount
  useEffect(() => {
    if (socket && goalId) {
      socket.emit("goal:join", { goalId });
      
      socket.on("goal:user_list", ({ users }) => {
        setCollaborators(users);
      });
      
      socket.on("goal:content_update", ({ content, userId }) => {
        if (userId !== user.id) {
          setLiveDescription(content);
        }
      });
      
      socket.on("goal:cursor_update", ({ userId, cursor }) => {
        if (userId !== user.id) {
          setRemoteCursor(userId, cursor);
        }
      });
      
      return () => {
        socket.emit("goal:leave", { goalId });
        socket.off("goal:user_list");
        socket.off("goal:content_update");
        socket.off("goal:cursor_update");
      };
    }
  }, [socket, goalId]);

  // Handle local text changes
  const handleChange = (e) => {
    const val = e.target.value;
    setLiveDescription(val);
    
    // Broadcast to others
    socket.emit("goal:update", { goalId, content: val });
    
    // Debounced save to DB
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      updateGoal(goalId, { description: val });
    }, 2000); // Save after 2 seconds of inactivity
  };

  // Handle cursor movement
  const handleKeyUp = (e) => {
    const { selectionStart } = e.target;
    // Calculate cursor position (simple logic for now)
    socket.emit("goal:cursor_move", { 
      goalId, 
      cursor: { pos: selectionStart } 
    });
  };

  return (
    <div className="space-y-4">
      {/* Collaborators List */}
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2">
          {collaborators.map((c, i) => (
            <div 
              key={c.id || i}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-indigo-500 flex items-center justify-center text-white text-xs overflow-hidden"
              title={c.name}
            >
              {c.avatarUrl ? (
                <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <User size={14} />
              )}
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {collaborators.length} editing now
        </span>
      </div>

      {/* Editor Area */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={liveDescription}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onClick={handleKeyUp}
          placeholder="Start writing goal description..."
          className="w-full min-h-[300px] p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 transition-all outline-none text-gray-700 dark:text-gray-200 resize-none shadow-sm"
        />
        
        {/* Remote Cursors Overlay (Conceptual - mapping selectionStart to visually absolute position would require mirror div logic) */}
        <div className="absolute top-0 left-0 pointer-events-none w-full h-full p-6 text-transparent whitespace-pre-wrap break-words border-2 border-transparent">
          {/* This is a visual ghost layer */}
          {liveDescription}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-2">
        <span>Real-time Sync Enabled</span>
        <span>Auto-saving to cloud</span>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
