# Course Upload Field Overlap Fix

## Issue
The course upload dialog had overlapping fields in two main sections:
1. Cover Image upload section (tabs overlapping)
2. Course Content section (video/PDF upload fields overlapping)

## Root Cause
The Radix UI Tabs component was rendering both TabsContent elements simultaneously. The inactive tab was invisible but still taking up space in the DOM, causing visual overlap with the active tab content.

## Solutions Applied

### 1. Fixed Tabs Component (`src/components/ui/tabs.tsx`)
Added `data-[state=inactive]:hidden` to the TabsContent component to completely hide inactive tabs:

```tsx
className={cn(
  "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=inactive]:hidden",
  className,
)}
```

### 2. Improved CourseUploadDialog Layout (`src/components/school/CourseUploadDialog.tsx`)

#### Dialog Container
- Increased width from `max-w-2xl` to `max-w-3xl` for more space
- Increased form spacing from `space-y-4` to `space-y-6`

#### Cover Image Section
- Added explicit `mb-4` to TabsList for proper separation
- Set TabsContent to `mt-4` for consistent spacing
- Wrapped file inputs with proper containers
- Added borders and backgrounds to file preview sections

#### Course Content Section
- Restructured with cleaner spacing hierarchy
- Added `mt-6` and `pt-6` for clear section separation
- Each upload box (video/PDF) has:
  - Consistent `mb-3` for labels
  - `space-y-3` for internal content
  - Proper padding (`p-3`) on preview containers
  - Borders on all containers for visual clarity

#### File Display Improvements
- Added `flex-shrink-0` to icons and buttons
- Added `min-w-0` and `flex-1` to text containers
- Added `truncate` class to prevent long filenames from breaking layout
- All inputs have explicit `w-full` class

#### Course Parts Section
- Improved card spacing with `space-y-4` internally
- Added border separator at the top of each part card
- Better visual hierarchy with consistent padding

## Testing
After applying these fixes:
1. Build completed successfully: `npm run build`
2. Dev server started on: `http://localhost:8082/`
3. All overlapping issues resolved in both Cover Image and Course Content sections

## Files Modified
1. `src/components/ui/tabs.tsx` - Added inactive tab hiding
2. `src/components/school/CourseUploadDialog.tsx` - Complete layout restructure

## Date Fixed
February 3, 2026
