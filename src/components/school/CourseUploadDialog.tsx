import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Trash2, FileVideo, FileText, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cloudinaryService } from '@/services/cloudinary';
import { coursesService } from '@/services/courses';
import { mockCategories } from '@/services/mockData';
import type { Course, Language } from '@/types';

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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const CourseUploadDialog = ({ onCourseCreated }: CourseUploadDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverImageMode, setCoverImageMode] = useState<'url' | 'file'>('file');
  const [teacherInfo, setTeacherInfo] = useState({
    name: '',
    email: '',
    educationLevel: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    language: 'en',
    coverImageUrl: '',
    coverImageFile: null as File | null,
    coverImageProgress: 0,
    videoFile: null as File | null,
    videoProgress: 0,
    pdfFile: null as File | null,
    pdfProgress: 0,
    duration: 0, // in minutes
  });
  const [courseParts, setCourseParts] = useState<CoursePart[]>([]);

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

  const handleVideoFileSelect = (file: File) => {
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error('Video size exceeds 500MB. Please select a smaller file.');
      return;
    }

    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }

    setFormData({ ...formData, videoFile: file });
    toast.success(`Video selected: ${file.name}`);
  };

  const handlePdfFileSelect = (file: File) => {
    if (file.size > MAX_DOCUMENT_SIZE) {
      toast.error('PDF size exceeds 10MB. Please select a smaller file.');
      return;
    }

    const validDocTypes = ['application/pdf'];
    if (!validDocTypes.includes(file.type)) {
      toast.error('Please select a valid PDF file');
      return;
    }

    setFormData({ ...formData, pdfFile: file });
    toast.success(`PDF selected: ${file.name}`);
  };

  const handleCoverImageFileSelect = (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image size exceeds 5MB. Please select a smaller file.');
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    setFormData({ ...formData, coverImageFile: file, coverImageUrl: '' });
    toast.success(`Cover image selected: ${file.name}`);
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required course information');
      return false;
    }

    // Validate teacher info for school users
    if (user?.role === 'school') {
      if (!teacherInfo.name || !teacherInfo.email || !teacherInfo.educationLevel) {
        toast.error('Please fill in all teacher information (name, email, and education level)');
        return false;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(teacherInfo.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }

    // Validate cover image
    if (coverImageMode === 'url' && !formData.coverImageUrl) {
      toast.error('Please provide a cover image URL');
      return false;
    }
    if (coverImageMode === 'file' && !formData.coverImageFile) {
      toast.error('Please upload a cover image');
      return false;
    }

    // Validate course content - at least one file is required
    if (!formData.videoFile && !formData.pdfFile) {
      toast.error('Please upload at least a video or PDF file for the course content');
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
      const courseId = `course-${Date.now()}`;
      let coverImageUrl = formData.coverImageUrl;

      // Upload cover image to Cloudinary if file mode
      if (coverImageMode === 'file' && formData.coverImageFile) {
        const uploadResult = await cloudinaryService.uploadCourseThumbnail(
          formData.coverImageFile,
          courseId,
          (progress) => {
            setFormData(prev => ({ ...prev, coverImageProgress: progress.percentage }));
          }
        );
        coverImageUrl = uploadResult.secure_url;
      }

      // Upload video to Cloudinary (if exists)
      let videoUrl = null;
      if (formData.videoFile) {
        const uploadResult = await cloudinaryService.uploadCourseContent(
          formData.videoFile,
          courseId,
          'main-video',
          (progress) => {
            setFormData(prev => ({ ...prev, videoProgress: progress.percentage }));
          }
        );
        videoUrl = uploadResult.secure_url;
      }

      // Upload PDF to Cloudinary (if exists)
      let pdfUrl = null;
      if (formData.pdfFile) {
        const uploadResult = await cloudinaryService.uploadCourseContent(
          formData.pdfFile,
          courseId,
          'main-pdf',
          (progress) => {
            setFormData(prev => ({ ...prev, pdfProgress: progress.percentage }));
          }
        );
        pdfUrl = uploadResult.secure_url;
      }

      // Upload course parts to Cloudinary (if exist)
      const uploadedParts = [];
      for (let i = 0; i < courseParts.length; i++) {
        const part = courseParts[i];
        if (part.file) {
          const uploadResult = await cloudinaryService.uploadCourseContent(
            part.file,
            courseId,
            `part-${part.partNumber}`,
            (progress) => {
              updateCoursePart(part.id, { uploadProgress: progress.percentage });
            }
          );
          uploadedParts.push({
            partNumber: part.partNumber,
            title: part.title,
            description: part.description,
            contentType: part.contentType,
            fileUrl: uploadResult.secure_url,
          });
        }
      }

      // Create lessons array with main content
      const lessons = [];
      
      // Add video lesson if exists
      if (videoUrl) {
        lessons.push({
          id: `lesson-video-${Date.now()}`,
          courseId,
          title: 'Course Video',
          content: formData.description,
          contentType: 'video',
          videoUrl,
          order: 1,
          duration: formData.duration,
        });
      }

      // Add PDF lesson if exists
      if (pdfUrl) {
        lessons.push({
          id: `lesson-pdf-${Date.now()}`,
          courseId,
          title: 'Course Materials',
          content: formData.description,
          contentType: 'pdf',
          pdfUrl,
          order: videoUrl ? 2 : 1,
        });
      }

      // Add additional parts as lessons
      uploadedParts.forEach((part, index) => {
        lessons.push({
          id: `lesson-part-${part.partNumber}-${Date.now()}`,
          courseId,
          title: part.title,
          content: part.description,
          contentType: part.contentType === 'video' ? 'video' : 'pdf',
          videoUrl: part.contentType === 'video' ? part.fileUrl : undefined,
          pdfUrl: part.contentType === 'document' ? part.fileUrl : undefined,
          order: lessons.length + 1,
        });
      });

      // Save course data to Firebase
      const courseData: Omit<Course, 'id'> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        language: formData.language as Language,
        thumbnail: coverImageUrl,
        teacherId: user?.role === 'school' ? `manual-${Date.now()}` : (user?.id || ''),
        teacherName: user?.role === 'school' ? teacherInfo.name : (user?.name || 'Unknown Teacher'),
        teacherEmail: user?.role === 'school' ? teacherInfo.email : user?.email,
        teacherEducationLevel: user?.role === 'school' ? teacherInfo.educationLevel : undefined,
        schoolId: user?.schoolId,
        lessons,
        enrolledCount: 0,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Saving course to Firebase:', courseData);
      await coursesService.createCourse(courseData);

      toast.success('Course uploaded successfully!');
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        language: 'en',
        coverImageUrl: '',
        coverImageFile: null,
        coverImageProgress: 0,
        videoFile: null,
        videoProgress: 0,
        pdfFile: null,
        pdfProgress: 0,
        duration: 0,
      });
      setCourseParts([]);
      setTeacherInfo({
        name: '',
        email: '',
        educationLevel: '',
      });
      onCourseCreated?.();
    } catch (error: any) {
      console.error('Upload error:', error);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
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

          {/* Cover Image Section */}
          <div className="border rounded-lg p-5 bg-muted/30">
            <Label className="text-base font-semibold block mb-4">Cover Image *</Label>
            <Tabs value={coverImageMode} onValueChange={(v: any) => setCoverImageMode(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="file">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="url">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Image URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="file" className="mt-4 space-y-4">
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverImageFileSelect(file);
                  }}
                  disabled={loading}
                  className="w-full h-12 cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 1280x720px, Max 5MB (JPG, PNG, WEBP)
                </p>
                {formData.coverImageFile && (
                  <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                      <img
                        src={URL.createObjectURL(formData.coverImageFile)}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-xs text-muted-foreground min-w-0">
                      <p className="truncate font-medium">{formData.coverImageFile.name}</p>
                      <p className="mt-1">Size: {(formData.coverImageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
                {loading && formData.coverImageProgress > 0 && (
                  <div className="space-y-2 p-3 bg-background rounded-md border">
                    <Progress value={formData.coverImageProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Uploading cover image... {formData.coverImageProgress}%
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="url" className="mt-4 space-y-4">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value, coverImageFile: null })}
                  disabled={loading}
                  className="w-full"
                />
                {formData.coverImageUrl && (
                  <div className="w-full h-40 rounded-lg overflow-hidden border">
                    <img
                      src={formData.coverImageUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter a direct link to an image (must be publicly accessible)
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          {/* Teacher Information Input (for school users) or Teacher Info Display (for teachers) */}
          {user?.role === 'school' ? (
            <div className="space-y-4 border rounded-lg p-4 bg-primary/5">
              <Label className="text-sm font-medium">Teacher Information *</Label>
              <p className="text-xs text-muted-foreground">
                Enter the details of the teacher who will be responsible for this course
              </p>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="teacherName" className="text-sm">Teacher Name *</Label>
                  <Input
                    id="teacherName"
                    value={teacherInfo.name}
                    onChange={(e) => setTeacherInfo({ ...teacherInfo, name: e.target.value })}
                    placeholder="e.g., John Doe"
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherEmail" className="text-sm">Teacher Email *</Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    value={teacherInfo.email}
                    onChange={(e) => setTeacherInfo({ ...teacherInfo, email: e.target.value })}
                    placeholder="e.g., john.doe@school.com"
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherEducation" className="text-sm">Education Level *</Label>
                  <Select
                    value={teacherInfo.educationLevel}
                    onValueChange={(value) => setTeacherInfo({ ...teacherInfo, educationLevel: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD / Doctorate</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {teacherInfo.name && teacherInfo.email && teacherInfo.educationLevel && (
                <div className="flex items-start gap-3 p-3 bg-background rounded-md border mt-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{teacherInfo.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{teacherInfo.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{teacherInfo.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {teacherInfo.educationLevel === 'bachelor' && "Bachelor's Degree"}
                      {teacherInfo.educationLevel === 'master' && "Master's Degree"}
                      {teacherInfo.educationLevel === 'phd' && "PhD / Doctorate"}
                      {teacherInfo.educationLevel === 'diploma' && "Diploma"}
                      {teacherInfo.educationLevel === 'certificate' && "Certificate"}
                      {teacherInfo.educationLevel === 'other' && "Other"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 border rounded-lg p-4 bg-primary/5">
              <Label className="text-sm font-medium">Course Teacher</Label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{user?.name?.charAt(0) || '👤'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You will be automatically assigned as the teacher for this course
              </p>
            </div>
          )}

          {/* Direct File Upload Section */}
          <div className="border-t pt-6 mt-6">
            <div className="mb-5">
              <Label className="text-base font-semibold block">Course Content (Required) *</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Upload video and/or PDF materials for this course. At least one is required.
              </p>
            </div>

            <div className="space-y-5">
              {/* Video Upload */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <FileVideo className="h-5 w-5 text-primary flex-shrink-0" />
                  <Label htmlFor="videoFile" className="font-semibold text-sm">Course Video</Label>
                </div>
                <div className="space-y-3">
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoFileSelect(file);
                    }}
                    disabled={loading}
                    className="w-full h-12 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 500MB • Formats: MP4, WebM, OGG, MOV
                  </p>
                  {formData.videoFile && (
                    <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">Selected: {formData.videoFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, videoFile: null })}
                        disabled={loading}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {loading && formData.videoProgress > 0 && (
                    <div className="space-y-2 p-3 bg-background rounded-md border">
                      <Progress value={formData.videoProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Uploading video... {formData.videoProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Duration (optional) */}
              {formData.videoFile && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="duration" className="text-sm block mb-2">Video Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 45"
                    disabled={loading}
                    className="max-w-xs"
                  />
                </div>
              )}

              {/* PDF Upload */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <Label htmlFor="pdfFile" className="font-semibold text-sm">Course PDF Materials</Label>
                </div>
                <div className="space-y-3">
                  <Input
                    id="pdfFile"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePdfFileSelect(file);
                    }}
                    disabled={loading}
                    className="w-full h-12 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 10MB • Format: PDF only
                  </p>
                  {formData.pdfFile && (
                    <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">Selected: {formData.pdfFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {(formData.pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, pdfFile: null })}
                        disabled={loading}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {loading && formData.pdfProgress > 0 && (
                    <div className="space-y-2 p-3 bg-background rounded-md border">
                      <Progress value={formData.pdfProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Uploading PDF... {formData.pdfProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {!formData.videoFile && !formData.pdfFile && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/10">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Upload at least one file (video or PDF) to continue
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Course Parts Section */}
          <div className="space-y-5 border-t pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-base font-semibold">Additional Parts/Lessons (Optional)</Label>
                <p className="text-xs text-muted-foreground">
                  Add more videos or documents if your course has multiple parts
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addCoursePart} 
                className="flex-shrink-0 mt-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Part
              </Button>
            </div>

            {courseParts.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No additional parts. Click "Add Part" if your course has multiple lessons.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {courseParts.map((part, index) => (
                <Card key={part.id} className="overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <h4 className="font-semibold">Part {part.partNumber}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCoursePart(part.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`part-title-${part.id}`} className="text-sm">Part Title *</Label>
                      <Input
                        id={`part-title-${part.id}`}
                        value={part.title}
                        onChange={(e) => updateCoursePart(part.id, { title: e.target.value })}
                        placeholder="e.g., Introduction to Algebra"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`part-desc-${part.id}`} className="text-sm">Part Description</Label>
                      <Textarea
                        id={`part-desc-${part.id}`}
                        value={part.description}
                        onChange={(e) => updateCoursePart(part.id, { description: e.target.value })}
                        placeholder="Brief description of this part"
                        rows={2}
                        className="w-full resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`part-type-${part.id}`} className="text-sm">Content Type *</Label>
                      <Select
                        value={part.contentType}
                        onValueChange={(value: 'video' | 'document') => 
                          updateCoursePart(part.id, { contentType: value, file: null })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <FileVideo className="h-4 w-4" />
                              <span>Video (Max 500MB)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="document">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Document (Max 10MB)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor={`part-file-${part.id}`} className="text-sm">
                        Upload {part.contentType === 'video' ? 'Video' : 'Document'} *
                      </Label>
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
                        className="w-full h-12 cursor-pointer"
                      />
                      {part.file && (
                        <div className="text-xs p-3 bg-muted/50 rounded-md border">
                          <p className="font-medium truncate">Selected: {part.file.name}</p>
                          <p className="text-muted-foreground mt-1">
                            Size: {(part.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                      {loading && part.uploadProgress > 0 && (
                        <div className="space-y-2 p-3 bg-background rounded-md border">
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
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-background pb-2">
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
