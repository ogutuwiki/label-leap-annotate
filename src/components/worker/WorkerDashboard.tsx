import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Image, FileText, Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import AnnotationWorkspace from "@/components/AnnotationWorkspace";
import WorkerFeedback from "./WorkerFeedback";
import WorkerProgress from "./WorkerProgress";

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigned");
  const [selectedProject, setSelectedProject] = useState(null);

  const assignedProjects = [
    {
      id: 1,
      name: "Medical Image Classification",
      type: "image",
      description: "Annotate X-ray images for disease detection",
      assignedItems: 50,
      completedItems: 35,
      pendingFeedback: 5,
      dueDate: "2024-02-15",
      priority: "high",
      feedback: [
        { id: 1, message: "Great work on the lung classifications!", type: "positive" },
        { id: 2, message: "Please be more careful with the heart region annotations", type: "revision" }
      ]
    },
    {
      id: 2,
      name: "Sentiment Analysis Dataset",
      type: "text",
      description: "Label customer reviews for sentiment classification", 
      assignedItems: 100,
      completedItems: 75,
      pendingFeedback: 2,
      dueDate: "2024-02-20",
      priority: "medium",
      feedback: [
        { id: 3, message: "Good accuracy on neutral sentiment detection", type: "positive" }
      ]
    }
  ];

  const stats = {
    assignedProjects: assignedProjects.length,
    totalItems: assignedProjects.reduce((sum, p) => sum + p.assignedItems, 0),
    completedItems: assignedProjects.reduce((sum, p) => sum + p.completedItems, 0),
    pendingFeedback: assignedProjects.reduce((sum, p) => sum + p.pendingFeedback, 0)
  };

  const overallProgress = (stats.completedItems / stats.totalItems) * 100;

  return (
    <div className="space-y-6">
      {/* Worker Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Assigned Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.assignedProjects}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Items Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedItems}</div>
            <div className="text-sm opacity-90">of {stats.totalItems} total</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingFeedback}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assigned" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>My Projects</span>
          </TabsTrigger>
          <TabsTrigger value="annotate" className="flex items-center space-x-2">
            <Image className="w-4 h-4" />
            <span>Annotate</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>My Progress</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-6">
          <h2 className="text-2xl font-bold">Assigned Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assignedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {project.type === 'image' ? 
                        <Image className="w-5 h-5 text-blue-600" /> : 
                        <FileText className="w-5 h-5 text-green-600" />
                      }
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    <Badge variant={project.priority === 'high' ? 'destructive' : 'secondary'}>
                      {project.priority}
                    </Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.completedItems}/{project.assignedItems}</span>
                    </div>
                    <Progress value={(project.completedItems / project.assignedItems) * 100} />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Due: {project.dueDate}</span>
                    </div>
                    {project.pendingFeedback > 0 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{project.pendingFeedback} need attention</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => setSelectedProject(project)}
                  >
                    Continue Annotating
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="annotate">
          <AnnotationWorkspace selectedProject={selectedProject} />
        </TabsContent>

        <TabsContent value="feedback">
          <WorkerFeedback projects={assignedProjects} />
        </TabsContent>

        <TabsContent value="progress">
          <WorkerProgress projects={assignedProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkerDashboard;