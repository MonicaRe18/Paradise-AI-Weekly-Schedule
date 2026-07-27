import { ScheduleData } from '../types';

export const INITIAL_SCHEDULE_DATA: ScheduleData = {
  header: {
    companyLogoText: 'PARADISE',
    companySubtext: 'Artificial Intelligence',
    title: 'جدول الأسبوع لمهام فريق الاستشاريين',
    subtitle: 'من الأحد 19 يوليو 2026 إلى الخميس 23 يوليو 2026',
    startDate: '2026-07-19',
    endDate: '2026-07-23',
    coreValues: ['التزام', 'أداء', 'تنسيق', 'تركيز'],
  },
  days: [
    { key: 'sun', labelAr: 'الأحد', dateLabel: '19-7', fullDate: '2026-07-19' },
    { key: 'mon', labelAr: 'الاثنين', dateLabel: '20-7', fullDate: '2026-07-20' },
    { key: 'tue', labelAr: 'الثلاثاء', dateLabel: '21-7', fullDate: '2026-07-21' },
    { key: 'wed', labelAr: 'الأربعاء', dateLabel: '22-7', fullDate: '2026-07-22' },
    { key: 'thu', labelAr: 'الخميس', dateLabel: '23-7', fullDate: '2026-07-23' },
  ],
  footerNotes: [
    {
      id: 'fn-1',
      iconType: 'info',
      text: 'على أن يتم تحديث هذا الجدول في حالة حدوث أي تطورات أو مهام جديدة تُسند للفريق.',
    },
    {
      id: 'fn-2',
      iconType: 'whatsapp',
      text: 'يلتزم كل عضو في الفريق بتقديم تقرير بالعمل اليومي، سواء عبر الواتساب أو من خلال التواصل تلفونياً، لعرضه ضمن المتابعة اليومية.',
    },
  ],
  teamMembers: [
    {
      id: 'm1',
      indexNumber: 1,
      name: 'محمد يحي',
      roleTitle: 'استشاري رئيسي',
      avatarColor: '#0ea5e9', // cyan
      mainTasks: 'متابعة وإشراف على جميع مهام الفريق خلال أيام الأسبوع',
      ongoingFollowUp: 'متابعة يومية لأعمال الفريق',
      tasksByDay: {
        sun: [
          {
            id: 'm1-sun-1',
            text: 'متابعة وإشراف على جميع مهام الفريق',
            categoryIcon: 'users',
            status: 'completed',
          },
        ],
        mon: [
          {
            id: 'm1-mon-1',
            text: 'عرض الجمارك للجهاز التنفيذي',
            categoryIcon: 'chart',
            status: 'completed',
          },
        ],
        tue: [
          {
            id: 'm1-tue-1',
            text: 'حضور سيناريو وزارة التضامن',
            categoryIcon: 'users',
            status: 'in_progress',
          },
        ],
        wed: [
          {
            id: 'm1-wed-1',
            text: 'متابعة وإشراف على جميع مهام الفريق',
            categoryIcon: 'shield',
            status: 'in_progress',
          },
        ],
        thu: [
          {
            id: 'm1-thu-1',
            text: 'متابعة وإشراف على جميع مهام الفريق',
            categoryIcon: 'checkSquare',
            status: 'pending',
          },
        ],
      },
    },
    {
      id: 'm2',
      indexNumber: 2,
      name: 'مونيكا ريمون',
      roleTitle: 'منسق عام',
      avatarColor: '#a855f7', // purple
      mainTasks: 'متابعة ودعم الفريق مع تنسيق جميع الاجتماعات اليومية خلال أيام الأسبوع',
      ongoingFollowUp: 'متابعة يومية ودعم الفريق',
      tasksByDay: {
        sun: [
          {
            id: 'm2-sun-1',
            text: 'تنسيق الاجتماعات + دعم الفريق',
            categoryIcon: 'calendar',
            status: 'completed',
          },
        ],
        mon: [
          {
            id: 'm2-mon-1',
            text: 'عرض الجمارك للجهاز التنفيذي',
            categoryIcon: 'chart',
            status: 'completed',
          },
        ],
        tue: [
          {
            id: 'm2-tue-1',
            text: 'حضور سيناريو وزارة التضامن',
            categoryIcon: 'users',
            status: 'in_progress',
          },
        ],
        wed: [
          {
            id: 'm2-wed-1',
            text: 'تنسيق الاجتماعات + دعم الفريق',
            categoryIcon: 'calendar',
            status: 'in_progress',
          },
        ],
        thu: [
          {
            id: 'm2-thu-1',
            text: 'تنسيق الاجتماعات + دعم الفريق',
            categoryIcon: 'calendar',
            status: 'pending',
          },
        ],
      },
    },
    {
      id: 'm3',
      indexNumber: 3,
      name: 'مصطفى أشرف',
      roleTitle: 'إدارة المشاريع',
      avatarColor: '#22c55e', // green
      mainTasks: 'متابعة جميع التاسكات بإدارة المشاريع قيد التطوير',
      ongoingFollowUp: 'متابعة مستمرة لتاسكات إدارة المشاريع',
      tasksByDay: {
        sun: [
          {
            id: 'm3-sun-1',
            text: 'تحليل مقترح المشروعات للتضامن الاجتماعي',
            categoryIcon: 'search',
            status: 'completed',
          },
        ],
        mon: [
          {
            id: 'm3-mon-1',
            text: 'متابعة تاسكات إدارة المشاريع',
            categoryIcon: 'checkSquare',
            status: 'completed',
          },
        ],
        tue: [
          {
            id: 'm3-tue-1',
            text: 'تقديم تقرير الرد على المقترح بما يتناسب مع النظام',
            categoryIcon: 'chart',
            status: 'in_progress',
          },
        ],
        wed: [
          {
            id: 'm3-wed-1',
            text: 'متابعة تاسكات إدارة المشاريع',
            categoryIcon: 'checkSquare',
            status: 'in_progress',
          },
        ],
        thu: [
          {
            id: 'm3-thu-1',
            text: 'متابعة تاسكات إدارة المشاريع',
            categoryIcon: 'checkSquare',
            status: 'pending',
          },
        ],
      },
    },
    {
      id: 'm4',
      indexNumber: 4,
      name: 'محفوظ صبري',
      roleTitle: 'التعاقدات والمخازن',
      avatarColor: '#eab308', // amber
      mainTasks: 'متابعة تاسكات التعاقدات والمخازن التي بالتطوير',
      ongoingFollowUp: 'متابعة التعاقدات والمخازن',
      tasksByDay: {
        sun: [
          {
            id: 'm4-sun-1',
            text: 'إعداد سيناريو للتضامن وعرضه بالشركة',
            categoryIcon: 'clipboard',
            status: 'completed',
          },
        ],
        mon: [
          {
            id: 'm4-mon-1',
            text: 'متابعة تاسكات التعاقدات والمخازن',
            categoryIcon: 'box',
            status: 'completed',
          },
        ],
        tue: [
          {
            id: 'm4-tue-1',
            text: 'عرض السيناريو كامل في وزارة التضامن',
            categoryIcon: 'presentation',
            status: 'in_progress',
          },
        ],
        wed: [
          {
            id: 'm4-wed-1',
            text: 'متابعة تاسكات التعاقدات والمخازن',
            categoryIcon: 'box',
            status: 'in_progress',
          },
        ],
        thu: [
          {
            id: 'm4-thu-1',
            text: 'متابعة تاسكات التعاقدات والمخازن',
            categoryIcon: 'box',
            status: 'pending',
          },
        ],
      },
    },
    {
      id: 'm5',
      indexNumber: 5,
      name: 'شهاب خالد',
      roleTitle: 'استشاري أنظمة وموديولات',
      avatarColor: '#14b8a6', // teal
      mainTasks: 'استلام جميع CR الخاصة بموديول النقل الميكانيكي، ومن يوم الاثنين استلام موديول الصادر والوارد والشئون القانونية والمكتب الفني والمكتب الاستشاري في الجهاز التنفيذي والعمل عليهم',
      ongoingFollowUp: 'متابعة النقل الميكانيكي والموديولات المستلمة',
      tasksByDay: {
        sun: [
          {
            id: 'm5-sun-1',
            text: 'عرض سيناريو كامل للنقل الميكانيكي + استلام CR الخاصة بالموديول',
            categoryIcon: 'fileText',
            status: 'completed',
          },
        ],
        mon: [
          {
            id: 'm5-mon-1',
            text: 'استلام موديول الصادر والوارد والشئون القانونية والمكتب الفني والمكتب الاستشاري',
            categoryIcon: 'inbox',
            status: 'completed',
          },
        ],
        tue: [
          {
            id: 'm5-tue-1',
            text: 'العمل على الموديولات المستلمة',
            categoryIcon: 'settings',
            status: 'in_progress',
          },
        ],
        wed: [
          {
            id: 'm5-wed-1',
            text: 'متابعة العمل على الموديولات',
            categoryIcon: 'settings',
            status: 'in_progress',
          },
        ],
        thu: [
          {
            id: 'm5-thu-1',
            text: 'متابعة العمل على الموديولات',
            categoryIcon: 'settings',
            status: 'pending',
          },
        ],
      },
    },
    {
      id: 'm6',
      indexNumber: 6,
      name: 'محمد سيد',
      roleTitle: 'جودة وتقارير',
      avatarColor: '#3b82f6', // blue
      mainTasks: 'تسليم CR التقارير المستلمة للأسبوع الماضي، مراجعة جميع التقارير المنتهية في النظام وحالتها وتقديم تقرير بها، تقديم تقرير نتيجة تيست موديول التدريب، واستلام كدعم لموديول صندوق التكافل بالجهاز التنفيذي',
      ongoingFollowUp: 'متابعة التقارير ودعم صندوق التكافل',
      tasksByDay: {
        sun: [
          {
            id: 'm6-sun-1',
            text: 'تجهيز ومراجعة الأعمال المطلوبة',
            categoryIcon: 'listTodo',
            status: 'completed',
          },
        ],
        mon: [
          {
            id: 'm6-mon-1',
            text: 'تسليم CR التقارير المستلمة للأسبوع الماضي',
            categoryIcon: 'fileCheck',
            status: 'completed',
          },
        ],
        tue: [
          {
            id: 'm6-tue-1',
            text: 'تقديم تقرير نتيجة تيست موديول التدريب',
            categoryIcon: 'award',
            status: 'in_progress',
          },
        ],
        wed: [
          {
            id: 'm6-wed-1',
            text: 'مراجعة جميع التقارير المنتهية في النظام وحالتها',
            categoryIcon: 'search',
            status: 'in_progress',
          },
        ],
        thu: [
          {
            id: 'm6-thu-1',
            text: 'تقديم تقرير حالة التقارير + دعم موديول صندوق التكافل',
            categoryIcon: 'heartHandshake',
            status: 'pending',
          },
        ],
      },
    },
    {
      id: 'm7',
      indexNumber: 7,
      name: 'رانيا مدحت',
      roleTitle: 'اختبارات وجودة',
      avatarColor: '#ec4899', // pink
      mainTasks: 'متابعة جميع التاسكات المنتهية بالوادي الجديد واختبارها خلال الأسبوع',
      ongoingFollowUp: 'متابعة واختبار مستمر لتاسكات الوادي الجديد',
      tasksByDay: {
        sun: [
          {
            id: 'm7-sun-1',
            text: 'عمل شيت اللوح الخاص بالبوابة',
            categoryIcon: 'monitor',
            status: 'completed',
          },
        ],
        mon: [
          {
            id: 'm7-mon-1',
            text: 'متابعة واختبار التاسكات المنتهية بالوادي الجديد',
            categoryIcon: 'checkCircle',
            status: 'completed',
          },
        ],
        tue: [
          {
            id: 'm7-tue-1',
            text: 'متابعة واختبار التاسكات المنتهية بالوادي الجديد',
            categoryIcon: 'checkCircle',
            status: 'in_progress',
          },
        ],
        wed: [
          {
            id: 'm7-wed-1',
            text: 'متابعة واختبار التاسكات المنتهية بالوادي الجديد',
            categoryIcon: 'checkCircle',
            status: 'in_progress',
          },
        ],
        thu: [
          {
            id: 'm7-thu-1',
            text: 'متابعة واختبار التاسكات المنتهية بالوادي الجديد',
            categoryIcon: 'checkCircle',
            status: 'pending',
          },
        ],
      },
    },
  ],
};
