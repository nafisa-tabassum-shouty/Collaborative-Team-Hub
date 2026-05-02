"use client";
import { useEffect, useState } from "react";
import useActionItemStore from "@/store/actionItemStore";
import useGoalStore from "@/store/goalStore";

const COLUMNS = [
  { id: "TODO",        label: "To Do",       color: "border-gray-400 dark:border-gray-600", badge: "bg-bg-secondary text-text-secondary" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-accent",                       badge: "bg-accent/10 text-accent" },
  { id: "DONE",        label: "Done",        color: "border-green-500",                    badge: "bg-green-500/10 text-green-600 dark:text-green-400" },
];

const PRIORITY_COLORS = {
  HIGH:   "text-red-500 dark:text-red-400",
  MEDIUM: "text-yellow-600 dark:text-yellow-400",
  LOW:    "text-text-muted",
};

const STATUS_BADGE = {
  TODO:        "bg-bg-secondary text-text-secondary",
  IN_PROGRESS: "bg-accent/10 text-accent",
  DONE:        "bg-green-500/10 text-green-600 dark:text-green-400",
};

const STATUS_LABEL = { TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done" };

// ── View Toggle ──────────────────────────────────────────────────────────────
function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-1 bg-bg-secondary border border-border-color rounded-xl p-1 shadow-inner">
      <button
        onClick={() => { setViewMode("kanban"); localStorage.setItem("kanbanViewMode", "kanban"); }}
        title="Kanban View"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          viewMode === "kanban"
            ? "bg-accent text-white shadow-md shadow-accent/30"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="1" width="4" height="12" rx="1"/>
          <rect x="6" y="1" width="4" height="8"  rx="1"/>
          <rect x="11" y="1" width="2" height="10" rx="1"/>
        </svg>
        Board
      </button>
      <button
        onClick={() => { setViewMode("list"); localStorage.setItem("kanbanViewMode", "list"); }}
        title="List View"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          viewMode === "list"
            ? "bg-accent text-white shadow-md shadow-accent/30"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
          <line x1="1" y1="3"  x2="13" y2="3"/>
          <line x1="1" y1="7"  x2="13" y2="7"/>
          <line x1="1" y1="11" x2="13" y2="11"/>
        </svg>
        List
      </button>
    </div>
  );
}

