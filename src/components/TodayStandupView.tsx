import React, { useState } from 'react';
import { Calendar, User, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { DayConfig, TeamMember, TaskStatus } from '../types';
import { renderTaskIcon, getStatusConfig } from '../utils/iconHelper';

interface TodayStandupViewProps {
  days: DayConfig[];
  teamMembers: TeamMember[];
  onQuickToggleStatus: (memberId: string, dayKey: string, taskId: string) => void;
  onAddTask: (memberId: string, dayKey: string) => void;
}

export const TodayStandupView: React.FC<TodayStandupViewProps> = ({
  days,
  teamMembers,
  onQuickToggleStatus,
  onAddTask,
}) => {
  const [activeDayKey, setActiveDayKey] = useState<string>(days[0]?.key || 'sun');

  const selectedDay = days.find((d) => d.key === activeDayKey) || days[0];

  // Calculate stats for active day
  let dayTotal = 0;
  let dayCompleted = 0;

  teamMembers.forEach((m) => {
    const tasks = m.tasksByDay[activeDayKey] || [];
    tasks.forEach((t) => {
      dayTotal++;
      if (t.status === 'completed') dayCompleted++;
    });
  });

  const dayPct = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;

  return (
    <div className="space-y-6 print:hidden font-['Cairo']">
      
      {/* Day Selector Tabs Bar */}
      <div className="p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-['Tajawal']">
              متابعة الإنجاز اليومي (الاجتماع اليومي / Standup)
            </h3>
            <p className="text-xs text-slate-400">
              اختر اليوم لتحديث واستعراض حالة مهام كل عضو بسرعة
            </p>
          </div>
        </div>

        {/* Day Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          {days.map((day) => {
            const isActive = day.key === activeDayKey;

            return (
              <button
                key={day.key}
                onClick={() => setActiveDayKey(day.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{day.labelAr}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-950/30 text-white' : 'bg-slate-800 text-cyan-400'}`}>
                  {day.dateLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Progress Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/30 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/40">
            {dayPct}%
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-['Tajawal']">
              نسبة إنجاز مهام يوم {selectedDay.labelAr} ({selectedDay.dateLabel})
            </h4>
            <p className="text-xs text-emerald-300/80">
              تم إنجاز {dayCompleted} من أصل {dayTotal} مهام مكلف بها الفريق اليوم
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${dayPct}%` }}
          />
        </div>
      </div>

      {/* Grid of Team Members for Active Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => {
          const tasks = member.tasksByDay[activeDayKey] || [];

          return (
            <div
              key={member.id}
              className="p-4 rounded-2xl border border-cyan-500/20 bg-slate-950/80 hover:border-cyan-400/40 transition-all shadow-xl space-y-3"
            >
              {/* Member Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shadow"
                    style={{ backgroundColor: member.avatarColor || '#0ea5e9' }}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-['Tajawal']">
                      {member.name}
                    </h4>
                    <span className="text-[10px] text-cyan-400 font-medium">
                      {member.roleTitle || 'عضو بالفريق'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAddTask(member.id, activeDayKey)}
                  className="no-print p-1.5 rounded-lg bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/30 text-xs font-bold transition-all"
                  title="إضافة مهمة جديدة اليوم"
                >
                  + إضافة
                </button>
              </div>

              {/* Tasks List */}
              {tasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 italic">
                  لا توجد مهام مخصصة لليوم
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const stCfg = getStatusConfig(task.status);

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border ${stCfg.borderColor} ${stCfg.bgColor} space-y-2 transition-all`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 text-cyan-300">
                            {renderTaskIcon(task.categoryIcon, 'w-4 h-4 shrink-0 text-cyan-400')}
                            <p className="text-xs font-bold text-white leading-snug">
                              {task.text}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-cyan-500/10">
                          <span className="text-[10px] text-slate-400">انقر للتغيير:</span>
                          
                          {/* Quick Toggle Status */}
                          <button
                            onClick={() => onQuickToggleStatus(member.id, activeDayKey, task.id)}
                            className={`px-3 py-1 rounded-full text-xs font-black border ${stCfg.badgeBg} hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer`}
                          >
                            {stCfg.icon}
                            <span>{stCfg.label}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
