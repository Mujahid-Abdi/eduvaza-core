import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Trash2, FileVideo, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CourseUploadDialogProps {
  onCourseCreated?: () => void;
}

interface CoursePart {
  id: string;
  partNumber: number;
  title: string;
  description: string;
  contentType: 'video' | 'document';
  file: File | null;
  uploadProgress: number;
}

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB in bytes
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const CourseUploadDialog = ({ onCourseCreated }: CourseUploadDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    language: 'en',
    assignedTeacher: '',
    contentType: 'none' as 'video' | 'document' | 'none',
    mainFile: null as File | null,
    mainFileProgress: 0,
  });
  const [courseParts, setCourseParts] = useState<CoursePart[]>([]);

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
    // Renumber the parts
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

    // Validate file type
    if (contentType === 'video') {
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validVideoTypes.includes(file.type)) {
        toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)');
        return;
      }
    } else {
      const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validDocTypes.includes(file.type)) {
        toast.error('Please select a valid document file (PDF, DOC, DOCX)');
        return;
      }
    }

    updateCoursePart(partId, { file });
    toast.success(`File selected: ${file.name}`);
  };

  const handleMainFileSelect = (file: File, contentType: 'video' | 'document') => {
    const maxSize = contentType === 'video' ? MAX_VIDEO_SIZE : MAX_DOCUMENT_SIZE;
    const maxSizeLabel = contentType === 'video' ? '500MB' : '10MB';

    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxSizeLabel}. Please select a smaller file.`);
      return;
    }

    // Validate file type
    if (contentType === 'video') {
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validVideoTypes.includes(file.type)) {
        toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)');
        return;
      }
    } else {
      const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validDocTypes.includes(file.type)) {
        toast.error('Please select a valid document file (PDF, DOC, DOCX)');
        return;
      }
    }

    setFormData({ ...formData, mainFile: file });
    toast.success(`File selected: ${file.name}`);
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.assignedTeacher) {
      toast.error('Please fill in all required course information');
      return false;
    }

    // Course parts are optional, but if added, they must be complete
    if (courseParts.length > 0) {
      for (const part of courseParts) {
        if (!part.title) {
          toast.error(`Please provide a title for Part ${part.partNumber}`);
          return false;
        }
        if (!part.file) {
          toast.error(`Please upload a file for Part ${part.partNumber}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement Firebase course creation with file uploads
      // 1. Create course document in Firestore
      // 2. Upload main file to Cloudinary (if exists)
      // 3. Upload each part's file to Cloudinary (if parts exist)
      // 4. Update course document with file URLs
      
      // Simulate main file upload progress
      if (formData.mainFile) {
        for (let progress = 0; progress <= 100; progress += 20) {
          setFormData(prev => ({ ...prev, mainFileProgress: progress }));
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Simulate parts upload progress
      if (courseParts.length > 0) {
        for (let i = 0; i < courseParts.length; i++) {
          const part = courseParts[i];
          for (let progress = 0; progress <= 100; progress += 20) {
            updateCoursePart(part.id, { uploadProgress: progress });
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      // const courseData = {
      //   ...formData,
      //   schoolId: user?.id,
      //   createdBy: user?.id,
      //   createdAt: new Date(),
      //   enrolledCount: 0,
      //   isPublished: true,
      //   mainFileUrl: formData.mainFile ? 'uploaded-url' : null,
      //   parts: courseParts.length > 0 ? courseParts.map(part => ({
      //     partNumber: part.partNumber,
      //     title: part.title,
      //     description: part.description,
      //     contentType: part.contentType,
      //     fileUrl: 'uploaded-url', // Will be from Cloudinary
      //   })) : [],
      // };
      // await firebaseService.createCourse(courseData);

      const hasContent = formData.mainFile || courseParts.length > 0;
      toast.success(hasContent 
        ? 'Course with content uploaded successfully!' 
        : 'Course uploaded successfully!'
      );
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        language: 'en',
        assignedTeacher: '',
        contentType: 'none',
        mainFile: null,
        mainFileProgress: 0,
      });
      setCourseParts([]);
      onCourseCreated?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Course</DialogTitle>
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
            <p className="text-xs text-muted-foreground">
              Only registered teachers in the system can be assigned
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

          {/* Direct File Upload Section */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <Label className="text-base font-semibold">Course Content (Optional)</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a video or document for this course, or add multiple parts below
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value: 'video' | 'document' | 'none') => 
                  setFormData({ ...formData, contentType: value, mainFile: null })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No content (course info only)</SelectItem>
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

            {formData.contentType !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="mainFile">
                  Upload {formData.contentType === 'video' ? 'Video' : 'Document'}
                </Label>
                <Input
                  id="mainFile"
                  type="file"
                  accept={formData.contentType === 'video' 
                    ? 'video/mp4,video/webm,video/ogg,video/quicktime' 
                    : 'application/pdf,.doc,.docx'
                  }
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleMainFileSelect(file, formData.contentType as 'video' | 'document');
                    }
                  }}
                />
                {formData.mainFile && (
                  <div className="text-xs text-muted-foreground">
                    Selected: {formData.mainFile.name} ({(formData.mainFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
                {loading && formData.mainFileProgress > 0 && (
                  <div className="space-y-1">
                    <Progress value={formData.mainFileProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Uploading... {formData.mainFileProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Course Parts Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Additional Parts/Lessons (Optional)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Add more videos or documents if your course has multiple parts
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
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No additional parts. Click "Add Part" if your course has multiple lessons.
                  </p>
                </CardContent>
              </Card>
            )}

            {courseParts.map((part, index) => (
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
                    <Label htmlFor={`part-title-${part.id}`}>Part Title *</Label>
                    <Input
                      id={`part-title-${part.id}`}
                      value={part.title}
                      onChange={(e) => updateCoursePart(part.id, { title: e.target.value })}
                      placeholder="e.g., Introduction to Algebra"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`part-desc-${part.id}`}>Part Description</Label>
                    <Textarea
                      id={`part-desc-${part.id}`}
                      value={part.description}
                      onChange={(e) => updateCoursePart(part.id, { description: e.target.value })}
                      placeholder="Brief description of this part"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`part-type-${part.id}`}>Content Type *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor={`part-file-${part.id}`}>
                      Upload {part.contentType === 'video' ? 'Video' : 'Document'} *
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`part-file-${part.id}`}
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
                        className="flex-1"
                      />
                    </div>
                    {part.file && (
                      <div className="text-xs text-muted-foreground">
                        Selected: {part.file.name} ({(part.file.size / (1024 * 1024)).toFixed(2)} MB)
                      </div>
                    )}
                    {loading && part.uploadProgress > 0 && (
                      <div className="space-y-1">
                        <Progress value={part.uploadProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {part.uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Course
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