// ── List View ────────────────────────────────────────────────────────────────
function ListView({ actionItems, updateActionItem }) {
  return (
    <div className="bg-bg-card border border-border-color rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-bg-secondary/50 border-b border-border-color">
        {["Task", "Status", "Assignee", "Due Date"].map(h => (
          <span key={h} className="text-[10px] font-black uppercase tracking-widest text-text-muted">{h}</span>
        ))}
      </div>

      {/* Rows */}
      {actionItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">No Tasks</p>
        </div>
      ) : (
        <div className="divide-y divide-border-color/50">
          {actionItems.map(item => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center hover:bg-bg-secondary/30 transition-colors group"
            >
              {/* Title + Priority */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-bold text-text-primary truncate group-hover:text-accent transition-colors">
                  {item.title}
                </span>
                <span className={`text-[9px] font-black uppercase ${PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.MEDIUM}`}>
                  ● {item.priority}
                </span>
              </div>

              {/* Status Badge + quick move */}
              <div className="relative group/status">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer ${STATUS_BADGE[item.status]}`}>
                  {STATUS_LABEL[item.status]}
                </span>
                {/* Hover quick-change */}
                <div className="absolute top-full left-0 mt-1 bg-bg-card border border-border-color rounded-xl shadow-xl z-10 p-1 flex flex-col gap-1 opacity-0 pointer-events-none group-hover/status:opacity-100 group-hover/status:pointer-events-auto transition-all">
                  {COLUMNS.filter(c => c.id !== item.status).map(c => (
                    <button
                      key={c.id}
                      onClick={() => updateActionItem(item.id, { status: c.id })}
                      className="text-[10px] font-bold text-text-secondary hover:text-accent hover:bg-accent/10 px-3 py-1.5 rounded-lg text-left whitespace-nowrap transition-colors"
                    >
                      → {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignee */}
              <div className="flex items-center gap-2">
                {item.assignee ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[9px] font-black text-white flex-shrink-0">
                      {item.assignee.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-text-secondary truncate">{item.assignee.name}</span>
                  </>
                ) : (
                  <span className="text-[10px] text-text-muted italic">Unassigned</span>
                )}
              </div>

              {/* Due Date */}
              <div>
                {item.dueDate ? (
                  <span className="text-[10px] font-bold text-text-muted">
                    📅 {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-[10px] text-text-muted italic">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function KanbanBoard({ workspaceId }) {
  const { actionItems, fetchActionItems, createActionItem, updateActionItem, isLoading } = useActionItemStore();
  const { goals, fetchGoals } = useGoalStore();
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [taskForm, setTaskForm]         = useState({ title: "", goalId: "", priority: "MEDIUM" });

  // Restore from localStorage
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("kanbanViewMode") || "kanban";
    return "kanban";
  });

  useEffect(() => {
    fetchActionItems(workspaceId);
    fetchGoals(workspaceId);
  }, [workspaceId]);

  const grouped = {
    TODO:        actionItems.filter(i => i.status === "TODO"),
    IN_PROGRESS: actionItems.filter(i => i.status === "IN_PROGRESS"),
    DONE:        actionItems.filter(i => i.status === "DONE"),
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.goalId) return alert("Please select a Goal for this task");
    await createActionItem(taskForm.goalId, { ...taskForm, status: showTaskForm, workspaceId });
    setTaskForm({ title: "", goalId: "", priority: "MEDIUM" });
    setShowTaskForm(null);
    fetchActionItems(workspaceId);
  };

  return (
    <div className="p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Kanban Board</h2>
          <p className="text-text-secondary text-sm mt-1">Operational task management and workflow</p>
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Conditional View */}
      {viewMode === "list" ? (
        <ListView actionItems={actionItems} updateActionItem={updateActionItem} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className={`flex flex-col bg-bg-card/40 backdrop-blur-sm border border-border-color border-t-4 ${col.color} rounded-2xl min-h-[600px] shadow-sm transition-all`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between p-4 border-b border-border-color/50">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs uppercase tracking-widest text-text-primary">{col.label}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-inner ${col.badge}`}>
                    {grouped[col.id].length}
                  </span>
                </div>
                <button
                  onClick={() => setShowTaskForm(showTaskForm === col.id ? null : col.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-bg-secondary text-text-primary hover:bg-accent hover:text-white transition-all shadow-sm"
                >
                  +
                </button>
              </div>

              {/* Quick Add Form */}
              {showTaskForm === col.id && (
                <div className="p-3 bg-bg-secondary/30 animate-in fade-in slide-in-from-top-2 duration-200">
                  <form onSubmit={handleCreateTask} className="space-y-3 bg-bg-card p-4 rounded-xl border border-accent/20 shadow-lg">
                    <input
                      required autoFocus
                      placeholder="Task title..."
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="w-full bg-input-bg border border-border-color rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent outline-none"
                    />
                    <select
                      required
                      value={taskForm.goalId}
                      onChange={(e) => setTaskForm({ ...taskForm, goalId: e.target.value })}
                      className="w-full bg-input-bg border border-border-color rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-accent outline-none"
                    >
                      <option value="">Select Goal...</option>
                      {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        className="flex-1 bg-input-bg border border-border-color rounded-lg px-3 py-2 text-xs outline-none"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                      <button type="submit" className="bg-accent text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md active:scale-95 transition-all">
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {grouped[col.id].length === 0 && !showTaskForm && (
                  <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
                    <div className="text-3xl mb-2">📋</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">No Tasks</p>
                  </div>
                )}
                {grouped[col.id].map((item) => (
                  <div
                    key={item.id}
                    className="bg-bg-card border border-border-color rounded-xl p-4 hover:border-accent/40 hover:shadow-xl transition-all group animate-in fade-in duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-tighter ${PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.MEDIUM}`}>
                        ● {item.priority}
                      </span>
                      {item.assignee && (
                        <div className="w-5 h-5 rounded-full bg-accent border border-bg-card flex items-center justify-center text-[8px] font-black text-white" title={item.assignee.name}>
                          {item.assignee.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-bold text-text-primary mb-3 leading-tight group-hover:text-accent transition-colors">{item.title}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-border-color/30">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-text-muted uppercase">Goal</span>
                        <span className="text-[10px] font-bold text-text-secondary truncate max-w-[120px]">{item.goal?.title || "N/A"}</span>
                      </div>
                      {item.dueDate && (
                        <span className="text-[9px] font-bold text-text-muted">
                          📅 {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Move Actions */}
                    <div className="flex gap-1.5 mt-4 pt-3 border-t border-border-color/30 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                      {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => updateActionItem(item.id, { status: c.id })}
                          className="text-[9px] font-black text-accent hover:bg-accent/10 px-2 py-1 rounded transition-colors flex-1 text-center bg-bg-secondary/50"
                        >
                          {c.label} →
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
