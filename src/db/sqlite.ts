import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { ScheduleData, ScheduleHeader, DayConfig, TeamMember, DailyTask, FooterNote, ArchivedWeek } from '../types.js';
import { INITIAL_SCHEDULE_DATA } from '../data/initialData.js';

let db: Database | null = null;
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'schedule.sqlite');

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
    } catch (err) {
      console.error('Error reading SQLite file, initializing new DB:', err);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  initTables(db);
  persistDb();
  return db;
}

function persistDb() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to write SQLite file to disk:', err);
  }
}

function initTables(database: Database) {
  // Table for header configuration
  database.run(`
    CREATE TABLE IF NOT EXISTS header_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      companyLogoText TEXT,
      companySubtext TEXT,
      title TEXT,
      subtitle TEXT,
      coreValues TEXT,
      logoUrl TEXT,
      logoType TEXT,
      startDate TEXT,
      endDate TEXT
    );
  `);

  // Table for days configuration
  database.run(`
    CREATE TABLE IF NOT EXISTS days_config (
      key TEXT PRIMARY KEY,
      labelAr TEXT,
      dateLabel TEXT,
      fullDate TEXT,
      sortOrder INTEGER
    );
  `);

  // Table for team members
  database.run(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      indexNumber INTEGER,
      name TEXT,
      roleTitle TEXT,
      avatarColor TEXT,
      mainTasks TEXT,
      ongoingFollowUp TEXT,
      sortOrder INTEGER
    );
  `);

  // Table for daily tasks
  database.run(`
    CREATE TABLE IF NOT EXISTS daily_tasks (
      id TEXT PRIMARY KEY,
      memberId TEXT,
      dayKey TEXT,
      text TEXT,
      categoryIcon TEXT,
      status TEXT,
      note TEXT,
      updatedAt TEXT,
      FOREIGN KEY (memberId) REFERENCES team_members(id) ON DELETE CASCADE
    );
  `);

  // Table for footer notes
  database.run(`
    CREATE TABLE IF NOT EXISTS footer_notes (
      id TEXT PRIMARY KEY,
      noteText TEXT,
      iconType TEXT,
      sortOrder INTEGER
    );
  `);

  // Table for archived weeks
  database.run(`
    CREATE TABLE IF NOT EXISTS archived_weeks (
      id TEXT PRIMARY KEY,
      title TEXT,
      startDate TEXT,
      endDate TEXT,
      subtitle TEXT,
      archivedAt TEXT,
      totalTasks INTEGER,
      completedTasks INTEGER,
      memberCount INTEGER,
      dataJson TEXT
    );
  `);

  // Seed default data if header is empty
  const res = database.exec("SELECT COUNT(*) as cnt FROM header_config");
  const count = res.length > 0 && res[0].values.length > 0 ? (res[0].values[0][0] as number) : 0;

  if (count === 0) {
    seedDefaultData(database, INITIAL_SCHEDULE_DATA);
  }
}

export function seedDefaultData(database: Database, data: ScheduleData) {
  database.run("DELETE FROM header_config;");
  database.run("DELETE FROM days_config;");
  database.run("DELETE FROM team_members;");
  database.run("DELETE FROM daily_tasks;");
  database.run("DELETE FROM footer_notes;");

  // Insert Header
  database.run(
    `INSERT INTO header_config (id, companyLogoText, companySubtext, title, subtitle, coreValues, logoUrl, logoType, startDate, endDate)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      data.header.companyLogoText || 'PARADISE',
      data.header.companySubtext || 'Artificial Intelligence',
      data.header.title || 'جدول الأسبوع لمهام الفريق',
      data.header.subtitle || 'جدول المتابعة اليومية',
      JSON.stringify(data.header.coreValues || []),
      data.header.logoUrl || null,
      data.header.logoType || 'icon',
      data.header.startDate || '',
      data.header.endDate || '',
    ]
  );

  // Insert Days
  data.days.forEach((day, index) => {
    database.run(
      `INSERT INTO days_config (key, labelAr, dateLabel, fullDate, sortOrder) VALUES (?, ?, ?, ?, ?);`,
      [day.key, day.labelAr, day.dateLabel, day.fullDate || '', index]
    );
  });

  // Insert Team Members & Tasks
  data.teamMembers.forEach((member, index) => {
    database.run(
      `INSERT INTO team_members (id, indexNumber, name, roleTitle, avatarColor, mainTasks, ongoingFollowUp, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        member.id,
        member.indexNumber || index + 1,
        member.name,
        member.roleTitle || '',
        member.avatarColor || '#0ea5e9',
        member.mainTasks || '',
        member.ongoingFollowUp || '',
        index,
      ]
    );

    Object.entries(member.tasksByDay || {}).forEach(([dayKey, tasks]) => {
      tasks.forEach((task) => {
        database.run(
          `INSERT INTO daily_tasks (id, memberId, dayKey, text, categoryIcon, status, note, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            task.id,
            member.id,
            dayKey,
            task.text,
            task.categoryIcon || 'general',
            task.status || 'pending',
            task.note || '',
            task.updatedAt || new Date().toISOString(),
          ]
        );
      });
    });
  });

  // Insert Footer Notes
  data.footerNotes.forEach((note, index) => {
    database.run(
      `INSERT INTO footer_notes (id, noteText, iconType, sortOrder) VALUES (?, ?, ?, ?);`,
      [note.id, note.text, note.iconType || 'info', index]
    );
  });

  persistDb();
}

