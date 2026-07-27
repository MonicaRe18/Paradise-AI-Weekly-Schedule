import React from 'react';
import { User, CheckCircle2, Clock, AlertCircle, Edit2, Plus, Calendar } from 'lucide-react';
import { DayConfig, TeamMember } from '../types';
import { renderTaskIcon, getStatusConfig } from '../utils/iconHelper';

interface MemberSummaryViewProps {
  days: DayConfig[];
  teamMembers: TeamMember[];
  onEditMember: (member: TeamMember) => void;
  onAddTask: (memberId: string, dayKey: string) => void;
  onQuickToggleStatus: (memberId: string, dayKey: string, taskId: string) => void;
}

export const MemberSummaryView: React.FC<MemberSummaryViewProps> = ({
  days,
  teamMembers,
  onEditMember,
  onAddTask,
  onQuickToggleStatus,
}) => {
  return (
    <div className="space-y-6 print-container font-['Cairo']">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamMembers.map((member) => {
          // Calculate member weekly completion rate
          let memberTotal = 0;
          let memberCompleted = 0;

          days.forEach((day) => {
            const tasks = member.tasksByDay[day.key] || [];
            tasks.forEach((t) => {
              memberTotal++;
              if (t.status === 'completed') memberCompleted++;
            });
          });

          const memberPct = memberTotal > 0 ? Math.round((memberCompleted / memberTotal) * 100) : 0;

          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-950/90 shadow-2xl shadow-cyan-950/30 space-y-4 relative group"
            >
              {/* Member Card Top */}
              <div className="flex items-start justify-between pb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg border border-white/20"
                    style={{ backgroundColor: member.avatarColor || '#0ea5e9' }}
                  >
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white font-['Tajawal']">
                      {member.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium">
                      {member.roleTitle || 'عضو الفريق الاستشاري'}
                    </p>
                  </div>
                </div>

                {/* Completion badge */}
                <div className="text-left">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>إنجاز الأسبوع: {memberPct}%</span>
                  </div>
                  <button
                    onClick={() => onEditMember(member)}
                    className="no-print mt-2 block text-xs text-slate-400 hover:text-cyan-300 font-bold transition-colors"
                  >
                    تعديل البيانات ⚙️
                  </button>
                </div>
              </div>

              {/* Focus Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-bold text-cyan-400 block mb-1">المهام الرئيسية:</span>
                  <p className="text-slate-200 leading-relaxed">{member.mainTasks}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="font-bold text-cyan-400 block mb-1">المتابعة المستمرة:</span>
                  <p className="text-slate-200 leading-relaxed">{member.ongoingFollowUp}</p>
                </div>
              </div>

              {/* Days Tasks Checklist */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>جدول الأسبوع حسب الأيام:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {days.map((day) => {
                    const tasks = member.tasksByDay[day.key] || [];

                    return (
                      <div
                        key={day.key}
                        className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 border-b border-slate-800 pb-1">
                          <span>{day.labelAr}</span>
                          <span className="text-[9px] text-slate-400">{day.dateLabel}</span>
                        </div>

                        {tasks.length === 0 ? (
                          <div className="text-[10px] text-slate-600 italic text-center py-2">
                            لا توجد مهام
                          </div>
                        ) : (
                          tasks.map((t) => {
                            const st = getStatusConfig(t.status);
                            return (
                              <button
                                key={t.id}
                                onClick={() => onQuickToggleStatus(member.id, day.key, t.id)}
                                className={`w-full text-right p-1.5 rounded-lg border text-[10px] ${st.bgColor} ${st.borderColor} hover:scale-102 transition-transform block`}
                              >
                                <div className="flex items-center justify-between font-bold text-white mb-0.5">
                                  <span className="truncate max-w-[80px]">{t.text}</span>
                                  {st.icon}
                                </div>
                                <span className={`text-[9px] ${st.textColor}`}>{st.label}</span>
                              </button>
                            );
                          })
                        )}

                        <button
                          onClick={() => onAddTask(member.id, day.key)}
                          className="no-print w-full py-0.5 text-[9px] text-cyan-400/70 hover:text-cyan-300 font-bold border border-dashed border-cyan-500/20 rounded mt-1 text-center"
                        >
                          + إضافة
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
