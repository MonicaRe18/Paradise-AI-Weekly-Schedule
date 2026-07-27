import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_SCHEDULE_DATA } from './data/initialData';
import { ScheduleData, ViewMode, TaskStatus, DailyTask, TeamMember, ScheduleHeader, FooterNote, ArchivedWeek } from './types';
import { Header } from './components/Header';
import { ScheduleGrid } from './components/ScheduleGrid';
import { StatsBar } from './components/StatsBar';
import { FooterNotes } from './components/FooterNotes';
import { TaskModal } from './components/TaskModal';
import { MemberModal } from './components/MemberModal';
import { HeaderSettingsModal } from './components/HeaderSettingsModal';
import { TextEditModal } from './components/TextEditModal';
import { HistoryModal } from './components/HistoryModal';
import { TodayStandupView } from './components/TodayStandupView';
import { MemberSummaryView } from './components/MemberSummaryView';
import { LoginPage, UserSession } from './components/LoginPage';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { PdfReportPrintView } from './components/PdfReportPrintView';
import { generateSundayToThursdayDays } from './utils/dateUtils';
import {
  subscribeToSchedule,
  saveScheduleToFirestore,
  subscribeToPasswords,
  savePasswordsToFirestore,
  subscribeToHistory,
  saveArchivedWeekToFirestore,
  deleteArchivedWeekFromFirestore,
  resetScheduleInFirestore,
  DEFAULT_PASSWORDS,
} from './services/firestoreService';
// lucide-react icons can be removed if unused

const STORAGE_KEY = 'paradise_weekly_team_schedule_v1';
const HISTORY_STORAGE_KEY = 'paradise_schedule_history_v1';
const SESSION_STORAGE_KEY = 'paradise_schedule_user_session_v1';
const PASSWORDS_STORAGE_KEY = 'paradise_schedule_user_passwords_v1';

