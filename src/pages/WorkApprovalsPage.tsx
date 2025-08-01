import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import WorkApprovalForm from "@/components/forms/WorkApprovalForm";

interface WorkApproval {
  id: string;
  item_name: string;
  description?: string;
  annotations?: string;
  confidence_score?: number;
  status: string;
  submitted_by: string;
  admin_comment?: string;
  created_at: string;
  reviewed_at?: string;
  profiles: {
    display_name: string;
  };
}

const WorkApprovalsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workApprovals, setWorkApprovals] = React.useState<WorkApproval[]>([]);
  const [selectedApproval, setSelectedApproval] = React.useState<WorkApproval | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const fetchWorkApprovals = async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('work_approvals')
        .select(`
          *,
          profiles!work_approvals_submitted_by_fkey(display_name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkApprovals(data || []);
    } catch (error) {
      console.error('Error fetching work approvals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch work approvals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWorkApprovals();
  }, [projectId]);

  const handleApprovalClick = (approval: WorkApproval) => {
    if (approval.status === 'pending') {
      setSelectedApproval(approval);
      setIsDialogOpen(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const pendingCount = workApprovals.filter(approval => approval.status === 'pending').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Work Approvals</h1>
            <p className="text-muted-foreground">
              {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workApprovals.map((approval) => (
          <Card 
            key={approval.id} 
            className={`cursor-pointer transition-shadow hover:shadow-lg ${
              approval.status === 'pending' ? 'border-orange-200' : ''
            }`}
            onClick={() => handleApprovalClick(approval)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{approval.item_name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(approval.status)}
                  <Badge variant={getStatusVariant(approval.status)}>
                    {approval.status}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Submitted by {approval.profiles.display_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {approval.description && (
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {approval.description}
                  </p>
                </div>
              )}

              {approval.confidence_score && (
                <div>
                  <p className="text-sm font-medium">Confidence Score</p>
                  <Badge variant="outline">{approval.confidence_score}%</Badge>
                </div>
              )}

              <div>
                <p className="text-sm font-medium">Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(approval.created_at).toLocaleDateString()}
                </p>
              </div>

              {approval.reviewed_at && (
                <div>
                  <p className="text-sm font-medium">Reviewed</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(approval.reviewed_at).toLocaleDateString()}
                  </p>
                </div>
              )}

              {approval.admin_comment && (
                <div>
                  <p className="text-sm font-medium">Admin Comment</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {approval.admin_comment}
                  </p>
                </div>
              )}

              {approval.status === 'pending' && (
                <div className="pt-2">
                  <Button size="sm" className="w-full">
                    Review Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {workApprovals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No work approvals found for this project</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Work Approval</DialogTitle>
          </DialogHeader>
          {selectedApproval && (
            <WorkApprovalForm
              workApproval={selectedApproval}
              onSuccess={() => {
                setIsDialogOpen(false);
                setSelectedApproval(null);
                fetchWorkApprovals();
              }}
              onCancel={() => {
                setIsDialogOpen(false);
                setSelectedApproval(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkApprovalsPage;