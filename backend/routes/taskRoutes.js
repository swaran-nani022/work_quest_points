import express from "express";
import Task from "../models/taskModel.js";

const router = express.Router();

// Review Task (Approve / Reject)
router.patch("/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    if (reason) task.reviewReason = reason;

    // If approved, assign points based on task type
    if (status === "approved") {
      const TaskType = (await import("../models/taskTypeModel.js")).default;
      const type = await TaskType.findById(task.taskTypeId);
      if (type) task.points = type.points;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
