import mongoose from 'mongoose';

const TaskTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('TaskType', TaskTypeSchema);
