# Opportunities Feature

## Overview
The Opportunities feature allows administrators to post global opportunities like scholarships, universities, and free courses that are visible to all users (public access).

## Features

### Public Page (`/opportunities`)
- **Accessible to everyone** (no login required)
- View all active opportunities
- Filter by category:
  - Scholarships
  - Universities
  - Free Courses
  - Other
- Click on opportunity cards to visit external links
- Responsive grid layout with cover images

### Admin Management (`/admin/opportunities`)
- **Admin-only access** (super_admin role required)
- Create new opportunities
- Edit existing opportunities
- Delete opportunities
- Toggle active/inactive status
- View all opportunities (including inactive ones)

## Opportunity Structure

Each opportunity contains:
- **Title**: Name of the opportunity
- **Description**: Detailed description
- **Cover Image**: URL to cover image
- **Link**: External URL that opens in new tab
- **Category**: scholarship | university | free_course | other
- **Status**: Active/Inactive (only active shown on public page)
- **Metadata**: Created date, updated date, created by user ID

## File Structure

```
src/
├── pages/
│   ├── OpportunitiesPage.tsx          # Public page
│   └── admin/
│       └── ManageOpportunities.tsx    # Admin management page
├── services/
│   └── opportunities.ts               # Firebase service
├── types/
│   └── index.ts                       # Opportunity type definition
└── components/
    └── layout/
        ├── Navbar.tsx                 # Added opportunities link
        └── DashboardLayout.tsx        # Added admin sidebar link
```

## Routes

- `/opportunities` - Public page (no auth required)
- `/admin/opportunities` - Admin management (super_admin only)

## Firebase Collection

Collection name: `opportunities`

### Document Structure
```typescript
{
  title: string;
  description: string;
  coverImage: string;
  link: string;
  category: 'scholarship' | 'university' | 'free_course' | 'other';
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // User ID
}
```

### Security Rules
- **Read**: Public access (no authentication required)
- **Write**: Authenticated users only (intended for admins)

## Usage

### For Admins

1. **Navigate to Admin Dashboard**
   - Login as super_admin
   - Click "Opportunities" in sidebar

2. **Create Opportunity**
   - Click "Add Opportunity" button
   - Fill in all required fields:
     - Title
     - Description
     - Cover Image URL
     - External Link URL
     - Category
     - Active status
   - Click "Create Opportunity"

3. **Edit Opportunity**
   - Click edit icon on any opportunity
   - Modify fields
   - Click "Update Opportunity"

4. **Toggle Status**
   - Click eye icon to activate/deactivate
   - Inactive opportunities won't show on public page

5. **Delete Opportunity**
   - Click trash icon
   - Confirm deletion

### For Public Users

1. **View Opportunities**
   - Visit `/opportunities` or click "Opportunities" in navbar
   - No login required

2. **Filter Opportunities**
   - Click category buttons to filter
   - "All Opportunities" shows everything

3. **Access Opportunity**
   - Click "Learn More" button on any card
   - Opens external link in new tab

## API Methods

### `opportunitiesService`

```typescript
// Get active opportunities (public)
getActiveOpportunities(): Promise<Opportunity[]>

// Get all opportunities (admin)
getAllOpportunities(): Promise<Opportunity[]>

// Get single opportunity
getOpportunityById(id: string): Promise<Opportunity | null>

// Create opportunity (admin)
createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>

// Update opportunity (admin)
updateOpportunity(id: string, data: Partial<Opportunity>): Promise<void>

// Delete opportunity (admin)
deleteOpportunity(id: string): Promise<void>

// Toggle status (admin)
toggleOpportunityStatus(id: string, isActive: boolean): Promise<void>
```

## Styling

- Uses shadcn/ui components
- Responsive design (mobile, tablet, desktop)
- Category-specific colors:
  - Scholarships: Green
  - Universities: Blue
  - Free Courses: Purple
  - Other: Orange
- Hover effects and transitions
- Loading states and empty states

## Future Enhancements

Potential improvements:
- Search functionality
- Date-based filtering (deadline)
- Bookmark/save opportunities for logged-in users
- Email notifications for new opportunities
- Application tracking
- Rich text editor for descriptions
- Image upload to Firebase Storage
- Multiple images per opportunity
- Comments/reviews section
- Share to social media
