# 🚀 AI Chatbot - Quick Reference Card

## ⚡ Quick Actions

| Action | Desktop | Mobile |
|--------|---------|--------|
| **Open Chat** | Click 💬 button | Tap 💬 button |
| **Resize** | Drag left edge | N/A (auto full-width) |
| **Move Button** | Drag grip handle | N/A (fixed position) |
| **Minimize** | Click [-] | Tap [-] |
| **Clear History** | Click 🗑 | Tap 🗑 |
| **Close** | Click [×] | Tap [×] |
| **Send Message** | Enter or Click Send | Tap Send |
| **Attach File** | Click 📎 | Tap 📎 |
| **Summarize** | Click 📄 icon | Tap 📄 icon |
| **Generate Questions** | Click ? icon | Tap ? icon |

## 📏 Size Specifications

```
Desktop:
├─ Min Width: 320px
├─ Max Width: 800px
├─ Default: 384px
└─ Height: 600px (fixed)

Mobile:
├─ Width: 100vw - 32px (full width)
├─ Height: calc(100vh - 100px)
└─ Position: Bottom-fixed
```

## 🎯 Access by Role

| Role | Access | Pages |
|------|--------|-------|
| **Student** | ✅ | All student pages |
| **Teacher** | ✅ | All teacher pages |
| **School Admin** | ✅ | All school pages |
| **Platform Admin** | ✅ | All admin pages |
| **Public** | ✅ | Home, Courses, About, Contact |

## 📁 File Support

```
Supported Formats:
├─ Images: JPEG, PNG, GIF, WebP
├─ Documents: PDF
└─ Text: TXT

Max Size: 10MB

Actions:
├─ Upload & Ask
├─ Summarize
└─ Generate Questions
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Esc` | Close chat |
| `Tab` | Navigate elements |

## 🎨 UI Components

```
Header:
├─ Status indicator (●)
├─ Title
├─ Minimize button (-)
├─ Clear history (🗑)
└─ Close button (×)

Body:
├─ Message area (scrollable)
└─ File preview (when file attached)

Footer:
├─ Attach button (📎)
├─ Input field
└─ Send button
```

## 🔧 Configuration

```typescript
// Model
Model: gemini-2.5-flash-lite

// API Key
VITE_GEMINI_API_KEY=your-key-here

// Database
Collection: chatHistory
Rules: User-specific access
```

## 📱 Responsive Breakpoints

```
< 768px   → Mobile (full-width)
768-1023px → Tablet (fixed 384px)
> 1024px  → Desktop (resizable)
```

## 🎯 Common Use Cases

### Students
```
✓ Homework help
✓ Concept explanations
✓ Study summaries
✓ Practice questions
✓ Exam preparation
```

### Teachers
```
✓ Lesson planning
✓ Content ideas
✓ Quiz generation
✓ Research assistance
✓ Administrative help
```

### Admins
```
✓ System queries
✓ Data analysis
✓ Report generation
✓ Technical support
✓ Policy guidance
```

### Public
```
✓ Course information
✓ Platform guidance
✓ General inquiries
✓ Feature exploration
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Button not visible | Check role/page, refresh |
| Can't resize | Desktop only, hover left edge |
| Chat not loading | Check internet, API key |
| File upload fails | Check size (<10MB), format |
| History not saving | Check authentication |
| Mobile layout broken | Clear cache, check viewport |

## 📊 Performance Tips

```
✓ Keep chat history reasonable
✓ Clear old conversations
✓ Compress large files
✓ Use specific questions
✓ Close when not needed
```

## 🔒 Privacy & Security

```
✓ User-specific history
✓ Secure API communication
✓ No data sharing
✓ Clear history option
✓ Role-based access
```

## 📚 Documentation Links

```
Quick Start:    CHATBOT_QUICK_START.md
User Guide:     AI_CHATBOT_README.md
Features:       AI_CHATBOT_FEATURES.md
Setup:          AI_CHATBOT_SETUP.md
Enhanced:       CHATBOT_ENHANCED.md
Visual Guide:   CHATBOT_VISUAL_GUIDE.md
Summary:        CHATBOT_FINAL_SUMMARY.md
```

## 🎓 Best Practices

### For Best Results
```
1. Be specific in questions
2. Provide context
3. Upload relevant files
4. Use follow-up questions
5. Review AI responses
```

### For Performance
```
1. Clear old history
2. Minimize when not using
3. Close unused chats
4. Optimize file sizes
5. Use appropriate model
```

## 🚀 Quick Start

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
http://localhost:5173

# 3. Login or browse public pages

# 4. Click 💬 button

# 5. Start chatting!
```

## 📞 Support

```
Issues:     Check console logs
Bugs:       Report to admin
Features:   Request via feedback
Help:       Check documentation
Updates:    Monitor changelog
```

## ✨ Pro Tips

```
💡 Resize for comfortable reading
💡 Use keyboard shortcuts
💡 Upload study materials
💡 Generate practice questions
💡 Clear history regularly
💡 Drag button to preferred position
💡 Use on mobile for on-the-go help
💡 Ask follow-up questions
💡 Verify important information
💡 Explore all features
```

## 🎯 Feature Status

```
✅ Chat conversations
✅ File upload
✅ Summarization
✅ Question generation
✅ Chat history
✅ Resizable width
✅ Mobile responsive
✅ Multi-role access
✅ Public access
✅ Drag positioning
✅ Minimize/maximize
✅ Clear history
```

## 📈 Version Info

```
Version:    2.0.0
Model:      gemini-2.5-flash-lite
Status:     Production Ready
Updated:    February 6, 2026
Build:      Successful
Tests:      All Passed
```

---

**Print this card for quick reference! 📄**

**Keep it handy while using the chatbot! 🎯**
