"use client";
import { useEffect, useState } from "react";
import useActionItemStore from "@/store/actionItemStore";
import useGoalStore from "@/store/goalStore";
import useWorkspaceStore from "@/store/workspaceStore";

const COLUMNS = [
  { id: "TODO",        label: "To Do",       color: "border-gray-400", badge: "bg-bg-secondary text-text-secondary" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-accent",   badge: "bg-accent/10 text-accent" },
  { id: "DONE",        label: "Done",        color: "border-green-500", badge: "bg-green-500/10 text-green-500" },
];

const PRIORITY_COLORS = {
  HIGH:   "text-red-500",
  MEDIUM: "text-yellow-500",
  LOW:    "text-green-500",
};

const STATUS_BADGE = {
  TODO:        "bg-bg-secondary text-text-secondary",
  IN_PROGRESS: "bg-accent/10 text-accent",
  DONE:        "bg-green-500/10 text-green-500",
};

const STATUS_LABEL = { TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done" };

// ─── View Toggle ──────────────────────────────────────────────────────────────
function ViewToggle({ viewMode, setViewMode }) {
  return (
    <div className="flex items-center gap-1 bg-bg-secondary border border-border-color rounded-xl p-1">
      {[
        { id: "kanban", label: "Board", icon: (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="1" y="1" width="3" height="12" rx="1"/><rect x="6" y="1" width="3" height="8" rx="1"/><rect x="11" y="1" width="2" height="10" rx="1"/>
          </svg>
        )},
        { id: "list", label: "List", icon: (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="1" y1="3" x2="13" y2="3"/><line x1="1" y1="7" x2="13" y2="7"/><line x1="1" y1="11" x2="13" y2="11"/>
          </svg>
        )},
      ].map(v => (
        <button
          key={v.id}
          onClick={() => { setViewMode(v.id); localStorage.setItem("kanbanViewMode", v.id); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            viewMode === v.id ? "bg-accent text-white shadow-md" : "text-text-muted hover:text-text-primary"
          }`}
        >
          {v.icon} {v.label}
        </button>
      ))}
    </div>
  );
}

// ─── Create Action Item Modal ────────────────────────────────────────────────────────
function CreateActionItemModal({ onClose, onSubmit, goals, members, defaultStatus }) {
  const [form, setForm] = useState({
    title: "", description: "", goalId: "", assigneeId: "",
    priority: "MEDIUM", status: defaultStatus || "TODO", dueDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.goalId) return setError("Please select a Goal");
    setLoading(true);
    const result = await onSubmit(form);
    if (!result.success) setError(result.error || "Failed to create action item");
    else onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-card border border-border-color rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-color">
          <h3 className="font-bold text-text-primary text-base">Create New Action Item</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors text-lg">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Title *</label>
            <input
              required autoFocus
              placeholder="Action Item title..."
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-input-bg border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              rows={2}
              placeholder="Optional description..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full bg-input-bg border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {/* Goal + Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Goal *</label>
              <select
                value={form.goalId}
                onChange={e => setForm({...form, goalId: e.target.value})}
                className="w-full bg-input-bg border border-border-color rounded-xl px-3 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="">Select goal...</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Assignee</label>
              <select
                value={form.assigneeId}
                onChange={e => setForm({...form, assigneeId: e.target.value})}
                className="w-full bg-input-bg border border-border-color rounded-xl px-3 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.user?.id || m.id} value={m.user?.id || m.id}>{m.user?.name || m.name}</option>)}
              </select>
            </div>
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value})}
                className="w-full bg-input-bg border border-border-color rounded-xl px-3 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
                className="w-full bg-input-bg border border-border-color rounded-xl px-3 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({...form, dueDate: e.target.value})}
              className="w-full bg-input-bg border border-border-color rounded-xl px-4 py-2.5 text-sm text-text-primary focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border-color text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold shadow-lg shadow-accent/20 disabled:opacity-50 transition-all active:scale-95">
              {loading ? "Creating..." : "Create Action Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────
function ListView({ actionItems, updateActionItem, deleteActionItem, onCreateClick }) {
  return (
    <div className="bg-bg-card border border-border-color rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-bg-secondary/40 border-b border-border-color">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">{actionItems.length} Action Items</span>
        <button onClick={onCreateClick} className="bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all shadow-sm">
          + New Action Item
        </button>
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border-color">
        {["Task", "Goal", "Assignee", "Priority", "Due Date", "Status"].map(h => (
          <span key={h} className="text-[10px] font-black uppercase tracking-widest text-text-muted">{h}</span>
        ))}
      </div>

      {actionItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">No Action Items Yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border-color/40">
          {actionItems.map(item => (
            <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-bg-secondary/20 transition-colors group">
              {/* Title */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors">{item.title}</p>
                {item.description && <p className="text-[10px] text-text-muted truncate mt-0.5">{item.description}</p>}
              </div>
              {/* Goal */}
              <span className="text-[11px] text-text-muted truncate">{item.goal?.title || "—"}</span>
              {/* Assignee */}
              <div className="flex items-center gap-1.5">
                {item.assignee ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[8px] font-black text-white flex-shrink-0">
                      {item.assignee.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[11px] text-text-secondary truncate">{item.assignee.name}</span>
                  </>
                ) : <span className="text-[10px] text-text-muted italic">None</span>}
              </div>
              {/* Priority */}
              <span className={`text-[10px] font-black uppercase ${PRIORITY_COLORS[item.priority] || ""}`}>● {item.priority}</span>
              {/* Due Date */}
              <span className="text-[10px] text-text-muted">{item.dueDate ? `📅 ${new Date(item.dueDate).toLocaleDateString()}` : "—"}</span>
              {/* Status + delete */}
              <div className="flex items-center gap-2">
                <div className="relative group/status">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer whitespace-nowrap ${STATUS_BADGE[item.status]}`}>
                    {STATUS_LABEL[item.status]}
                  </span>
                  <div className="absolute top-full right-0 mt-1 bg-bg-card border border-border-color rounded-xl shadow-xl z-10 p-1 flex flex-col gap-1 opacity-0 pointer-events-none group-hover/status:opacity-100 group-hover/status:pointer-events-auto transition-all min-w-[110px]">
                    {COLUMNS.filter(c => c.id !== item.status).map(c => (
                      <button key={c.id} onClick={() => updateActionItem(item.id, { status: c.id })}
                        className="text-[10px] font-bold text-text-secondary hover:text-accent hover:bg-accent/10 px-3 py-1.5 rounded-lg text-left whitespace-nowrap transition-colors">
                        → {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { if (confirm("Delete this action item?")) deleteActionItem(item.id); }}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all text-sm">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KanbanBoard({ workspaceId }) {
  const { actionItems, fetchActionItems, createActionItem, updateActionItem, deleteActionItem, moveActionItem } = useActionItemStore();
  const { goals, fetchGoals } = useGoalStore();
  const { members, fetchMembers } = useWorkspaceStore();

  const [viewMode, setViewMode] = useState(() =>
    (typeof window !== "undefined" && localStorage.getItem("kanbanViewMode")) || "kanban"
  );
  const [showModal, setShowModal]         = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState("TODO");
  const [dragOverCol, setDragOverCol] = useState(null);

  useEffect(() => {
    fetchActionItems(workspaceId);
    fetchGoals(workspaceId);
    fetchMembers(workspaceId);
  }, [workspaceId]);

  const grouped = {
    TODO:        actionItems.filter(i => i.status === "TODO"),
    IN_PROGRESS: actionItems.filter(i => i.status === "IN_PROGRESS"),
    DONE:        actionItems.filter(i => i.status === "DONE"),
  };

  const handleCreate = async (formData) => {
    const result = await createActionItem(formData.goalId, {
      ...formData,
      workspaceId,
      assigneeId: formData.assigneeId || undefined,
      dueDate:    formData.dueDate    || undefined,
    });
    if (result.success) fetchActionItems(workspaceId);
    return result;
  };

  const openModal = (status = "TODO") => { setModalDefaultStatus(status); setShowModal(true); };

  return (
    <div className="p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Kanban Board</h2>
          <p className="text-text-secondary text-sm mt-1">Operational task management and workflow</p>
        </div>
        <div className="flex items-center gap-3">
          {viewMode === "kanban" && (
            <button onClick={() => openModal()}
              className="bg-accent hover:bg-accent-hover text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-95">
              + New Action Item
            </button>
          )}
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateActionItemModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
          goals={goals}
          members={members}
          defaultStatus={modalDefaultStatus}
        />
      )}

      {/* Views */}
      {viewMode === "list" ? (
        <ListView
          actionItems={actionItems}
          updateActionItem={updateActionItem}
          deleteActionItem={deleteActionItem}
          onCreateClick={() => openModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(col => (
            <div key={col.id}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverCol(null);
                const itemId = e.dataTransfer.getData("itemId");
                if (itemId) moveActionItem(itemId, col.id);
              }}
              className={`flex flex-col backdrop-blur-sm border border-border-color border-t-4 ${col.color} rounded-2xl min-h-[600px] shadow-sm transition-colors ${
                dragOverCol === col.id ? "bg-accent/5 border-accent/40" : "bg-bg-card/40"
              }`}>
              {/* Column Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-color/50">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs uppercase tracking-widest text-text-primary">{col.label}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${col.badge}`}>{grouped[col.id].length}</span>
                </div>
                <button onClick={() => openModal(col.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-bg-secondary text-text-primary hover:bg-accent hover:text-white transition-all">
                  +
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {grouped[col.id].length === 0 && (
                  <div className={`h-full flex flex-col items-center justify-center py-20 transition-opacity ${dragOverCol === col.id ? "opacity-100" : "opacity-40"}`}>
                    <div className="text-3xl mb-2">{dragOverCol === col.id ? "📥" : "📋"}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      {dragOverCol === col.id ? "Drop here" : "No Action Items"}
                    </p>
                  </div>
                )}
                {grouped[col.id].map(item => (
                  <div key={item.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("itemId", item.id);
                      e.currentTarget.classList.add("opacity-50", "scale-95");
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove("opacity-50", "scale-95");
                    }}
                    className={`bg-bg-card border border-border-color rounded-xl p-4 hover:border-accent/40 hover:shadow-xl transition-all group animate-in fade-in duration-300 cursor-grab active:cursor-grabbing ${
                      item._optimistic ? "opacity-70 animate-pulse" : ""
                    }`}>
                    {/* Priority + Assignee */}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black uppercase ${PRIORITY_COLORS[item.priority] || ""}`}>● {item.priority}</span>
                      <div className="flex items-center gap-1">
                        {item.assignee && (
                          <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[8px] font-black text-white" title={item.assignee.name}>
                            {item.assignee.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {/* Delete */}
                        <button onClick={() => { if (confirm("Delete this action item?")) deleteActionItem(item.id); }}
                          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-text-muted hover:text-red-500 transition-all text-xs">
                          ✕
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-text-primary mb-1 leading-tight group-hover:text-accent transition-colors">{item.title}</p>
                    {item.description && <p className="text-[10px] text-text-muted mb-3 line-clamp-2">{item.description}</p>}

                    <div className="flex items-center justify-between pt-3 border-t border-border-color/30">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-text-muted uppercase">Goal</span>
                        <span className="text-[10px] font-bold text-text-secondary truncate max-w-[120px]">{item.goal?.title || "N/A"}</span>
                      </div>
                      {item.dueDate && (
                        <span className="text-[9px] font-bold text-text-muted">📅 {new Date(item.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="flex gap-1.5 mt-4 pt-3 border-t border-border-color/30 opacity-0 group-hover:opacity-100 transition-all">
                      {COLUMNS.filter(c => c.id !== col.id).map(c => (
                        <button key={c.id} onClick={() => moveActionItem(item.id, c.id)}
                          className="text-[9px] font-black text-accent hover:bg-accent/10 px-2 py-1 rounded transition-colors flex-1 text-center bg-bg-secondary/50">
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
