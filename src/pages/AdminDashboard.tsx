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
import { Plus, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// Custom CSS for hiding scrollbar
const hideScrollbar = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

export default function AdminDashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTaskType, setEditingTaskType] = useState<TaskType | null>(null);
    const [form, setForm] = useState({ name: "", points: 0, description: "" });
    const navigate = useNavigate();

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
    const approvedTasksCount = useMemo(() => tasks.filter((t) => t.status === "approved").length, [tasks]);
    const rejectedTasksCount = useMemo(() => tasks.filter((t) => t.status === "rejected").length, [tasks]);

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
        if (!confirm("Are you sure you want to delete this task type?")) return;
        try {
            await axios.delete(`${API}/task-types/${id}`);
            setTaskTypes((prev) => prev.filter((tt) => tt._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete task type");
        }
    };

    return (
        <div className="min-h-screen p-6 text-gray-100 bg-black no-scrollbar" style={{ overflowY: "auto" }}>
            <style>{hideScrollbar}</style>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Button onClick={() => navigate(-1)} variant="ghost" className="text-white hover:text-gray-400">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Admin Dashboard</h1>
                    <div></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <Card className="flex flex-col justify-center items-center shadow-2xl transition-all duration-300 border border-transparent hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,229,255,0.7)] bg-white/5 backdrop-blur-md" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="p-3 rounded-full mb-4" style={{ background: 'linear-gradient(45deg, #00e5ff, #00b0ff)' }}>
                                <Clock className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-sm font-medium text-gray-400">Pending Reviews</div>
                            <div className="text-4xl font-bold mt-2">{pendingTasks.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col justify-center items-center shadow-2xl transition-all duration-300 border border-transparent hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,229,255,0.7)] bg-white/5 backdrop-blur-md" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="p-3 rounded-full mb-4" style={{ background: 'linear-gradient(45deg, #00e5ff, #00b0ff)' }}>
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-sm font-medium text-gray-400">Approved Tasks</div>
                            <div className="text-4xl font-bold mt-2">{approvedTasksCount}</div>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col justify-center items-center shadow-2xl transition-all duration-300 border border-transparent hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,229,255,0.7)] bg-white/5 backdrop-blur-md" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="p-3 rounded-full mb-4" style={{ background: 'linear-gradient(45deg, #00e5ff, #00b0ff)' }}>
                                <XCircle className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-sm font-medium text-gray-400">Rejected Tasks</div>
                            <div className="text-4xl font-bold mt-2">{rejectedTasksCount}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <Tabs defaultValue="pending">
                        <TabsList className="w-full grid grid-cols-2 bg-gray-900/50 backdrop-blur-md shadow-lg" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                            <TabsTrigger value="pending" className="data-[state=active]:bg-transparent data-[state=active]:text-white relative z-10 before:absolute before:inset-0 before:rounded-lg before:transition-all before:duration-300 data-[state=active]:before:bg-gradient-to-r data-[state=active]:before:from-cyan-500 data-[state=active]:before:to-blue-500 data-[state=active]:before:shadow-[0_0_15px_rgba(0,229,255,0.7)]">
                                <span className="relative z-20">Pending Reviews</span>
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:text-white relative z-10 before:absolute before:inset-0 before:rounded-lg before:transition-all before:duration-300 data-[state=active]:before:bg-gradient-to-r data-[state=active]:before:from-cyan-500 data-[state=active]:before:to-blue-500 data-[state=active]:before:shadow-[0_0_15px_rgba(0,229,255,0.7)]">
                                <span className="relative z-20">Task Types</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="mt-6 space-y-4">
                            {pendingTasks.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <p className="text-lg">No pending tasks to review at this time. Great job!</p>
                                </div>
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

                        <TabsContent value="settings" className="mt-6">
                            <div className="flex justify-end mb-4">
                                <Button onClick={() => openDialog()} className="relative overflow-hidden bg-transparent border-2 border-transparent transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(45deg, #00e5ff, #00b0ff)' }}>
                                    <span className="relative z-10"><Plus className="mr-2 h-4 w-4" /> Add New Task Type</span>
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {taskTypes.map((tt) => (
                                    <Card key={tt._id} className="shadow-md border border-transparent hover:border-cyan-500 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-md" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">{tt.name}</CardTitle>
                                            <CardDescription className="text-sm text-gray-400">{tt.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-2">
                                            <div className="text-sm text-gray-400">Points: <span className="font-bold text-white">{tt.points}</span></div>
                                            <div className="flex gap-2 mt-2">
                                                <Button onClick={() => openDialog(tt)} variant="outline" className="border-2 border-gray-700 hover:border-white transition-colors">Edit</Button>
                                                <Button variant="destructive" onClick={() => handleDelete(tt._id)} className="bg-red-600 hover:bg-red-700">Delete</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] border-none bg-white/5 backdrop-blur-lg text-white" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>
                    <DialogHeader>
                        <DialogTitle>{editingTaskType ? "Edit Task Type" : "Add Task Type"}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {editingTaskType ? "Update the details for this task type." : "Create a new task type for users to complete."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Task Name</Label>
                            <Input id="name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required className="bg-gray-800 border-gray-700 text-white focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="points">Points</Label>
                            <Input id="points" type="number" value={form.points} onChange={(e) => setForm((prev) => ({ ...prev, points: parseInt(e.target.value) || 0 }))} required className="bg-gray-800 border-gray-700 text-white focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required className="bg-gray-800 border-gray-700 text-white focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-2 border-gray-700 hover:border-white transition-colors">Cancel</Button>
                            <Button type="submit" className="relative overflow-hidden bg-transparent border-2 border-transparent" style={{ background: 'linear-gradient(45deg, #00e5ff, #00b0ff)' }}>{editingTaskType ? "Update Task" : "Create Task"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}