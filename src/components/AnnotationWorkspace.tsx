
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Save, SkipForward, ArrowLeft, ArrowRight, Square, Tag, Trash2, ZoomIn, ZoomOut, RotateCcw, Download, Upload } from "lucide-react";

interface AnnotationWorkspaceProps {
  selectedProject: any;
}

const AnnotationWorkspace: React.FC<AnnotationWorkspaceProps> = ({ selectedProject }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<any>(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [zoom, setZoom] = useState(1);
  const [sentiment, setSentiment] = useState('');
  const [confidence, setConfidence] = useState('');
  const [notes, setNotes] = useState('');
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
      {/* Progress and Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">Image Annotation</h3>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span>Item {currentIndex + 1} of {sampleImages.length}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{annotations.length} annotations</span>
          </div>
          <Progress value={(currentIndex + 1) / sampleImages.length * 100} className="w-48" />
        </div>
        <div className="flex items-center space-x-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Image Viewer</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-slate-600 min-w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.25))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-4" />
                  <Button variant="ghost" size="sm" onClick={() => setZoom(1)}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative overflow-hidden rounded-lg bg-checkered">
                <div 
                  className="relative transition-transform duration-200"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <img
                    src={sampleImages[currentIndex]}
                    alt={`Annotation ${currentIndex + 1}`}
                    className="w-full h-96 object-contain rounded"
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
                  {annotations.map((ann, index) => (
                    <div
                      key={ann.id}
                      className="absolute border-2 border-primary bg-primary/20 group hover:bg-primary/30 transition-colors"
                      style={{
                        left: ann.x,
                        top: ann.y,
                        width: Math.abs(ann.width),
                        height: Math.abs(ann.height)
                      }}
                    >
                      <div className="bg-primary text-primary-foreground px-2 py-1 text-xs font-medium">
                        {ann.label} #{index + 1}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeAnnotation(ann.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {/* Render current drawing box */}
                  {currentBox && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/20 animate-pulse"
                      style={{
                        left: currentBox.x,
                        top: currentBox.y,
                        width: Math.abs(currentBox.width),
                        height: Math.abs(currentBox.height)
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Square className="w-5 h-5 mr-2 text-primary" />
                Annotation Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select Label</Label>
                <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a label" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.slice(3).map((label) => (
                      <SelectItem key={label} value={label}>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedLabel && (
                  <p className="text-xs text-muted-foreground mt-1">Select a label to start drawing</p>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Drawing Mode</span>
                  <Badge variant={selectedLabel ? "default" : "secondary"}>
                    {selectedLabel ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click and drag on the image to create bounding boxes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Annotations ({annotations.length})</CardTitle>
                {annotations.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setAnnotations([])}>
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {annotations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No annotations yet</p>
                  </div>
                ) : (
                  annotations.map((ann, index) => (
                    <div key={ann.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <span className="text-sm font-medium">{ann.label}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnnotation(ann.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Bar */}
      <Card className="shadow-md bg-gradient-to-r from-slate-50 to-slate-100">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
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
        </CardContent>
      </Card>
    </div>
  );

  const renderTextAnnotation = () => (
    <div className="space-y-6">
      {/* Progress and Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">Text Annotation</h3>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span>Text {currentIndex + 1} of {sampleTexts.length}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{sentiment ? 'Classified' : 'Unclassified'}</span>
          </div>
          <Progress value={(currentIndex + 1) / sampleTexts.length * 100} className="w-48" />
        </div>
        <div className="flex items-center space-x-2">
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
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Text Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-200 text-slate-800 leading-relaxed font-medium">
                  {sampleTexts[currentIndex]}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                    {sampleTexts[currentIndex].split(' ').length} words
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Tag className="w-5 h-5 mr-2 text-primary" />
                Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Sentiment</Label>
                <Select value={sentiment} onValueChange={setSentiment}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.slice(0, 3).map((label) => (
                      <SelectItem key={label} value={label.toLowerCase()}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            label === 'Positive' ? 'bg-green-500' :
                            label === 'Negative' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Confidence Level</Label>
                <Select value={confidence} onValueChange={setConfidence}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>High (90-100%)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Medium (70-89%)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Low (50-69%)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Additional Notes</Label>
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add context, reasoning, or special considerations..."
                  className="h-24 mt-1 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {notes.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Annotation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={sentiment && confidence ? "default" : "secondary"}>
                    {sentiment && confidence ? "Complete" : "Pending"}
                  </Badge>
                </div>
                {sentiment && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sentiment:</span>
                    <Badge variant="outline" className="capitalize">
                      {sentiment}
                    </Badge>
                  </div>
                )}
                {confidence && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <Badge variant="outline" className="capitalize">
                      {confidence}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Bar */}
      <Card className="shadow-md bg-gradient-to-r from-slate-50 to-slate-100">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline">
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                disabled={!sentiment || !confidence}
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
