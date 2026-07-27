import React, { useState, useEffect } from 'react';
import { X, Check, FileText, AlignRight, List, Sparkles } from 'lucide-react';

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberId: string, field: 'ongoingFollowUp' | 'mainTasks', newText: string) => void;
  memberId: string;
  memberName: string;
  field: 'ongoingFollowUp' | 'mainTasks';
  initialText: string;
}

export const TextEditModal: React.FC<TextEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  memberId,
  memberName,
  field,
  initialText,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(initialText || '');
  }, [initialText, isOpen]);

  if (!isOpen) return null;

  const title = field === 'ongoingFollowUp' ? 'تعديل المتابعة المستمرة' : 'تعديل المهام الرئيسية';
  const subtitle = field === 'ongoingFollowUp'
    ? 'المتابعة المستمرة والمهام اليومية الجارية للموظف'
    : 'الأهداف الرئيسية والمسؤوليات الأساسية للأسبوع';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(memberId, field, text.trim());
    onClose();
  };

  const handleAddBullet = () => {
    setText((prev) => (prev ? `${prev}\n• ` : '• '));
  };

  // Quick preset templates for ongoing follow up
  const ongoingPresets = [
    '• متابعة يومية لمستجدات المهام والمشاريع',
    '• إعداد ونشر التقارير الدورية للعملاء',
    '• التنسيق بين أعضاء الفريق وتقديم الدعم الفني',
    '• مراجعة الجودة وضمان تطبيق المعايير',
  ];

  // Quick preset templates for main tasks
  const mainTasksPresets = [
    '• تطوير وتحديث اللوحات البرمجية والأنظمة',
    '• متابعة العقود وتوقيع الصفقات الجديدة',
    '• إشراف وتنفيذ استراتيجية العمل الأسبوعية',
    '• إدارة وتنسيق الحملات التسويقية للأسبوع',
  ];

  const presets = field === 'ongoingFollowUp' ? ongoingPresets : mainTasksPresets;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-['Cairo']">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/50 text-right">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-['Tajawal']">
                {title}
              </h3>
              <p className="text-xs text-cyan-300/80"> للعضو: <span className="font-bold text-white">{memberName}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                {subtitle}
              </label>
              <button
                type="button"
                onClick={handleAddBullet}
                className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-lg transition-colors"
              >
                <List className="w-3 h-3" />
                <span>إضافة نقطة (•)</span>
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="اكتب تفاصيل النص هنا..."
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-white text-xs md:text-sm leading-relaxed focus:outline-none focus:border-cyan-400 transition-all font-medium resize-y"
            />
          </div>

          {/* Quick Presets / Suggestions */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>مقترحات سريعة للاستخدام:</span>
            </label>
            <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText((prev) => (prev ? `${prev}\n${preset}` : preset))}
                  className="text-right text-[11px] text-slate-300 hover:text-cyan-300 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 p-2 rounded-lg transition-colors leading-normal"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
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
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
