# Quiz System - Quick Reference Guide

## For Students

### How to Take a Quiz
1. Go to `/quizzes` or `/student/quizzes`
2. Click "Start Quiz" on any quiz
3. Answer questions
4. Click "Next Question" or "Finish Quiz"
5. View your results

### How to Save a Quiz for Later
1. Find a quiz you want to take later
2. Click the bookmark icon (📑)
3. Quiz is saved to your "Saved" tab
4. Access it anytime from `/student/quizzes` → Saved tab

### How to Retake a Quiz
1. Go to `/student/quizzes` → Completed tab
2. Find the quiz you want to retake
3. Click "Retake Quiz" button
4. Take the quiz again
5. New attempt is recorded

### Student Dashboard Tabs
- **Available** - All quizzes you can take (with bookmark option)
- **Saved** - Quizzes you bookmarked for later
- **Completed** - Your quiz history with retake option

## For Teachers

### How to Create and Publish a Quiz
1. Go to Teacher Dashboard → Quizzes
2. Click "Create Quiz"
3. Fill in quiz details (Step 1)
4. Add questions (Step 2)
5. Configure settings (Step 3)
   - Toggle "Publish Quiz" to ON
   - Set other options
6. Preview (Step 4)
7. Click "Save Quiz"

### How to Publish a Draft Quiz
1. Go to Teacher Dashboard → Quizzes
2. Switch to "Drafts" tab
3. Find your draft quiz
4. Click "Publish" button
5. Quiz immediately appears on public page

### How to Unpublish a Quiz
1. Go to Teacher Dashboard → Quizzes
2. Find the published quiz
3. Click "Unpublish" button
4. Quiz is removed from public page (saved as draft)

## Quick Links

### Student Routes
- `/quizzes` - Browse all quizzes
- `/quiz/:quizId` - Take a specific quiz
- `/student/quizzes` - Your quiz dashboard
- `/student/leaderboard` - See rankings

### Teacher Routes
- `/teacher/quizzes` - Manage your quizzes
- `/teacher/analytics` - View quiz statistics

## Common Actions

### Save a Quiz
```
Click bookmark icon (📑) → Quiz saved
```

### Unsave a Quiz
```
Click filled bookmark icon (📑✓) → Quiz removed from saved
```

### Start a Quiz
```
Click "Start Quiz" button → Navigate to quiz player
```

### Retake a Quiz
```
Completed tab → Find quiz → Click "Retake Quiz"
```

### Publish a Quiz
```
Settings step → Toggle "Publish Quiz" ON → Save
OR
Drafts tab → Click "Publish" button
```

## Tips

### For Students
- Save quizzes you find interesting to take later
- Retake quizzes to improve your score
- Check the "Completed" tab to track your progress
- Look for the pass/fail badge to see if you passed

### For Teachers
- Keep quizzes as drafts while editing
- Publish when ready for students
- Unpublish to make changes
- Check analytics to see student performance

## Troubleshooting

### Quiz not appearing on public page?
- Make sure "Publish Quiz" is toggled ON
- Check if quiz is in "Published" tab in teacher dashboard

### Can't save a quiz?
- Make sure you're logged in
- Check your internet connection

### Retake button not working?
- Make sure you completed the quiz first
- Check if quiz is still published

### Bookmark not persisting?
- Make sure you're logged in
- Check if you have a stable internet connection

## Keyboard Shortcuts
- `Enter` - Submit answer (in quiz player)
- `Esc` - Exit quiz (shows confirmation)

## Status Indicators

### Quiz Badges
- 🟢 Easy - Green badge
- 🟡 Medium - Yellow badge
- 🔴 Hard - Red badge
- 🏆 Multiplayer - Trophy icon
- 📑 Saved - Filled bookmark
- ✓ Completed - Checkmark

### Pass/Fail
- Green badge - Passed (≥ passing score)
- Gray badge - Failed (< passing score)

## Data Persistence
- Saved quizzes persist across sessions
- Quiz attempts are permanently recorded
- Can retake quizzes unlimited times
- All attempts are tracked

## Need Help?
- Check the documentation files in the project root
- Contact support
- Report issues on GitHub
