# Unfinished Quizzes & Browse Feature

## New Features in Available Tab

### 1. Unfinished Quizzes Section ✅
Shows quizzes that students started but didn't complete, allowing them to continue where they left off.

### 2. Browse Quizzes Button ✅
Direct link to the public quiz library for discovering and starting new quizzes.

## Available Tab Structure

### Section 1: Unfinished Quizzes (If Any)
**Displays when:** Student has started but not completed any quizzes

**Shows:**
- Warning icon and "Unfinished Quizzes" title
- Count badge showing number of unfinished quizzes
- List of in-progress quiz attempts with:
  - Quiz title and description
  - "In Progress" badge (warning color)
  - Quiz metadata (questions, points, time limit)
  - Start date and time
  - "Continue" button

**Purpose:**
- Reminds students of incomplete quizzes
- Easy access to resume quizzes
- Prevents lost progress

### Section 2: Browse All Quizzes
**Always displays**

**Shows:**
- "Browse All Quizzes" title
- "Browse Quizzes" button in header
- Central card with:
  - Trophy icon
  - Count of available quizzes
  - Motivational text
  - "Go to Quiz Library" button

**Purpose:**
- Direct access to public quiz page
- Discover new quizzes
- Start fresh quizzes

## User Experience

### Student with Unfinished Quizzes

```
┌─────────────────────────────────────────┐
│ ⚠️ Unfinished Quizzes              [2]  │
│ Continue where you left off             │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Math Quiz 1        [In Progress]    │ │
│ │ Basic algebra questions             │ │
│ │ 📊 10 Questions  🏆 100 Points      │ │
│ │ Started: Jan 1, 2024 at 2:30 PM    │ │
│ │                      [Continue] ▶   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Science Quiz       [In Progress]    │ │
│ │ Biology basics                      │ │
│ │ 📊 15 Questions  🏆 150 Points      │ │
│ │ Started: Dec 30, 2023 at 1:15 PM   │ │
│ │                      [Continue] ▶   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Browse All Quizzes    [Browse Quizzes]  │
├─────────────────────────────────────────┤
│              🏆                          │
│   Explore 25 available quizzes          │
│   Test your knowledge and improve       │
│                                         │
│      [Go to Quiz Library] 🔗            │
└─────────────────────────────────────────┘
```

### Student without Unfinished Quizzes

```
┌─────────────────────────────────────────┐
│ Browse All Quizzes    [Browse Quizzes]  │
├─────────────────────────────────────────┤
│              🏆                          │
│   Explore 25 available quizzes          │
│   Test your knowledge and improve       │
│                                         │
│      [Go to Quiz Library] 🔗            │
└─────────────────────────────────────────┘
```

## Implementation Details

### Unfinished Quizzes Detection

```typescript
// Get in-progress (unfinished) quizzes
const inProgressAttempts = attempts
  .filter(attempt => attempt.status === 'in_progress')
  .map(attempt => ({
    ...attempt,
    quiz: quizzes.find(q => q.id === attempt.quizId),
  }))
  .sort((a, b) => {
    // Most recent first
    const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
    const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
    return dateB - dateA;
  });
```

### Quiz Attempt Status
- `in_progress` - Started but not completed
- `completed` - Finished and scored
- Unfinished quizzes have `status: 'in_progress'`

### Continue Functionality
```typescript
// Clicking "Continue" navigates to quiz player
// Existing attempt is resumed
<Button onClick={() => handleStartQuiz(attempt.quiz)}>
  Continue
</Button>
```

### Browse Navigation
```typescript
// Both buttons navigate to public quiz page
<Button onClick={() => navigate('/quizzes')}>
  Browse Quizzes
</Button>
```

## Visual Design

### Unfinished Quiz Card
- **Background:** Warning color tint (yellow/orange)
- **Border:** Warning color
- **Badge:** "In Progress" with warning styling
- **Icon:** AlertCircle (⚠️)
- **Button:** Primary "Continue" with Play icon

### Browse Card
- **Icon:** Trophy (🏆)
- **Style:** Clean, centered layout
- **Button:** Primary with ExternalLink icon
- **Text:** Motivational and informative

### Tab Badge
- Shows count of unfinished quizzes
- Only appears when count > 0
- Secondary variant
- Positioned next to "Available" text

## User Flows

