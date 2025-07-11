import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Users, Target } from "lucide-react";

interface WorkerAssignmentProps {
  projects: any[];
}

const WorkerAssignment = ({ projects }: WorkerAssignmentProps) => {
  const [selectedProject, setSelectedProject] = useState("");

  const workers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", skill: "image", workload: 45, performance: 92 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", skill: "text", workload: 60, performance: 88 },
    { id: 3, name: "Carol Davis", email: "carol@example.com", skill: "both", workload: 30, performance: 95 },
    { id: 4, name: "David Wilson", email: "david@example.com", skill: "image", workload: 75, performance: 85 }
  ];

  const assignments = [
    { projectId: 1, workerId: 1, itemsAssigned: 50, itemsCompleted: 35, dueDate: "2024-02-15" },
    { projectId: 1, workerId: 3, itemsAssigned: 30, itemsCompleted: 25, dueDate: "2024-02-15" },
    { projectId: 2, workerId: 2, itemsAssigned: 100, itemsCompleted: 75, dueDate: "2024-02-20" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Worker Assignments</h2>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          New Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Workers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Available Workers</span>
            </CardTitle>
            <CardDescription>Select workers to assign to projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workers.map((worker) => (
                <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-muted-foreground">{worker.email}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{worker.skill}</Badge>
                      <span className="text-xs">Workload: {worker.workload}%</span>
                      <span className="text-xs">Performance: {worker.performance}%</span>
                    </div>
                  </div>
                  <Button size="sm">Assign</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Project Assignments</span>
            </CardTitle>
            <CardDescription>View and manage current assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedProject && (
                <div className="space-y-3">
                  {assignments
                    .filter(a => a.projectId.toString() === selectedProject)
                    .map((assignment, index) => {
                      const worker = workers.find(w => w.id === assignment.workerId);
                      return (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{worker?.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {assignment.itemsCompleted}/{assignment.itemsAssigned} items completed
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Due: {assignment.dueDate}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="destructive" size="sm">Remove</Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerAssignment;