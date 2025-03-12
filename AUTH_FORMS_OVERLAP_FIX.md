# Login and Register Forms Overlap Fix

## Issue
Input field placeholders were overlapping with the left-side icons in both login and register forms.

## Root Cause
The icons were positioned at `left-3` (12px from left) and inputs had `pl-10` (40px padding-left). The Input component also has a default `px-3` (12px horizontal padding). This wasn't enough space between the icon and the placeholder text, causing visual overlap.

## Solution Applied

### Changed padding from `pl-10` to `pl-12` (48px)
This provides proper spacing between the icon (16px width at 12px from left = 28px) and placeholder text start (48px).

### Added `pointer-events-none` and `z-10` to icons
- `pointer-events-none`: Prevents icons from interfering with input interactions
- `z-10`: Ensures icons stay above the input field

### Added `z-10` to toggle buttons
Ensures password visibility toggle buttons stay clickable above the input field.

## Files Modified

### 1. LoginPage (`src/pages/auth/LoginPage.tsx`)
Fixed input fields:
- Email input: Changed `pl-10` to `pl-12`, added `z-10` to icon
- Password input: Changed `pl-10 pr-10` to `pl-12 pr-12`, added `z-10` to icon and button
- Phone input: Changed `pl-10` to `pl-12`, added `z-10` to icon

### 2. RegisterPage (`src/pages/auth/RegisterPage.tsx`)
Fixed input fields:
- School Name input: Changed `pl-11` to `pl-12`, added `z-10` to icon
- School Email input: Changed `pl-11` to `pl-12`, added `z-10` to icon
- Name input: Changed `pl-11` to `pl-12`, added `z-10` to icon
- Email input: Changed `pl-11` to `pl-12`, added `z-10` to icon
- Phone input: Changed `pl-11` to `pl-12`, added `z-10` to icon
- Password input: Changed `pl-11 pr-11` to `pl-12 pr-12`, added `z-10` to icon and button
- Confirm Password input: Changed `pl-11 pr-11` to `pl-12 pr-12`, added `z-10` to icon and button

## Technical Details

### Before:
```tsx
<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<Input className="pl-10" ... />
```
- Icon at 12px from left (16px width = ends at 28px)
- Input padding 40px from left
- Gap: Only 12px between icon and text (too small)

### After:
```tsx
<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
<Input className="pl-12" ... />
```
- Icon at 12px from left (16px width = ends at 28px)
- Input padding 48px from left
- Gap: 20px between icon and text (proper spacing)

## Testing
After applying these fixes:
1. Login page email, password, and phone fields display correctly
2. Register page all input fields display correctly
3. Icons and placeholders no longer overlap
4. Icons don't interfere with input interactions
5. Password toggle buttons remain clickable

## Browser Cache
If changes don't appear immediately:
1. Hard refresh: Ctrl + Shift + R (Windows/Linux) or Cmd + Shift + R (Mac)
2. Clear browser cache
3. Check dev server is running on http://localhost:8082/

## Date Fixed
February 3, 2026
