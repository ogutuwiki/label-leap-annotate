import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Edit, Trash2, Users, Clock, AlertCircle, UserPlus } from "lucide-react";
import EditProjectForm from '../forms/EditProjectForm';
import AssignProjectForm from '../forms/AssignProjectForm';
import DeleteConfirmationDialog from '../forms/DeleteConfirmationDialog';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectManagementProps {
  projects: any[];
  onProjectsChange: () => void;
}

const ProjectManagement = ({ projects, onProjectsChange }: ProjectManagementProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleView = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const handleAssign = (project: any) => {
    setSelectedProject(project);
    setAssignDialogOpen(true);
  };

  const handleDelete = (project: any) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', selectedProject.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      onProjectsChange();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{project.contributors || 0} workers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.completed_items || 0}/{project.total_items || 0}</span>
                </div>
                <Progress value={project.progress || 0} />
              </div>

              {(project.pending_approval || 0) > 0 && (
                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{project.pending_approval} items pending approval</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(project.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(project)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleAssign(project)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <EditProjectForm
              project={selectedProject}
              onSuccess={() => {
                setEditDialogOpen(false);
                setSelectedProject(null);
                onProjectsChange();
              }}
              onCancel={() => {
                setEditDialogOpen(false);
                setSelectedProject(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <AssignProjectForm
              projectId={selectedProject.id}
              onSuccess={() => {
                setAssignDialogOpen(false);
                setSelectedProject(null);
                onProjectsChange();
              }}
              onCancel={() => {
                setAssignDialogOpen(false);
                setSelectedProject(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProjectManagement;

export default ProjectManagement;