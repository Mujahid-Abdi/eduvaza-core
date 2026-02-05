# Quiz System Testing Guide 🧪

## Prerequisites
✅ `.env` file created (done!)
✅ Firebase configured
✅ Logged in as a teacher

## Step-by-Step Testing

### 1️⃣ Access Teacher Quiz Page
1. Make sure you're logged in as a **teacher**
2. Navigate to: **Teacher Dashboard** → **Quizzes** (from sidebar)
3. URL should be: `http://localhost:8080/teacher/quizzes`

**Expected Result:**
- Page loads without errors
- You see "My Quizzes" heading
- Tabs: All, Published, Drafts, Scheduled, Completed
- "Create Quiz" button visible

---

### 2️⃣ Create Your First Quiz

#### Step 1: Quiz Details
1. Click **"Create Quiz"** button
2. Fill in:
   - **Title**: "My First Quiz"
   - **Description**: "Testing the quiz system"
   - **Quiz Type**: Select "Practice Quiz"
   - **Language**: Select "English"
   - **Difficulty**: Select "Medium"
   - **Time Limit**: Enter "10" (minutes)
3. Click **"Next"** button

**Expected Result:**
- Form accepts all inputs
- Moves to Questions step

#### Step 2: Add Questions
1. Click **"+ MCQ"** to add a multiple choice question
2. Fill in:
   - **Question**: "What is 2 + 2?"
   - **Option 1**: "3"
   - **Option 2**: "4" ← Click the radio button to mark as correct
   - **Option 3**: "5"
   - **Option 4**: "6"
   - **Points**: 10
   - **Time Limit**: 30 seconds
3. Click **"+ True/False"** to add another question
4. Fill in:
   - **Question**: "The sky is blue"
   - Click radio button next to **"True"** to mark as correct
   - **Points**: 5
   - **Time Limit**: 15 seconds
5. Click **"Next"** button

**Expected Result:**
- Questions are added successfully
- Total points shown: 15
- Moves to Settings step

#### Step 3: Configure Settings
1. Toggle **"Publish Quiz"** to **ON** (important!)
2. Keep other settings as default:
   - Shuffle Questions: OFF
   - Shuffle Options: ON
   - Show Results: ON
   - Passing Score: 60%
3. Click **"Next"** button

**Expected Result:**
- Settings saved
- Moves to Preview step

#### Step 4: Preview & Save
1. Review your quiz in the preview
2. Check:
   - Title and description are correct
   - Both questions appear
   - Correct answers are marked with green checkmarks
3. Click **"Save Quiz"** button

**Expected Result:**
- Success toast: "Quiz created successfully!"
- Returns to quiz list
- Your new quiz appears in the list
- Badge shows "Published"

---

### 3️⃣ View Quiz on Public Page

1. Open a new tab or window
2. Navigate to: `http://localhost:8080/quizzes`
3. Look for your quiz: "My First Quiz"

**Expected Result:**
- Your quiz appears on the public page
- Shows: 2 questions, 15 points, 10 minutes
- Difficulty badge: Medium
- Language badge: EN

---

### 4️⃣ Test Filtering

On the public quiz page:
1. Click **"Medium"** in the Difficulty filter
2. Your quiz should still appear
3. Click **"Hard"** in the Difficulty filter
4. Your quiz should disappear
5. Click **"All Difficulties"** to reset

**Expected Result:**
- Filtering works correctly
- Quiz appears/disappears based on filters

---

### 5️⃣ Test Search

On the public quiz page:
1. Type "First" in the search box
2. Your quiz should appear
3. Type "xyz123" in the search box
4. Your quiz should disappear (no results)
5. Clear the search box

**Expected Result:**
- Search works correctly
- Results update in real-time

---

### 6️⃣ Create a Draft Quiz

1. Go back to Teacher Quiz page
2. Click **"Create Quiz"** again
3. Fill in basic details:
   - Title: "Draft Quiz"
   - Description: "This is a draft"
4. Add one question (any type)
5. In Settings step: Keep **"Publish Quiz"** toggle **OFF**
6. Save the quiz

**Expected Result:**
- Quiz saved successfully
- Appears in "Drafts" tab on teacher page
- Does NOT appear on public quiz page

---

### 7️⃣ Test Tabs

On Teacher Quiz page:
1. Click **"All"** tab → Should see both quizzes
2. Click **"Published"** tab → Should see only "My First Quiz"
3. Click **"Drafts"** tab → Should see only "Draft Quiz"

**Expected Result:**
- Tabs filter quizzes correctly
- Published and draft quizzes separated

---

## ✅ Success Checklist

- [ ] Can access Teacher Quiz page
- [ ] Can create a quiz with multiple questions
- [ ] Can publish a quiz
- [ ] Published quiz appears on public page
- [ ] Can create a draft quiz
- [ ] Draft quiz hidden from public
- [ ] Filtering works (difficulty, language)
- [ ] Search works
- [ ] Tabs work (All, Published, Drafts)
- [ ] No console errors (except Cloudinary warnings)

---

## 🐛 Troubleshooting

### Quiz not appearing on public page?
- Check if "Publish Quiz" toggle was ON when saving
- Refresh the page
- Check browser console for errors

### Can't create quiz?
- Make sure you're logged in as a teacher
- Check Firebase connection
- Check browser console for errors

### Page not loading?
- Restart the dev server: `npm run dev`
- Clear browser cache
- Check if port 8080 is available

---

## 📊 What to Check in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Look for collection: **`quizzes`**
3. You should see your quiz documents
4. Each document should have:
   - title
   - description
   - isPublished (true/false)
   - teacherId (your user ID)
   - questions array
   - createdAt timestamp

---

## 🎉 Next Steps

Once basic testing is complete:
- Test with different question types
- Test with different languages
- Test with different difficulty levels
- Create multiple quizzes
- Test as different users (student, admin)

---

## 📝 Notes

- Cloudinary errors are normal if not configured (doesn't affect quizzes)
- Quizzes are stored in Firebase Firestore
- Published quizzes are visible to everyone
- Draft quizzes are only visible to creator and admins
- All changes are saved in real-time

---

**Happy Testing! 🚀**
