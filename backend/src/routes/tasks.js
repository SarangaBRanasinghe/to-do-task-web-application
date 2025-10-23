const express = require('express');
const router = express.Router();
const db = require('../db');

// ➕ Create a new task
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO task (title, description) VALUES (?, ?)',
      [title, description]
    );
    res.status(201).json({ id: result.insertId, title, description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📋 Get latest 5 incomplete tasks
router.get('/', async (req, res) => {
  try {
    const [tasks] = await db.execute(
      'SELECT * FROM task WHERE is_completed = FALSE ORDER BY created_at DESC LIMIT 5'
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Mark a task as done
router.put('/:id/done', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE task SET is_completed = TRUE WHERE id = ?', [id]);
    res.json({ message: 'Task marked as completed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
