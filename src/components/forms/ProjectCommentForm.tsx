import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  comment: z.string().min(1, "Comment is required").max(1000, "Comment must be less than 1000 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface ProjectCommentFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectCommentForm = ({ projectId, onSuccess, onCancel }: ProjectCommentFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add comments",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('project_comments')
        .insert({
          project_id: projectId,
          user_id: user.id,
          comment: data.comment,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Comment</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter your comment..."
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                {field.value.length}/1000 characters
              </p>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectCommentForm;