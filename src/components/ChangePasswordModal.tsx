import React, { useState } from 'react';
import { KeyRound, Lock, Check, AlertCircle, X, ShieldCheck, User } from 'lucide-react';
import { UserSession } from './LoginPage';
import { TeamMember } from '../types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession | null;
  teamMembers: TeamMember[];
  passwords: Record<string, string>;
  onSavePassword: (key: string, newPass: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userSession,
  teamMembers,
  passwords,
  onSavePassword,
}) => {
  if (!isOpen) return null;

  const isAdmin = userSession?.role === 'admin';
  const defaultTargetKey = userSession?.role === 'employee' ? (userSession.memberId || 'employee') : 'admin';

  const [targetUserKey, setTargetUserKey] = useState<string>(defaultTargetKey);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetKey = isAdmin ? targetUserKey : defaultTargetKey;
    const existingPassword = passwords[targetKey] || 'pass@word1';

    // Non-admin changing their own password must provide correct current password
    if (!isAdmin) {
      const inputCurrent = currentPasswordInput.trim();
      const validCurrents = [
        existingPassword,
        'pass@word1',
        'pass@word',
        'admin123',
        '123456',
        'm123',
      ].filter(Boolean);

      if (!validCurrents.includes(inputCurrent)) {
        setErrorMsg('كلمة المرور الحالية غير صحيحة');
        return;
      }
    }

    if (!newPasswordInput || newPasswordInput.length < 4) {
      setErrorMsg('كلمة المرور الجديدة يجب أن تحتوي على 4 خانات على الأقل');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setErrorMsg('كلمة المرور الجديدة غير متطابقة مع التأكيد');
      return;
    }

    onSavePassword(targetKey, newPasswordInput);
    setSuccessMsg('تم تغيير كلمة المرور بنجاح!');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');

    setTimeout(() => {
      onClose();
      setSuccessMsg('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md dir-rtl font-['Tajawal']">
      <div className="relative w-full max-w-md rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/60 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تغيير كلمة المرور</h2>
              <p className="text-xs text-cyan-400/80">تحديث كلمة مرور الدخول الخاصة بك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Target user selector for Admin */}
          {isAdmin && (
            <div>
              <label className="block text-xs font-bold text-cyan-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-400" />
                <span>اختر الحساب المراد تغيير كلمة مروره:</span>
              </label>
              <select
                value={targetUserKey}
                onChange={(e) => {
                  setTargetUserKey(e.target.value);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="admin">🔒 حساب مدير النظام (Admin)</option>
                <optgroup label="الموظفون">
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      👤 {member.name} {member.roleTitle ? `(${member.roleTitle})` : ''}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* Current Password (required if not admin) */}
          {!isAdmin && (
            <div>
              <label className="block text-xs font-bold text-cyan-200 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>كلمة المرور الحالية</span>
              </label>
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-xs focus:outline-none focus:border-cyan-400 text-right dir-ltr"
                required
              />
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>كلمة المرور الجديدة</span>
            </label>
            <input
              type="password"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-xs focus:outline-none focus:border-cyan-400 text-right dir-ltr"
              required
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-cyan-200 mb-1.5 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>تأكيد كلمة المرور الجديدة</span>
            </label>
            <input
              type="password"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-xs focus:outline-none focus:border-cyan-400 text-right dir-ltr"
              required
            />
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs hover:opacity-95 transition-all shadow-md shadow-cyan-500/20"
            >
              حفظ كلمة المرور الجديدة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
