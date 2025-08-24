import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskCard } from "@/components/TaskCard";
import { Plus, Clock, CheckCircle, XCircle } from "lucide-react";

// Types
type Task = {
  _id: string;
  title: string;
  description: string;
  proofUrl: string;
  status: "pending" | "approved" | "rejected";
  reviewReason?: string;
  points?: number;
  createdAt?: string;
};

type TaskType = {
  _id: string;
  name: string;
  points: number;
  description: string;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState<TaskType | null>(null);
  const [form, setForm] = useState({ name: "", points: 0, description: "" });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, typesRes] = await Promise.all([
          axios.get(`${API}/tasks`),
          axios.get(`${API}/task-types`),
        ]);
        setTasks(tasksRes.data);
        setTaskTypes(typesRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "pending"), [tasks]);

  // Review task
  const handleReview = async (id: string, status: "approved" | "rejected", reason?: string) => {
    try {
      const { data } = await axios.patch(`${API}/tasks/${id}/review`, { status, reason });
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  // Task Type Dialog
  const openDialog = (type?: TaskType) => {
    if (type) {
      setEditingTaskType(type);
      setForm({ name: type.name, points: type.points, description: type.description });
    } else {
      setEditingTaskType(null);
      setForm({ name: "", points: 0, description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTaskType) {
        const { data } = await axios.put(`${API}/task-types/${editingTaskType._id}`, form);
        setTaskTypes((prev) => prev.map((tt) => (tt._id === data._id ? data : tt)));
      } else {
        const { data } = await axios.post(`${API}/task-types`, form);
        setTaskTypes((prev) => [data, ...prev]);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save task type");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task type?")) return;
    try {
      await axios.delete(`${API}/task-types/${id}`);
      setTaskTypes((prev) => prev.filter((tt) => tt._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task type");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock /> Pending: {pendingTasks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle /> Approved: {tasks.filter((t) => t.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle /> Rejected: {tasks.filter((t) => t.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="settings">Task Types</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length === 0 ? (
            <p>No pending tasks.</p>
          ) : (
            pendingTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={{ id: task._id, title: task.title, description: task.description, proofUrl: task.proofUrl, status: task.status }}
                showActions
                onReview={(id, status) => handleReview(id, status)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Button onClick={() => openDialog()} className="mb-4">
            <Plus /> Add Task Type
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskTypes.map((tt) => (
              <Card key={tt._id}>
                <CardHeader>
                  <CardTitle>
                    {tt.name} ({tt.points} pts)
                  </CardTitle>
                  <CardDescription>{tt.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button onClick={() => openDialog(tt)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(tt._id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTaskType ? "Edit Task Type" : "Add Task Type"}</DialogTitle>
            <DialogDescription>Configure task type details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <Label>Points</Label>
            <Input type="number" value={form.points} onChange={(e) => setForm((prev) => ({ ...prev, points: parseInt(e.target.value) || 0 }))} required />
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
            <div className="flex gap-2 pt-4">
              <Button type="submit">{editingTaskType ? "Update" : "Create"}</Button>
              <Button type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
