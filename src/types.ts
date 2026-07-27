export type TaskStatus = 'completed' | 'in_progress' | 'pending' | 'deferred';

export type TaskIcon = 
  | 'users'
  | 'calendar'
  | 'chart'
  | 'shield'
  | 'checkSquare'
  | 'search'
  | 'clipboard'
  | 'box'
  | 'presentation'
  | 'inbox'
  | 'settings'
  | 'truck'
  | 'listTodo'
  | 'fileCheck'
  | 'award'
  | 'heartHandshake'
  | 'trendingUp'
  | 'monitor'
  | 'checkCircle'
  | 'briefcase'
  | 'phone'
  | 'fileText';

export interface DailyTask {
  id: string;
  text: string;
  categoryIcon: TaskIcon;
  status: TaskStatus;
  note?: string;
  updatedAt?: string;
}

export interface DayConfig {
  key: string; // e.g. 'sun', 'mon', 'tue', 'wed', 'thu'
  labelAr: string; // e.g. 'الأحد', 'الاثنين'
  dateLabel: string; // e.g. '19-7'
  fullDate: string; // e.g. '2026-07-19'
}

export interface TeamMember {
  id: string;
  indexNumber: number;
  name: string;
  roleTitle?: string;
  avatarColor: string; // e.g. 'cyan', 'purple', 'green', 'amber', 'teal', 'blue', 'pink'
  mainTasks: string; // المهام الرئيسية
  ongoingFollowUp: string; // المتابعة المستمرة
  tasksByDay: Record<string, DailyTask[]>; // key is dayConfig.key (e.g. 'sun')
}

export interface ScheduleHeader {
  companyLogoText: string;
  companySubtext: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  coreValues: string[];
  logoUrl?: string;
  logoType?: 'image' | 'icon';
}

export interface FooterNote {
  id: string;
  text: string;
  iconType: 'info' | 'whatsapp';
}

export interface ScheduleData {
  header: ScheduleHeader;
  days: DayConfig[];
  teamMembers: TeamMember[];
  footerNotes: FooterNote[];
}

export interface ArchivedWeek {
  id: string;
  title: string;
  startDate: string; // e.g. "2026-07-19"
  endDate: string; // e.g. "2026-07-23"
  subtitle: string;
  archivedAt: string;
  totalTasks: number;
  completedTasks: number;
  memberCount: number;
  data: ScheduleData;
}

export type ViewMode = 'board' | 'standup' | 'members' | 'stats';
