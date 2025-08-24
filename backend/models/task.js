import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional for now
    title: { type: String, required: true },
    description: String,
    taskTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskType', required: true },
    proofUrl: { type: String, required: true },
    tags: [String],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewReason: String,
    points: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Task', TaskSchema);
