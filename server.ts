import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getScheduleFromDb,
  saveScheduleToDb,
  getArchivedWeeksFromDb,
  saveArchivedWeekToDb,
  deleteArchivedWeekFromDb,
  getPasswordsFromDb,
  savePasswordsToDb,
  seedDefaultData,
  getDb,
} from './src/db/sqlite.js';
import { INITIAL_SCHEDULE_DATA } from './src/data/initialData.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize SQLite database on boot
  await getDb();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: 'sqlite', timestamp: new Date().toISOString() });
  });

  // GET schedule data
  app.get('/api/schedule', async (req, res) => {
    try {
      const data = await getScheduleFromDb();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch schedule' });
    }
  });

  // POST update schedule data
  app.post('/api/schedule', async (req, res) => {
    try {
      const scheduleData = req.body;
      if (!scheduleData || !scheduleData.header || !scheduleData.teamMembers) {
        return res.status(400).json({ success: false, error: 'Invalid schedule data format' });
      }
      await saveScheduleToDb(scheduleData);
      res.json({ success: true, message: 'Schedule saved to SQLite successfully' });
    } catch (error) {
      console.error('Error saving schedule:', error);
      res.status(500).json({ success: false, error: 'Failed to save schedule' });
    }
  });

  // GET archived weeks history
  app.get('/api/history', async (req, res) => {
    try {
      const history = await getArchivedWeeksFromDb();
      res.json({ success: true, data: history });
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch history' });
    }
  });

  // POST save archived week
  app.post('/api/history', async (req, res) => {
    try {
      const weekItem = req.body;
      if (!weekItem || !weekItem.id || !weekItem.data) {
        return res.status(400).json({ success: false, error: 'Invalid archived week format' });
      }
      await saveArchivedWeekToDb(weekItem);
      res.json({ success: true, message: 'Archived week saved to SQLite successfully' });
    } catch (error) {
      console.error('Error saving archived week:', error);
      res.status(500).json({ success: false, error: 'Failed to save archived week' });
    }
  });

  // DELETE archived week
  app.delete('/api/history/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await deleteArchivedWeekFromDb(id);
      res.json({ success: true, message: 'Archived week deleted from SQLite' });
    } catch (error) {
      console.error('Error deleting archived week:', error);
      res.status(500).json({ success: false, error: 'Failed to delete archived week' });
    }
  });

  // GET passwords
  app.get('/api/passwords', async (req, res) => {
    try {
      const passwords = await getPasswordsFromDb();
      res.json({ success: true, data: passwords });
    } catch (error) {
      console.error('Error fetching passwords:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch passwords' });
    }
  });

  // POST update passwords
  app.post('/api/passwords', async (req, res) => {
    try {
      const passwords = req.body;
      if (!passwords || typeof passwords !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid passwords payload' });
      }
      await savePasswordsToDb(passwords);
      res.json({ success: true, message: 'Passwords saved to SQLite' });
    } catch (error) {
      console.error('Error saving passwords:', error);
      res.status(500).json({ success: false, error: 'Failed to save passwords' });
    }
  });

  // POST reset database to original Paradise initial data
  app.post('/api/reset', async (req, res) => {
    try {
      const database = await getDb();
      seedDefaultData(database, INITIAL_SCHEDULE_DATA);
      res.json({ success: true, data: INITIAL_SCHEDULE_DATA });
    } catch (error) {
      console.error('Error resetting database:', error);
      res.status(500).json({ success: false, error: 'Failed to reset database' });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server with SQLite backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
