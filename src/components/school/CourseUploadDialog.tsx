import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Trash2, FileVideo, Loader2, Image as ImageIcon, Link as LinkIcon, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { cloudinaryService } from '@/services/cloudinary';
import { coursesService } from '@/services/courses';
import { mockCategories } from '@/services/mockData';
import type { Language } from '@/types';

interface CourseUploadDialogProps {
  onCourseCreated?: () => void;
}

interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  description: string;
  videoFile: File | null;
  uploadProgress: number;
  duration: number;
}

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

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
    isPaid: false,
    price: 0,
    currency: 'USD',
    bankName: '',
    accountNumber: '',
    accountName: '',
    mobileMoneyNumber: '',
    mobileMoneyProvider: '',
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const addLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      lessonNumber: lessons.length + 1,
      title: '',
      description: '',
      videoFile: null,
      uploadProgress: 0,
      duration: 0,
    };
    setLessons([...lessons, newLesson]);
  };

  const removeLesson = (id: string) => {
    const updatedLessons = lessons.filter(lesson => lesson.id !== id);
    const renumberedLessons = updatedLessons.map((lesson, index) => ({
      ...lesson,
      lessonNumber: index + 1,
    }));
    setLessons(renumberedLessons);
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, ...updates } : lesson
    ));
  };

  const handleVideoFileSelect = (lessonId: string, file: File) => {
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error('Video size exceeds 500MB. Please select a smaller file.');
      return;
    }

    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }

    updateLesson(lessonId, { videoFile: file });
    toast.success(`Video selected: ${file.name}`);
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

    if (user?.role === 'school') {
      if (!teacherInfo.name || !teacherInfo.email || !teacherInfo.educationLevel) {
        toast.error('Please fill in all teacher information');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(teacherInfo.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }

    if (coverImageMode === 'url' && !formData.coverImageUrl) {
      toast.error('Please provide a cover image URL');
      return false;
    }
    if (coverImageMode === 'file' && !formData.coverImageFile) {
      toast.error('Please upload a cover image');
      return false;
    }

    if (lessons.length === 0) {
      toast.error('Please add at least one lesson with a video');
      return false;
    }

    for (const lesson of lessons) {
      if (!lesson.title) {
        toast.error(`Please provide a title for Lesson ${lesson.lessonNumber}`);
        return false;
      }
      if (!lesson.videoFile) {
        toast.error(`Please upload a video for Lesson ${lesson.lessonNumber}`);
        return false;
      }
    }

    if (formData.isPaid) {
      if (!formData.price || formData.price <= 0) {
        toast.error('Please enter a valid price for the paid course');
        return false;
      }
      if (!formData.bankName && !formData.mobileMoneyNumber) {
        toast.error('Please provide at least one payment method (bank or mobile money)');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check authentication first
    if (!user || !user.id) {
      toast.error('You must be logged in to upload a course. Please log in and try again.');
      console.error('Upload failed: User not authenticated', { user });
      return;
    }

    console.log('User authenticated:', {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    });

    setLoading(true);

    try {
      console.log('Starting course upload...');
      const courseId = `course-${Date.now()}`;
      let coverImageUrl = formData.coverImageUrl;

      // Upload cover image
      if (coverImageMode === 'file' && formData.coverImageFile) {
        console.log('Uploading cover image...');
        toast.info('Uploading cover image...');
        try {
          const uploadResult = await cloudinaryService.uploadCourseThumbnail(
            formData.coverImageFile,
            courseId,
            (progress) => {
              setFormData(prev => ({ ...prev, coverImageProgress: progress.percentage }));
            }
          );
          coverImageUrl = uploadResult.secure_url;
          console.log('Cover image uploaded:', coverImageUrl);
        } catch (error: any) {
          console.error('Cover image upload failed:', error);
          throw new Error(`Cover image upload failed: ${error.message}`);
        }
      }

      // Upload lesson videos
      console.log(`Uploading ${lessons.length} lesson videos...`);
      const uploadedLessons = [];
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        if (lesson.videoFile) {
          console.log(`Uploading lesson ${lesson.lessonNumber}...`);
          toast.info(`Uploading lesson ${lesson.lessonNumber} of ${lessons.length}...`);
          try {
            const uploadResult = await cloudinaryService.uploadCourseContent(
              lesson.videoFile,
              courseId,
              `lesson-${lesson.lessonNumber}`,
              (progress) => {
                updateLesson(lesson.id, { uploadProgress: progress.percentage });
              }
            );
            uploadedLessons.push({
              id: `lesson-${lesson.lessonNumber}-${Date.now()}`,
              courseId,
              title: lesson.title,
              content: lesson.description,
              contentType: 'video' as const,
              videoUrl: uploadResult.secure_url,
              order: lesson.lessonNumber,
              duration: lesson.duration,
            });
            console.log(`Lesson ${lesson.lessonNumber} uploaded successfully`);
          } catch (error: any) {
            console.error(`Lesson ${lesson.lessonNumber} upload failed:`, error);
            throw new Error(`Lesson ${lesson.lessonNumber} upload failed: ${error.message}`);
          }
        }
      }

      // Prepare course data
      console.log('Preparing course data...');
      const courseData: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        language: formData.language as Language,
        thumbnail: coverImageUrl,
        teacherId: user?.role === 'school' ? `manual-${Date.now()}` : (user?.id || ''),
        teacherName: user?.role === 'school' ? teacherInfo.name : (user?.name || 'Unknown Teacher'),
        teacherEmail: user?.role === 'school' ? teacherInfo.email : user?.email,
        schoolId: user?.role === 'school' ? user?.id : (user?.schoolId || null),
        lessons: uploadedLessons,
        enrolledCount: 0,
        isPublished: true,
        isPaid: formData.isPaid || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (user?.role === 'school' && teacherInfo.educationLevel) {
        courseData.teacherEducationLevel = teacherInfo.educationLevel;
      }

      if (formData.isPaid) {
        courseData.price = formData.price || 0;
        courseData.currency = formData.currency || 'USD';
        
        // Only add payment details if at least one method is provided
        const hasPaymentDetails = formData.bankName || formData.mobileMoneyNumber;
        if (hasPaymentDetails) {
          courseData.paymentDetails = {};
          
          if (formData.bankName) {
            courseData.paymentDetails.bankName = formData.bankName;
            courseData.paymentDetails.accountNumber = formData.accountNumber || '';
            courseData.paymentDetails.accountName = formData.accountName || '';
          }
          
          if (formData.mobileMoneyNumber) {
            courseData.paymentDetails.mobileMoneyNumber = formData.mobileMoneyNumber;
            courseData.paymentDetails.mobileMoneyProvider = formData.mobileMoneyProvider || '';
          }
        }
      }

      // Remove undefined and null values (Firebase doesn't like them)
      const cleanCourseData = JSON.parse(JSON.stringify(courseData, (key, value) => {
        // Keep false and 0, but remove undefined and null
        if (value === undefined || value === null) {
          return undefined;
        }
        return value;
      }));

      console.log('Saving course to Firebase...', {
        title: cleanCourseData.title,
        teacherId: cleanCourseData.teacherId,
        schoolId: cleanCourseData.schoolId,
        lessonsCount: cleanCourseData.lessons?.length || 0,
        isPaid: cleanCourseData.isPaid,
        hasPaymentDetails: !!cleanCourseData.paymentDetails,
        allFields: Object.keys(cleanCourseData)
      });
      
      toast.info('Saving course to database...');
      try {
        await coursesService.createCourse(cleanCourseData);
        console.log('Course saved successfully');
      } catch (error: any) {
        console.error('Firebase save failed:', error);
        throw new Error(`Failed to save course: ${error.message}`);
      }

      toast.success('Course uploaded successfully!');
      setOpen(false);
      resetForm();
      onCourseCreated?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      // Show more detailed error message
      const errorMessage = error.message || 'Failed to upload course. Please check the console for details.';
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      language: 'en',
      coverImageUrl: '',
      coverImageFile: null,
      coverImageProgress: 0,
      isPaid: false,
      price: 0,
      currency: 'USD',
      bankName: '',
      accountNumber: '',
      accountName: '',
      mobileMoneyNumber: '',
      mobileMoneyProvider: '',
    });
    setLessons([]);
    setTeacherInfo({
      name: '',
      email: '',
      educationLevel: '',
    });
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
          <DialogDescription>
            Fill in the course details and upload video lessons to create a new course.
          </DialogDescription>
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
                <SelectItem value="am">Amharic</SelectItem>
                <SelectItem value="ha">Hausa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Information */}
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
            </div>
          )}

          {/* Payment Section */}
          <div className="border rounded-lg p-5 bg-muted/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Course Pricing
                </Label>
                <p className="text-xs text-muted-foreground">
                  Set whether this course is free or paid
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="isPaid" className="text-sm">Paid Course</Label>
                <Switch
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
                  disabled={loading}
                />
              </div>
            </div>

            {formData.isPaid && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g., 29.99"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="KES">KES (KSh)</SelectItem>
                        <SelectItem value="TZS">TZS (TSh)</SelectItem>
                        <SelectItem value="UGX">UGX (USh)</SelectItem>
                        <SelectItem value="RWF">RWF (FRw)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Payment Details (Demo)</Label>
                  <p className="text-xs text-muted-foreground">
                    Provide at least one payment method for students to pay
                  </p>

                  <div className="space-y-3 p-3 bg-background rounded-md border">
                    <Label className="text-sm">Bank Transfer</Label>
                    <div className="grid gap-3">
                      <Input
                        placeholder="Bank Name"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        disabled={loading}
                      />
                      <Input
                        placeholder="Account Number"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        disabled={loading}
                      />
                      <Input
                        placeholder="Account Name"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 p-3 bg-background rounded-md border">
                    <Label className="text-sm">Mobile Money</Label>
                    <div className="grid gap-3">
                      <Select
                        value={formData.mobileMoneyProvider}
                        onValueChange={(value) => setFormData({ ...formData, mobileMoneyProvider: value })}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                          <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                          <SelectItem value="MTN Mobile Money">MTN Mobile Money</SelectItem>
                          <SelectItem value="Tigo Pesa">Tigo Pesa</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Mobile Money Number"
                        value={formData.mobileMoneyNumber}
                        onChange={(e) => setFormData({ ...formData, mobileMoneyNumber: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lessons Section */}
          <div className="space-y-5 border-t pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-base font-semibold">Course Lessons (Video Only) *</Label>
                <p className="text-xs text-muted-foreground">
                  Add video lessons for your course. At least one lesson is required.
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addLesson} 
                className="flex-shrink-0 mt-1"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Lesson
              </Button>
            </div>

            {lessons.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <FileVideo className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No lessons added yet. Click "Add Lesson" to start adding video lessons.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addLesson}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Lesson
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileVideo className="h-4 w-4" />
                        Lesson {lesson.lessonNumber}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLesson(lesson.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`lesson-title-${lesson.id}`} className="text-sm">Lesson Title *</Label>
                      <Input
                        id={`lesson-title-${lesson.id}`}
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                        placeholder="e.g., Introduction to the Topic"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`lesson-desc-${lesson.id}`} className="text-sm">Lesson Description</Label>
                      <Textarea
                        id={`lesson-desc-${lesson.id}`}
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                        placeholder="Brief description of this lesson"
                        rows={2}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor={`lesson-video-${lesson.id}`} className="text-sm">
                        Upload Video *
                      </Label>
                      <Input
                        id={`lesson-video-${lesson.id}`}
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleVideoFileSelect(lesson.id, file);
                          }
                        }}
                        disabled={loading}
                        className="w-full h-12 cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Max 500MB • Formats: MP4, WebM, OGG, MOV
                      </p>
                      {lesson.videoFile && (
                        <div className="text-xs p-3 bg-muted/50 rounded-md border">
                          <p className="font-medium truncate">Selected: {lesson.videoFile.name}</p>
                          <p className="text-muted-foreground mt-1">
                            Size: {(lesson.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                      {loading && lesson.uploadProgress > 0 && (
                        <div className="space-y-2 p-3 bg-background rounded-md border">
                          <Progress value={lesson.uploadProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Uploading... {lesson.uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`lesson-duration-${lesson.id}`} className="text-sm">
                        Duration (minutes)
                      </Label>
                      <Input
                        id={`lesson-duration-${lesson.id}`}
                        type="number"
                        min="0"
                        value={lesson.duration || ''}
                        onChange={(e) => updateLesson(lesson.id, { duration: parseInt(e.target.value) || 0 })}
                        placeholder="e.g., 15"
                        disabled={loading}
                        className="max-w-xs"
                      />
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
