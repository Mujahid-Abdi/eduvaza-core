# Font Size & Spacing Update

## Summary
Updated the entire website with medium default font sizes, significantly reduced spacing between elements, and added left/right body margins for better content centralization. Also added user-adjustable font size controls in all settings pages.

## Changes Made

### 1. Global CSS Updates (index.css)
- **Base font size**: Set to 15px (medium default)
- **Font size classes**: Added `.font-small`, `.font-medium`, `.font-large`, `.font-extra-large`
- **Heading sizes**: Adjusted to medium proportions (h1: 2rem, h2: 1.65rem, etc.)
- **Line heights**: Set to 1.5 for body, 1.3 for headings
- **Component spacing**: Aggressively reduced padding and margins across cards, buttons, inputs, tables
- **Grid/Flex gaps**: Reduced to 0.75rem and 0.5rem respectively

### 2. Body Margins & Centralization
Added responsive left/right margins to body for better content presentation:
- **Mobile (default)**: 1.5rem (24px) on each side
- **Tablet (640px+)**: 2rem (32px) on each side
- **Desktop (1024px+)**: 3rem (48px) on each side
- **Large screens (1280px+)**: 4rem (64px) on each side, max-width 1920px
- **Content centering**: All containers and main content areas centered with `margin: 0 auto`

### 3. Tailwind Config (tailwind.config.ts)
- **Container**: Centered with no padding (body margins handle spacing)
- **Font sizes**: Updated scale to medium proportions
- **Spacing scale**: Aggressively reduced all values by 25-40%
  - space-2: 0.375rem (6px)
  - space-4: 0.75rem (12px)
  - space-6: 1rem (16px)
  - space-8: 1.25rem (20px)

### 4. Aggressive Spacing Overrides
All spacing utilities now use `!important` to ensure they apply:
- `space-y-*` classes: Reduced by 30-50%
- `gap-*` classes: Reduced by 30-40%
- `padding` utilities: Reduced by 25-40%
- `margin` utilities: Reduced by 25-40%

### 5. Font Size Control Feature
Created a complete font size adjustment system:

#### New Files:
- `src/hooks/useFontSize.ts` - Custom hook for managing font size state
- `src/components/settings/FontSizeControl.tsx` - Reusable font size selector component
- `src/pages/admin/AdminSettings.tsx` - New admin settings page

#### Updated Files:
- `src/pages/student/StudentSettings.tsx` - Added font size control
- `src/pages/teacher/TeacherSettings.tsx` - Added font size control
- `src/pages/school/SchoolSettings.tsx` - Added font size control
- `src/App.tsx` - Added admin settings route
- `src/main.tsx` - Initialize font size on app load

### 6. Font Size Options
Users can now choose from 4 font sizes:
- **Small**: 13px base
- **Medium**: 15px base (default)
- **Large**: 17px base
- **Extra Large**: 19px base

### 7. Persistence
Font size preference is saved to localStorage and persists across sessions.

## Visual Changes

### Before:
- Large spacing between elements (2rem, 3rem gaps)
- Content stretched edge-to-edge
- Inconsistent spacing across components

### After:
- Tight, compact spacing (0.5rem - 1rem gaps)
- Content centered with comfortable margins
- Consistent spacing throughout
- Professional, modern layout
- Better readability with proper whitespace

## Responsive Behavior

The layout now adapts beautifully across screen sizes:
- **Mobile**: Comfortable 24px margins, compact spacing
- **Tablet**: 32px margins, balanced layout
- **Desktop**: 48px margins, spacious but not wasteful
- **Large screens**: 64px margins, max-width constraint prevents over-stretching

## How to Use

### For Users:
1. Navigate to Settings page (available in Student, Teacher, School, and Admin dashboards)
2. Find the "Font Size" dropdown in the Profile/Language section
3. Select your preferred size (Small, Medium, Large, or Extra Large)
4. Changes apply immediately across the entire website
5. Preference is saved automatically

### For Developers:
The font size system uses CSS classes on the `<html>` element:
- `.font-small` - 13px base
- `.font-medium` - 15px base
- `.font-large` - 17px base
- `.font-extra-large` - 19px base

All font sizes throughout the app use `rem` units, so they scale proportionally with the base size.

## Access Settings Pages

- **Student**: `/student/settings`
- **Teacher**: `/teacher/settings`
- **School**: `/school/settings`
- **Admin**: `/admin/settings`

## Technical Details

### Spacing System:
1. Uses aggressive CSS overrides with `!important`
2. Targets all common Tailwind utility classes
3. Reduces component-level spacing
4. Ensures consistent spacing across all pages

### Centralization:
1. Body has responsive left/right padding
2. All containers centered with `margin: 0 auto`
3. Max-width constraint on large screens
4. No horizontal scrolling

### Font Size Control:
1. Uses React hooks for state management
2. Stores preference in localStorage
3. Applies CSS class to `<html>` element
4. All components inherit the sizing automatically via `rem` units
5. No page refresh required - changes apply instantly

## Benefits

- **Compact Layout**: More content visible without scrolling
- **Better UX**: Reduced visual clutter, easier to scan
- **Centralized Content**: Professional appearance with proper margins
- **Responsive**: Adapts beautifully to all screen sizes
- **Accessibility**: Users can adjust text size for better readability
- **Personalization**: Each user can set their preferred size
- **Consistency**: Spacing and sizing apply across all pages and dashboards
- **Performance**: Uses CSS classes, no JavaScript calculations needed
- **Persistence**: Settings saved and restored on every visit
