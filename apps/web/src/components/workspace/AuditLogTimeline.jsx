import React, { useEffect } from "react";
import useAuditStore from "@/store/auditStore";
import useWorkspaceStore from "@/store/workspaceStore";
import { Clock, Download, User, Activity, CheckCircle, Trash2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ActionIcon = ({ action }) => {
  if (action.includes("CREATE")) return <CheckCircle className="text-green-500" size={16} />;
  if (action.includes("DELETE")) return <Trash2 className="text-red-500" size={16} />;
  if (action.includes("UPDATE")) return <Edit className="text-blue-500" size={16} />;
  return <Activity className="text-gray-500" size={16} />;
};

const AuditLogTimeline = ({ workspaceId }) => {
  const { logs, isLoading, fetchLogs, exportToCSV } = useAuditStore();
  const { activeWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (workspaceId) {
      fetchLogs(workspaceId);
    }
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 animate-pulse">Loading activity history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Clock size={20} className="text-indigo-500" />
            Workspace Activity
          </h2>
          <p className="text-sm text-gray-500 mt-1">Immutable audit trail of all changes</p>
        </div>
        
        <button 
          onClick={() => exportToCSV(activeWorkspace?.name || "Workspace")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-all text-sm font-semibold"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 dark:before:via-gray-700 before:to-transparent">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No activity recorded yet</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="relative flex items-start gap-4 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-sm z-10 group-hover:border-indigo-400 transition-colors">
                <ActionIcon action={log.action} />
              </div>
              
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                      {log.user?.name || "System"}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                      {log.action.replace("_", " ").toLowerCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {log.entity}: <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {log.details ? JSON.parse(log.details).title : "Unknown Entity"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditLogTimeline;
