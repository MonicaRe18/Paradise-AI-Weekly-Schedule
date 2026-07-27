import React from 'react';
import {
  Calendar,
  Sparkles,
  Printer,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Settings,
  LayoutGrid,
  CheckCircle2,
  Users,
  Target,
  History,
  LogOut,
  UserCheck,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { ScheduleHeader, ViewMode } from '../types';
import { UserSession } from './LoginPage';

interface HeaderProps {
  headerData: ScheduleHeader;
  viewMode: ViewMode;
  userSession: UserSession | null;
  onLogout: () => void;
  onOpenChangePasswordModal: () => void;
  onViewChange: (mode: ViewMode) => void;
  onOpenHeaderSettings: () => void;
  onOpenAddMemberModal: () => void;
  onOpenHistoryModal: () => void;
  archivedWeeksCount: number;
  onResetData: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrint: () => void;
  totalTasks: number;
  completedTasks: number;
}

export const Header: React.FC<HeaderProps> = ({
  headerData,
  viewMode,
  userSession,
  onLogout,
  onOpenChangePasswordModal,
  onViewChange,
  onOpenHeaderSettings,
  onOpenAddMemberModal,
  onOpenHistoryModal,
  archivedWeeksCount,
  onResetData,
  onExportJSON,
  onImportJSON,
  onPrint,
  totalTasks,
  completedTasks,
}) => {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isAdmin = userSession?.role === 'admin';

  return (
    <header className="relative mb-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 p-5 shadow-2xl shadow-cyan-950/40 print:hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 h-32 w-1/2 -translate-y-12 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 h-24 w-1/3 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* User Login & Session Bar */}
      {userSession && (
        <div className="no-print mb-4 pb-3 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>حساب مدير النظام</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-white font-bold text-xs">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>الموظف: {userSession.memberName}</span>
                <span className="text-[10px] text-cyan-400 font-medium bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  عرض خاص لملفك والمهام فقط
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChangePasswordModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all cursor-pointer"
              title="تغيير كلمة المرور الخاصة بك"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>تغيير كلمة المرور</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 font-bold text-xs transition-all cursor-pointer"
              title="تسجيل الخروج وتبديل المستخدم"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        
        {/* Company Branding Logo & Custom Uploaded Logo */}
        <div className="flex items-center gap-3">
          {headerData.logoUrl ? (
            <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900 border border-cyan-500/40 p-1 shadow-lg shadow-cyan-500/20 overflow-hidden shrink-0">
              <img
                src={headerData.logoUrl}
                alt={headerData.companyLogoText}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 font-['Tajawal']">
              {headerData.companyLogoText}
            </h2>
            <p className="text-xs font-semibold text-cyan-400/80 tracking-widest uppercase">
              {headerData.companySubtext}
            </p>
          </div>
        </div>

        {/* Center Main Title */}
        <div className="text-center flex-1 px-2">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-['Tajawal'] drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">
            {headerData.title}
          </h1>
          <div className="inline-flex items-center gap-2 mt-1 px-4 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs md:text-sm text-cyan-300 font-medium shadow-inner">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{headerData.subtitle}</span>
          </div>
        </div>

        {/* Core Values Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {headerData.coreValues.map((value, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-xs font-bold text-slate-200 shadow-sm hover:border-cyan-400/50 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Control Toolbar - Hidden during print */}
      <div className="no-print mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => onViewChange('board')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'board'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>جدول المهام</span>
          </button>

          <button
            onClick={() => onViewChange('standup')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'standup'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>متابعة اليوم</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onViewChange('members')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'members'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>ملفات الأعضاء</span>
            </button>
          )}

          <button
            onClick={() => onViewChange('stats')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'stats'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>معدل الإنجاز ({completionPercentage}%)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* History / Archive Button */}
          {isAdmin && (
            <button
              onClick={onOpenHistoryModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-cyan-950/60 text-cyan-300 text-xs font-bold transition-all relative"
              title="عرض سجل الأسابيع الماضية والأرشيف"
            >
              <History className="w-4 h-4 text-cyan-400" />
              <span>سجل الأسابيع</span>
              {archivedWeeksCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black">
                  {archivedWeeksCount}
                </span>
              )}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenAddMemberModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold transition-all active:scale-95"
              title="إضافة عضو جديد للفريق"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عضو</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenHeaderSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-medium transition-all"
              title="تعديل اللوجو والتواريخ والعنوان الرئيسي"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>إعدادات اللوحة</span>
            </button>
          )}

          {/* Download PDF Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-500 hover:to-cyan-500 text-xs transition-all shadow-md shadow-blue-900/30 cursor-pointer"
            title="تنزيل ملف PDF بنفس الشكل والتصميم"
          >
            <Printer className="w-4 h-4" />
            <span>تنزيل PDF</span>
          </button>

          {isAdmin && (
            <>
              <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

              {/* Export JSON */}
              <button
                onClick={onExportJSON}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 text-xs font-medium transition-colors"
                title="تصدير البيانات إلى ملف JSON"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">تصدير</span>
              </button>

              {/* Import JSON */}
              <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer" title="استيراد بيانات جدول">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">استيراد</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={onImportJSON}
                />
              </label>

              {/* Reset Defaults */}
              <button
                onClick={onResetData}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-rose-300/80 border border-slate-800 hover:bg-rose-950/40 text-xs font-medium transition-colors"
                title="إعادة التعيين إلى النموذج الأصلي (جدول بارادايس الأصلي)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden lg:inline">إعادة ضبط</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

