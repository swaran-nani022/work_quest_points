import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/TaskCard";
import { Leaderboard } from "@/components/Leaderboard";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Plus, Coins, CheckCircle, Clock, XCircle, TrendingUp, ArrowLeft } from "lucide-react";

export default function UserDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  
  const currentUser = state.users.find(u => u.id === state.currentUser);
  const userTasks = state.tasks.filter(t => t.userId === state.currentUser);
  const recentTasks = userTasks.slice(-5).reverse();
  
  const pendingTasks = userTasks.filter(t => t.status === 'pending');
  const approvedTasks = userTasks.filter(t => t.status === 'approved');
  const rejectedTasks = userTasks.filter(t => t.status === 'rejected');

  const getTaskType = (taskTypeId: string) => 
    state.taskTypes.find(tt => tt.id === taskTypeId);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button 
              variant="hero" 
              onClick={() => navigate('/user/submit-task')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Submit New Task
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
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
                <Coins className="h-6 w-6 text-points-glow" />
                <span className="text-3xl font-bold points-glow">
                  {currentUser?.totalPoints.toLocaleString() || 0}
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
                <CheckCircle className="h-6 w-6 text-success" />
                <span className="text-3xl font-bold text-success">
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
                <Clock className="h-6 w-6 text-pending" />
                <span className="text-3xl font-bold text-pending">
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
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold text-primary">
                  {userTasks.length > 0 
                    ? Math.round((approvedTasks.length / (approvedTasks.length + rejectedTasks.length)) * 100) || 0
                    : 0}%
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
                  <h3 className="text-xl font-semibold mb-4">Recent Submissions</h3>
                  {recentTasks.length === 0 ? (
                    <Card className="gradient-card shadow-card">
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">No tasks submitted yet</p>
                        <Button variant="hero" onClick={() => navigate('/user/submit-task')}>
                          Submit Your First Task
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {recentTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          taskType={getTaskType(task.taskTypeId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Pending Review</h3>
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
                          key={task.id}
                          task={task}
                          taskType={getTaskType(task.taskTypeId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Approved Tasks</h3>
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
                          key={task.id}
                          task={task}
                          taskType={getTaskType(task.taskTypeId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Rejected Tasks</h3>
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
                          key={task.id}
                          task={task}
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