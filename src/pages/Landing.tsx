import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppActions } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { User, Shield, Coins, Zap, Target, Trophy } from "lucide-react";

export default function Landing() {
  const { setRole } = useAppActions();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'user' | 'admin') => {
    setRole(role);
    // redirect based on role
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard'); // make sure this route exists
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full gradient-primary shadow-glow">
              <Zap className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-glow">
            Work Quest Points
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern proof-of-work incentive system where contribution meets recognition. 
            Submit tasks, earn points, and climb the leaderboard.
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Role</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="gradient-card shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer group"
                  onClick={() => handleRoleSelect('user')}>
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4 group-hover:shadow-glow transition-all">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Continue as User</CardTitle>
                <CardDescription>
                  Submit tasks, earn points, and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Submit and track your tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-points-glow" />
                    Earn points for approved work
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Compete on the leaderboard
                  </li>
                </ul>
                <Button variant="hero" size="lg" className="w-full mt-6">
                  Enter User Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer group"
                  onClick={() => handleRoleSelect('admin')}>
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full bg-success/10 w-fit mb-4 group-hover:shadow-success transition-all">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-2xl">Continue as Admin</CardTitle>
                <CardDescription>
                  Review submissions and manage the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" />
                    Review pending tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Approve or reject submissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-warning" />
                    Manage task types and points
                  </li>
                </ul>
                <Button variant="success" size="lg" className="w-full mt-6">
                  Enter Admin Panel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="gradient-card shadow-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Submit Tasks</CardTitle>
                <CardDescription>
                  Create detailed task submissions with proof of work
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card shadow-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-success/10 w-fit mb-4">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Get Reviewed</CardTitle>
                <CardDescription>
                  Admins review and approve quality submissions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card shadow-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-points-bg w-fit mb-4">
                  <Coins className="h-6 w-6 text-points-glow" />
                </div>
                <CardTitle>Earn Points</CardTitle>
                <CardDescription>
                  Gain points for approved tasks and climb the leaderboard
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}