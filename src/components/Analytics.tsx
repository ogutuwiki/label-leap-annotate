
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Target } from "lucide-react";

interface AnalyticsProps {
  projects: any[];
}

const Analytics: React.FC<AnalyticsProps> = ({ projects }) => {
  const progressData = projects.map(project => ({
    name: project.name.substring(0, 15) + (project.name.length > 15 ? '...' : ''),
    progress: project.progress,
    completed: project.completedItems,
    total: project.totalItems
  }));

  const weeklyData = [
    { day: 'Mon', annotations: 120 },
    { day: 'Tue', annotations: 150 },
    { day: 'Wed', annotations: 180 },
    { day: 'Thu', annotations: 160 },
    { day: 'Fri', annotations: 140 },
    { day: 'Sat', annotations: 90 },
    { day: 'Sun', annotations: 70 }
  ];

  const typeDistribution = [
    { name: 'Image', value: 60, color: '#3b82f6' },
    { name: 'Text', value: 30, color: '#10b981' },
    { name: 'Audio', value: 10, color: '#f59e0b' }
  ];

  const totalAnnotations = projects.reduce((sum, p) => sum + p.completedItems, 0);
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
        <p className="text-slate-600 mt-1">Track progress and performance across all projects</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Annotations</p>
                <p className="text-3xl font-bold text-slate-900">{totalAnnotations.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Progress</p>
                <p className="text-3xl font-bold text-slate-900">{avgProgress}%</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Projects</p>
                <p className="text-3xl font-bold text-slate-900">{activeProjects}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-slate-600">2 completing this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Team Members</p>
                <p className="text-3xl font-bold text-slate-900">15</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-slate-600">12 active today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Completion status across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'progress' ? `${value}%` : value,
                    name === 'progress' ? 'Progress' : name
                  ]}
                />
                <Bar dataKey="progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Annotations completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="annotations" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Type Distribution</CardTitle>
            <CardDescription>Breakdown of annotation types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key metrics and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Highest Performing Project</p>
                <p className="text-sm text-slate-600">Named Entity Recognition</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">90%</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Most Active Annotator</p>
                <p className="text-sm text-slate-600">Sarah Wilson</p>
              </div>
              <div className="text-2xl font-bold text-green-600">890</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Quality Score</p>
                <p className="text-sm text-slate-600">Average across all projects</p>
              </div>
              <div className="text-2xl font-bold text-purple-600">94%</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
