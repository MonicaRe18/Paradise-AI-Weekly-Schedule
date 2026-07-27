import { DayConfig } from '../types';

/**
 * Returns formatted Arabic month names
 */
const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

/**
 * Get nearest Sunday for a given date (or date string)
 */
export function getNearestSunday(dateInput?: Date | string): Date {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return new Date();
  
  const day = date.getDay(); // 0 is Sunday
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  return sunday;
}

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format date for table column (e.g. "19-7")
 */
export function formatDateShort(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}-${month}`;
}

/**
 * Format full date in Arabic (e.g. "19 يوليو 2026")
 */
export function formatDateArabic(date: Date): string {
  const day = date.getDate();
  const monthName = ARABIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

/**
 * Generate 5 working days configs starting from Sunday to Thursday
 */
export function generateSundayToThursdayDays(sundayDateInput: Date | string): {
  days: DayConfig[];
  subtitle: string;
  startDateISO: string;
  endDateISO: string;
} {
  const sunday = new Date(sundayDateInput);
  if (isNaN(sunday.getTime())) {
    return generateSundayToThursdayDays(new Date());
  }

  const dayKeys: { key: string; labelAr: string }[] = [
    { key: 'sun', labelAr: 'الأحد' },
    { key: 'mon', labelAr: 'الاثنين' },
    { key: 'tue', labelAr: 'الثلاثاء' },
    { key: 'wed', labelAr: 'الأربعاء' },
    { key: 'thu', labelAr: 'الخميس' },
  ];

  const days: DayConfig[] = dayKeys.map((dayDef, index) => {
    const current = new Date(sunday);
    current.setDate(sunday.getDate() + index);

    return {
      key: dayDef.key,
      labelAr: dayDef.labelAr,
      dateLabel: formatDateShort(current),
      fullDate: formatDateISO(current),
    };
  });

  const thursday = new Date(sunday);
  thursday.setDate(sunday.getDate() + 4);

  const subtitle = `من الأحد ${formatDateArabic(sunday)} إلى الخميس ${formatDateArabic(thursday)}`;

  return {
    days,
    subtitle,
    startDateISO: formatDateISO(sunday),
    endDateISO: formatDateISO(thursday),
  };
}
