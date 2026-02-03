# Navigation Guide - Course & Quiz Pages

## Student Navigation Flow

### From Student Dashboard
```
Student Dashboard
├── "Explore Quizzes" Button → /student/quiz-explore
├── "Browse Courses" Button → /student/browse (existing)
└── Course Cards (Click) → /student/course/:courseId
```

### Course Detail Page (`/student/course/:courseId`)
```
Course Detail Page
├── Back Button → Returns to previous page
├── About Tab
│   ├── Course Description
│   ├── What You'll Learn
│   ├── Course Details
│   └── Curriculum
├── Lessons Tab
│   └── List of all lessons with progress
└── Contact Tab
    ├── Instructor Profile
    ├── Contact Information
    └── Send Message Button
```

### Quiz Exploration Page (`/student/quiz-explore`)
```
Quiz Exploration Page
├── Search Bar (Filter quizzes)
├── Featured Quizzes Section
│   └── Top 3 featured quizzes
├── All Quizzes Tab
│   └── Grid of all available quizzes
├── Popular Tab
│   └── Ranked list of popular quizzes
└── Recent Tab
    └── Recently added quizzes

Each Quiz Card → /student/quiz/:quizId (existing)
```

## Teacher Navigation Flow

### From Teacher Course Page
```
Teacher Course Page (/teacher/courses)
├── "Create Course" Button → Opens Course Upload Dialog
└── Course Cards (Click) → /teacher/course/:courseId
```

### Teacher Course Detail Page (`/teacher/course/:courseId`)
```
Teacher Course Detail Page
├── Back Button → Returns to /teacher/courses
├── Edit Course Button → Opens Course Edit Dialog
├── Preview Button → Preview as student
├── Delete Button → Delete course with confirmation
├── Overview Tab
│   ├── Course Description
│   └── Course Details
├── Lessons Tab
│   ├── Add Lesson Button
│   └── List of lessons with Edit/Delete
├── Students Tab
│   └── Enrolled students list
└── Analytics Tab
    ├── Completion Rate
    ├── Average Progress
    └── Active Students
```

## Quick Access Points

### Student
- **Dashboard** → Course cards are now clickable
- **Dashboard** → "Explore Quizzes" button added
- **Any Course Card** → Click to view full details

### Teacher
- **Course Page** → Course cards are now clickable
- **Course Detail** → Full management interface
- **Course Detail** → Quick edit/delete actions

## URL Structure

### Student URLs
```
/student/course/:courseId          # Course detail with tabs
/student/quiz-explore              # Quiz discovery page
/student/quiz/:quizId              # Individual quiz (existing)
```

### Teacher URLs
```
/teacher/course/:courseId          # Course management detail
/teacher/courses                   # Course list (existing)
```

## Key Interactions

### Course Cards
- **Hover Effect:** Background changes, play button appears
- **Click:** Navigates to course detail page
- **Progress Bar:** Shows completion percentage (students only)

### Quiz Cards
- **Hover Effect:** Play button overlay appears
- **Click:** Navigates to quiz page
- **Badges:** Show difficulty, language, and other metadata

### Navigation Buttons
- **Back Button:** Returns to previous page
- **Breadcrumbs:** Show current location (future enhancement)

## Mobile Responsiveness

All pages are fully responsive:
- **Desktop:** Multi-column grid layouts
- **Tablet:** 2-column layouts
- **Mobile:** Single column, stacked layout

## Accessibility Features

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators on buttons and links
- Semantic HTML structure
- Screen reader friendly

## Animation Timing

- **Page Load:** 0-200ms stagger
- **Card Hover:** 200ms transition
- **Tab Switch:** Instant with fade
- **Button Click:** Immediate feedback

## Future Enhancements

1. **Breadcrumb Navigation**
   - Show path: Dashboard > Courses > Course Name
   
2. **Quick Actions Menu**
   - Right-click context menu on cards
   
3. **Keyboard Shortcuts**
   - Ctrl+K for search
   - Esc to go back
   
4. **Deep Linking**
   - Direct links to specific tabs
   - Share course/quiz URLs
