import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { Trophy, Medal, Award, Coins } from "lucide-react";

export function Leaderboard() {
  const { state } = useApp();
  
  const sortedUsers = [...state.users].sort((a, b) => b.totalPoints - a.totalPoints);
  
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="gradient-primary">Champion</Badge>;
      case 1:
        return <Badge variant="secondary">Runner-up</Badge>;
      case 2:
        return <Badge variant="outline">Third Place</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-points-glow" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          Top performers ranked by total points earned
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedUsers.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
              user.id === state.currentUser
                ? 'bg-primary/10 border border-primary/20 shadow-glow'
                : 'bg-card/50 hover:bg-card/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(index)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{user.name}</h4>
                  {user.id === state.currentUser && (
                    <Badge variant="outline" className="text-xs">You</Badge>
                  )}
                  {getRankBadge(index)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.tasksCompleted} tasks completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-points-glow" />
                <span className="points-glow font-bold text-lg">
                  {user.totalPoints.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}