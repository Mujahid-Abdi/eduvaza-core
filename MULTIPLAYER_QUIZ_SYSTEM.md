# Multiplayer Quiz Scheduling System

## Overview
A comprehensive system for creating, scheduling, and managing multiplayer quizzes with student registration and automatic conversion to self-practice after expiration.

## Features Implemented

### 1. Quiz Type Selection
When creating a quiz, admins/teachers/schools can now choose between:
- **Self Practice**: Students can take anytime, no registration required
- **Multiplayer (Scheduled)**: Live competitive quiz with registration and scheduling

### 2. Multiplayer Quiz Scheduling
For multiplayer quizzes, creators must set:
- **Start Date & Time**: When the quiz begins
- **End Date & Time**: When the quiz ends
- **Registration Deadline**: Last date/time students can register
- **Max Participants**: Maximum number of students (default: 100)

### 3. Student Registration System
- Students must register before the registration deadline
- Registration button shows in quiz detail modal
- Shows registered count vs max participants
- Students can unregister before the deadline
- Cannot register after deadline or if max participants reached

### 4. Quiz Detail Modal Enhancements
Shows comprehensive information:
- **Schedule Info**: Start time, end time, registration deadline
- **Registration Status**: Number of registered students
- **Registration Button**: Register/Unregister based on status
- **Start Button**: Only available if registered or quiz has started

### 5. Auto-Conversion System
- Automatically converts expired multiplayer quizzes to self-practice
- Runs when the public quiz page loads
- Checks if `scheduledEndTime` has passed
- Converts `isMultiplayer: false` and `quizType: 'practice'`

## Database Schema Updates

### Quiz Type
```typescript
interface Quiz {
  // ... existing fields
  
  // Multiplayer scheduling fields
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
  registrationDeadline?: Date;
  registeredStudents?: string[]; // Array of student IDs
  maxParticipants?: number;
}
```

## Service Methods Added

### quizService
```typescript
// Register student for multiplayer quiz
registerForQuiz(quizId: string, studentId: string): Promise<void>

// Unregister student from quiz
unregisterFromQuiz(quizId: string, studentId: string): Promise<void>

// Check if student is registered
isRegisteredForQuiz(quizId: string, studentId: string): Promise<boolean>

// Get count of registered students
getRegisteredStudentsCount(quizId: string): Promise<number>

// Auto-convert expired multiplayer quizzes
convertExpiredMultiplayerQuizzes(): Promise<void>
```

## User Flow

### For Quiz Creators (Admin/Teacher/School)
1. Click "Create Quiz" in quiz management page
2. Fill in quiz details
3. Select "Multiplayer (Scheduled)" as quiz type
4. Set schedule: start time, end time, registration deadline
5. Set max participants (optional)
6. Add questions and configure settings
7. Publish quiz

### For Students
1. Browse public quiz page
2. See multiplayer quizzes in "Multiplayer" tab
3. Click "View" on a quiz to see details
4. See schedule information and registered count
5. Click "Register Now" before deadline
6. Return when quiz starts to click "Join Game"
7. After quiz ends, it automatically becomes self-practice

## Validation Rules

### Registration
- ✅ Must be logged in
- ✅ Registration deadline not passed
- ✅ Not already registered
- ✅ Max participants not reached

### Quiz Start
- ✅ Must be registered (for multiplayer)
- ✅ Quiz start time has arrived (for multiplayer)
- ✅ Or quiz has converted to self-practice

## UI Components Updated

### QuizBuilder
- Added quiz type selector (self-practice vs multiplayer)
- Added scheduling fields for multiplayer
- Conditional rendering based on quiz type

### QuizzesPage
- Added registration state management
- Added registration handlers
- Updated quiz detail modal with schedule info
- Shows registered students count
- Registration/unregistration buttons
- Auto-conversion on page load

## Future Enhancements
- Email notifications for registration confirmation
- Reminders before quiz starts
- Waiting room for registered students
- Live leaderboard during quiz
- Post-quiz analytics for multiplayer sessions
- Ability to extend registration deadline
- Waitlist when max participants reached

## Testing Checklist
- [ ] Create multiplayer quiz with schedule
- [ ] Register for quiz as student
- [ ] Unregister from quiz
- [ ] Try registering after deadline (should fail)
- [ ] Try registering when max reached (should fail)
- [ ] Verify registered count updates
- [ ] Wait for quiz to expire and verify auto-conversion
- [ ] Start quiz after registration
- [ ] Verify self-practice quizzes still work normally
