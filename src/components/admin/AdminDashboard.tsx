import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, BarChart3, FileText, Upload, Download, Settings, Eye, CheckCircle, XCircle } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import UserManagement from "@/components/UserManagement";
import Analytics from "@/components/Analytics";
import WorkerAssignment from "./WorkerAssignment";
import WorkApproval from "./WorkApproval";
import ProjectManagement from "./ProjectManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const projects = [
    {
      id: 1,
      name: "Medical Image Classification",
      type: "image",
      description: "Annotate X-ray images for disease detection",
      progress: 75,
      totalItems: 1000,
      completedItems: 750,
      contributors: 5,
      createdAt: "2024-01-15",
      status: "active",
      pendingApproval: 45
    },
    {
      id: 2,
      name: "Sentiment Analysis Dataset",
      type: "text", 
      description: "Label customer reviews for sentiment classification",
      progress: 60,
      totalItems: 2500,
      completedItems: 1500,
      contributors: 8,
      createdAt: "2024-01-10",
      status: "active",
      pendingApproval: 120
    }
  ];

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalWorkers: 15,
    pendingApprovals: projects.reduce((sum, p) => sum + p.pendingApproval, 0)
  };

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeProjects}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalWorkers}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingApprovals}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="workers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Workers</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Project Management</h2>
            <div className="flex gap-2">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
          <ProjectManagement projects={projects} />
        </TabsContent>

        <TabsContent value="workers">
          <UserManagement />
        </TabsContent>

        <TabsContent value="assignments">
          <WorkerAssignment projects={projects} />
        </TabsContent>

        <TabsContent value="approvals">
          <WorkApproval projects={projects} />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics projects={projects} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Manage platform configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;