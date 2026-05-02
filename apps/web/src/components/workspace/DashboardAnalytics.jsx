"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from "recharts";

export default function DashboardAnalytics({ workspaceId }) {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          api.get(`/workspaces/${workspaceId}/stats`),
          api.get(`/workspaces/${workspaceId}/trends`)
        ]);
        setStats(statsRes.data);
        setTrends(trendsRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [workspaceId]);

  const handleExport = async () => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}/export-csv`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `workspace-analytics-${workspaceId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to export CSV");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-card border border-border-color rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-bg-card border border-border-color rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Workspace Analytics</h2>
          <p className="text-text-secondary text-sm">Real-time performance metrics and growth trends</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-bg-secondary hover:bg-bg-secondary/80 text-text-primary px-5 py-2.5 rounded-xl text-sm font-bold border border-border-color transition-all active:scale-95 flex items-center gap-2"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Goals" value={stats?.totalGoals} icon="🎯" color="text-blue-500" />
        <StatCard title="Completed (This Week)" value={stats?.completedThisWeek} icon="✅" color="text-green-500" />
        <StatCard title="Overdue Goals" value={stats?.overdueGoals} icon="⚠️" color="text-red-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Completion Trend */}
        <div className="bg-bg-card border border-border-color p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">Weekly Completion Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 10, fill: 'var(--text-muted)'}} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => new Date(val).toLocaleDateString([], { weekday: 'short' })}
                />
                <YAxis 
                  tick={{fontSize: 10, fill: 'var(--text-muted)'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--text-primary)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="var(--accent)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorComp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate Bar Chart */}
        <div className="bg-bg-card border border-border-color p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
           <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Overall Completion Rate</h3>
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-bg-secondary"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={502.4}
                  strokeDashoffset={502.4 - (502.4 * (stats?.completionRate || 0)) / 100}
                  strokeLinecap="round"
                  className="text-accent transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-text-primary">{stats?.completionRate}%</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Done</span>
              </div>
           </div>
           <p className="text-xs text-text-secondary mt-4 max-w-[200px]">
             Keep it up! Your team is performing above average this week.
           </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-bg-card border border-border-color p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-[10px] font-black bg-bg-secondary px-2 py-1 rounded text-text-muted uppercase tracking-widest">Live</span>
      </div>
      <h4 className="text-3xl font-black text-text-primary mb-1">{value || 0}</h4>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
    </div>
  );
}
