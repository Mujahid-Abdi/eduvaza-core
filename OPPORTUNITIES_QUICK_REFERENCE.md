# Opportunities Feature - Quick Reference

## 🚀 Getting Started (3 Steps)

### Step 1: Deploy Firestore Rules
```bash
cd eduvaza-core
firebase deploy --only firestore:rules
```

### Step 2: Create First Opportunity (Admin)
1. Login as `super_admin`
2. Go to `/admin/opportunities`
3. Click "Add Opportunity"
4. Fill form and submit

### Step 3: View Public Page
- Visit `/opportunities` (no login needed)
- Your opportunity is live!

---

## 📍 URLs

| Page | URL | Access |
|------|-----|--------|
| Public View | `/opportunities` | Everyone |
| Admin Manage | `/admin/opportunities` | super_admin only |

---

## 🎯 Admin Actions

| Action | How To |
|--------|--------|
| **Create** | Click "Add Opportunity" button |
| **Edit** | Click pencil icon on row |
| **Delete** | Click trash icon on row |
| **Toggle Status** | Click eye/eye-off icon |
| **View Link** | Click external link icon |

---

## 📝 Opportunity Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| Title | Text | ✅ | "Google Africa Scholarship" |
| Description | Text | ✅ | "10,000 scholarships for developers..." |
| Cover Image | URL | ✅ | "https://example.com/image.jpg" |
| Link | URL | ✅ | "https://developers.google.com" |
| Category | Select | ✅ | scholarship / university / free_course / other |
| Active | Checkbox | ✅ | true = visible on public page |

---

## 🎨 Categories

| Category | Icon | Color | Use For |
|----------|------|-------|---------|
| Scholarship | 🎓 | Green | Financial aid, grants |
| University | 🏫 | Blue | University programs, admissions |
| Free Course | 📚 | Purple | Online courses, certifications |
| Other | ✨ | Orange | Competitions, events, etc. |

---

## 🔍 Public Page Features

- ✅ View all active opportunities
- ✅ Filter by category
- ✅ Click "Learn More" to visit external site
- ✅ No login required
- ✅ Mobile responsive

---

## 🛠️ Admin Page Features

- ✅ Create new opportunities
- ✅ Edit existing ones
- ✅ Delete opportunities
- ✅ Toggle active/inactive
- ✅ View all (including inactive)
- ✅ Image preview
- ✅ Form validation

---

## 🔒 Security

- **Public Page**: No authentication needed
- **Admin Page**: super_admin role required
- **Firestore**: Public read, authenticated write

---

## 📱 Navigation

### For Public Users
**Main Navbar** → Click "Opportunities" (between Quizzes and About)

### For Admins
**Admin Sidebar** → Click "Opportunities" (between Quizzes and Reports)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see opportunities | Deploy Firestore rules |
| Not showing on public page | Check "Active" checkbox |
| Can't access admin page | Login as super_admin |
| Image not loading | Use valid public URL |

---

## 💡 Example Opportunity

```json
{
  "title": "Mastercard Foundation Scholars Program",
  "description": "Full scholarship covering tuition, accommodation, books, and living expenses for African students pursuing undergraduate and graduate studies.",
  "coverImage": "https://example.com/mastercard-scholars.jpg",
  "link": "https://mastercardfdn.org/scholars-program",
  "category": "scholarship",
  "isActive": true
}
```

---

## 📊 Firebase Collection

**Collection Name**: `opportunities`

**Auto-created**: Yes (on first opportunity creation)

**Fields**: title, description, coverImage, link, category, isActive, createdAt, updatedAt, createdBy

---

## ✅ Testing Checklist

- [ ] Deploy Firestore rules
- [ ] Login as admin
- [ ] Create opportunity
- [ ] View on public page
- [ ] Test filters
- [ ] Edit opportunity
- [ ] Toggle status
- [ ] Test external link
- [ ] Test on mobile
- [ ] Logout and view public page

---

## 📚 Documentation

- **Complete Guide**: `OPPORTUNITIES_FEATURE.md`
- **Setup Guide**: `OPPORTUNITIES_SETUP.md`
- **Summary**: `OPPORTUNITIES_SUMMARY.md`
- **This File**: `OPPORTUNITIES_QUICK_REFERENCE.md`

---

## 🎉 You're Ready!

The feature is complete and ready to use. Start by deploying Firestore rules, then create your first opportunity!
