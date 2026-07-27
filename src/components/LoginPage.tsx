import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Sparkles, AlertCircle, ArrowLeft, KeyRound, UserCheck } from 'lucide-react';
import { TeamMember, ScheduleHeader } from '../types';
import { DEFAULT_PASSWORDS } from '../services/firestoreService';

export interface UserSession {
  role: 'admin' | 'employee';
  memberId?: string;
  memberName?: string;
}

interface LoginPageProps {
  teamMembers: TeamMember[];
  headerData: ScheduleHeader;
  passwords: Record<string, string>;
  onLoginSuccess: (session: UserSession) => void;
  onOpenChangePasswordModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  teamMembers,
  headerData,
  passwords,
  onLoginSuccess,
  onOpenChangePasswordModal,
}) => {
  const [loginType, setLoginType] = useState<'employee' | 'admin'>('employee');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    teamMembers[0]?.id || ''
  );
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginType === 'employee') {
      let member = teamMembers.find((m) => m.id === selectedMemberId);
      if (!member && usernameInput.trim()) {
        member = teamMembers.find(
          (m) => m.name.trim().toLowerCase() === usernameInput.trim().toLowerCase()
        );
      }

      if (!member) {
        setErrorMsg('الرجاء اختيار أو كتابة اسم الموظف بشكل صحيح');
        return;
      }

      const expectedPass = passwords[member.id] || DEFAULT_PASSWORDS[member.id] || 'm123';
      const inputPass = passwordInput.trim();

      if (inputPass !== expectedPass) {
        setErrorMsg('كلمة المرور غير صحيحة.');
        return;
      }

      onLoginSuccess({
        role: 'employee',
        memberId: member.id,
        memberName: member.name,
      });
    } else {
      // Admin Login
      const expectedAdminPass = passwords['admin'] || DEFAULT_PASSWORDS['admin'] || 'admin123';
      const inputPass = passwordInput.trim();

      if (inputPass !== expectedAdminPass) {
        setErrorMsg('كلمة مرور مدير النظام غير صحيحة.');
        return;
      }

      onLoginSuccess({
        role: 'admin',
        memberName: 'مدير النظام',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex items-center justify-center p-4 dir-rtl relative overflow-hidden font-['Tajawal']">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Logo Badge */}
        <div className="text-center mb-8">
          {headerData.logoUrl ? (
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-900 border border-cyan-500/40 p-2 shadow-xl shadow-cyan-500/20 overflow-hidden mx-auto mb-4">
              <img
                src={headerData.logoUrl}
                alt={headerData.companyLogoText || 'PARADISE'}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20 mb-4">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
            {headerData.companyLogoText || 'PARADISE'}
          </h1>
          <p className="text-xs font-bold text-cyan-400/80 tracking-widest mt-1">
            {headerData.companySubtext || headerData.title || 'جدول الأسبوع لمهام الفريق'}
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 md:p-8 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
          {/* Toggle Login Type */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-cyan-500/20 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginType('employee');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                loginType === 'employee'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>دخول الموظفين</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                loginType === 'admin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>مدير النظام</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Selection or Input */}
            {loginType === 'employee' ? (
              <div>
                <label className="block text-xs font-bold text-cyan-200 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>اسم الموظف (اسم المستخدم)</span>
                </label>
                
                {/* Select Member Dropdown */}
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
                >
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id} className="bg-slate-900 text-white">
                      {member.name} {member.roleTitle ? `(${member.roleTitle})` : ''}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  اختر اسمك للوصول السريع لجدول مهامك
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-cyan-200 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>اسم المستخدم لمدير النظام</span>
                </label>
                <input
                  type="text"
                  value={usernameInput || 'مدير النظام'}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="مدير النظام"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-cyan-200 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>كلمة المرور</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all dir-ltr text-right"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-cyan-400/70 mt-1.5">
                <p className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>كلمة المرور الافتراضية: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[11px]">{loginType === 'admin' ? 'admin123' : 'm123'}</code></span>
                </p>
                <button
                  type="button"
                  onClick={onOpenChangePasswordModal}
                  className="text-cyan-400 hover:text-cyan-200 underline font-bold cursor-pointer transition-colors"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 text-slate-950 font-black text-sm hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>دخول النظام</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-cyan-500/15 text-center text-[11px] text-slate-400 leading-relaxed">
            {loginType === 'employee' ? (
              <p className="text-cyan-300/80">
                🔒 عند تسجيل الدخول، ستتمكن فقط من عرض ملفك والمهام الرئيسية وإضافة إنجازات اليوم دون إمكانية رؤية بيانات أو مهام الآخرين.
              </p>
            ) : (
              <p className="text-cyan-300/80">
                ⚡ وضع مدير النظام يتيح الصلاحيات الكاملة للوحة وإدارة جميع الموظفين والنسخ الاحتياطي.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
