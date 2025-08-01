import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  completed_items: z.number().min(0, "Completed items cannot be negative"),
});

type FormData = z.infer<typeof formSchema>;

interface Project {
  id: string;
  name: string;
  total_items: number;
  completed_items: number;
  progress: number;
}

interface ProjectProgressFormProps {
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectProgressForm = ({ project, onSuccess, onCancel }: ProjectProgressFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      completed_items: project.completed_items,
    },
  });

  const watchedCompletedItems = form.watch("completed_items");
  const calculatedProgress = Math.min(100, Math.round((watchedCompletedItems / project.total_items) * 100));

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const progress = Math.min(100, Math.round((data.completed_items / project.total_items) * 100));
      
      const { error } = await supabase
        .from('projects')
        .update({
          completed_items: data.completed_items,
          progress: progress,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project progress updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update project progress",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-muted-foreground">
          Update project progress
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="completed_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completed Items</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter completed items"
                    max={project.total_items}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-muted-foreground">
                  Total items: {project.total_items}
                </p>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{calculatedProgress}%</span>
            </div>
            <Progress value={calculatedProgress} />
            <p className="text-sm text-muted-foreground">
              {watchedCompletedItems} of {project.total_items} items completed
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Progress"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectProgressForm;