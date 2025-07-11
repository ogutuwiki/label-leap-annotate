import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Award } from "lucide-react";

interface WorkerProgressProps {
  projects: any[];
}

const WorkerProgress = ({ projects }: WorkerProgressProps) => {
  const totalAssigned = projects.reduce((sum, p) => sum + p.assignedItems, 0);
  const totalCompleted = projects.reduce((sum, p) => sum + p.completedItems, 0);
  const overallProgress = (totalCompleted / totalAssigned) * 100;

  const weeklyStats = {
    itemsCompleted: 45,
    accuracyRate: 94,
    avgTimePerItem: 2.3,
    streakDays: 7
  };

  const achievements = [
    { title: "Speed Demon", description: "Completed 50+ items in a day", achieved: true },
    { title: "Accuracy Expert", description: "Maintain 95% accuracy for a week", achieved: false },
    { title: "Consistent Worker", description: "7 day working streak", achieved: true },
    { title: "Quality Assurance", description: "Zero rejections in 100 items", achieved: false }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Progress</h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{weeklyStats.accuracyRate}%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{weeklyStats.avgTimePerItem}m</div>
                <div className="text-sm text-muted-foreground">Avg Time/Item</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{weeklyStats.streakDays}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Your progress across all assigned projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => {
              const progress = (project.completedItems / project.assignedItems) * 100;
              return (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.completedItems}/{project.assignedItems} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{Math.round(progress)}%</div>
                      <Badge variant={project.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your milestones and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-4 border rounded-lg ${achievement.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Award className={`w-5 h-5 ${achievement.achieved ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="font-medium">{achievement.title}</div>
                  {achievement.achieved && <Badge variant="default" className="text-xs">Earned</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerProgress;