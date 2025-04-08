# Opportunities Feature - Quick Setup Guide

## What's Been Added

A new public Opportunities page where admins can post global opportunities like scholarships, universities, and free courses.

## Files Created/Modified

### New Files
1. `src/pages/OpportunitiesPage.tsx` - Public page to view opportunities
2. `src/pages/admin/ManageOpportunities.tsx` - Admin page to manage opportunities
3. `src/services/opportunities.ts` - Firebase service for CRUD operations
4. `OPPORTUNITIES_FEATURE.md` - Complete feature documentation

### Modified Files
1. `src/types/index.ts` - Added Opportunity interface
2. `src/App.tsx` - Added routes for opportunities pages
3. `src/components/layout/Navbar.tsx` - Added "Opportunities" link
4. `src/components/layout/DashboardLayout.tsx` - Added admin sidebar link
5. `firestore.rules` - Added security rules for opportunities collection

## How to Use

### 1. Deploy Firestore Rules (Required)

```bash
cd eduvaza-core
firebase deploy --only firestore:rules
```

This will update your Firestore security rules to allow public read access to opportunities.

### 2. Access as Admin

1. Login as super_admin
2. Navigate to `/admin/opportunities` or click "Opportunities" in the admin sidebar
3. Click "Add Opportunity" to create your first opportunity

### 3. Create an Opportunity

Fill in the form:
- **Title**: e.g., "Full Scholarship to Harvard University"
- **Description**: Detailed description of the opportunity
- **Cover Image URL**: Direct URL to an image (e.g., from Cloudinary or any public URL)
- **Link**: External URL where users can learn more/apply
- **Category**: Choose from Scholarship, University, Free Course, or Other
- **Active**: Check to make it visible on public page

### 4. View Public Page

Visit `/opportunities` (no login required) to see all active opportunities.

## Example Opportunity Data

Here's an example to get you started:

```json
{
  "title": "Google Africa Developer Scholarship",
  "description": "Google is offering 10,000 scholarships for African developers to learn Android, Web, and Cloud development. Includes free courses, mentorship, and certification.",
  "coverImage": "https://example.com/google-scholarship.jpg",
  "link": "https://developers.google.com/africa",
  "category": "scholarship",
  "isActive": true
}
```

## Navigation

### Public Access
- Main navbar: Click "Opportunities" (between Quizzes and About)
- Direct URL: `/opportunities`

### Admin Access
- Admin sidebar: Click "Opportunities" (between Quizzes and Reports)
- Direct URL: `/admin/opportunities`

## Features

### Public Page
✅ View all active opportunities
✅ Filter by category (Scholarship, University, Free Course, Other)
✅ Click to visit external links
✅ Responsive design
✅ No login required

### Admin Page
✅ Create new opportunities
✅ Edit existing opportunities
✅ Delete opportunities
✅ Toggle active/inactive status
✅ View all opportunities (including inactive)
✅ Image preview
✅ Form validation

## Firestore Collection

Collection: `opportunities`

The service will automatically create this collection when you add your first opportunity. No manual setup needed!

## Security

- **Public page**: Anyone can view active opportunities (no auth required)
- **Admin page**: Only super_admin role can access
- **Firestore**: Public read, authenticated write (intended for admins)

## Testing

1. **Test Public Access**:
   - Logout or open incognito window
   - Visit `/opportunities`
   - Should see all active opportunities

2. **Test Admin Access**:
   - Login as super_admin
   - Visit `/admin/opportunities`
   - Create, edit, and delete opportunities

3. **Test Filtering**:
   - Create opportunities in different categories
   - Test category filters on public page

## Troubleshooting

### "Failed to load opportunities"
- Check Firebase connection
- Verify Firestore rules are deployed
- Check browser console for errors

### "Opportunity not showing on public page"
- Verify opportunity is marked as "Active"
- Check that isActive = true in Firestore

### "Can't access admin page"
- Verify you're logged in as super_admin
- Check user role in Firebase Authentication

### Image not loading
- Verify image URL is publicly accessible
- Check for CORS issues
- Use placeholder.svg as fallback

## Next Steps

1. Deploy Firestore rules
2. Create your first opportunity as admin
3. Share the `/opportunities` page with users
4. Monitor engagement and add more opportunities

## Support

For issues or questions, check:
- `OPPORTUNITIES_FEATURE.md` - Complete feature documentation
- Firebase Console - Check Firestore data and rules
- Browser DevTools - Check for console errors
