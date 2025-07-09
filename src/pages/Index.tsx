
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, FileText, Users, BarChart3, Settings, Upload, Download, Eye } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import AnnotationWorkspace from "@/components/AnnotationWorkspace";
import UserManagement from "@/components/UserManagement";
import Analytics from "@/components/Analytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);

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
      status: "active"
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
      status: "active"
    },
    {
      id: 3,
      name: "Object Detection - Autonomous Driving",
      type: "image",
      description: "Annotate cars, pedestrians, and traffic signs",
      progress: 45,
      totalItems: 5000,
      completedItems: 2250,
      contributors: 12,
      createdAt: "2024-01-05",
      status: "active"
    },
    {
      id: 4,
      name: "Named Entity Recognition",
      type: "text",
      description: "Extract entities from legal documents",
      progress: 90,
      totalItems: 800,
      completedItems: 720,
      contributors: 3,
      createdAt: "2023-12-20",
      status: "completed"
    }
  ];

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalAnnotations: projects.reduce((sum, p) => sum + p.completedItems, 0),
    totalContributors: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LA</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900">Data Bridge</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="annotate" className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Annotate</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistics Cards */}
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
                  <CardTitle className="text-lg">Annotations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalAnnotations.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalContributors}</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
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

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onView={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="annotate">
            <AnnotationWorkspace selectedProject={selectedProject} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics projects={projects} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
