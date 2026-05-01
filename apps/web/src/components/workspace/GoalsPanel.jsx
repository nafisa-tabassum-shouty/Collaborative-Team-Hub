"use client";
import { useEffect, useState } from "react";
import useGoalStore from "@/store/goalStore";

const STATUS_COLORS = {
  TODO:        "bg-bg-secondary text-text-secondary border border-border-color",
  IN_PROGRESS: "bg-accent/10 text-accent border border-accent/20",
  DONE:        "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
};

export default function GoalsPanel({ workspaceId }) {
  const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, isLoading } = useGoalStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    fetchGoals(workspaceId);
  }, [workspaceId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createGoal(workspaceId, form);
    setForm({ title: "", description: "", dueDate: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Goals</h2>
          <p className="text-text-secondary text-sm mt-1">Track team objectives and milestones</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          {showForm ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-bg-card border border-border-color rounded-xl p-5 mb-6 space-y-4 shadow-sm transition-all"
        >
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Goal title"
            className="w-full bg-input-bg border border-border-color text-text-primary rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-muted transition-colors"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
            className="w-full bg-input-bg border border-border-color text-text-primary rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-muted resize-none transition-colors"
          />
          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="bg-input-bg border border-border-color text-text-primary rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
            <button
              type="submit"
              className="ml-auto bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Create Goal
            </button>
          </div>
        </form>
      )}

      {/* Loading skeletons */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-color rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-bg-secondary rounded w-2/3 mb-3" />
              <div className="h-3 bg-bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-color rounded-xl">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-text-secondary">No goals yet. Create your first goal!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
          ))}
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, onUpdate, onDelete }) {
  const statusOptions = ["TODO", "IN_PROGRESS", "DONE"];

  return (
    <div className="bg-bg-card border border-border-color rounded-xl p-5 hover:border-text-muted/30 transition-all shadow-sm group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">{goal.title}</h3>
          {goal.description && (
            <p className="text-text-secondary text-sm mt-1 line-clamp-2">{goal.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <select
              value={goal.status}
              onChange={(e) => onUpdate(goal.id, { status: e.target.value })}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-none focus:outline-none cursor-pointer uppercase tracking-tight transition-colors ${STATUS_COLORS[goal.status] || STATUS_COLORS.TODO}`}
            >
              {statusOptions.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            {goal.owner && (
              <span className="text-xs text-text-muted">
                Owner: <span className="text-text-secondary">{goal.owner.name}</span>
              </span>
            )}
            {goal.dueDate && (
              <span className="text-xs text-text-muted">
                Due: <span className="text-text-secondary">{new Date(goal.dueDate).toLocaleDateString()}</span>
              </span>
            )}
            {goal._count && (
              <span className="text-xs text-text-muted/60">
                {goal._count.milestones} milestones · {goal._count.actionItems} tasks
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-text-muted hover:text-red-500 transition-colors text-sm flex-shrink-0 p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
