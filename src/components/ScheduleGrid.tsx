import React from 'react';
import { Plus, Edit2, Trash2, User, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { DayConfig, DailyTask, TeamMember, TaskStatus } from '../types';
import { renderTaskIcon, getStatusConfig } from '../utils/iconHelper';

interface ScheduleGridProps {
  days: DayConfig[];
  teamMembers: TeamMember[];
  onAddTask: (memberId: string, dayKey: string) => void;
  onEditTask: (memberId: string, dayKey: string, task: DailyTask) => void;
  onQuickToggleStatus: (memberId: string, dayKey: string, taskId: string) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  onEditOngoingFollowUp: (memberId: string, currentText: string) => void;
  onEditMainTasks: (memberId: string, currentText: string) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  days,
  teamMembers,
  onAddTask,
  onEditTask,
  onQuickToggleStatus,
  onEditMember,
  onDeleteMember,
  onEditOngoingFollowUp,
  onEditMainTasks,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-cyan-500/30 bg-slate-950/90 shadow-2xl shadow-cyan-950/30 print-container">
      <table className="w-full min-w-[1200px] border-collapse text-right text-xs md:text-sm">
        {/* Table Header Row */}
        <thead>
          <tr className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-b-2 border-cyan-500/40 text-cyan-200">
            {/* Numbering Column */}
            <th className="py-3 px-2 w-10 text-center font-black border-l border-cyan-500/20">
              م
            </th>

            {/* Member Name */}
            <th className="py-3 px-4 w-44 font-black border-l border-cyan-500/20 font-['Tajawal'] text-base">
              الاسم
            </th>

            {/* Main Focus Tasks */}
            <th className="py-3 px-4 w-52 font-black border-l border-cyan-500/20 font-['Tajawal'] text-base">
              المهام الرئيسية
            </th>

            {/* 5 Working Days Columns (Sunday -> Thursday) */}
            {days.map((day) => (
              <th
                key={day.key}
                className="py-3 px-3 text-center border-l border-cyan-500/20 min-w-[150px] font-['Tajawal']"
              >
                <div className="font-extrabold text-sm md:text-base text-white">
                  {day.labelAr}
                </div>
                <div className="text-[11px] font-bold text-cyan-400 opacity-90 mt-0.5">
                  {day.dateLabel}
                </div>
              </th>
            ))}

            {/* Ongoing Follow-up Column */}
            <th className="py-3 px-4 w-44 text-center font-black border-cyan-500/20 font-['Tajawal'] text-base text-cyan-300">
              المتابعة المستمرة
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-cyan-500/15">
          {teamMembers.map((member, memberIdx) => {
            return (
              <tr
                key={member.id}
                className="hover:bg-slate-900/60 transition-colors group print-page-break"
              >
                {/* 1. Index Number */}
                <td className="py-4 px-2 text-center font-black text-cyan-400 border-l border-cyan-500/15 bg-slate-950/40 text-base">
                  {member.indexNumber || memberIdx + 1}
                </td>

                {/* 2. Member Name & Profile Badge */}
                <td className="py-3 px-3 border-l border-cyan-500/15 bg-slate-900/40 align-top">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md shrink-0"
                        style={{ backgroundColor: member.avatarColor || '#0ea5e9' }}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm font-['Tajawal'] leading-tight">
                          {member.name}
                        </h3>
                        {member.roleTitle && (
                          <span className="text-[10px] text-cyan-300/80 font-medium block">
                            {member.roleTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons on hover */}
                    <div className="no-print opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditMember(member)}
                        className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                        title="تعديل العضو"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMember(member.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded transition-colors"
                        title="حذف العضو"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </td>

                {/* 3. Main Weekly Focus */}
                <td
                  onClick={() => onEditMainTasks(member.id, member.mainTasks)}
                  className="py-3 px-3 border-l border-cyan-500/15 bg-slate-900/20 align-top text-xs text-slate-200 leading-relaxed font-medium group/main hover:bg-slate-800/60 transition-colors cursor-pointer"
                  title="انقر لتعديل المهام الرئيسية"
                >
                  <div className="relative group/edit">
                    <p className="whitespace-pre-line">{member.mainTasks || 'انقر لإضافة المهام الرئيسية...'}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMainTasks(member.id, member.mainTasks);
                      }}
                      className="no-print absolute top-0 left-0 opacity-0 group-hover/main:opacity-100 p-1 text-cyan-400 hover:bg-cyan-950/80 rounded text-[10px] flex items-center gap-1 border border-cyan-500/30 bg-slate-900 shadow-sm"
                      title="تعديل المهام الرئيسية"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>
                  </div>
                </td>

                {/* 4. Days Columns (Sun -> Thu) */}
                {days.map((day) => {
                  const dayTasks = member.tasksByDay[day.key] || [];

                  return (
                    <td
                      key={day.key}
                      className="py-2.5 px-2 border-l border-cyan-500/15 align-top relative group/cell hover:bg-cyan-950/20 transition-colors"
                    >
                      {/* List of daily tasks */}
                      <div className="space-y-2">
                        {dayTasks.map((task) => {
                          const statusCfg = getStatusConfig(task.status);

                          return (
                            <div
                              key={task.id}
                              className={`group/task relative p-2.5 rounded-xl border ${statusCfg.borderColor} ${statusCfg.bgColor} shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
                            >
                              {/* Task Card Header: Icon & Quick Status Toggle */}
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <div className="flex items-center gap-1.5 text-cyan-300">
                                  {renderTaskIcon(task.categoryIcon, 'w-4 h-4 shrink-0 text-cyan-400')}
                                </div>

                                {/* Status Clickable Badge */}
                                <button
                                  onClick={() => onQuickToggleStatus(member.id, day.key, task.id)}
                                  className={`no-print inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.badgeBg} hover:scale-105 transition-transform cursor-pointer`}
                                  title="انقر لتغيير حالة الإنجاز (مكتمل / قيد التنفيذ / لم يبدأ)"
                                >
                                  {statusCfg.icon}
                                  <span>{statusCfg.label}</span>
                                </button>
                                
                                {/* Static Badge for Print */}
                                <div className="print-container hidden print:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border">
                                  <span>{statusCfg.label}</span>
                                </div>
                              </div>

                              {/* Task Text Content */}
                              <p className="text-xs font-semibold text-slate-100 leading-snug break-words">
                                {task.text}
                              </p>

                              {/* Task Note if exists */}
                              {task.note && (
                                <p className="text-[10px] text-cyan-300/80 mt-1 italic border-t border-cyan-500/10 pt-1">
                                  💡 {task.note}
                                </p>
                              )}

                              {/* Hover Edit button for specific task */}
                              <button
                                onClick={() => onEditTask(member.id, day.key, task)}
                                className="no-print absolute bottom-1 left-1 opacity-0 group-hover/task:opacity-100 p-1 text-slate-300 hover:text-cyan-300 hover:bg-slate-800/90 rounded bg-slate-900/90 border border-slate-700 transition-all shadow"
                                title="تعديل التفاصيل"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Task Button per cell */}
                      <button
                        onClick={() => onAddTask(member.id, day.key)}
                        className="no-print mt-2 w-full py-1.5 px-2 rounded-lg border border-dashed border-cyan-500/20 hover:border-cyan-400 text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-950/40 text-[11px] font-bold flex items-center justify-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة مهمة</span>
                      </button>
                    </td>
                  );
                })}

                {/* 5. Ongoing Follow-Up Column */}
                <td
                  onClick={() => onEditOngoingFollowUp(member.id, member.ongoingFollowUp)}
                  className="py-3 px-3 border-cyan-500/15 bg-slate-900/20 align-top text-xs text-cyan-200 font-medium leading-relaxed group/ongoing hover:bg-slate-800/60 transition-colors cursor-pointer"
                  title="انقر لتعديل المتابعة المستمرة"
                >
                  <div className="relative group/edit">
                    <p className="whitespace-pre-line">{member.ongoingFollowUp || 'انقر لإضافة تفاصيل المتابعة المستمرة...'}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditOngoingFollowUp(member.id, member.ongoingFollowUp);
                      }}
                      className="no-print absolute top-0 left-0 opacity-0 group-hover/ongoing:opacity-100 p-1 text-cyan-400 hover:bg-cyan-950/80 rounded text-[10px] flex items-center gap-1 border border-cyan-500/30 bg-slate-900 shadow-sm"
                      title="تعديل المتابعة المستمرة"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
