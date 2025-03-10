# Student Questions Feature

## Overview
The Student Questions feature allows students to ask questions about courses and quizzes, and enables teachers and school administrators to respond to these questions efficiently.

## Features

### For Students
- **Ask Questions**: Students can submit questions about specific courses or quizzes
- **Question Context**: Each question is linked to a specific course/quiz and teacher
- **Get Answers**: Students receive notifications when their questions are answered

### For Teachers
- **View Questions**: Teachers can see all questions from students about their courses and quizzes
- **Answer Questions**: Teachers can respond to student questions directly
- **Filter & Organize**: Questions can be filtered by:
  - Status (Pending/Answered)
  - Type (Course/Quiz)
  - All questions
- **Statistics Dashboard**: View metrics including:
  - Total questions
  - Pending questions
  - Answered questions
  - Response rate

### For School Administrators
- **Monitor All Questions**: School admins can see questions across all teachers and courses
- **Answer Questions**: School admins can also answer questions if needed
- **Teacher Information**: Each question shows which teacher is responsible
- **Same Filtering**: All the same filtering options as teachers

## Routes

### Teacher Dashboard
- **Path**: `/teacher/questions`
- **Component**: `TeacherStudentQuestions`
- **Access**: Teachers only

### School Dashboard
- **Path**: `/school/questions`
- **Component**: `SchoolStudentQuestions`
- **Access**: School administrators only

## Components

### AskQuestionDialog
**Location**: `src/components/student/AskQuestionDialog.tsx`

A reusable dialog component that students can use to ask questions.

**Props**:
- `type`: 'course' | 'quiz'
- `itemId`: ID of the course or quiz
- `itemTitle`: Title of the course or quiz
- `teacherId`: ID of the teacher
- `teacherName`: Name of the teacher
- `schoolId`: (optional) ID of the school

**Usage Example**:
```tsx
import { AskQuestionDialog } from '@/components/student';

<AskQuestionDialog
  type="course"
  itemId="course123"
  itemTitle="Mathematics 101"
  teacherId="teacher456"
  teacherName="Mr. Smith"
  schoolId="school789"
/>
```

## Services

### studentQuestions.ts
**Location**: `src/services/studentQuestions.ts`

Provides Firebase integration for managing student questions.

**Functions**:
- `submitQuestion()`: Submit a new question
- `answerQuestion()`: Answer a question
- `getTeacherQuestions()`: Get all questions for a teacher
- `getSchoolQuestions()`: Get all questions for a school
- `getStudentQuestions()`: Get all questions from a student
- `getItemQuestions()`: Get questions for a specific course/quiz
- `getQuestionById()`: Get a single question
- `getTeacherQuestionStats()`: Get statistics for a teacher
- `getSchoolQuestionStats()`: Get statistics for a school

## Data Structure

### StudentQuestion Interface
```typescript
interface StudentQuestion {
  id?: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  schoolId?: string;
  type: 'course' | 'quiz';
  itemId: string;
  itemTitle: string;
  question: string;
  status: 'pending' | 'answered';
  answer?: string;
  answeredBy?: string;
  answeredById?: string;
  createdAt: Timestamp;
  answeredAt?: Timestamp;
}
```

## Firebase Collection

**Collection Name**: `studentQuestions`

**Indexes Required**:
- `teacherId` + `createdAt` (descending)
- `schoolId` + `createdAt` (descending)
- `studentId` + `createdAt` (descending)
- `itemId` + `type` + `createdAt` (descending)

## Navigation

The "Student Questions" link appears in the sidebar navigation for:
- **Teachers**: Between "Quizzes" and "Schedule"
- **Schools**: Between "Quizzes" and "Analytics"

## Integration Points

### Where to Add AskQuestionDialog

1. **Course Pages**: Add the dialog to course detail pages where students view course content
2. **Quiz Pages**: Add the dialog to quiz pages (before, during, or after taking a quiz)
3. **Student Dashboard**: Can be added to show recent questions

### Example Integration in Course Page:
```tsx
import { AskQuestionDialog } from '@/components/student';

// In your course component
<div className="flex gap-2">
  <Button>Start Course</Button>
  <AskQuestionDialog
    type="course"
    itemId={course.id}
    itemTitle={course.title}
    teacherId={course.teacherId}
    teacherName={course.teacherName}
    schoolId={course.schoolId}
  />
</div>
```

## Future Enhancements

- Real-time notifications when questions are answered
- Email notifications for pending questions
- Question upvoting/helpful marking
- Public Q&A section where all students can see questions and answers
- AI-powered suggested answers
- Question categories/tags
- Search functionality
- Export questions and answers
- Analytics on common question topics

## Notes

- Currently uses mock data in the pages - integrate with Firebase by uncommenting the service calls
- Ensure proper Firebase security rules are set up for the `studentQuestions` collection
- Consider adding rate limiting to prevent spam
- Add moderation features for inappropriate questions
