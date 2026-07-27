import React, { useState } from 'react';
import { X, History, Save, Calendar, Trash2, ArrowLeftRight, Check, Plus, FileSpreadsheet, Sparkles, Download, Layers } from 'lucide-react';
import { ArchivedWeek, ScheduleData } from '../types';
import { formatDateArabic } from '../utils/dateUtils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  archivedWeeks: ArchivedWeek[];
  onSaveCurrentWeekToHistory: (customTitle?: string) => void;
  onLoadArchivedWeek: (week: ArchivedWeek) => void;
  onDeleteArchivedWeek: (weekId: string) => void;
  onStartNewWeek: (startDateSunday: string, keepMembers: boolean) => void;
  currentScheduleData: ScheduleData;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  archivedWeeks,
  onSaveCurrentWeekToHistory,
  onLoadArchivedWeek,
  onDeleteArchivedWeek,
  onStartNewWeek,
  currentScheduleData,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'save' | 'new_week'>('list');
  const [saveTitle, setSaveTitle] = useState('');
  const [newWeekStartDate, setNewWeekStartDate] = useState('');
  const [keepMembersStructure, setKeepMembersStructure] = useState(true);

  if (!isOpen) return null;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCurrentWeekToHistory(saveTitle.trim() || undefined);
    setSaveTitle('');
    setActiveTab('list');
  };

  const handleStartNewWeekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeekStartDate) {
      alert('الرجاء اختيار تاريخ الأحد لبدء الأسبوع الجديد.');
      return;
    }
    onStartNewWeek(newWeekStartDate, keepMembersStructure);
    setActiveTab('list');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-['Cairo']">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/60 text-right max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-['Tajawal'] flex items-center gap-2">
                <span>سجل الأسابيع الماضية والجدولة</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300">
                  {archivedWeeks.length} أسبوع محفوظة
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                الاحتفاظ بالسجلات السابقة واسترجاعها وإنشاء أسابيع جديدة بسهولة
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

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>تصفح السجلات المحفوظة ({archivedWeeks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'save'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>حفظ الأسبوع الحالي بالسجل</span>
          </button>

          <button
            onClick={() => setActiveTab('new_week')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'new_week'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>بدء أسبوع جديد</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4">
          
          {/* TAB 1: LIST ARCHIVED WEEKS */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              {archivedWeeks.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-300 mb-1">لا يوجد أسابيع محفوظة في السجل حالياً</p>
                  <p className="text-xs text-slate-500 mb-4">
                    يمكنك حفظ الأسبوع الحالي للرجوع إليه في أي وقت أو بدء أسبوع جديد مع الاحتفاظ بهذا الأسبوع.
                  </p>
                  <button
                    onClick={() => setActiveTab('save')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ الأسبوع الحالي الآن</span>
                  </button>
                </div>
              ) : (
                archivedWeeks.map((week) => {
                  const completionPercentage = week.totalTasks > 0
                    ? Math.round((week.completedTasks / week.totalTasks) * 100)
                    : 0;

                  return (
                    <div
                      key={week.id}
                      className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                        <div>
                          <h4 className="font-bold text-white text-base font-['Tajawal'] flex items-center gap-2">
                            <span>{week.title}</span>
                          </h4>
                          <p className="text-xs text-cyan-300/80 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{week.subtitle}</span>
                          </p>
                        </div>
                        <div className="text-left text-[11px] text-slate-400">
                          <span>تم الحفظ بتاريخ: </span>
                          <span className="text-slate-300 font-mono">{new Date(week.archivedAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">عدد الأعضاء</span>
                          <span className="font-extrabold text-white text-sm">{week.memberCount || week.data.teamMembers.length}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">إجمالي المهام</span>
                          <span className="font-extrabold text-cyan-300 text-sm">{week.totalTasks}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">نسبة الإنجاز</span>
                          <span className="font-extrabold text-emerald-400 text-sm">{completionPercentage}%</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (confirm(`هل تريد استرجاع وعرض جدول (${week.title})؟`)) {
                              onLoadArchivedWeek(week);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold transition-all"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          <span>عرض / استرجاع هذا الأسبوع</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`هل أنت تأكد من حذف (${week.title}) من السجل؟`)) {
                              onDeleteArchivedWeek(week.id);
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60 text-xs font-medium transition-colors"
                          title="حذف الأسبوع"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: SAVE CURRENT WEEK */}
          {activeTab === 'save' && (
            <form onSubmit={handleSaveSubmit} className="space-y-4 bg-slate-950 p-4 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>حفظ الأسبوع الحالي في الأرشيف المقيم</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                سيتم حفظ كافة بيانات الأسبوع الحالي (
                <span className="text-cyan-400 font-bold">{currentScheduleData.header.subtitle}</span>
                ) بجميع المهام والأعضاء والملاحظات في سجل الأرشيف الدائم.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم أو عنوان الأسبوع بالسجل (اختياري)
                </label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder={`مثال: ${currentScheduleData.header.subtitle}`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>تأكيد الحفظ في السجل</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: START NEW WEEK */}
          {activeTab === 'new_week' && (
            <form onSubmit={handleStartNewWeekSubmit} className="space-y-4 bg-slate-950 p-4 rounded-xl border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>إعداد جدول جديد لأسبوع قادم</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يقوم هذا الخيار بأتمتة تجهيز الجدول للأسبوع القادم، وحساب التواريخ تلقائياً بدءاً من يوم الأحد وحتى يوم الخميس!
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  حدد تاريخ يوم الأحد لبدء الأسبوع الجديد:
                </label>
                <input
                  type="date"
                  required
                  value={newWeekStartDate}
                  onChange={(e) => setNewWeekStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepMembersStructure}
                    onChange={(e) => setKeepMembersStructure(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                  <span>الاحتفاظ بأعضاء الفريق والمهام الرئيسية والمتابعة المستمرة</span>
                </label>
                <p className="text-[11px] text-slate-400 pr-6">
                  عند تفعيل هذا الخيار، يتم تفريغ مهام الأيام فقط للبدء بأسبوع جديد، مع نقل قائمة الموظفين وأدوارهم ومتابعاتهم تلقائياً.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>تأكيد وإنشاء الأسبوع الجديد</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
