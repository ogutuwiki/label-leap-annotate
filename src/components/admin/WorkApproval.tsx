import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, MessageSquare, Eye } from "lucide-react";

interface WorkApprovalProps {
  projects: any[];
}

const WorkApproval = ({ projects }: WorkApprovalProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [feedback, setFeedback] = useState("");

  const pendingItems = [
    {
      id: 1,
      projectId: 1,
      workerId: 1,
      workerName: "Alice Johnson",
      type: "image",
      itemName: "chest_xray_001.jpg",
      annotations: ["Pneumonia", "Left lung opacity"],
      submittedAt: "2024-01-20 14:30",
      confidence: 0.92
    },
    {
      id: 2,
      projectId: 1,
      workerId: 3,
      workerName: "Carol Davis",
      type: "image", 
      itemName: "chest_xray_002.jpg",
      annotations: ["Normal", "No abnormalities"],
      submittedAt: "2024-01-20 15:45",
      confidence: 0.98
    },
    {
      id: 3,
      projectId: 2,
      workerId: 2,
      workerName: "Bob Smith",
      type: "text",
      itemName: "review_12345",
      annotations: ["Negative sentiment", "Product quality issues"],
      submittedAt: "2024-01-20 16:20",
      confidence: 0.85
    }
  ];

  const handleApprove = (itemId: number) => {
    console.log("Approved item:", itemId);
    // Handle approval logic
  };

  const handleReject = (itemId: number) => {
    console.log("Rejected item:", itemId, "with feedback:", feedback);
    // Handle rejection logic
    setFeedback("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Work Approval</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-orange-600">
            <Clock className="w-3 h-3 mr-1" />
            {pendingItems.length} pending
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Items List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pending Approvals</h3>
          {pendingItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedItem(item)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{item.itemName}</div>
                    <div className="text-sm text-muted-foreground">
                      by {item.workerName}
                    </div>
                  </div>
                  <Badge variant={item.type === 'image' ? 'default' : 'secondary'}>
                    {item.type}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Annotations:</strong> {item.annotations.join(", ")}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Submitted: {item.submittedAt}</span>
                    <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Panel</h3>
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedItem.itemName}</span>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Original
                  </Button>
                </CardTitle>
                <CardDescription>
                  Submitted by {selectedItem.workerName} at {selectedItem.submittedAt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Annotations</label>
                  <div className="mt-1 p-3 bg-muted rounded-lg">
                    {selectedItem.annotations.map((annotation: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {annotation}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Confidence Score</label>
                  <div className="mt-1 text-lg font-semibold">
                    {Math.round(selectedItem.confidence * 100)}%
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Feedback (optional for approval, required for rejection)</label>
                  <Textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the worker..."
                    className="mt-1"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedItem.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleReject(selectedItem.id)}
                    disabled={!feedback.trim()}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an item from the left to review</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkApproval;