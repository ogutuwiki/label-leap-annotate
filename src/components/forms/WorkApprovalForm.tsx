import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  admin_comment: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface WorkApproval {
  id: string;
  item_name: string;
  description?: string;
  annotations?: string;
  confidence_score?: number;
  submitted_by: string;
  created_at: string;
}

interface WorkApprovalFormProps {
  workApproval: WorkApproval;
  onSuccess: () => void;
  onCancel: () => void;
}

const WorkApprovalForm = ({ workApproval, onSuccess, onCancel }: WorkApprovalFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admin_comment: "",
    },
  });

  const handleApprove = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to approve work",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('work_approvals')
        .update({
          status: 'approved',
          admin_comment: data.admin_comment,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', workApproval.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Work approved successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error approving work:', error);
      toast({
        title: "Error",
        description: "Failed to approve work",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (data: FormData) => {
    if (!data.admin_comment?.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to reject work",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('work_approvals')
        .update({
          status: 'rejected',
          admin_comment: data.admin_comment,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', workApproval.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Work rejected successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error rejecting work:', error);
      toast({
        title: "Error",
        description: "Failed to reject work",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {workApproval.item_name}
            <Badge variant="secondary">Pending Review</Badge>
          </CardTitle>
          <CardDescription>
            Submitted on {new Date(workApproval.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workApproval.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{workApproval.description}</p>
            </div>
          )}
          
          {workApproval.annotations && (
            <div>
              <h4 className="font-medium mb-2">Annotations</h4>
              <p className="text-sm text-muted-foreground">{workApproval.annotations}</p>
            </div>
          )}
          
          {workApproval.confidence_score && (
            <div>
              <h4 className="font-medium mb-2">Confidence Score</h4>
              <Badge variant="outline">{workApproval.confidence_score}%</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="admin_comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Comment (Optional for approval, required for rejection)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add your feedback..."
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={form.handleSubmit(handleReject)}
              disabled={isLoading}
            >
              {isLoading ? "Rejecting..." : "Reject"}
            </Button>
            <Button 
              type="button" 
              onClick={form.handleSubmit(handleApprove)}
              disabled={isLoading}
            >
              {isLoading ? "Approving..." : "Approve"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkApprovalForm;