import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, TrendingUp, Users, Calendar } from 'lucide-react';
import { DayConfig, TeamMember, TaskStatus } from '../types';

interface StatsBarProps {
  days: DayConfig[];
  teamMembers: TeamMember[];
  selectedStatusFilter: TaskStatus | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  days,
  teamMembers,
  selectedStatusFilter,
  onStatusFilterChange,
}) => {
  // Compute overall stats
  let totalTasks = 0;
  let completedCount = 0;
  let inProgressCount = 0;
  let pendingCount = 0;
  let deferredCount = 0;

  const dayStats: Record<string, { total: number; completed: number; inProgress: number }> = {};
  days.forEach((day) => {
    dayStats[day.key] = { total: 0, completed: 0, inProgress: 0 };
  });

  teamMembers.forEach((member) => {
    days.forEach((day) => {
      const tasks = member.tasksByDay[day.key] || [];
      tasks.forEach((t) => {
        totalTasks++;
        dayStats[day.key].total++;

        if (t.status === 'completed') {
          completedCount++;
          dayStats[day.key].completed++;
        } else if (t.status === 'in_progress') {
          inProgressCount++;
          dayStats[day.key].inProgress++;
        } else if (t.status === 'deferred') {
          deferredCount++;
        } else {
          pendingCount++;
        }
      });
    });
  });

  const completionPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const inProgressPct = totalTasks > 0 ? Math.round((inProgressCount / totalTasks) * 100) : 0;

  return (
    <div className="my-6 p-5 rounded-2xl border border-cyan-500/20 bg-slate-950/80 shadow-xl space-y-4 print-container">
      {/* Top Stats Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Tajawal']">
              متابعة نسبة الإنجاز والإنتاجية اليومية
            </h3>
            <p className="text-xs text-slate-400">
              إجمالي {totalTasks} مهمة موزعة على {teamMembers.length} أعضاء بالفريق
            </p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-emerald-400">نسبة المكتمل: {completionPct}%</span>
            <span className="text-amber-400">قيد التنفيذ: {inProgressPct}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${inProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Chips & Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        {/* All Tasks */}
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedStatusFilter === 'all'
              ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>جميع المهام</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{totalTasks}</div>
        </button>

        {/* Completed */}
        <button
          onClick={() => onStatusFilterChange('completed')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedStatusFilter === 'completed'
              ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/20 shadow-lg'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
            <span>مكتمل</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-300">{completedCount}</div>
        </button>

        {/* In Progress */}
        <button
          onClick={() => onStatusFilterChange('in_progress')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedStatusFilter === 'in_progress'
              ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-500/20 shadow-lg'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
            <span>قيد التنفيذ</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300">{inProgressCount}</div>
        </button>

        {/* Pending */}
        <button
          onClick={() => onStatusFilterChange('pending')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedStatusFilter === 'pending'
              ? 'bg-slate-800 border-slate-400 ring-2 ring-slate-500/20 shadow-lg'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>لم يبدأ بعد</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-black text-slate-300">{pendingCount}</div>
        </button>
      </div>

      {/* Daily Progress Mini Bars */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>معدل الإنجاز اليومي خلال الأسبوع:</span>
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {days.map((day) => {
            const st = dayStats[day.key] || { total: 0, completed: 0, inProgress: 0 };
            const pct = st.total > 0 ? Math.round((st.completed / st.total) * 100) : 0;

            return (
              <div key={day.key} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xs font-bold text-white mb-0.5">{day.labelAr}</div>
                <div className="text-[10px] text-cyan-400 mb-1">{day.dateLabel}</div>
                <div className="text-sm font-black text-emerald-400">{pct}%</div>
                <div className="text-[10px] text-slate-400">
                  {st.completed}/{st.total} مهام
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
