# 🚀 Quick Admin Dashboard Test

## ⚡ Fast Testing Guide

### 1. Open Your Browser
Navigate to: **http://localhost:8080**

### 2. Login as Admin
- Click "Login" or go to: **http://localhost:8080/auth/login**
- Enter credentials:
  - Email: `admin@eduvaza.com`
  - Password: Your admin password
  - (Or any 6+ char password if `VITE_USE_MOCK_AUTH=true`)

### 3. Auto-Redirect
✅ You should automatically be redirected to: **http://localhost:8080/admin**

### 4. Test Each Tab (30 seconds)

#### Tab 1: Overview
- See 2 pending schools
- Click "Approve" → Green toast ✅
- Click "Reject" → Red toast ✅

#### Tab 2: Schools
- See 5 schools listed
- Type in search box → Filters work ✅
- Check status badges (green/yellow/red) ✅

#### Tab 3: Users
- Click "Teachers" → See 1 teacher ✅
- Click "Students" → See 1 student ✅
- Click "School Admins" → See 1 school ✅
- Click "Warn" → Yellow toast ✅
- Click "Suspend" → Red toast ✅

#### Tab 4: Courses
- See 6 courses ✅
- Click delete icon → Green toast ✅

#### Tab 5: Quizzes
- See 5 quizzes ✅

#### Tab 6: Reports ⭐
- See 2 reported courses ✅
- Check reporter name ✅
- Check uploader name and role ✅
- Check school name ✅
- Click "Warn teacher/school" → Yellow toast ✅
- Click "Delete Course" → Green toast ✅
- Click "Resolve" → Green toast ✅

## ✅ Success Criteria

All of the following should work:
- [x] Admin auto-redirects to dashboard
- [x] All 6 tabs load without errors
- [x] Tab switching is smooth
- [x] All buttons show toast notifications
- [x] Search filters schools
- [x] Status badges are color-coded
- [x] Reports show full context
- [x] Layout is responsive

## 🐛 If Something Doesn't Work

1. **Check console** (F12) for errors
2. **Refresh the page** (Ctrl+R)
3. **Clear cache** (Ctrl+Shift+R)
4. **Check .env file** - Make sure Firebase config is correct
5. **Restart dev server** if needed

## 📱 Test on Mobile

1. Open browser dev tools (F12)
2. Click device toolbar icon
3. Select a mobile device
4. Verify layout adapts correctly

---

**Expected Time**: 2-3 minutes for full test
**Status**: Ready to test! 🎉
