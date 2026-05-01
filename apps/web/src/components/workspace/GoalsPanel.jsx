"use client";
import { useEffect, useState } from "react";
import useGoalStore from "@/store/goalStore";
import useAuthStore from "@/store/authStore";

const STATUS_COLORS = {
  TODO:        "bg-bg-secondary text-text-secondary border border-border-color",
  IN_PROGRESS: "bg-accent/10 text-accent border border-accent/20",
  DONE:        "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
};

export default function GoalsPanel({ workspaceId }) {
  const { goals, fetchGoals, createGoal, updateGoal, deleteGoal, addMilestone, updateMilestone, addGoalComment, isLoading } = useGoalStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    fetchGoals(workspaceId);
  }, [workspaceId, fetchGoals]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createGoal(workspaceId, { ...form, status: "TODO" });
    setForm({ title: "", description: "", dueDate: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Goals & Milestones</h2>
          <p className="text-text-secondary text-sm mt-1">Strategic objectives and real-time progress tracking</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-lg active:scale-95"
        >
          {showForm ? "Cancel" : "+ New Goal"}
        </button>
      </div>

      {/* Create Goal Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-bg-card border border-border-color rounded-2xl p-6 mb-8 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What is your main objective?"
              className="md:col-span-2 w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide some context..."
              rows={3}
              className="md:col-span-2 w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none transition-all"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-input-bg border border-border-color text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                Launch Goal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Goals List */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-color rounded-2xl p-6 animate-pulse">
              <div className="h-5 bg-bg-secondary rounded w-1/3 mb-4" />
              <div className="h-3 bg-bg-secondary rounded w-2/3 mb-2" />
              <div className="h-3 bg-bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-color rounded-2xl bg-bg-secondary/10">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-lg font-bold text-text-primary">No active goals</h3>
          <p className="text-text-secondary text-sm mt-1 max-w-xs mx-auto">
            Set strategic objectives for your team and track progress with milestones.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onUpdate={updateGoal} 
              onDelete={deleteGoal} 
              onAddMilestone={addMilestone}
              onUpdateMilestone={updateMilestone}
              onAddComment={addGoalComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, onUpdate, onDelete, onAddMilestone, onUpdateMilestone, onAddComment }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const statusOptions = ["TODO", "IN_PROGRESS", "DONE"];

  const calculateTotalProgress = () => {
    if (!goal.milestones || goal.milestones.length === 0) return 0;
    const total = goal.milestones.reduce((acc, m) => acc + m.progress, 0);
    return Math.round(total / goal.milestones.length);
  };

  const progress = calculateTotalProgress();

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;
    await onAddMilestone(goal.id, { title: milestoneTitle, progress: 0 });
    setMilestoneTitle("");
    setShowMilestoneForm(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await onAddComment(goal.id, newComment);
    setNewComment("");
    // Re-fetch goal details to show new comment in activity feed?
    // For now, optimistic update would be better, but let's just push it.
  };

  return (
    <div className={`bg-bg-card border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${isExpanded ? "ring-1 ring-accent/30 border-accent/30" : "border-border-color shadow-sm"}`}>
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${STATUS_COLORS[goal.status]}`}>
                {goal.status.replace("_", " ")}
              </span>
              {goal.dueDate && (
                <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                  📅 {new Date(goal.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text-primary transition-colors group-hover:text-accent truncate">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-text-secondary text-sm mt-1 line-clamp-1">{goal.description}</p>
            )}
            
            {/* Overall Progress Bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-700 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <span className="text-xs font-black text-accent min-w-[30px]">{progress}%</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-accent border-2 border-bg-card flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {goal.owner?.name?.charAt(0).toUpperCase()}
                </div>
             </div>
             <p className="text-[10px] font-bold text-text-muted">{goal.owner?.name}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
           <div className="flex gap-4">
              <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                🏆 {goal.milestones?.length || 0} Milestones
              </span>
              <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                ✅ {goal._count?.actionItems || 0} Tasks
              </span>
           </div>
           <button className={`text-xs font-bold text-accent hover:underline transition-all ${isExpanded ? "rotate-180" : ""}`}>
             ▼
           </button>
        </div>
      </div>

      {/* Expanded Content: Milestones & Activity Feed */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border-color pt-6 bg-bg-secondary/5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Milestones Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">Milestones</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMilestoneForm(!showMilestoneForm); }}
                  className="text-xs font-bold text-accent hover:text-accent-hover"
                >
                  + Add
                </button>
              </div>

              {showMilestoneForm && (
                <form onSubmit={handleAddMilestone} className="mb-4 flex gap-2">
                  <input 
                    autoFocus
                    required
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    placeholder="Milestone name..."
                    className="flex-1 bg-bg-card border border-border-color rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button type="submit" className="bg-accent text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">Add</button>
                </form>
              )}

              <div className="space-y-3">
                {goal.milestones?.map((m) => (
                  <div key={m.id} className="bg-bg-card/50 border border-border-color p-3 rounded-xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-text-primary truncate">{m.title}</span>
                      <span className="text-[10px] font-black text-accent">{m.progress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={m.progress}
                      onChange={(e) => onUpdateMilestone(goal.id, m.id, { progress: parseInt(e.target.value) })}
                      className="w-full h-1 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                ))}
                {!goal.milestones?.length && (
                  <p className="text-xs text-text-muted text-center py-4 italic">No milestones defined yet.</p>
                )}
              </div>
            </div>

            {/* Activity Feed Section */}
            <div>
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Activity Feed</h4>
              <form onSubmit={handleAddComment} className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Post a progress update..."
                  rows={2}
                  className="w-full bg-bg-card border border-border-color rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
                <button 
                  type="submit" 
                  className="mt-2 bg-bg-secondary hover:bg-bg-secondary/80 text-text-primary text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Post Update
                </button>
              </form>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {goal.comments?.map((comment) => (
                  <div key={comment.id} className="text-xs border-l-2 border-accent/20 pl-3 py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text-primary">{comment.author?.name}</span>
                      <span className="text-[9px] text-text-muted">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{comment.content}</p>
                  </div>
                ))}
                {!goal.comments?.length && (
                  <p className="text-xs text-text-muted italic">No activity yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-border-color">
            <div className="flex gap-2">
               <select
                 value={goal.status}
                 onChange={(e) => onUpdate(goal.id, { status: e.target.value })}
                 className="bg-bg-secondary border border-border-color rounded-lg px-3 py-1.5 text-[10px] font-bold text-text-primary focus:outline-none"
               >
                 {statusOptions.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
               </select>
            </div>
            <button 
              onClick={() => onDelete(goal.id)}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Delete Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
