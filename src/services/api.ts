import { ScheduleData, ArchivedWeek } from '../types';

const API_BASE = '/api';

export async function checkSqliteHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      const data = await res.json();
      return data.status === 'ok' && data.db === 'sqlite';
    }
  } catch (e) {
    console.warn('SQLite backend API not reachable:', e);
  }
  return false;
}

export async function fetchScheduleFromApi(): Promise<ScheduleData | null> {
  try {
    const res = await fetch(`${API_BASE}/schedule`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (e) {
    console.error('Error fetching schedule from SQLite API:', e);
  }
  return null;
}

export async function saveScheduleToApi(scheduleData: ScheduleData): Promise<ScheduleData | null> {
  try {
    const res = await fetch(`${API_BASE}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) return result.data;
    }
  } catch (e) {
    console.error('Error saving schedule to SQLite API:', e);
  }
  return null;
}

export async function fetchHistoryFromApi(): Promise<ArchivedWeek[] | null> {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (e) {
    console.error('Error fetching history from SQLite API:', e);
  }
  return null;
}

export async function saveHistoryToApi(week: ArchivedWeek): Promise<ArchivedWeek[] | null> {
  try {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(week),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) return result.data;
    }
  } catch (e) {
    console.error('Error saving history item to SQLite API:', e);
  }
  return null;
}

export async function deleteHistoryFromApi(id: string): Promise<ArchivedWeek[] | null> {
  try {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) return result.data;
    }
  } catch (e) {
    console.error('Error deleting history item from SQLite API:', e);
  }
  return null;
}

export async function fetchPasswordsFromApi(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`${API_BASE}/passwords`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (e) {
    console.error('Error fetching passwords from SQLite API:', e);
  }
  return null;
}

export async function savePasswordsToApi(passwords: Record<string, string>): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`${API_BASE}/passwords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwords),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) return result.data;
    }
  } catch (e) {
    console.error('Error saving passwords to SQLite API:', e);
  }
  return null;
}

export async function resetScheduleFromApi(): Promise<ScheduleData | null> {
  try {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (e) {
    console.error('Error resetting schedule via SQLite API:', e);
  }
  return null;
}