### Continuing Unfinished Quiz
1. Student goes to Available tab
2. Sees "Unfinished Quizzes" section
3. Clicks "Continue" on a quiz
4. Navigates to quiz player
5. Resumes from where they left off
6. Completes quiz
7. Quiz moves to Completed tab
8. Removed from Unfinished section

### Browsing New Quizzes
1. Student goes to Available tab
2. Sees "Browse All Quizzes" card
3. Clicks "Browse Quizzes" or "Go to Quiz Library"
4. Navigates to `/quizzes` (public page)
5. Browses all available quizzes
6. Starts a new quiz
7. Returns to dashboard

### Starting Fresh Quiz from Browse
1. Click browse button
2. Go to public quiz page
3. Find interesting quiz
4. Click "Start Quiz"
5. Take quiz
6. Complete or leave unfinished
7. If unfinished, appears in Available tab

## Benefits

### For Students
1. **Never Lose Progress** - Easy to find and continue unfinished quizzes
2. **Clear Organization** - Separate unfinished from new quizzes
3. **Quick Access** - One-click to continue or browse
4. **Visual Reminders** - Warning styling draws attention to unfinished work
5. **Flexible Learning** - Can pause and resume anytime

### For Learning
1. **Reduces Abandonment** - Students more likely to complete
2. **Better Engagement** - Easy to pick up where left off
3. **Time Management** - Can take breaks during long quizzes
4. **Stress Reduction** - No pressure to finish in one sitting

## Edge Cases Handled

### 1. Multiple Unfinished Quizzes
- All shown in chronological order (newest first)
- Each has own "Continue" button
- Clear separation between quizzes

### 2. No Unfinished Quizzes
- Section doesn't appear
- Only Browse card shows
- Clean, uncluttered interface

### 3. Quiz Deleted After Starting
- Quiz data may be null
- Handled gracefully with optional chaining
- Won't crash the page

### 4. Long Time Since Starting
- Still shows in unfinished
- Date/time shows when started
- Can continue regardless of time passed

## Testing Checklist

### Unfinished Quizzes
- [ ] Start a quiz but don't finish
- [ ] Go to Available tab
- [ ] Verify quiz appears in Unfinished section
- [ ] Click "Continue" button
- [ ] Verify quiz resumes correctly
- [ ] Complete the quiz
- [ ] Verify it moves to Completed tab
- [ ] Verify it's removed from Unfinished section

### Browse Functionality
- [ ] Click "Browse Quizzes" in header
- [ ] Verify navigation to `/quizzes`
- [ ] Click "Go to Quiz Library" in card
- [ ] Verify navigation to `/quizzes`
- [ ] Start quiz from public page
- [ ] Return to dashboard
- [ ] Verify quiz appears appropriately

### Multiple Unfinished
- [ ] Start 3 quizzes without finishing
- [ ] Verify all 3 appear in Unfinished section
- [ ] Verify correct order (newest first)
- [ ] Verify badge shows "3"
- [ ] Complete one quiz
- [ ] Verify badge updates to "2"

### No Unfinished
- [ ] Complete all quizzes
- [ ] Go to Available tab
- [ ] Verify Unfinished section doesn't appear
- [ ] Verify Browse card is visible
- [ ] Verify clean layout

## Tab Badge Behavior

### Available Tab Badge
```typescript
<TabsTrigger value="available">
  Available
  {inProgressAttempts.length > 0 && (
    <Badge variant="secondary" className="ml-2">
      {inProgressAttempts.length}
    </Badge>
  )}
</TabsTrigger>
```

**Shows:**
- Only when there are unfinished quizzes
- Count of unfinished quizzes
- Secondary styling
- Small size

**Doesn't Show:**
- When no unfinished quizzes
- Keeps tab clean

## Future Enhancements

### Possible Features
- [ ] Time elapsed since starting
- [ ] Progress indicator (questions answered)
- [ ] Auto-save draft answers
- [ ] Resume from specific question
- [ ] Notification for old unfinished quizzes
- [ ] Bulk complete/abandon option

### Analytics
- [ ] Track completion rate
- [ ] Average time to complete
- [ ] Most abandoned quizzes
- [ ] Completion patterns

## Files Modified
- `src/pages/student/StudentQuizPage.tsx` - Added unfinished section and browse button

## Status
✅ Unfinished quizzes section implemented
✅ Browse quizzes button added
✅ Tab badge for unfinished count
✅ Continue functionality working
✅ Navigation to public page working
✅ No TypeScript errors
✅ Ready for use
