"use client";
import { useEffect } from "react";
import useActionItemStore from "@/store/actionItemStore";

const COLUMNS = [
  { id: "TODO",        label: "To Do",       color: "border-gray-400 dark:border-gray-600", badge: "bg-bg-secondary text-text-secondary" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-accent",                      badge: "bg-accent/10 text-accent" },
  { id: "DONE",        label: "Done",        color: "border-green-500",                   badge: "bg-green-500/10 text-green-600 dark:text-green-400" },
];

const PRIORITY_COLORS = {
  HIGH:   "text-red-500 dark:text-red-400",
  MEDIUM: "text-yellow-600 dark:text-yellow-400",
  LOW:    "text-text-muted",
};

export default function KanbanBoard({ workspaceId }) {
  const { actionItems, fetchActionItems, updateActionItem, isLoading } = useActionItemStore();

  useEffect(() => {
    fetchActionItems(workspaceId);
  }, [workspaceId]);

  const grouped = {
    TODO:        actionItems.filter((i) => i.status === "TODO"),
    IN_PROGRESS: actionItems.filter((i) => i.status === "IN_PROGRESS"),
    DONE:        actionItems.filter((i) => i.status === "DONE"),
  };

  const moveCard = async (itemId, newStatus) => {
    await updateActionItem(itemId, { status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 transition-colors">
        {COLUMNS.map((col) => (
          <div key={col.id} className="bg-bg-card rounded-xl p-4 space-y-3 animate-pulse border border-border-color">
            <div className="h-4 bg-bg-secondary rounded w-1/2 mb-4" />
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-bg-secondary rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 transition-colors">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">Kanban Board</h2>
        <p className="text-text-secondary text-sm mt-1">Manage tasks across your team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className={`bg-bg-card border border-border-color border-t-4 ${col.color} rounded-xl p-4 min-h-[400px] shadow-sm transition-colors`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="font-bold text-xs uppercase tracking-wider text-text-primary">{col.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${col.badge}`}>
                {grouped[col.id].length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {grouped[col.id].length === 0 && (
                <div className="border border-dashed border-border-color rounded-lg py-12 text-center">
                  <p className="text-text-muted text-[10px] font-medium uppercase tracking-widest">No tasks</p>
                </div>
              )}
              {grouped[col.id].map((item) => (
                <div
                  key={item.id}
                  className="bg-bg-primary border border-border-color rounded-lg p-3 hover:border-accent/50 hover:shadow-md transition-all group cursor-default"
                >
                  <p className="text-sm font-medium text-text-primary mb-2 line-clamp-2 leading-snug">{item.title}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.MEDIUM}`}>
                      {item.priority}
                    </span>
                    {item.assignee && (
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title={item.assignee.name}>
                        {item.assignee.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {item.dueDate && (
                    <p className="text-[10px] text-text-muted mt-2 font-medium">
                      📅 {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {/* Quick move buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border-color/50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                    {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => moveCard(item.id, c.id)}
                        className="text-[10px] font-bold text-accent hover:text-accent-hover transition-colors flex-1 text-left"
                      >
                        → {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
