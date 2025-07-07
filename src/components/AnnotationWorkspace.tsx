
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Save, SkipForward, ArrowLeft, ArrowRight, Square, Tag, Trash2 } from "lucide-react";

interface AnnotationWorkspaceProps {
  selectedProject: any;
}

const AnnotationWorkspace: React.FC<AnnotationWorkspaceProps> = ({ selectedProject }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<any>(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sampleImages = [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
  ];

  const sampleTexts = [
    "The customer service was absolutely terrible. I waited for over an hour just to speak with someone, and when I finally did, they were rude and unhelpful.",
    "I love this product! It exceeded my expectations and the quality is amazing. Highly recommend to everyone.",
    "The delivery was fast and the packaging was secure. The product itself is okay, nothing special but does what it's supposed to do."
  ];

  const labels = ['Positive', 'Negative', 'Neutral', 'Car', 'Person', 'Traffic Sign', 'Building'];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedLabel) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentBox({ x, y, width: 0, height: 0, label: selectedLabel });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentBox) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentBox({
      ...currentBox,
      width: x - currentBox.x,
      height: y - currentBox.y
    });
  };

  const handleMouseUp = () => {
    if (currentBox && Math.abs(currentBox.width) > 10 && Math.abs(currentBox.height) > 10) {
      setAnnotations([...annotations, { ...currentBox, id: Date.now() }]);
    }
    setIsDrawing(false);
    setCurrentBox(null);
  };

  const removeAnnotation = (id: number) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  const renderImageAnnotation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Image Annotation</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">
            {currentIndex + 1} of {sampleImages.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.min(sampleImages.length - 1, currentIndex + 1))}
            disabled={currentIndex === sampleImages.length - 1}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={sampleImages[currentIndex]}
                  alt={`Annotation ${currentIndex + 1}`}
                  className="w-full h-96 object-cover rounded"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  width={800}
                  height={384}
                />
                {/* Render existing annotations */}
                {annotations.map((ann) => (
                  <div
                    key={ann.id}
                    className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                    style={{
                      left: ann.x,
                      top: ann.y,
                      width: Math.abs(ann.width),
                      height: Math.abs(ann.height)
                    }}
                  >
                    <div className="bg-red-500 text-white px-2 py-1 text-xs">
                      {ann.label}
                    </div>
                  </div>
                ))}
                {/* Render current drawing box */}
                {currentBox && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                    style={{
                      left: currentBox.x,
                      top: currentBox.y,
                      width: Math.abs(currentBox.width),
                      height: Math.abs(currentBox.height)
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Annotation Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Label</Label>
                <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a label" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.slice(3).map((label) => (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Square className="w-4 h-4" />
                <span className="text-sm">Bounding Box</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Annotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {annotations.map((ann) => (
                  <div key={ann.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <Badge>{ann.label}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAnnotation(ann.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save & Next
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTextAnnotation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Text Annotation</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">
            {currentIndex + 1} of {sampleTexts.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.min(sampleTexts.length - 1, currentIndex + 1))}
            disabled={currentIndex === sampleTexts.length - 1}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Text to Annotate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-slate-50 rounded-lg text-slate-800 leading-relaxed">
                {sampleTexts[currentIndex]}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sentiment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.slice(0, 3).map((label) => (
                      <SelectItem key={label} value={label.toLowerCase()}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Confidence</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea 
                  placeholder="Add any additional notes about this annotation..."
                  className="h-24"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline">
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save & Next
          </Button>
        </div>
      </div>
    </div>
  );

  if (!selectedProject) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <CardContent>
          <div className="text-center text-slate-500">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Project Selected</h3>
            <p>Please select a project from the dashboard to start annotating.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{selectedProject.name}</CardTitle>
              <p className="text-slate-600 mt-1">{selectedProject.description}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {selectedProject.type} annotation
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {selectedProject.type === 'image' ? renderImageAnnotation() : renderTextAnnotation()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnotationWorkspace;
