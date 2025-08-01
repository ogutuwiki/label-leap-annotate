import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, MessageSquare, Users, CheckCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProjectCommentForm from "@/components/forms/ProjectCommentForm";
import ProjectProgressForm from "@/components/forms/ProjectProgressForm";

interface Project {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  total_items: number;
  completed_items: number;
  progress: number;
  contributors: number;
  pending_approval: number;
  created_at: string;
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

interface Assignment {
  id: string;
  items_assigned: number;
  items_completed: number;
  due_date?: string;
  status: string;
  profiles: {
    display_name: string;
  };
}

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = React.useState<Project | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = React.useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = React.useState(false);

  const fetchProjectDetails = async () => {
    if (!id) return;

    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // For now, set empty arrays - full implementation requires authentication
      setComments([]);
      setAssignments([]);
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch project details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleMarkComplete = async () => {
    if (!project) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed', progress: 100 })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project marked as complete",
      });
      fetchProjectDetails();
    } catch (error) {
      console.error('Error marking project complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark project as complete",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">Project Details</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Progress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Project Progress</DialogTitle>
              </DialogHeader>
              <ProjectProgressForm
                project={project}
                onSuccess={() => {
                  setIsProgressDialogOpen(false);
                  fetchProjectDetails();
                }}
                onCancel={() => setIsProgressDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {project.status !== 'completed' && (
            <Button onClick={handleMarkComplete}>
              Mark as Complete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Overview
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Project Type</p>
                  <p className="text-sm text-muted-foreground">{project.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
                <p className="text-sm text-muted-foreground">
                  {project.completed_items} of {project.total_items} items completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="assignments" className="w-full">
            <TabsList>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assignments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Project Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.length === 0 ? (
                    <p className="text-muted-foreground">No assignments yet</p>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{assignment.profiles.display_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {assignment.items_completed} of {assignment.items_assigned} items completed
                              </p>
                              {assignment.due_date && (
                                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                              {assignment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Project Comments
                    </CardTitle>
                    <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">Add Comment</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Comment</DialogTitle>
                        </DialogHeader>
                        <ProjectCommentForm
                          projectId={project.id}
                          onSuccess={() => {
                            setIsCommentDialogOpen(false);
                            fetchProjectDetails();
                          }}
                          onCancel={() => setIsCommentDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground">No comments yet</p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-l-2 border-primary pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{comment.profiles.display_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{project.contributors}</div>
                <p className="text-sm text-muted-foreground">Contributors</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{project.pending_approval}</div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;