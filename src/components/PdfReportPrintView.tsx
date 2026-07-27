import React from 'react';
import { User, Target, Activity, Sparkles, Calendar } from 'lucide-react';
import { TeamMember, ScheduleHeader } from '../types';

interface PdfReportPrintViewProps {
  headerData: ScheduleHeader;
  teamMembers: TeamMember[];
}

export const PdfReportPrintView: React.FC<PdfReportPrintViewProps> = ({
  headerData,
  teamMembers,
}) => {
  return (
    <div className="hidden print:block w-full text-right dir-rtl font-['Tajawal'] text-slate-100 bg-[#0b1120] p-4">
      {/* Print Report Header */}
      <div className="border border-cyan-500/40 rounded-2xl bg-slate-900 p-5 mb-6 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {headerData.logoUrl ? (
            <div className="w-16 h-16 rounded-xl border border-cyan-500/30 p-1 bg-slate-950 flex items-center justify-center shrink-0">
              <img
                src={headerData.logoUrl}
                alt={headerData.companyLogoText || 'PARADISE'}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shrink-0 flex items-center justify-center text-slate-950 font-black text-xl">
              <Sparkles className="w-8 h-8 text-cyan-200" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-black text-white">
              {headerData.companyLogoText || 'PARADISE'} - {headerData.title || 'جدول مهام الفريق'}
            </h1>
            <p className="text-xs text-cyan-300 font-bold mt-0.5">
              تقرير المهام الرئيسية والمتابعة المستمرة للموظفين
            </p>
          </div>
        </div>

        <div className="text-left bg-slate-950 px-4 py-2 rounded-xl border border-cyan-500/30 text-xs text-slate-300 font-bold">
          <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>الفترة الزمنية:</span>
          </div>
          <div>من: {headerData.startDate || '—'}</div>
          <div>إلى: {headerData.endDate || '—'}</div>
        </div>
      </div>

      {/* Main Table for Employee Main Tasks & Ongoing Follow-up */}
      <div className="rounded-2xl border border-cyan-500/40 bg-slate-900 overflow-hidden">
        <table className="w-full border-collapse text-right text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-cyan-500/30 text-cyan-300 font-black text-sm">
              <th className="py-3 px-4 w-12 text-center border-l border-cyan-500/20">#</th>
              <th className="py-3 px-4 w-48 border-l border-cyan-500/20">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>اسم الموظف</span>
                </div>
              </th>
              <th className="py-3 px-4 border-l border-cyan-500/20">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>المهام الرئيسية</span>
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>المتابعة المستمرة</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/20">
            {teamMembers.map((member, idx) => (
              <tr key={member.id} className="bg-slate-900/60 align-top">
                {/* Index */}
                <td className="py-3 px-2 text-center font-bold text-cyan-400 border-l border-cyan-500/15">
                  {idx + 1}
                </td>

                {/* Employee Name */}
                <td className="py-3 px-4 border-l border-cyan-500/15">
                  <div className="font-bold text-sm text-white">{member.name}</div>
                  {member.roleTitle && (
                    <div className="text-[11px] text-cyan-400 font-medium mt-0.5">
                      {member.roleTitle}
                    </div>
                  )}
                </td>

                {/* Main Tasks */}
                <td className="py-3 px-4 border-l border-cyan-500/15 leading-relaxed font-medium text-slate-200">
                  {member.mainTasks ? (
                    <div className="whitespace-pre-line text-xs">{member.mainTasks}</div>
                  ) : (
                    <span className="text-slate-500 italic">لا توجد مهام رئيسية مضافة</span>
                  )}
                </td>

                {/* Ongoing Follow-up */}
                <td className="py-3 px-4 leading-relaxed font-medium text-cyan-200">
                  {member.ongoingFollowUp ? (
                    <div className="whitespace-pre-line text-xs">{member.ongoingFollowUp}</div>
                  ) : (
                    <span className="text-slate-500 italic">لا توجد تفاصيل متابعة مستمرة</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer stamp */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-[10px] text-slate-400">
        <div>تم استخراج التقرير بتاريخ: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div className="font-bold text-cyan-400">{headerData.companyLogoText || 'PARADISE'} - نظام إدارة المهام والمتابعة</div>
      </div>
    </div>
  );
};
