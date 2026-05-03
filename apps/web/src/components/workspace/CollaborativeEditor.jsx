"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState, useRef } from "react";
import { connectSocket } from "@/lib/socket";
import "@/styles/editor.css";

export default function CollaborativeEditor({ goalId, initialContent, user, onSave }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const socketRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 bg-input-bg border border-border-color rounded-xl text-text-primary",
      },
    },
    onUpdate: ({ editor }) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }
      const content = editor.getHTML();
      socketRef.current?.emit("goal:update", { goalId, content });
      
      // Auto-save debounced
      if (onSave) {
        clearTimeout(window.saveTimeout);
        window.saveTimeout = setTimeout(() => onSave(content), 2000);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      socketRef.current?.emit("goal:cursor_move", { 
        goalId, 
        cursor: { from, to, name: user.name, color: user.color || "#4f46e5" } 
      });
    },
  });

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.emit("goal:join", { goalId });

    socket.on("goal:content_update", ({ content, userId }) => {
      if (userId !== user.id && editor) {
        isRemoteUpdate.current = true;
        editor.commands.setContent(content, false);
      }
    });

    socket.on("goal:cursor_update", ({ userId, cursor }) => {
      if (userId !== user.id) {
        setCursors((prev) => ({ ...prev, [userId]: cursor }));
      }
    });

    socket.on("goal:user_list", ({ users }) => {
      setActiveUsers(users);
    });

    return () => {
      socket.emit("goal:leave", { goalId });
      socket.off("goal:content_update");
      socket.off("goal:cursor_update");
      socket.off("goal:user_list");
    };
  }, [goalId, editor, user.id]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2 overflow-hidden">
          {activeUsers.map((u) => (
            <div 
              key={u.id}
              title={u.name}
              className="w-7 h-7 rounded-full border-2 border-bg-card flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0"
              style={{ backgroundColor: u.color || "#4f46e5" }}
            >
              {u.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">
          {activeUsers.length} Editing
        </span>
      </div>

      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Render Remote Cursors (Simplified version) */}
        {Object.entries(cursors).map(([userId, cursor]) => {
          // This is a simplified cursor rendering. 
          // For a perfect one, we'd use TipTap's CollaborationCursor extension
          // which maps coordinates to the document position.
          return null; // Cursors are better handled by TipTap extension
        })}
      </div>
      <p className="text-[9px] text-text-muted mt-2 italic">Changes are saved automatically and synced in real-time.</p>
    </div>
  );
}
