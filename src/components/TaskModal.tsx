import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Tag } from 'lucide-react';
import { DailyTask, TaskIcon, TaskStatus } from '../types';
import { AVAILABLE_ICONS, renderTaskIcon } from '../utils/iconHelper';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<DailyTask, 'id'> & { id?: string }) => void;
  onDelete?: (taskId: string) => void;
  initialTask?: DailyTask | null;
  dayLabel?: string;
  memberName?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTask,
  dayLabel,
  memberName,
}) => {
  const [text, setText] = useState('');
  const [categoryIcon, setCategoryIcon] = useState<TaskIcon>('clipboard');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialTask) {
      setText(initialTask.text || '');
      setCategoryIcon(initialTask.categoryIcon || 'clipboard');
      setStatus(initialTask.status || 'pending');
      setNote(initialTask.note || '');
    } else {
      setText('');
      setCategoryIcon('clipboard');
      setStatus('pending');
      setNote('');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSave({
      id: initialTask?.id,
      text: text.trim(),
      categoryIcon,
      status,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-['Cairo']">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/50 text-right">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white font-['Tajawal']">
              {initialTask ? 'تعديل بيانات المهمة' : 'إضافة مهمة جديدة'}
            </h3>
            {memberName && dayLabel && (
              <p className="text-xs text-cyan-400 mt-0.5">
                العضو: <span className="font-bold text-white">{memberName}</span> | اليوم: <span className="font-bold text-white">{dayLabel}</span>
              </p>
            )}
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
          
          {/* Task Text Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              نص المهمة / المطلوبة <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب وصف المهمة المكلف بها العضو هنا..."
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-600"
            />
          </div>

          {/* Completion Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              حالة الإنجاز اليومي
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  status === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>مكتمل 🟢</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('in_progress')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  status === 'in_progress'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>قيد التنفيذ 🟡</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  status === 'pending'
                    ? 'bg-slate-800 border-slate-400 text-slate-200 ring-2 ring-slate-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-slate-500" />
                <span>لم يبدأ ⚪</span>
              </button>
            </div>
          </div>

          {/* Category Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>أيقونة / تصنيف المهمة:</span>
              <span className="text-cyan-400 font-medium">
                {AVAILABLE_ICONS.find((i) => i.id === categoryIcon)?.labelAr}
              </span>
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = categoryIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategoryIcon(item.id)}
                    className={`p-2.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-lg scale-105 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={item.labelAr}
                  >
                    {renderTaskIcon(item.id, 'w-5 h-5')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              ملاحظة إضافية (اختياري)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: بحاجة إلى مراجعة الملف الفني..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {initialTask && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialTask.id);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف المهمة</span>
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
                <span>حفظ البيانات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
