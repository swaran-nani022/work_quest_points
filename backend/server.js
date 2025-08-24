import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hackathonUser:yourStrongPassword123@cluster0.i5sr0j8.mongodb.net/hackathon?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

// --- SCHEMAS AND MODELS ---

// Task Schema (Simplified)
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  proofUrl: String,
  status: { type: String, default: 'pending' },
  tags: [String],
  taskTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskType', required: true },
  reviewReason: String,
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

// Task Type Schema
const taskTypeSchema = new mongoose.Schema({
  name: String,
  points: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const TaskType = mongoose.model('TaskType', taskTypeSchema);

// --- TASK ROUTES ---

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('taskTypeId');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Task Submission Route
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, taskTypeId, proofUrl, tags } = req.body;
    const newTask = new Task({ title, description, taskTypeId, proofUrl, tags });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting task', error });
  }
});

// Task Review Route
app.patch('/api/tasks/:id/review', async (req, res) => {
  try {
    const { status, reason } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { status, reviewReason: reason }, 
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing task', error });
  }
});

// --- TASK TYPE ROUTES ---

// Get all task types
app.get('/api/task-types', async (req, res) => {
  try {
    const types = await TaskType.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task types', error });
  }
});

// Create a new task type
app.post('/api/task-types', async (req, res) => {
  try {
    const newType = new TaskType(req.body);
    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task type', error });
  }
});

// Update a task type
app.put('/api/task-types/:id', async (req, res) => {
  try {
    const updated = await TaskType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task type not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task type', error });
  }
});

// Delete a task type
app.delete('/api/task-types/:id', async (req, res) => {
  try {
    const deleted = await TaskType.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task type not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task type', error });
  }
});

// --- START SERVER ---
app.listen(5000, () => console.log('Server running on port 5000'));