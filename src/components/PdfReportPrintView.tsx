import React from 'react';
import {
  User,
  Target,
  Activity,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  FileCheck,
  Check,
} from 'lucide-react';
import { TeamMember, ScheduleHeader, DayConfig } from '../types';

interface PdfReportPrintViewProps {
  headerData: ScheduleHeader;
  teamMembers: TeamMember[];
  days?: DayConfig[];
}

export const PdfReportPrintView: React.FC<PdfReportPrintViewProps> = ({
  headerData,
  teamMembers,
  days = [],
}) => {
  // Calculate Smart Weekly Achievements & Metrics
  let totalDailyTasks = 0;
  let completedDailyTasks = 0;
  let inProgressDailyTasks = 0;
  let membersWithMainTasksCount = 0;
  let membersWithFollowUpCount = 0;

  teamMembers.forEach((member) => {
    if (member.mainTasks && member.mainTasks.trim().length > 0) {
      membersWithMainTasksCount++;
    }
    if (member.ongoingFollowUp && member.ongoingFollowUp.trim().length > 0) {
      membersWithFollowUpCount++;
    }

    if (member.tasksByDay) {
      Object.values(member.tasksByDay).forEach((tasks) => {
        if (Array.isArray(tasks)) {
          tasks.forEach((t) => {
            totalDailyTasks++;
            if (t.status === 'completed') {
              completedDailyTasks++;
            } else if (t.status === 'in_progress') {
              inProgressDailyTasks++;
            }
          });
        }
      });
    }
  });

  const completionPercentage =
    totalDailyTasks > 0
      ? Math.round((completedDailyTasks / totalDailyTasks) * 100)
      : 100;

  const activeMembersCount = teamMembers.length;

  return (
    <div className="hidden print:block w-full text-right dir-rtl font-['Tajawal'] text-slate-100 bg-[#0b1120] p-4 print:p-2 print:bg-white print:text-slate-900">
      {/* Company Header & Brand Bar */}
      <div className="border border-cyan-500/40 print:border-slate-300 rounded-2xl bg-slate-900 print:bg-slate-50 p-5 print:p-4 mb-5 shadow-sm flex items-center justify-between gap-4 break-inside-avoid">
        {/* Logo & Company Title */}
        <div className="flex items-center gap-4">
          {headerData.logoUrl ? (
            <div className="w-16 h-16 print:w-14 print:h-14 rounded-xl border border-cyan-500/40 print:border-slate-300 p-1.5 bg-slate-950 print:bg-white flex items-center justify-center shrink-0 shadow-inner">
              <img
                src={headerData.logoUrl}
                alt={headerData.companyLogoText || 'PARADISE'}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 print:w-14 print:h-14 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shrink-0 flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
              <div className="w-full h-full bg-slate-950 print:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-300 print:text-cyan-400" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl print:text-lg font-black text-white print:text-slate-900">
                {headerData.companyLogoText || 'PARADISE'}
              </h1>
              <span className="text-[10px] bg-cyan-950/80 print:bg-cyan-100 text-cyan-300 print:text-cyan-800 border border-cyan-500/30 print:border-cyan-300 px-2 py-0.5 rounded-full font-extrabold">
                تقرير ذكي معتمد
              </span>
            </div>
            <h2 className="text-sm print:text-xs font-bold text-cyan-300 print:text-cyan-700 mt-0.5">
              {headerData.title || 'جدول مهام الفريق والمتابعة الأسبوعية'}
            </h2>
            <p className="text-[11px] text-slate-400 print:text-slate-600 font-medium">
              {headerData.companySubtext || headerData.subtitle || 'نظام إدارة وجدولة المهام الحي والتقرير التنفيذي'}
            </p>
          </div>
        </div>

        {/* Period & Export Info */}
        <div className="text-left bg-slate-950 print:bg-white px-4 py-2.5 rounded-xl border border-cyan-500/30 print:border-slate-300 text-xs text-slate-300 print:text-slate-700 font-bold shrink-0">
          <div className="flex items-center gap-1.5 text-cyan-400 print:text-cyan-700 mb-1 font-black">
            <Calendar className="w-4 h-4" />
            <span>فترة التقرير:</span>
          </div>
          <div className="text-[11px] text-slate-300 print:text-slate-800">
            من: <span className="font-extrabold text-white print:text-slate-900">{headerData.startDate || '—'}</span>
          </div>
          <div className="text-[11px] text-slate-300 print:text-slate-800">
            إلى: <span className="font-extrabold text-white print:text-slate-900">{headerData.endDate || '—'}</span>
          </div>
        </div>
      </div>

      {/* Smart Weekly Achievements Summary Card (ملخص ذكي لإنجازات الأسبوع) */}
      <div className="border border-cyan-500/40 print:border-slate-300 rounded-2xl bg-slate-900/90 print:bg-slate-50 p-4 mb-5 break-inside-avoid">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20 print:border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 print:bg-cyan-100 text-cyan-400 print:text-cyan-800">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-white print:text-slate-900">
              ملخص ذكي لإنجازات ومؤشرات الأسبوع
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 print:text-emerald-700 bg-emerald-950/60 print:bg-emerald-50 border border-emerald-500/30 print:border-emerald-200 px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>نسبة إنجاز المهام: {completionPercentage}%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="bg-slate-950 print:bg-white p-2.5 rounded-xl border border-cyan-500/20 print:border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 print:text-slate-600 text-[11px] font-bold mb-0.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>إجمالي الكادر</span>
            </div>
            <div className="text-base font-black text-white print:text-slate-900">
              {activeMembersCount} <span className="text-[10px] text-slate-400 font-normal">موظف</span>
            </div>
          </div>

          <div className="bg-slate-950 print:bg-white p-2.5 rounded-xl border border-cyan-500/20 print:border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 print:text-slate-600 text-[11px] font-bold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>المهام المنجزة</span>
            </div>
            <div className="text-base font-black text-emerald-400 print:text-emerald-700">
              {completedDailyTasks}{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                من أصل {totalDailyTasks}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 print:bg-white p-2.5 rounded-xl border border-cyan-500/20 print:border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 print:text-slate-600 text-[11px] font-bold mb-0.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>المهام الرئيسية</span>
            </div>
            <div className="text-base font-black text-amber-300 print:text-amber-800">
              {membersWithMainTasksCount}{' '}
              <span className="text-[10px] text-slate-400 font-normal">محاور موثقة</span>
            </div>
          </div>

          <div className="bg-slate-950 print:bg-white p-2.5 rounded-xl border border-cyan-500/20 print:border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 print:text-slate-600 text-[11px] font-bold mb-0.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>المتابعة المستمرة</span>
            </div>
            <div className="text-base font-black text-cyan-300 print:text-cyan-800">
              {membersWithFollowUpCount}{' '}
              <span className="text-[10px] text-slate-400 font-normal">خطط تشغيلية</span>
            </div>
          </div>
        </div>

        {/* Dynamic Executive Narrative Summary */}
        <div className="bg-slate-950/80 print:bg-cyan-50/70 p-3 rounded-xl border border-cyan-500/20 print:border-cyan-200 text-xs leading-relaxed text-slate-300 print:text-slate-800">
          <span className="font-extrabold text-cyan-300 print:text-cyan-900 ml-1">
            💡 النظرة التنفيذية الذكية:
          </span>
          خلال هذه الفترة الأسبوعية، تم توثيق أنشطة ومهمات{' '}
          <strong className="text-white print:text-slate-900">{activeMembersCount} أعضاء</strong>{' '}
          في فريق العمل. بلغ إجمالي المهام اليومية المسجلة{' '}
          <strong className="text-white print:text-slate-900">{totalDailyTasks} مهمة</strong>، انجز منها{' '}
          <strong className="text-emerald-400 print:text-emerald-800">{completedDailyTasks} مهمة بنجاح</strong>{' '}
          بنسبة كفاءة وإنجاز كلي قدرها <strong className="text-emerald-400 print:text-emerald-800">{completionPercentage}%</strong>.
          {inProgressDailyTasks > 0 && (
            <span> ويجري العمل حالياً على استكمال {inProgressDailyTasks} مهمة قيد التنفيذ.</span>
          )}
        </div>
      </div>

      {/* Main Table for Employee Main Tasks & Ongoing Follow-up */}
      <div className="rounded-2xl border border-cyan-500/40 print:border-slate-300 bg-slate-900 print:bg-white overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-right text-xs">
          <thead>
            <tr className="bg-slate-950 print:bg-slate-100 border-b border-cyan-500/30 print:border-slate-300 text-cyan-300 print:text-slate-900 font-black text-xs">
              <th className="py-3 px-3 w-10 text-center border-l border-cyan-500/20 print:border-slate-200">#</th>
              <th className="py-3 px-4 w-44 border-l border-cyan-500/20 print:border-slate-200">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400 print:text-cyan-700" />
                  <span>اسم الموظف / المسمى</span>
                </div>
              </th>
              <th className="py-3 px-4 border-l border-cyan-500/20 print:border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-400 print:text-cyan-700" />
                  <span>المهام الرئيسية</span>
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400 print:text-cyan-700" />
                  <span>المتابعة المستمرة</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/20 print:divide-slate-200">
            {teamMembers.map((member, idx) => {
              // calculate member completed count
              let memberCompleted = 0;
              let memberTotal = 0;
              if (member.tasksByDay) {
                Object.values(member.tasksByDay).forEach((tasks) => {
                  if (Array.isArray(tasks)) {
                    tasks.forEach((t) => {
                      memberTotal++;
                      if (t.status === 'completed') memberCompleted++;
                    });
                  }
                });
              }

              return (
                <tr key={member.id} className="bg-slate-900/60 print:bg-white align-top break-inside-avoid">
                  {/* Index */}
                  <td className="py-3 px-2 text-center font-bold text-cyan-400 print:text-slate-700 border-l border-cyan-500/15 print:border-slate-200">
                    {idx + 1}
                  </td>

                  {/* Employee Name & Mini Badge */}
                  <td className="py-3 px-4 border-l border-cyan-500/15 print:border-slate-200">
                    <div className="font-bold text-sm text-white print:text-slate-900">{member.name}</div>
                    {member.roleTitle && (
                      <div className="text-[11px] text-cyan-400 print:text-cyan-800 font-medium mt-0.5">
                        {member.roleTitle}
                      </div>
                    )}
                    {memberTotal > 0 && (
                      <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-slate-950 print:bg-slate-100 text-[10px] text-emerald-400 print:text-emerald-800 font-bold border border-emerald-500/30 print:border-slate-300">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>إنجاز اليوميات: {memberCompleted}/{memberTotal}</span>
                      </div>
                    )}
                  </td>

                  {/* Main Tasks */}
                  <td className="py-3 px-4 border-l border-cyan-500/15 print:border-slate-200 leading-relaxed font-medium text-slate-200 print:text-slate-800">
                    {member.mainTasks ? (
                      <div className="whitespace-pre-line text-xs">{member.mainTasks}</div>
                    ) : (
                      <span className="text-slate-500 print:text-slate-400 italic">لا توجد مهام رئيسية مضافة</span>
                    )}
                  </td>

                  {/* Ongoing Follow-up */}
                  <td className="py-3 px-4 leading-relaxed font-medium text-cyan-200 print:text-cyan-900">
                    {member.ongoingFollowUp ? (
                      <div className="whitespace-pre-line text-xs">{member.ongoingFollowUp}</div>
                    ) : (
                      <span className="text-slate-500 print:text-slate-400 italic">لا توجد تفاصيل متابعة مستمرة</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer stamp & Verification Notice */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 print:border-slate-300 flex items-center justify-between text-[10px] text-slate-400 print:text-slate-600 break-inside-avoid">
        <div>
          تاريخ الاستخراج للطباعة: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="font-extrabold text-cyan-400 print:text-slate-800 flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400 print:text-cyan-700" />
          <span>{headerData.companyLogoText || 'PARADISE'} - نظام التقرير السحابي المعتمد</span>
        </div>
      </div>
    </div>
  );
};

