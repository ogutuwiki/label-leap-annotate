
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Image, FileText, Users, Calendar, Eye, Edit, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Project {
  id: number;
  name: string;
  type: string;
  description: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  contributors: number;
  createdAt: string;
  status: string;
}

interface ProjectCardProps {
  project: Project;
  onView: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView }) => {
  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-blue-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getProjectIcon(project.type)}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">{project.name}</CardTitle>
              <Badge className={`mt-1 ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-slate-600 mt-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{project.completedItems} completed</span>
              <span>{project.totalItems} total</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{project.contributors} contributors</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button onClick={onView} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
