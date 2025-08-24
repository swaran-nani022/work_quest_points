import express from 'express';
import TaskType from '../models/TaskType.js';

const router = express.Router();

// ✅ Get all task types
router.get('/', async (_req, res) => {
  const taskTypes = await TaskType.find().sort({ createdAt: -1 });
  res.json(taskTypes);
});

// ✅ Add a new task type
router.post('/', async (req, res) => {
  const newType = await TaskType.create(req.body);
  res.status(201).json(newType);
});

// ✅ Update a task type
router.put('/:id', async (req, res) => {
  const updated = await TaskType.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// ✅ Delete a task type
router.delete('/:id', async (req, res) => {
  await TaskType.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
