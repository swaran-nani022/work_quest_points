import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, Send } from "lucide-react";
import axios from "axios";

interface TaskType {
  _id: string;
  name: string;
  points: number;
  description: string;
}

export default function SubmitTask() {
  const navigate = useNavigate();
  
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskTypeId: '',
    proofUrl: '',
    tags: [] as string[],
    userId: "64df8f23c1234567890abcd" // Replace with real user ID from context/auth
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch task types from backend
  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/task-types");
        setTaskTypes(res.data);
      } catch (error) {
        console.error("Error fetching task types:", error);
      }
    };
    fetchTaskTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.taskTypeId || !formData.proofUrl) return;

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/tasks", formData);
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const selectedTaskType = taskTypes.find(tt => tt._id === formData.taskTypeId);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/user/dashboard')}
              className="text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Submit New Task</h1>
              <p className="text-muted-foreground">
                Provide details about your completed work to earn points
              </p>
            </div>
          </div>

          {/* Form */}
          <Card className="gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>
                Fill out all required information about your completed task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief, descriptive title of your task"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of what you accomplished and how you did it"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                {/* Task Type */}
                <div className="space-y-2">
                  <Label htmlFor="taskType">Task Type *</Label>
                  <Select 
                    value={formData.taskTypeId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, taskTypeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((taskType) => (
                        <SelectItem key={taskType._id} value={taskType._id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{taskType.name}</span>
                            <Badge variant="outline" className="ml-2 text-points-glow">
                              {taskType.points} pts
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTaskType && (
                    <p className="text-sm text-muted-foreground">
                      {selectedTaskType.description} • Worth {selectedTaskType.points} points
                    </p>
                  )}
                </div>

                {/* Proof URL */}
                <div className="space-y-2">
                  <Label htmlFor="proofUrl">Proof URL *</Label>
                  <Input
                    id="proofUrl"
                    type="url"
                    placeholder="https://github.com/username/repo/pull/123"
                    value={formData.proofUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, proofUrl: e.target.value }))}
                    required
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Task for Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
