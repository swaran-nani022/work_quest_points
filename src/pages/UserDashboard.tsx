import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/TaskCard";
import { Leaderboard } from "@/components/Leaderboard";
import { useNavigate } from "react-router-dom";
import { Plus, Coins, CheckCircle, Clock, XCircle, TrendingUp, ArrowLeft } from "lucide-react";

type Task = {
  _id: string;
  title: string;
  description: string;
  proofUrl: string;
  status: "pending" | "approved" | "rejected";
  reviewReason?: string;
  taskTypeId: string | { _id: string; name: string; points: number; description: string };
  userId: string;            // <-- needed for filtering current user's tasks
  createdAt?: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  points: number;
  role: string;
};

type TaskType = {
  _id: string;
  name: string;
  points: number;
  description: string;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef<number | null>(null);

  // helper: safe auth header
  const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // fetch all page data (profile, tasks, task types)
  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const [meRes, tasksRes, typesRes] = await Promise.all([
        axios.get(`${API}/api/auth/me`, { headers: authHeader() }),
        axios.get(`${API}/api/tasks`, { headers: authHeader() }),
        axios.get(`${API}/api/task-types`) // public in your server code
      ]);

      if (meRes.data?.success) setCurrentUser(meRes.data.user);
      setTasks(tasksRes.data || []);
      setTaskTypes(typesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // initial load + start polling
  useEffect(() => {
    fetchAll();

    // lightweight polling for real-time-ish updates
    pollingRef.current = window.setInterval(async () => {
      try {
        const res = await axios.get(`${API}/api/tasks`, { headers: authHeader() });
        setTasks(res.data || []);
      } catch (e) {
        // silently ignore transient errors
      }
    }, 8000); // every 8s; adjust if you want

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // map helper: resolve a taskType even if taskTypeId is populated or string
  const getTaskType = (taskTypeId: Task["taskTypeId"]) => {
    if (!taskTypeId) return undefined;
    if (typeof taskTypeId === "string") {
      return taskTypes.find((tt) => tt._id === taskTypeId);
    }
    return taskTypes.find((tt) => tt._id === taskTypeId._id) || (taskTypeId as TaskType);
  };

  // filter and derive lists
  const userTasks = useMemo(
    () => tasks.filter((t) => t.userId === currentUser?._id),
    [tasks, currentUser?._id]
  );

  const recentTasks = useMemo(() => [...userTasks].slice(-5).reverse(), [userTasks]);
  const pendingTasks = useMemo(() => userTasks.filter((t) => t.status === "pending"), [userTasks]);
  const approvedTasks = useMemo(() => userTasks.filter((t) => t.status === "approved"), [userTasks]);
  const rejectedTasks = useMemo(() => userTasks.filter((t) => t.status === "rejected"), [userTasks]);

  const successRate = useMemo(() => {
    const denom = approvedTasks.length + rejectedTasks.length;
    if (denom === 0) return 0;
    return Math.round((approvedTasks.length / denom) * 100);
  }, [approvedTasks.length, rejectedTasks.length]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button
              variant="hero"
              onClick={() => navigate("/user/submit-task")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit New Task
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-white">Welcome back, {currentUser?.name}!</h1>
            <p className="text-muted-foreground text-lg">Track your progress and submissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coins className="h-6 w-6 text-yellow-500" />
                <span className="text-3xl font-bold text-yellow-400">
                  {currentUser?.points?.toLocaleString() || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-3xl font-bold text-green-500">
                  {approvedTasks.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-500" />
                <span className="text-3xl font-bold text-blue-500">
                  {pendingTasks.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-500" />
                <span className="text-3xl font-bold text-purple-500">
                  {successRate}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="recent" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recent">Recent Tasks</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedTasks.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedTasks.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Recent Submissions</h3>
                  {recentTasks.length === 0 ? (
                    <Card className="gradient-card shadow-card">
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">No tasks submitted yet</p>
                        <Button variant="hero" onClick={() => navigate("/user/submit-task")}>
                          Submit Your First Task
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {recentTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={{
                            id: task._id,
                            title: task.title,
                            description: task.description,
                            proofUrl: task.proofUrl,
                            status: task.status,
                            reviewReason: task.reviewReason
                          }}
                          taskType={getTaskType(task.taskTypeId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Pending Review</h3>
                  {pendingTasks.length === 0 ? (
                    <Card className="gradient-card shadow-card">
                      <CardContent className="py-12 text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No pending tasks</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={{
                            id: task._id,
                            title: task.title,
                            description: task.description,
                            proofUrl: task.proofUrl,
                            status: task.status
                          }}
                          taskType={getTaskType(task.taskTypeId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Approved Tasks</h3>
                  {approvedTasks.length === 0 ? (
                    <Card className="gradient-card shadow-card">
                      <CardContent className="py-12 text-center">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No approved tasks yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {approvedTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={{
                            id: task._id,
                            title: task.title,
                            description: task.description,
                            proofUrl: task.proofUrl,
                            status: task.status
                          }}
                          taskType={getTaskType(task.taskTypeId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Rejected Tasks</h3>
                {rejectedTasks.length === 0 ? (
                    <Card className="gradient-card shadow-card">
                      <CardContent className="py-12 text-center">
                        <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No rejected tasks</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {rejectedTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={{
                            id: task._id,
                            title: task.title,
                            description: task.description,
                            proofUrl: task.proofUrl,
                            status: task.status,
                            reviewReason: task.reviewReason
                          }}
                          taskType={getTaskType(task.taskTypeId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
