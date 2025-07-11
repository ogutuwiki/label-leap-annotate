import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, MessageSquare, Clock } from "lucide-react";

interface WorkerFeedbackProps {
  projects: any[];
}

const WorkerFeedback = ({ projects }: WorkerFeedbackProps) => {
  const allFeedback = projects.flatMap(project => 
    project.feedback.map((fb: any) => ({
      ...fb,
      projectName: project.name,
      projectId: project.id
    }))
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'revision': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <MessageSquare className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'revision': return 'bg-orange-50 border-orange-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feedback & Comments</h2>
        <Badge variant="outline">
          {allFeedback.length} total messages
        </Badge>
      </div>

      <div className="space-y-4">
        {allFeedback.length > 0 ? (
          allFeedback.map((feedback) => (
            <Card key={feedback.id} className={`border-l-4 ${getTypeColor(feedback.type)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(feedback.type)}
                    <CardTitle className="text-base">{feedback.projectName}</CardTitle>
                    <Badge variant={feedback.type === 'positive' ? 'default' : 'secondary'}>
                      {feedback.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>2 hours ago</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{feedback.message}</p>
                {feedback.type === 'revision' && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Item
                    </Button>
                    <Button size="sm">
                      Make Corrections
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No feedback available yet</p>
              <p className="text-sm">Complete some annotations to receive feedback from your admin</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkerFeedback;