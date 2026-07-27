import React, { useState, useEffect } from 'react';
import { X, Check, Settings, Sparkles, Image, Calendar, Upload, Trash2 } from 'lucide-react';
import { ScheduleHeader } from '../types';
import { generateSundayToThursdayDays, getNearestSunday, formatDateISO } from '../utils/dateUtils';

interface HeaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerData: ScheduleHeader;
  onSaveHeader: (newHeader: ScheduleHeader, updatedSundayDate?: string) => void;
}

export const HeaderSettingsModal: React.FC<HeaderSettingsModalProps> = ({
  isOpen,
  onClose,
  headerData,
  onSaveHeader,
}) => {
  const [companyLogoText, setCompanyLogoText] = useState('');
  const [companySubtext, setCompanySubtext] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [coreValuesStr, setCoreValuesStr] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [sundayDate, setSundayDate] = useState('');

  useEffect(() => {
    if (headerData) {
      setCompanyLogoText(headerData.companyLogoText || '');
      setCompanySubtext(headerData.companySubtext || '');
      setTitle(headerData.title || '');
      setSubtitle(headerData.subtitle || '');
      setCoreValuesStr(headerData.coreValues ? headerData.coreValues.join(' - ') : '');
      setLogoUrl(headerData.logoUrl || '');
      
      if (headerData.startDate) {
        setSundayDate(headerData.startDate);
      } else {
        setSundayDate(formatDateISO(getNearestSunday()));
      }
    }
  }, [headerData, isOpen]);

  if (!isOpen) return null;

  const handleSundayDateChange = (dateStr: string) => {
    setSundayDate(dateStr);
    if (dateStr) {
      const generated = generateSundayToThursdayDays(dateStr);
      setSubtitle(generated.subtitle);
    }
  };

  const handleQuickSundayPreset = (offsetWeeks: number) => {
    const sun = getNearestSunday();
    sun.setDate(sun.getDate() + offsetWeeks * 7);
    const iso = formatDateISO(sun);
    handleSundayDateChange(iso);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً، يفضل اختيار صورة أقل من 2 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const coreValuesArray = coreValuesStr
      .split(/[-,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveHeader(
      {
        ...headerData,
        companyLogoText: companyLogoText.trim() || 'PARADISE',
        companySubtext: companySubtext.trim() || 'Artificial Intelligence',
        title: title.trim() || 'جدول الأسبوع لمهام الفريق',
        subtitle: subtitle.trim() || 'جدول المتابعة اليومية',
        coreValues: coreValuesArray.length > 0 ? coreValuesArray : ['التزام', 'أداء', 'تنسيق', 'تركيز'],
        logoUrl: logoUrl.trim() || undefined,
        logoType: logoUrl ? 'image' : 'icon',
        startDate: sundayDate,
      },
      sundayDate || undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-['Cairo']">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/60 text-right max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white font-['Tajawal']">
                إعدادات اللوحة واللوجو والتواريخ
              </h3>
              <p className="text-xs text-slate-400">
                تحديد شعار المؤسسة وتخصيص تواريخ الأسبوع من الأحد إلى الخميس
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
          
          {/* SECTION 1: DATES (SUNDAY TO THURSDAY) */}
          <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
            <label className="block text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>تحديد تواريخ الأسبوع (من الأحد إلى الخميس)</span>
            </label>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                اختر تاريخ بدء الأسبوع (يوم الأحد):
              </label>
              <input
                type="date"
                value={sundayDate}
                onChange={(e) => handleSundayDateChange(e.target.value)}
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">اختيارات سريعة:</span>
              <button
                type="button"
                onClick={() => handleQuickSundayPreset(0)}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-[10px] font-bold"
              >
                الأسبوع الحالي
              </button>
              <button
                type="button"
                onClick={() => handleQuickSundayPreset(1)}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-[10px] font-bold"
              >
                الأسبوع القادم
              </button>
              <button
                type="button"
                onClick={() => handleQuickSundayPreset(-1)}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-bold"
              >
                الأسبوع السابق
              </button>
            </div>

            {/* Subtitle / Date range text */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                نص فترة الأسبوع المعروض بأعلى اللوحة:
              </label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="مثال: من الأحد 19 يوليو 2026 إلى الخميس 23 يوليو 2026"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* SECTION 2: COMPANY LOGO */}
          <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
            <label className="block text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-cyan-400" />
              <span>لوجو / شعار الشركة في النظام</span>
            </label>

            {/* Logo Preview */}
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <div className="relative w-16 h-16 rounded-xl border border-cyan-500/40 bg-slate-900 overflow-hidden flex items-center justify-center p-1 shrink-0">
                  <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain rounded" />
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="absolute top-0.5 right-0.5 p-0.5 rounded-md bg-rose-950/80 text-rose-300 hover:bg-rose-900"
                    title="إزالة اللوجو"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border border-dashed border-slate-700 bg-slate-900 flex flex-col items-center justify-center text-slate-500 text-[10px] shrink-0">
                  <Sparkles className="w-5 h-5 text-cyan-400 mb-0.5" />
                  <span>شعار افتراضي</span>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    رفع صورة اللوجو من جهازك:
                  </label>
                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs font-bold cursor-pointer transition-colors inline-block">
                    <Upload className="w-3.5 h-3.5 inline" />
                    <span>اختر صورة اللوجو...</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoFileUpload}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">
                    أو ادخل رابط الصورة مباشر (URL):
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-[11px] focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Logo text & subtext */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  اسم الشعار المصاحب
                </label>
                <input
                  type="text"
                  value={companyLogoText}
                  onChange={(e) => setCompanyLogoText(e.target.value)}
                  placeholder="PARADISE"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  الوصف الفرعي للشعار
                </label>
                <input
                  type="text"
                  value={companySubtext}
                  onChange={(e) => setCompanySubtext(e.target.value)}
                  placeholder="Artificial Intelligence"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: BOARD TITLE & VALUES */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                عنوان اللوحة الرئيسي
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: جدول الأسبوع لمهام فريق الاستشاريين"
                className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-white text-xs md:text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>قيم وأهداف الفريق (مفصولة بـ - أو comma)</span>
              </label>
              <input
                type="text"
                value={coreValuesStr}
                onChange={(e) => setCoreValuesStr(e.target.value)}
                placeholder="التزام - أداء - تنسيق - تركيز"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
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
              <span>تحديث وتطبيق الإعدادات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
