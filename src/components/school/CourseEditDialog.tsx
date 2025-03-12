import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, FileVideo, FileText, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CourseEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    language: string;
    teacher: string;
    isPublished?: boolean;
    parts?: CoursePart[];
  };
  onCourseUpdated?: () => void;
}

interface CoursePart {
  id: string;
  partNumber: number;
  title: string;
  description: string;
  contentType: 'video' | 'document';
  file?: File | null;
  fileUrl?: string;
  uploadProgress: number;
}

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

export const CourseEditDialog = ({ open, onOpenChange, course, onCourseUpdated }: CourseEditDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    language: course.language,
    assignedTeacher: course.teacher,
    isPublished: course.isPublished ?? true,
  });
  const [courseParts, setCourseParts] = useState<CoursePart[]>(course.parts || []);

  useEffect(() => {
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      language: course.language,
      assignedTeacher: course.teacher,
      isPublished: course.isPublished ?? true,
    });
    setCourseParts(course.parts || []);
  }, [course]);

  // Mock registered teachers - will be fetched from Firebase
  const registeredTeachers = [
    { id: 'teacher1', name: 'John Doe', email: 'john@example.com' },
    { id: 'teacher2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const addCoursePart = () => {
    const newPart: CoursePart = {
      id: `part-${Date.now()}`,
      partNumber: courseParts.length + 1,
      title: '',
      description: '',
      contentType: 'video',
      file: null,
      uploadProgress: 0,
    };
    setCourseParts([...courseParts, newPart]);
  };

  const removeCoursePart = (id: string) => {
    const updatedParts = courseParts.filter(part => part.id !== id);
    const renumberedParts = updatedParts.map((part, index) => ({
      ...part,
      partNumber: index + 1,
    }));
    setCourseParts(renumberedParts);
  };

  const updateCoursePart = (id: string, updates: Partial<CoursePart>) => {
    setCourseParts(courseParts.map(part => 
      part.id === id ? { ...part, ...updates } : part
    ));
  };

  const handleFileSelect = (partId: string, file: File, contentType: 'video' | 'document') => {
    const maxSize = contentType === 'video' ? MAX_VIDEO_SIZE : MAX_DOCUMENT_SIZE;
    const maxSizeLabel = contentType === 'video' ? '500MB' : '10MB';

    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxSizeLabel}. Please select a smaller file.`);
      return;
    }

    const validTypes = contentType === 'video' 
      ? ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      toast.error(`Please select a valid ${contentType} file`);
      return;
    }

    updateCoursePart(partId, { file });
    toast.success(`File selected: ${file.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement Firebase course update with file uploads
      // await coursesService.updateCourse(course.id, formData);

      toast.success('Course updated successfully!');
      onOpenChange(false);
      onCourseUpdated?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update course information and content
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Mathematics 101"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value: any) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.isPublished ? 'published' : 'draft'}
                onValueChange={(value) => setFormData({ ...formData, isPublished: value === 'published' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.isPublished ? 'Course is visible to students' : 'Course is hidden from students'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Assign to Registered Teacher *</Label>
            <Select
              value={formData.assignedTeacher}
              onValueChange={(value) => setFormData({ ...formData, assignedTeacher: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {registeredTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course Parts Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Course Parts/Lessons (Optional)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage videos or documents for each part. Parts are optional.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addCoursePart}>
                <Plus className="h-4 w-4 mr-1" />
                Add Part
              </Button>
            </div>

            {courseParts.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No parts added. This course has no parts/lessons. Click "Add Part" to add some.
                  </p>
                </CardContent>
              </Card>
            )}

            {courseParts.map((part) => (
              <Card key={part.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Part {part.partNumber}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCoursePart(part.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Part Title *</Label>
                    <Input
                      value={part.title}
                      onChange={(e) => updateCoursePart(part.id, { title: e.target.value })}
                      placeholder="e.g., Introduction"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Part Description</Label>
                    <Textarea
                      value={part.description}
                      onChange={(e) => updateCoursePart(part.id, { description: e.target.value })}
                      placeholder="Brief description"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content Type *</Label>
                    <Select
                      value={part.contentType}
                      onValueChange={(value: 'video' | 'document') => 
                        updateCoursePart(part.id, { contentType: value, file: null })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <FileVideo className="h-4 w-4" />
                            Video (Max 500MB)
                          </div>
                        </SelectItem>
                        <SelectItem value="document">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Document (Max 10MB)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {part.fileUrl && !part.file && (
                    <div className="text-xs text-green-600">
                      ✓ File already uploaded
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>
                      {part.fileUrl ? 'Replace File (Optional)' : 'Upload File *'}
                    </Label>
                    <Input
                      type="file"
                      accept={part.contentType === 'video' 
                        ? 'video/mp4,video/webm,video/ogg,video/quicktime' 
                        : 'application/pdf,.doc,.docx'
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(part.id, file, part.contentType);
                        }
                      }}
                    />
                    {part.file && (
                      <div className="text-xs text-muted-foreground">
                        Selected: {part.file.name} ({(part.file.size / (1024 * 1024)).toFixed(2)} MB)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Course'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