export async function getScheduleFromDb(): Promise<ScheduleData> {
  const database = await getDb();

  // Header
  const headerRes = database.exec("SELECT * FROM header_config WHERE id = 1");
  let header: ScheduleHeader = INITIAL_SCHEDULE_DATA.header;

  if (headerRes.length > 0 && headerRes[0].values.length > 0) {
    const row = headerRes[0].values[0];
    const columns = headerRes[0].columns;
    const getVal = (col: string) => row[columns.indexOf(col)];

    let coreValues: string[] = [];
    try {
      coreValues = JSON.parse((getVal('coreValues') as string) || '[]');
    } catch {
      coreValues = INITIAL_SCHEDULE_DATA.header.coreValues;
    }

    header = {
      companyLogoText: (getVal('companyLogoText') as string) || 'PARADISE',
      companySubtext: (getVal('companySubtext') as string) || 'Artificial Intelligence',
      title: (getVal('title') as string) || 'جدول الأسبوع لمهام الفريق',
      subtitle: (getVal('subtitle') as string) || 'جدول المتابعة اليومية',
      coreValues,
      logoUrl: (getVal('logoUrl') as string) || undefined,
      logoType: ((getVal('logoType') as string) as 'image' | 'icon') || 'icon',
      startDate: (getVal('startDate') as string) || '',
      endDate: (getVal('endDate') as string) || '',
    };
  }

  // Days
  const daysRes = database.exec("SELECT * FROM days_config ORDER BY sortOrder ASC");
  const days: DayConfig[] = [];
  if (daysRes.length > 0) {
    const cols = daysRes[0].columns;
    daysRes[0].values.forEach((row) => {
      const getVal = (col: string) => row[cols.indexOf(col)];
      days.push({
        key: getVal('key') as string,
        labelAr: getVal('labelAr') as string,
        dateLabel: getVal('dateLabel') as string,
        fullDate: (getVal('fullDate') as string) || undefined,
      });
    });
  }

  if (days.length === 0) {
    days.push(...INITIAL_SCHEDULE_DATA.days);
  }

  // Members
  const membersRes = database.exec("SELECT * FROM team_members ORDER BY sortOrder ASC");
  const teamMembers: TeamMember[] = [];

  if (membersRes.length > 0) {
    const cols = membersRes[0].columns;
    for (const row of membersRes[0].values) {
      const getVal = (col: string) => row[cols.indexOf(col)];
      const memberId = getVal('id') as string;

      // Tasks for member
      const tasksRes = database.exec(
        `SELECT * FROM daily_tasks WHERE memberId = '${memberId.replace(/'/g, "''")}'`
      );

      const tasksByDay: Record<string, DailyTask[]> = {
        sun: [],
        mon: [],
        tue: [],
        wed: [],
        thu: [],
      };

      if (tasksRes.length > 0) {
        const tCols = tasksRes[0].columns;
        tasksRes[0].values.forEach((tRow) => {
          const getTVal = (col: string) => tRow[tCols.indexOf(col)];
          const dayKey = getTVal('dayKey') as string;
          if (!tasksByDay[dayKey]) tasksByDay[dayKey] = [];

          tasksByDay[dayKey].push({
            id: getTVal('id') as string,
            text: getTVal('text') as string,
            categoryIcon: getTVal('categoryIcon') as any,
            status: getTVal('status') as any,
            note: (getTVal('note') as string) || undefined,
            updatedAt: (getTVal('updatedAt') as string) || undefined,
          });
        });
      }

      teamMembers.push({
        id: memberId,
        indexNumber: getVal('indexNumber') as number,
        name: getVal('name') as string,
        roleTitle: (getVal('roleTitle') as string) || undefined,
        avatarColor: (getVal('avatarColor') as string) || '#0ea5e9',
        mainTasks: (getVal('mainTasks') as string) || '',
        ongoingFollowUp: (getVal('ongoingFollowUp') as string) || '',
        tasksByDay,
      });
    }
  }

  // Footer Notes
  const notesRes = database.exec("SELECT * FROM footer_notes ORDER BY sortOrder ASC");
  const footerNotes: FooterNote[] = [];
  if (notesRes.length > 0) {
    const cols = notesRes[0].columns;
    notesRes[0].values.forEach((row) => {
      const getVal = (col: string) => row[cols.indexOf(col)];
      footerNotes.push({
        id: getVal('id') as string,
        text: (getVal('noteText') as string) || '',
        iconType: ((getVal('iconType') as string) as 'info' | 'whatsapp') || 'info',
      });
    });
  }

  return {
    header,
    days,
    teamMembers,
    footerNotes,
  };
}

