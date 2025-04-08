# Mobile Bottom Navigation - Quick Reference

## 🎯 What It Does
A smart mobile navigation bar that appears at the bottom of the screen on mobile devices, providing quick access to Home, Courses, Quizzes, and Opportunities pages.

## 🚀 Quick Start

### Already Implemented!
The mobile bottom nav is automatically included in all pages using `MainLayout`. No setup required!

### Test It Now
1. Open your app in a browser
2. Press `F12` to open DevTools
3. Press `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac) for device mode
4. Select any mobile device or set width < 768px
5. Navigate between pages and watch the magic! ✨

## 🎨 Key Features at a Glance

| Feature | Description |
|---------|-------------|
| **Auto-Hide** | Hides when scrolling down, shows when scrolling up |
| **Smart Visibility** | Always visible at page top and on route changes |
| **Smooth Animations** | Spring animations with staggered entrance |
| **Active Indicator** | Gradient bar that slides between tabs |
| **Ripple Effect** | Pulsing animation on active tab |
| **Tap Feedback** | Visual feedback on touch |
| **Safe Area Support** | Works with notched devices |

## 📱 Responsive Breakpoints

```css
/* Mobile: Bottom nav visible */
< 768px (md breakpoint)

/* Desktop: Bottom nav hidden */
≥ 768px (md breakpoint)
```

## 🎭 Visual States

### Active Tab
- ✅ Primary color icon and text
- ✅ Gradient top border indicator
- ✅ 110% scale on icon
- ✅ Pulsing ripple effect
- ✅ Bolder stroke weight (2.5)

### Inactive Tab
- Muted foreground color
- Standard stroke weight (2)
- Hover effect (color + scale)
- Tap scale effect (95%)

## 🔧 Customization Points

### Change Navigation Items
Edit `MobileBottomNav.tsx`:
```typescript
const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  // Add your items here
];
```

### Adjust Auto-Hide Behavior
```typescript
// Show threshold (pixels from top)
currentScrollY < 50  // Change this value

// Hide threshold (pixels scrolled)
currentScrollY > 100  // Change this value
```

### Modify Animations
```typescript
// Entrance animation
transition={{ type: 'spring', stiffness: 300, damping: 30 }}

// Tab indicator animation
transition={{ type: 'spring', stiffness: 500, damping: 30 }}

// Ripple effect
transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
```

## 🎨 Styling Classes

### Main Container
```css
fixed bottom-0 left-0 right-0 z-50 md:hidden
bg-background/95 backdrop-blur-lg
border-t border-border shadow-lg
```

### Active Indicator
```css
w-12 h-1 
bg-gradient-to-r from-primary/50 via-primary to-primary/50
rounded-b-full
```

### Icon Container
```css
h-6 w-6
text-primary (active) | text-muted-foreground (inactive)
scale-110 (active)
```

### Label
```css
text-[10px] mt-1 font-medium
text-primary (active) | text-muted-foreground (inactive)
```

## 🐛 Troubleshooting

### Nav Not Showing
- ✅ Check screen width is < 768px
- ✅ Verify you're on a page using `MainLayout`
- ✅ Check browser console for errors

### Auto-Hide Not Working
- ✅ Ensure page has scrollable content
- ✅ Check scroll event listener is attached
- ✅ Verify `lastScrollY` state is updating

### Animations Choppy
- ✅ Check for other heavy animations on page
- ✅ Verify GPU acceleration is enabled
- ✅ Test on different devices

### Active State Wrong
- ✅ Check route path matches exactly
- ✅ Verify `isActive` function logic
- ✅ Ensure `location.pathname` is correct

## 📊 Performance Tips

1. **Passive Scroll Listener**: Already implemented for smooth scrolling
2. **AnimatePresence**: Efficient mount/unmount animations
3. **CSS Transforms**: Hardware-accelerated animations
4. **Debounced Updates**: Scroll state updates are optimized

## 🔮 Enhancement Ideas

Want to extend the mobile nav? Here are some ideas:

```typescript
// Add badge notifications
<Badge className="absolute top-1 right-1">{count}</Badge>

// Add long-press actions
<div onContextMenu={handleLongPress}>

// Add swipe gestures
<motion.div drag="y" onDragEnd={handleSwipe}>

// Add haptic feedback (if supported)
if (navigator.vibrate) navigator.vibrate(10);
```

## 📚 Related Files

- `src/components/layout/MobileBottomNav.tsx` - Main component
- `src/components/layout/MainLayout.tsx` - Layout wrapper
- `src/index.css` - Safe area styles
- `MOBILE_BOTTOM_NAV.md` - Full documentation

## 💡 Pro Tips

1. **Test on Real Devices**: Emulators don't always show the true experience
2. **Check Safe Areas**: Test on devices with notches (iPhone X+)
3. **Dark Mode**: Nav automatically adapts to theme
4. **RTL Support**: Works with right-to-left languages
5. **Accessibility**: Consider adding ARIA labels for screen readers

## 🎉 That's It!

Your mobile bottom navigation is ready to go. Enjoy the smooth, modern mobile experience! 🚀

---

**Need Help?** Check the full documentation in `MOBILE_BOTTOM_NAV.md`
