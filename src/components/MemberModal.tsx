import React, { useState, useEffect } from 'react';
import { X, Check, User, Palette, Trash2 } from 'lucide-react';
import { TeamMember } from '../types';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Omit<TeamMember, 'id' | 'tasksByDay'> & { id?: string }) => void;
  onDelete?: (memberId: string) => void;
  initialMember?: TeamMember | null;
  nextIndexNumber: number;
}

const COLOR_PRESETS = [
  '#0ea5e9', // cyan
  '#a855f7', // purple
  '#22c55e', // green
  '#eab308', // amber
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#ec4899', // pink
  '#f97316', // orange
  '#6366f1', // indigo
  '#84cc16', // lime
];

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialMember,
  nextIndexNumber,
}) => {
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [avatarColor, setAvatarColor] = useState('#0ea5e9');
  const [mainTasks, setMainTasks] = useState('');
  const [ongoingFollowUp, setOngoingFollowUp] = useState('');

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name || '');
      setRoleTitle(initialMember.roleTitle || '');
      setAvatarColor(initialMember.avatarColor || '#0ea5e9');
      setMainTasks(initialMember.mainTasks || '');
      setOngoingFollowUp(initialMember.ongoingFollowUp || '');
    } else {
      setName('');
      setRoleTitle('');
      setAvatarColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
      setMainTasks('');
      setOngoingFollowUp('');
    }
  }, [initialMember, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialMember?.id,
      indexNumber: initialMember ? initialMember.indexNumber : nextIndexNumber,
      name: name.trim(),
      roleTitle: roleTitle.trim() || undefined,
      avatarColor,
      mainTasks: mainTasks.trim() || 'متابعة وإشراف على الأعمال المكلف بها',
      ongoingFollowUp: ongoingFollowUp.trim() || 'متابعة يومية مستمرة',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-['Cairo']">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/50 text-right">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: avatarColor }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-['Tajawal']">
                {initialMember ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للفريق'}
              </h3>
              <p className="text-xs text-slate-400">
                {initialMember ? `رقم العضو: ${initialMember.indexNumber}` : `سيتم إضافته برقم: ${nextIndexNumber}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Member Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              اسم عضو الفريق <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أحمد عبد الله"
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Role Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              المسمى الوظيفي / التخصص
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="مثال: استشاري نظم / إدارة مشاريع / اختبارات وجودة..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>لون تمييز العضو</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                    avatarColor === color ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {avatarColor === color && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Main Tasks */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              المهام الرئيسية (التركيز الأسبوعي)
            </label>
            <textarea
              rows={2}
              value={mainTasks}
              onChange={(e) => setMainTasks(e.target.value)}
              placeholder="وصف الإشراف والمهام الأساسية المكلف بها هذا العضو خلال الأسبوع..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Ongoing Follow-up */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              المتابعة المستمرة
            </label>
            <input
              type="text"
              value={ongoingFollowUp}
              onChange={(e) => setOngoingFollowUp(e.target.value)}
              placeholder="مثال: متابعة يومية لأعمال الفريق..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {initialMember && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialMember.id);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف العضو</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition-all"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 text-xs font-black shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>حفظ العضو</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