export default function App() {
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(true);

  // User Passwords State
  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse passwords from storage', e);
    }
    return DEFAULT_PASSWORDS;
  });

  const handleSavePassword = (targetKey: string, newPass: string) => {
    updateAndSyncPasswords((prev) => ({ ...prev, [targetKey]: newPass }));
  };

  // User Auth Session State
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
    return null;
  });

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear user session', e);
    }
  };

  // Load initial schedule data from localStorage or default
  const [scheduleData, setScheduleData] = useState<ScheduleData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load schedule data from localStorage', e);
    }
    return INITIAL_SCHEDULE_DATA;
  });

  // Load archived history weeks from localStorage
  const [archivedWeeks, setArchivedWeeks] = useState<ArchivedWeek[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load history archive from localStorage', e);
    }
    return [];
  });

  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<TaskStatus | 'all'>('all');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalContext, setTaskModalContext] = useState<{
    memberId: string;
    dayKey: string;
    task?: DailyTask | null;
  } | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [isHeaderSettingsOpen, setIsHeaderSettingsOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Dedicated Text Editing Modal state (for ongoing follow-up or main tasks)
  const [textEditContext, setTextEditContext] = useState<{
    isOpen: boolean;
    memberId: string;
    memberName: string;
    field: 'ongoingFollowUp' | 'mainTasks';
    initialText: string;
  }>({
    isOpen: false,
    memberId: '',
    memberName: '',
    field: 'ongoingFollowUp',
    initialText: '',
  });

  const isInitialLoadedRef = useRef(false);
  const isSavingRef = useRef(false);
  const lastSaveTimeRef = useRef(0);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const scheduleDataRef = useRef(scheduleData);
  useEffect(() => {
    scheduleDataRef.current = scheduleData;
  }, [scheduleData]);

  const passwordsRef = useRef(passwords);
  useEffect(() => {
    passwordsRef.current = passwords;
  }, [passwords]);

  const isAnyModalOpen =
    isTaskModalOpen ||
    isMemberModalOpen ||
    isHeaderSettingsOpen ||
    isHistoryModalOpen ||
    isChangePasswordModalOpen ||
    textEditContext.isOpen;

  const isModalOpenRef = useRef(isAnyModalOpen);
  useEffect(() => {
    isModalOpenRef.current = isAnyModalOpen;
  }, [isAnyModalOpen]);

  // Sync helpers that save directly to Cloud Firestore & localStorage
  const updateAndSyncSchedule = (updater: ScheduleData | ((prev: ScheduleData) => ScheduleData)) => {
    setScheduleData((prev) => {
      const nextData = typeof updater === 'function' ? updater(prev) : updater;
      scheduleDataRef.current = nextData;
      saveScheduleToFirestore(nextData);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) {
        console.error('Failed to set localStorage schedule', e);
      }
      return nextData;
    });
  };

  const updateAndSyncPasswords = (updater: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
    const nextData = typeof updater === 'function' ? updater(passwordsRef.current) : updater;
    passwordsRef.current = nextData;
    setPasswords(nextData);
    try {
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(nextData));
    } catch (e) {
      console.error('Failed to set localStorage passwords', e);
    }
    savePasswordsToFirestore(nextData);
  };

  // Real-time Cloud Firestore Subscriptions for Live Sync Across Devices
  useEffect(() => {
    const unsubSchedule = subscribeToSchedule((remoteSchedule) => {
      setScheduleData(remoteSchedule);
      scheduleDataRef.current = remoteSchedule;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteSchedule));
      } catch (e) {
        console.error('Error caching schedule locally', e);
      }
    });

    const unsubPasswords = subscribeToPasswords((remotePasswords) => {
      setPasswords(remotePasswords);
      passwordsRef.current = remotePasswords;
      try {
        localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(remotePasswords));
      } catch (e) {
        console.error('Error caching passwords locally', e);
      }
    });

    const unsubHistory = subscribeToHistory((remoteHistory) => {
      setArchivedWeeks(remoteHistory);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(remoteHistory));
      } catch (e) {
        console.error('Error caching history locally', e);
      }
    });

    return () => {
      unsubSchedule();
      unsubPasswords();
      unsubHistory();
    };
  }, []);

  // Compute overall task counts
  let totalTaskCount = 0;
  let completedTaskCount = 0;

  scheduleData.teamMembers.forEach((member) => {
    scheduleData.days.forEach((day) => {
      const tasks = member.tasksByDay[day.key] || [];
      tasks.forEach((t) => {
        totalTaskCount++;
        if (t.status === 'completed') completedTaskCount++;
      });
    });
  });

  // --- Task Operations ---
  const handleOpenAddTask = (memberId: string, dayKey: string) => {
    setTaskModalContext({ memberId, dayKey, task: null });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (memberId: string, dayKey: string, task: DailyTask) => {
    setTaskModalContext({ memberId, dayKey, task });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskInput: Omit<DailyTask, 'id'> & { id?: string }) => {
    if (!taskModalContext) return;
    const { memberId, dayKey } = taskModalContext;

    updateAndSyncSchedule((prev) => {
      const updatedMembers = prev.teamMembers.map((m) => {
        if (m.id !== memberId) return m;

        const dayTasks = [...(m.tasksByDay[dayKey] || [])];

        if (taskInput.id) {
          // Edit existing
          const index = dayTasks.findIndex((t) => t.id === taskInput.id);
          if (index !== -1) {
            dayTasks[index] = {
              ...dayTasks[index],
              text: taskInput.text,
              categoryIcon: taskInput.categoryIcon,
              status: taskInput.status,
              note: taskInput.note,
              updatedAt: new Date().toISOString(),
            };
          }
        } else {
          // Create new
          const newTask: DailyTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            text: taskInput.text,
            categoryIcon: taskInput.categoryIcon,
            status: taskInput.status,
            note: taskInput.note,
            updatedAt: new Date().toISOString(),
          };
          dayTasks.push(newTask);
        }

        return {
          ...m,
          tasksByDay: {
            ...m.tasksByDay,
            [dayKey]: dayTasks,
          },
        };
      });

      return { ...prev, teamMembers: updatedMembers };
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!taskModalContext) return;
    const { memberId, dayKey } = taskModalContext;

    updateAndSyncSchedule((prev) => {
      const updatedMembers = prev.teamMembers.map((m) => {
        if (m.id !== memberId) return m;

        const dayTasks = (m.tasksByDay[dayKey] || []).filter((t) => t.id !== taskId);

        return {
          ...m,
          tasksByDay: {
            ...m.tasksByDay,
            [dayKey]: dayTasks,
          },
        };
      });

      return { ...prev, teamMembers: updatedMembers };
    });
  };

  // Quick Status Toggle Cycle: pending -> in_progress -> completed -> deferred -> pending
  const handleQuickToggleStatus = (memberId: string, dayKey: string, taskId: string) => {
    updateAndSyncSchedule((prev) => {
      const updatedMembers = prev.teamMembers.map((m) => {
        if (m.id !== memberId) return m;

        const dayTasks = (m.tasksByDay[dayKey] || []).map((t) => {
          if (t.id !== taskId) return t;

          let nextStatus: TaskStatus = 'in_progress';
          if (t.status === 'pending') nextStatus = 'in_progress';
          else if (t.status === 'in_progress') nextStatus = 'completed';
          else if (t.status === 'completed') nextStatus = 'deferred';
          else if (t.status === 'deferred') nextStatus = 'pending';

          return { ...t, status: nextStatus, updatedAt: new Date().toISOString() };
        });

        return {
          ...m,
          tasksByDay: {
            ...m.tasksByDay,
            [dayKey]: dayTasks,
          },
        };
      });

      return { ...prev, teamMembers: updatedMembers };
    });
  };

  // --- Member Operations ---
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (
    memberInput: Omit<TeamMember, 'id' | 'tasksByDay'> & { id?: string }
  ) => {
    updateAndSyncSchedule((prev) => {
      let updatedMembers = [...prev.teamMembers];

      if (memberInput.id) {
        // Edit existing member
        updatedMembers = updatedMembers.map((m) => {
          if (m.id !== memberInput.id) return m;
          return {
            ...m,
            name: memberInput.name,
            roleTitle: memberInput.roleTitle,
            avatarColor: memberInput.avatarColor,
            mainTasks: memberInput.mainTasks,
            ongoingFollowUp: memberInput.ongoingFollowUp,
            indexNumber: memberInput.indexNumber,
          };
        });
      } else {
        // Create new member
        const newMember: TeamMember = {
          id: `member-${Date.now()}`,
          indexNumber: memberInput.indexNumber,
          name: memberInput.name,
          roleTitle: memberInput.roleTitle,
          avatarColor: memberInput.avatarColor,
          mainTasks: memberInput.mainTasks,
          ongoingFollowUp: memberInput.ongoingFollowUp,
          tasksByDay: {
            sun: [],
            mon: [],
            tue: [],
            wed: [],
            thu: [],
          },
        };
        updatedMembers.push(newMember);
      }

      return { ...prev, teamMembers: updatedMembers };
    });
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذا العضو وجدول مهامه؟')) {
      updateAndSyncSchedule((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((m) => m.id !== memberId),
      }));
    }
  };

  // --- Dedicated Text Editing for Ongoing Follow-up & Main Tasks ---
  const handleOpenEditOngoingFollowUp = (memberId: string, currentText: string) => {
    const member = scheduleData.teamMembers.find((m) => m.id === memberId);
    setTextEditContext({
      isOpen: true,
      memberId,
      memberName: member?.name || '',
      field: 'ongoingFollowUp',
      initialText: currentText || '',
    });
  };

  const handleOpenEditMainTasks = (memberId: string, currentText: string) => {
    const member = scheduleData.teamMembers.find((m) => m.id === memberId);
    setTextEditContext({
      isOpen: true,
      memberId,
      memberName: member?.name || '',
      field: 'mainTasks',
      initialText: currentText || '',
    });
  };

  const handleSaveTextEdit = (
    memberId: string,
    field: 'ongoingFollowUp' | 'mainTasks',
    newText: string
  ) => {
    updateAndSyncSchedule((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) =>
        m.id === memberId ? { ...m, [field]: newText } : m
      ),
    }));
  };

  // --- Header & Date Range Operations ---
  const handleSaveHeader = (newHeader: ScheduleHeader, updatedSundayDate?: string) => {
    updateAndSyncSchedule((prev) => {
      let days = prev.days;
      let subtitle = newHeader.subtitle;

      if (updatedSundayDate) {
        const generated = generateSundayToThursdayDays(updatedSundayDate);
        days = generated.days;
        if (!newHeader.subtitle || newHeader.subtitle.startsWith('من الأحد')) {
          subtitle = generated.subtitle;
        }
      }

      return {
        ...prev,
        header: {
          ...newHeader,
          subtitle,
        },
        days,
      };
    });
  };

  const handleUpdateNotes = (newNotes: FooterNote[]) => {
    updateAndSyncSchedule((prev) => ({ ...prev, footerNotes: newNotes }));
  };

  // --- History & Archive Operations ---
  const handleSaveCurrentWeekToHistory = (customTitle?: string) => {
    const newArchiveItem: ArchivedWeek = {
      id: `archive-${Date.now()}`,
      title: customTitle || scheduleData.header.subtitle || 'أسبوع جديد',
      startDate: scheduleData.header.startDate || scheduleData.days[0]?.fullDate || '',
      endDate: scheduleData.header.endDate || scheduleData.days[4]?.fullDate || '',
      subtitle: scheduleData.header.subtitle,
      archivedAt: new Date().toISOString(),
      totalTasks: totalTaskCount,
      completedTasks: completedTaskCount,
      memberCount: scheduleData.teamMembers.length,
      data: JSON.parse(JSON.stringify(scheduleData)),
    };

    saveArchivedWeekToFirestore(newArchiveItem);
    alert('تم حفظ الأسبوع الحالي في الأرشيف وقاعدة البيانات السحابية Live Firestore بنجاح!');
  };

  const handleLoadArchivedWeek = (week: ArchivedWeek) => {
    updateAndSyncSchedule(week.data);
  };

  const handleDeleteArchivedWeek = (weekId: string) => {
    deleteArchivedWeekFromFirestore(weekId);
  };

  const handleStartNewWeek = (startDateSunday: string, keepMembers: boolean) => {
    // Optionally auto-archive current week before resetting if it has tasks
    if (totalTaskCount > 0) {
      handleSaveCurrentWeekToHistory();
    }

    const { days, subtitle, startDateISO, endDateISO } = generateSundayToThursdayDays(startDateSunday);

    updateAndSyncSchedule((prev) => {
      const newMembers: TeamMember[] = keepMembers
        ? prev.teamMembers.map((m) => ({
            ...m,
            tasksByDay: {
              sun: [],
              mon: [],
              tue: [],
              wed: [],
              thu: [],
            },
          }))
        : [];

      return {
        ...prev,
        header: {
          ...prev.header,
          subtitle,
          startDate: startDateISO,
          endDate: endDateISO,
        },
        days,
        teamMembers: newMembers,
      };
    });

    alert('تم إنشاء وتجهيز الأسبوع الجديد بنجاح!');
  };

  // --- Data Export / Import / Reset ---
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scheduleData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `paradise_team_schedule_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.teamMembers && parsed.header) {
            updateAndSyncSchedule(parsed);
            alert('تم استيراد جدول الفريق بنجاح!');
          } else {
            alert('صيغة ملف JSON غير صالحة لجدول المهام.');
          }
        } catch (error) {
          alert('تعذر قراءة ملف JSON.');
        }
      };
    }
  };

  const handleResetData = async () => {
    if (confirm('هل ترغب في إعادة ضبط البيانات إلى النموذج الأصلي (جدول فريق الاستشاريين)؟')) {
      await resetScheduleInFirestore();
      updateAndSyncSchedule(INITIAL_SCHEDULE_DATA);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute visible team members according to user session (Employee sees ONLY themselves)
  const userScopedTeamMembers = userSession?.role === 'employee'
    ? scheduleData.teamMembers.filter((m) => m.id === userSession.memberId)
    : scheduleData.teamMembers;

  // Filter team members based on status filter
  const filteredTeamMembers = userScopedTeamMembers.map((member) => {
    if (selectedStatusFilter === 'all') return member;

    const filteredTasksByDay: Record<string, DailyTask[]> = {};
    scheduleData.days.forEach((day) => {
      const tasks = member.tasksByDay[day.key] || [];
      filteredTasksByDay[day.key] = tasks.filter((t) => t.status === selectedStatusFilter);
    });

    return { ...member, tasksByDay: filteredTasksByDay };
  });

  const selectedMemberName = taskModalContext
    ? scheduleData.teamMembers.find((m) => m.id === taskModalContext.memberId)?.name
    : undefined;

  const selectedDayLabel = taskModalContext
    ? scheduleData.days.find((d) => d.key === taskModalContext.dayKey)?.labelAr
    : undefined;

  // Render Login Page if user is not authenticated
  if (!userSession) {
    return (
      <>
        <LoginPage
          teamMembers={scheduleData.teamMembers}
          headerData={scheduleData.header}
          passwords={passwords}
          onLoginSuccess={handleLoginSuccess}
          onOpenChangePasswordModal={() => setIsChangePasswordModalOpen(true)}
        />
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          userSession={userSession}
          teamMembers={scheduleData.teamMembers}
          passwords={passwords}
          onSavePassword={handleSavePassword}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 p-3 sm:p-6 md:p-8 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-[1600px] mx-auto">
        

        {/* Main Header Component */}
        <Header
          headerData={scheduleData.header}
          viewMode={viewMode}
          userSession={userSession}
          onLogout={handleLogout}
          onOpenChangePasswordModal={() => setIsChangePasswordModalOpen(true)}
          onViewChange={setViewMode}
          onOpenHeaderSettings={() => setIsHeaderSettingsOpen(true)}
          onOpenAddMemberModal={handleOpenAddMember}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          archivedWeeksCount={archivedWeeks.length}
          onResetData={handleResetData}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          onPrint={handlePrint}
          totalTasks={totalTaskCount}
          completedTasks={completedTaskCount}
        />

        {/* Dedicated PDF Report Print View (visible ONLY during print/PDF export) */}
        <PdfReportPrintView
          headerData={scheduleData.header}
          teamMembers={userScopedTeamMembers}
          days={scheduleData.days}
        />

        {/* View Switcher Container */}
        <main className="space-y-6">
          {viewMode === 'board' && (
            <>
              <ScheduleGrid
                days={scheduleData.days}
                teamMembers={filteredTeamMembers}
                userSession={userSession}
                onAddTask={handleOpenAddTask}
                onEditTask={handleOpenEditTask}
                onQuickToggleStatus={handleQuickToggleStatus}
                onEditMember={handleOpenEditMember}
                onDeleteMember={handleDeleteMember}
                onEditOngoingFollowUp={handleOpenEditOngoingFollowUp}
                onEditMainTasks={handleOpenEditMainTasks}
              />

              <StatsBar
                days={scheduleData.days}
                teamMembers={userScopedTeamMembers}
                selectedStatusFilter={selectedStatusFilter}
                onStatusFilterChange={setSelectedStatusFilter}
              />
            </>
          )}

          {viewMode === 'standup' && (
            <TodayStandupView
              days={scheduleData.days}
              teamMembers={userScopedTeamMembers}
              onQuickToggleStatus={handleQuickToggleStatus}
              onAddTask={handleOpenAddTask}
            />
          )}

          {viewMode === 'members' && (
            <MemberSummaryView
              days={scheduleData.days}
              teamMembers={userScopedTeamMembers}
              onEditMember={handleOpenEditMember}
              onAddTask={handleOpenAddTask}
              onQuickToggleStatus={handleQuickToggleStatus}
            />
          )}

          {viewMode === 'stats' && (
            <div className="space-y-6">
              <StatsBar
                days={scheduleData.days}
                teamMembers={userScopedTeamMembers}
                selectedStatusFilter={selectedStatusFilter}
                onStatusFilterChange={setSelectedStatusFilter}
              />

              <ScheduleGrid
                days={scheduleData.days}
                teamMembers={filteredTeamMembers}
                userSession={userSession}
                onAddTask={handleOpenAddTask}
                onEditTask={handleOpenEditTask}
                onQuickToggleStatus={handleQuickToggleStatus}
                onEditMember={handleOpenEditMember}
                onDeleteMember={handleDeleteMember}
                onEditOngoingFollowUp={handleOpenEditOngoingFollowUp}
                onEditMainTasks={handleOpenEditMainTasks}
              />
            </div>
          )}

          {/* Footer Notices */}
          <FooterNotes
            notes={scheduleData.footerNotes}
            onUpdateNotes={handleUpdateNotes}
          />
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={taskModalContext?.task}
        dayLabel={selectedDayLabel}
        memberName={selectedMemberName}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
        onDelete={handleDeleteMember}
        initialMember={editingMember}
        nextIndexNumber={scheduleData.teamMembers.length + 1}
      />

      <HeaderSettingsModal
        isOpen={isHeaderSettingsOpen}
        onClose={() => setIsHeaderSettingsOpen(false)}
        headerData={scheduleData.header}
        onSaveHeader={handleSaveHeader}
      />

      {/* Dedicated Ongoing Follow-up & Main Tasks Editor Modal */}
      <TextEditModal
        isOpen={textEditContext.isOpen}
        onClose={() => setTextEditContext((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveTextEdit}
        memberId={textEditContext.memberId}
        memberName={textEditContext.memberName}
        field={textEditContext.field}
        initialText={textEditContext.initialText}
      />

      {/* History Archive Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        archivedWeeks={archivedWeeks}
        onSaveCurrentWeekToHistory={handleSaveCurrentWeekToHistory}
        onLoadArchivedWeek={handleLoadArchivedWeek}
        onDeleteArchivedWeek={handleDeleteArchivedWeek}
        onStartNewWeek={handleStartNewWeek}
        currentScheduleData={scheduleData}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        userSession={userSession}
        teamMembers={scheduleData.teamMembers}
        passwords={passwords}
        onSavePassword={handleSavePassword}
      />
    </div>
  );
}
