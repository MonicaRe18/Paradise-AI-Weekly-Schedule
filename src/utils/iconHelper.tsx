import React from 'react';
import {
  Users,
  Calendar,
  BarChart3,
  Shield,
  CheckSquare,
  Search,
  ClipboardList,
  Box,
  Presentation,
  Inbox,
  Settings,
  Truck,
  ListTodo,
  FileCheck,
  Award,
  HeartHandshake,
  TrendingUp,
  Monitor,
  CheckCircle2,
  Briefcase,
  PhoneCall,
  FileText,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { TaskIcon, TaskStatus } from '../types';

export const renderTaskIcon = (icon: TaskIcon, className: string = 'w-4 h-4') => {
  switch (icon) {
    case 'users':
      return <Users className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'chart':
      return <BarChart3 className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'checkSquare':
      return <CheckSquare className={className} />;
    case 'search':
      return <Search className={className} />;
    case 'clipboard':
      return <ClipboardList className={className} />;
    case 'box':
      return <Box className={className} />;
    case 'presentation':
      return <Presentation className={className} />;
    case 'inbox':
      return <Inbox className={className} />;
    case 'settings':
      return <Settings className={className} />;
    case 'truck':
      return <Truck className={className} />;
    case 'listTodo':
      return <ListTodo className={className} />;
    case 'fileCheck':
      return <FileCheck className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'heartHandshake':
      return <HeartHandshake className={className} />;
    case 'trendingUp':
      return <TrendingUp className={className} />;
    case 'monitor':
      return <Monitor className={className} />;
    case 'checkCircle':
      return <CheckCircle2 className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'phone':
      return <PhoneCall className={className} />;
    case 'fileText':
      return <FileText className={className} />;
    default:
      return <ClipboardList className={className} />;
  }
};

export const getStatusConfig = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return {
        label: 'مكتمل',
        bgColor: 'bg-emerald-500/15',
        borderColor: 'border-emerald-500/40',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        dotColor: 'bg-emerald-500',
      };
    case 'in_progress':
      return {
        label: 'قيد التنفيذ',
        bgColor: 'bg-amber-500/15',
        borderColor: 'border-amber-500/40',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
        dotColor: 'bg-amber-500',
      };
    case 'pending':
      return {
        label: 'لم يبدأ',
        bgColor: 'bg-cyan-950/40',
        borderColor: 'border-cyan-500/20',
        textColor: 'text-slate-300',
        badgeBg: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
        icon: <AlertCircle className="w-3.5 h-3.5 text-slate-400" />,
        dotColor: 'bg-slate-500',
      };
    case 'deferred':
      return {
        label: 'مؤجل',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        textColor: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
        dotColor: 'bg-rose-500',
      };
    default:
      return {
        label: 'غير محدد',
        bgColor: 'bg-slate-800/40',
        borderColor: 'border-slate-700',
        textColor: 'text-slate-400',
        badgeBg: 'bg-slate-800 text-slate-400',
        icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />,
        dotColor: 'bg-slate-600',
      };
  }
};

export const AVAILABLE_ICONS: { id: TaskIcon; labelAr: string }[] = [
  { id: 'clipboard', labelAr: 'ملاحظة / تعقيب' },
  { id: 'users', labelAr: 'اجتماع / فريق' },
  { id: 'calendar', labelAr: 'جدول / المواعيد' },
  { id: 'chart', labelAr: 'تقرير / تحليلات' },
  { id: 'shield', labelAr: 'إشراف / أمان' },
  { id: 'checkSquare', labelAr: 'مهام / تاسكات' },
  { id: 'search', labelAr: 'مراجعة / فحص' },
  { id: 'box', labelAr: 'مخازن / تعاقدات' },
  { id: 'presentation', labelAr: 'عرض تقديمي' },
  { id: 'inbox', labelAr: 'صادر ووارد' },
  { id: 'settings', labelAr: 'إعدادات / موديول' },
  { id: 'truck', labelAr: 'نقل / لوجستيات' },
  { id: 'listTodo', labelAr: 'قائمة أعمال' },
  { id: 'fileCheck', labelAr: 'تسليم تسكات' },
  { id: 'award', labelAr: 'جودة / تدريب' },
  { id: 'heartHandshake', labelAr: 'دعم / تكافل' },
  { id: 'trendingUp', labelAr: 'متابعة تطوير' },
  { id: 'monitor', labelAr: 'نظام / بوابة' },
  { id: 'checkCircle', labelAr: 'اختبار منتهي' },
  { id: 'briefcase', labelAr: 'مشروع رئيسي' },
  { id: 'phone', labelAr: 'تواصل / واتساب' },
  { id: 'fileText', labelAr: 'مستندات CR' },
];
