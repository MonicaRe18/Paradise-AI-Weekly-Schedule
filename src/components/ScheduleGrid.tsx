import React from 'react';
import { Plus, Edit2, Trash2, User, CheckCircle2, Clock, AlertCircle, Calendar, Target, Activity, ArrowRightLeft } from 'lucide-react';
import { DayConfig, DailyTask, TeamMember, TaskStatus } from '../types';
import { renderTaskIcon, getStatusConfig } from '../utils/iconHelper';
import { UserSession } from './LoginPage';

interface ScheduleGridProps {
  days: DayConfig[];
  teamMembers: TeamMember[];
  userSession?: UserSession | null;
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
  userSession,
  onAddTask,
  onEditTask,
  onQuickToggleStatus,
  onEditMember,
  onDeleteMember,
  onEditOngoingFollowUp,
  onEditMainTasks,
}) => {
  const isAdmin = userSession?.role === 'admin';

  return (
    <div className="w-full print:hidden">
      {/* 1. Desktop View: Standard Interactive Full Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-cyan-500/30 bg-slate-950/90 shadow-2xl shadow-cyan-950/30">
        <table className="w-full min-w-[1200px] border-collapse text-right text-xs md:text-sm">
          {/* Table Header Row */}
          <thead>
            <tr className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-b-2 border-cyan-500/40 text-cyan-200">
              {/* Numbering Column */}
              <th className="py-3 px-2 w-10 text-center font-black border-l border-cyan-500/20">
                م
              </th>

              {/* Member Name */}
              <th className="py-3 px-4 w-48 font-black border-l border-cyan-500/20 font-['Tajawal'] text-base text-cyan-200">
                اسم الموظف
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
                  {/* Index Number */}
                  <td className="py-4 px-2 text-center font-black text-cyan-400 border-l border-cyan-500/15 bg-slate-950/40 text-base">
                    {member.indexNumber || memberIdx + 1}
                  </td>

                  {/* Member Name & Profile Badge */}
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

                      {/* Action buttons on hover for Admin */}
                      {isAdmin && (
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
                      )}
                    </div>
                  </td>

                  {/* Main Weekly Focus */}
                  <td
                    onClick={() => isAdmin && onEditMainTasks(member.id, member.mainTasks)}
                    className={`py-3 px-3 border-l border-cyan-500/15 bg-slate-900/20 align-top text-xs text-slate-200 leading-relaxed font-medium group/main ${
                      isAdmin ? 'hover:bg-slate-800/60 transition-colors cursor-pointer' : ''
                    }`}
                    title={isAdmin ? 'انقر لتعديل المهام الرئيسية' : 'المهام الرئيسية الخاصة بك'}
                  >
                    <div className="relative group/edit">
                      <p className="whitespace-pre-line">{member.mainTasks || 'لا توجد مهام رئيسية مضافة'}</p>
                      {isAdmin && (
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
                      )}
                    </div>
                  </td>

                  {/* Days Columns (Sun -> Thu) */}
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
                                    className="no-print inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-current hover:scale-105 transition-transform cursor-pointer"
                                    title="انقر لتغيير حالة الإنجاز"
                                  >
                                    {statusCfg.icon}
                                    <span>{statusCfg.label}</span>
                                  </button>
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

                                {/* Hover Edit button */}
                                <button
                                  onClick={() => onEditTask(member.id, day.key, task)}
                                  className="no-print absolute bottom-1 left-1 opacity-0 group-hover/task:opacity-100 p-1 text-slate-300 hover:text-cyan-300 hover:bg-slate-800/90 rounded bg-slate-900/90 border border-slate-700 transition-all shadow cursor-pointer"
                                  title="تعديل التفاصيل"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Task Button */}
                        <button
                          onClick={() => onAddTask(member.id, day.key)}
                          className="no-print mt-2 w-full py-1.5 px-2 rounded-lg border border-dashed border-cyan-500/30 hover:border-cyan-400 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-950/60 text-[11px] font-bold flex items-center justify-center gap-1 opacity-90 group-hover/cell:opacity-100 transition-all cursor-pointer shadow-sm"
                          title="إضافة ما تم إنجازه أو مهمة لهذا اليوم"
                        >
                          <Plus className="w-3.5 h-3.5 text-cyan-400" />
                          <span>إضافة إنجاز</span>
                        </button>
                      </td>
                    );
                  })}

                  {/* Ongoing Follow-Up Column */}
                  <td
                    onClick={() => onEditOngoingFollowUp(member.id, member.ongoingFollowUp)}
                    className="py-3 px-3 border-cyan-500/15 bg-slate-900/20 align-top text-xs text-cyan-200 font-medium leading-relaxed group/ongoing hover:bg-slate-800/60 transition-colors cursor-pointer"
                    title="انقر لتعديل تفاصيل المتابعة"
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

      {/* 2. Mobile View: Optimized Horizontally Scrollable Cards */}
      <div className="block md:hidden space-y-6">
        {teamMembers.map((member, memberIdx) => (
          <div
            key={member.id}
            className="rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-4 shadow-xl space-y-4"
          >
            {/* Mobile Card Header: Employee info & admin actions */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md shrink-0"
                  style={{ backgroundColor: member.avatarColor || '#0ea5e9' }}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      #{member.indexNumber || memberIdx + 1}
                    </span>
                    <h3 className="font-bold text-white text-base font-['Tajawal']">
                      {member.name}
                    </h3>
                  </div>
                  {member.roleTitle && (
                    <span className="text-xs text-cyan-300/80 font-medium block mt-0.5">
                      {member.roleTitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditMember(member)}
                    className="p-2 text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-700 rounded-lg"
                    title="تعديل الموظف"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="p-2 text-slate-300 hover:text-rose-400 bg-slate-900 border border-slate-700 rounded-lg"
                    title="حذف الموظف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Section: Main Focus Tasks & Ongoing Follow-up Grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {/* Main Focus Tasks */}
              <div
                onClick={() => isAdmin && onEditMainTasks(member.id, member.mainTasks)}
                className={`p-3 rounded-xl border border-cyan-500/20 bg-slate-900/60 ${
                  isAdmin ? 'active:bg-slate-800/80 cursor-pointer' : ''
                }`}
              >
                <div className="flex items-center justify-between text-cyan-300 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>المهام الرئيسية</span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMainTasks(member.id, member.mainTasks);
                      }}
                      className="text-[11px] text-cyan-400 flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>تعديل</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                  {member.mainTasks || 'لا توجد مهام رئيسية مضافة'}
                </p>
              </div>

              {/* Ongoing Follow-up */}
              <div
                onClick={() => onEditOngoingFollowUp(member.id, member.ongoingFollowUp)}
                className="p-3 rounded-xl border border-cyan-500/20 bg-slate-900/60 active:bg-slate-800/80 cursor-pointer"
              >
                <div className="flex items-center justify-between text-cyan-300 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>المتابعة المستمرة</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditOngoingFollowUp(member.id, member.ongoingFollowUp);
                    }}
                    className="text-[11px] text-cyan-400 flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>تعديل</span>
                  </button>
                </div>
                <p className="text-xs text-cyan-200 whitespace-pre-line leading-relaxed font-medium">
                  {member.ongoingFollowUp || 'انقر لإضافة تفاصيل المتابعة المستمرة...'}
                </p>
              </div>
            </div>

            {/* Mobile Section: Horizontally Scrollable Days Cards Carousel */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>جدول الأيام اليومي</span>
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
                  <span>اسحب أفقيًا</span>
                </span>
              </div>

              {/* Horizontal Scroll Track */}
              <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-cyan-500/30 snap-x">
                {days.map((day) => {
                  const dayTasks = member.tasksByDay[day.key] || [];

                  return (
                    <div
                      key={day.key}
                      className="min-w-[250px] max-w-[270px] shrink-0 snap-start p-3 rounded-xl border border-cyan-500/25 bg-slate-900/90 flex flex-col justify-between shadow-md"
                    >
                      {/* Day Title Header */}
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
                          <span className="font-black text-sm text-white font-['Tajawal']">
                            {day.labelAr}
                          </span>
                          <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                            {day.dateLabel}
                          </span>
                        </div>

                        {/* List of Tasks */}
                        <div className="space-y-2 my-2 min-h-[80px]">
                          {dayTasks.length === 0 ? (
                            <div className="text-[11px] text-slate-500 italic text-center py-4">
                              لا توجد مهام لهذا اليوم
                            </div>
                          ) : (
                            dayTasks.map((task) => {
                              const statusCfg = getStatusConfig(task.status);

                              return (
                                <div
                                  key={task.id}
                                  className={`relative p-2.5 rounded-lg border ${statusCfg.borderColor} ${statusCfg.bgColor} space-y-1.5`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1">
                                      {renderTaskIcon(
                                        task.categoryIcon,
                                        'w-3.5 h-3.5 text-cyan-400'
                                      )}
                                    </div>

                                    {/* Status Toggle Button */}
                                    <button
                                      onClick={() =>
                                        onQuickToggleStatus(member.id, day.key, task.id)
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-current active:scale-95 transition-transform"
                                    >
                                      {statusCfg.icon}
                                      <span>{statusCfg.label}</span>
                                    </button>
                                  </div>

                                  <p className="text-xs font-medium text-slate-100 leading-snug break-words">
                                    {task.text}
                                  </p>

                                  {task.note && (
                                    <p className="text-[10px] text-cyan-300/80 italic border-t border-cyan-500/10 pt-1">
                                      💡 {task.note}
                                    </p>
                                  )}

                                  <div className="pt-1 flex justify-end">
                                    <button
                                      onClick={() => onEditTask(member.id, day.key, task)}
                                      className="text-[10px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      <span>تعديل</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Add Task Button */}
                      <button
                        onClick={() => onAddTask(member.id, day.key)}
                        className="mt-2 w-full py-2 px-2 rounded-lg border border-dashed border-cyan-500/40 text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950 text-xs font-bold flex items-center justify-center gap-1 active:scale-98 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>إضافة إنجاز اليوم</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


