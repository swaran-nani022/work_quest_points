import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// ✅ Get distinct user count
router.get('/count', async (req, res) => {
  const ids = await Task.distinct('userId');
  res.json({ count: ids.length });
});

export default router;