export async function saveScheduleToDb(data: ScheduleData): Promise<void> {
  const database = await getDb();
  seedDefaultData(database, data);
}

export async function getArchivedWeeksFromDb(): Promise<ArchivedWeek[]> {
  const database = await getDb();
  const res = database.exec("SELECT * FROM archived_weeks ORDER BY archivedAt DESC");
  const archivedWeeks: ArchivedWeek[] = [];

  if (res.length > 0) {
    const cols = res[0].columns;
    res[0].values.forEach((row) => {
      const getVal = (col: string) => row[cols.indexOf(col)];
      let dataObj: ScheduleData = INITIAL_SCHEDULE_DATA;
      try {
        dataObj = JSON.parse(getVal('dataJson') as string);
      } catch {
        // fallback
      }

      archivedWeeks.push({
        id: getVal('id') as string,
        title: getVal('title') as string,
        startDate: getVal('startDate') as string,
        endDate: getVal('endDate') as string,
        subtitle: getVal('subtitle') as string,
        archivedAt: getVal('archivedAt') as string,
        totalTasks: getVal('totalTasks') as number,
        completedTasks: getVal('completedTasks') as number,
        memberCount: getVal('memberCount') as number,
        data: dataObj,
      });
    });
  }

  return archivedWeeks;
}

export async function saveArchivedWeekToDb(week: ArchivedWeek): Promise<void> {
  const database = await getDb();
  database.run(
    `INSERT OR REPLACE INTO archived_weeks (id, title, startDate, endDate, subtitle, archivedAt, totalTasks, completedTasks, memberCount, dataJson)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      week.id,
      week.title,
      week.startDate,
      week.endDate,
      week.subtitle,
      week.archivedAt,
      week.totalTasks,
      week.completedTasks,
      week.memberCount,
      JSON.stringify(week.data),
    ]
  );
  persistDb();
}

export async function deleteArchivedWeekFromDb(id: string): Promise<void> {
  const database = await getDb();
  database.run(`DELETE FROM archived_weeks WHERE id = ?;`, [id]);
  persistDb();
}
