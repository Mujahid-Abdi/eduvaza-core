# Quiz Publishing Fix

## Issue
Quizzes created by teachers were not appearing on the public quiz page (`/quizzes`).

## Root Cause
The public quiz page only displays quizzes where `isPublished: true`, but the quiz creation flow was defaulting to `isPublished: false` with no way to change it.

## Solution

### 1. Added Publish Toggle in Quiz Builder
- Added a "Publish Quiz" toggle in the Settings step (Step 3) of the quiz creation flow
- Teachers can now choose to publish the quiz immediately when creating it
- Also added a "Multiplayer Mode" toggle for future multiplayer features

### 2. Added Publish/Unpublish Buttons
- Added publish/unpublish buttons to quiz cards in the teacher quiz management page
- Teachers can now toggle the published status of existing quizzes with one click
- Different button styles for published vs unpublished quizzes

### 3. Updated Quiz Service
The quiz service already had the correct logic:
- `getQuizzes()` - Returns only published quizzes (for public page)
- `getQuizzesByTeacher()` - Returns all quizzes for a teacher (for management)

## How to Use

### Creating a New Quiz
1. Go to Teacher Dashboard → Quizzes
2. Click "Create Quiz"
3. Fill in quiz details and questions
4. In the Settings step, toggle "Publish Quiz" to ON
5. Save the quiz

### Publishing an Existing Quiz
1. Go to Teacher Dashboard → Quizzes
2. Find the quiz you want to publish
3. Click the "Publish" button on the quiz card
4. The quiz will now appear on the public quiz page

### Unpublishing a Quiz
1. Go to Teacher Dashboard → Quizzes
2. Find the published quiz
3. Click the "Unpublish" button
4. The quiz will be removed from the public quiz page but remain in your drafts

## Testing
1. Create a quiz with "Publish Quiz" toggled ON
2. Visit `/quizzes` (public quiz page)
3. Verify the quiz appears in the list
4. Go back to teacher dashboard and unpublish it
5. Verify it no longer appears on the public page
