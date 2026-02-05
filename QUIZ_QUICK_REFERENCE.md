# Quiz System - Quick Reference Guide

## 🎯 Overview
The quiz system is now fully integrated with Firebase. No more mock data!

## 📍 Where to Find Quizzes

### Public Quiz Page
- **URL**: `/quizzes`
- **Who can access**: Everyone (students, guests, logged-in users)
- **What shows**: Only **published** quizzes
- **Features**: Search, filter by difficulty/language

### Teacher Quiz Page
- **URL**: `/teacher/quizzes`
- **Who can access**: Teachers only
- **What shows**: Teacher's own quizzes (published + drafts)
- **Features**: Create, edit, schedule, view analytics

### School Quiz Page
- **URL**: `/school/quizzes`
- **Who can access**: School admins only
- **What shows**: School admin's quizzes (published + drafts)
- **Features**: Create, edit, schedule, view analytics

### Admin Quiz Management
- **URL**: `/admin/manage-quizzes`
- **Who can access**: Super admins only
- **What shows**: ALL quizzes from all users
- **Features**: View all, create, delete, statistics

## 🔧 Creating a Quiz

### Step 1: Quiz Details
- Title
- Description
- Quiz Type (Practice/Scheduled)
- Language (EN/FR/AR/SW)
- Difficulty (Easy/Medium/Hard)
- Time Limit (optional)

### Step 2: Add Questions
- MCQ (Multiple Choice)
- True/False
- Short Answer
- Set points per question
- Set time limit per question

### Step 3: Settings
- **Publish Quiz** ← Important! Turn ON to make public
- Shuffle Questions
- Shuffle Options
- Show Results
- Passing Score (%)

### Step 4: Preview & Save
- Review all questions
- Click "Save Quiz"

## 🔍 Quiz Visibility

| Creator Action | Public Sees | Creator Sees | Admin Sees |
|---------------|-------------|--------------|------------|
| Save as Draft | ❌ No       | ✅ Yes       | ✅ Yes     |
| Publish Quiz  | ✅ Yes      | ✅ Yes       | ✅ Yes     |

## 📊 Quiz Tabs (Teacher/School Pages)

- **All**: All your quizzes
- **Published**: Only published quizzes
- **Drafts**: Only unpublished quizzes
- **Scheduled**: Quizzes with scheduled times
- **Completed**: Finished quizzes with results

## 🔥 Firebase Structure

```
Collection: quizzes
├── quiz-id-1
│   ├── title: "Math Quiz"
│   ├── isPublished: true
│   ├── teacherId: "user-123"
│   ├── questions: [...]
│   └── ...
├── quiz-id-2
└── quiz-id-3
```

## ⚡ Quick Actions

### To make a quiz public:
1. Edit quiz
2. Go to Settings step
3. Turn ON "Publish Quiz"
4. Save

### To hide a quiz:
1. Edit quiz
2. Go to Settings step
3. Turn OFF "Publish Quiz"
4. Save

### To delete a quiz:
1. Go to Admin > Manage Quizzes
2. Find the quiz
3. Click trash icon
4. Confirm deletion

## 🎨 Quiz Difficulty Colors

- **Easy**: Green badge
- **Medium**: Yellow badge
- **Hard**: Red badge

## 🌍 Supported Languages

- 🇬🇧 English (en)
- 🇫🇷 French (fr)
- 🇸🇦 Arabic (ar)
- 🇹🇿 Swahili (sw)

## 📝 Question Types

### Multiple Choice (MCQ)
- 2-4 options
- One correct answer
- Click radio button to mark correct

### True/False
- 2 options (True/False)
- One correct answer

### Short Answer
- Text input
- Specify correct answer
- Case-sensitive matching

## 💡 Tips

1. **Always preview** before saving
2. **Set appropriate time limits** for questions
3. **Use clear, concise questions**
4. **Test your quiz** before publishing
5. **Check difficulty level** matches content
6. **Add descriptions** to help students

## 🐛 Troubleshooting

**Quiz not showing on public page?**
- Check if "Publish Quiz" is ON
- Verify quiz was saved successfully
- Check Firebase console

**Can't see my quiz?**
- Make sure you're logged in
- Check you're on the right page (teacher/school)
- Refresh the page

**Quiz creation fails?**
- Check internet connection
- Verify Firebase is configured
- Check browser console for errors

## 📞 Need Help?

Check these files:
- `QUIZ_FIREBASE_INTEGRATION_COMPLETE.md` - Full technical details
- `QUIZ_SYSTEM_READY.md` - Complete overview
- Firebase Console - View actual data

---

**Quick Start**: Login → Quiz Page → Create Quiz → Add Questions → Publish → Done! ✅
