# AI Chatbot Setup Guide

## Overview
This guide explains how the Gemini AI chatbot has been integrated into the EduVaza platform.

## What Was Added

### 1. **Dependencies**
- `@google/generative-ai` - Google's Gemini AI SDK

### 2. **Environment Variables**
Added to `.env`:
```
VITE_GEMINI_API_KEY="AIzaSyDtv-v7atoaC27r1R9h3CwjzxzIbEzt_m4"
```

### 3. **Services**

#### `src/services/geminiAI.ts`
- Main AI service that handles communication with Gemini API
- Features:
  - Chat conversations with history
  - File upload and analysis (images, PDFs, text)
  - Document summarization
  - Practice question generation
  - Context-aware responses

#### `src/services/chatHistory.ts`
- Manages chat history persistence in Firestore
- Saves/loads chat messages per user
- Allows clearing chat history

### 4. **Components**

#### `src/components/student/AIChatbot.tsx`
- Main chatbot interface
- Features:
  - Message display with markdown support
  - File upload (images, PDFs, text up to 10MB)
  - Summarize button for uploaded files
  - Generate questions button for uploaded files
  - Minimize/maximize functionality
  - Clear history button
  - Auto-scroll to latest message
  - Loading states

#### `src/components/student/AIChatbotButton.tsx`
- Floating draggable button
- Features:
  - Positioned on right side of screen
  - Draggable up/down
  - Hover tooltip
  - Pulse indicator when closed
  - Opens/closes chatbot

#### `src/components/layout/StudentLayout.tsx`
- Wrapper layout for student pages
- Automatically includes chatbot button for students only
- Replaces DashboardLayout in student pages

### 5. **Updated Pages**
All student pages now use `StudentLayout` instead of `DashboardLayout`:
- StudentDashboard.tsx
- CourseDetailPage.tsx
- LessonViewerPage.tsx
- StudentQuizPage.tsx
- QuizExplorePage.tsx
- StudentLeaderboard.tsx
- StudentDownloads.tsx
- StudentSettings.tsx

### 6. **Firestore Rules**
Added rule for chat history:
```javascript
match /chatHistory/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## How It Works

### Chat Flow
1. Student clicks floating chat button
2. Chat history loads from Firestore
3. Student types message or uploads file
4. Message sent to Gemini API with context
5. Response displayed in chat
6. Both messages saved to Firestore

### File Processing
1. Student uploads file (image/PDF/text)
2. File converted to base64
3. Student can:
   - Send with custom question
   - Click summarize for automatic summary
   - Click generate questions for practice questions
4. Gemini processes file with appropriate prompt
5. Response displayed and saved

### Draggable Button
1. Button appears on right side of screen
2. Hover shows grip handle
3. Drag handle to move button up/down
4. Position constrained to viewport
5. Click button to open/close chat

## Features

### For Students
- ✅ Ask any educational questions
- ✅ Upload study materials for analysis
- ✅ Get document summaries
- ✅ Generate practice questions
- ✅ Chat history persists across sessions
- ✅ Draggable interface
- ✅ Minimize/maximize chat
- ✅ Clear history anytime
- ✅ Markdown formatting in responses
- ✅ File attachments visible in chat

### Technical Features
- ✅ Gemini 1.5 Flash model
- ✅ Context-aware conversations
- ✅ Multi-modal input (text + images)
- ✅ Firestore persistence
- ✅ Role-based access (students only)
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Responsive design

## File Support

### Supported Formats
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, TXT
- Max size: 10MB

### File Operations
1. **Summarize**: Get comprehensive summary of document content
2. **Generate Questions**: Create 5-10 practice questions with answers
3. **Ask About**: Send custom questions about the file content

## Security

### Access Control
- Only authenticated students can access chatbot
- Each user's chat history is private
- Firestore rules enforce user-level isolation

### Data Privacy
- Chat history stored in Firestore
- User can clear history anytime
- No data shared between users

## Configuration

### Gemini API Settings
Located in `src/services/geminiAI.ts`:
```typescript
generationConfig: {
  maxOutputTokens: 2048,
  temperature: 0.7,
}
```

### Model Selection
Currently using: `gemini-1.5-flash`
- Fast responses
- Good for educational content
- Supports multi-modal input

## Deployment

### Before Deploying
1. Ensure Gemini API key is set in production environment
2. Deploy Firestore rules: `npm run firebase:deploy:rules`
3. Build application: `npm run build`
4. Deploy: `npm run firebase:deploy`

### Environment Variables
Make sure to set in your hosting platform:
```
VITE_GEMINI_API_KEY=your-production-api-key
```

## Troubleshooting

### Chatbot not appearing
- Check user role is 'student'
- Verify StudentLayout is being used
- Check browser console for errors

### API errors
- Verify API key is correct
- Check API quota/limits
- Ensure network connectivity

### Chat history not saving
- Check Firestore rules are deployed
- Verify user authentication
- Check browser console for errors

### File upload failing
- Verify file size < 10MB
- Check file format is supported
- Ensure base64 conversion succeeds

## Future Enhancements

Potential improvements:
- Voice input/output
- Multi-language support
- Integration with course materials
- Study schedule recommendations
- Collaborative study sessions
- Quiz generation from conversations
- Export chat history
- Share conversations with teachers
- AI-powered study plans

## API Usage

### Gemini API Costs
- Free tier: 60 requests per minute
- Monitor usage in Google Cloud Console
- Consider rate limiting for production

### Optimization Tips
- Use appropriate model (flash vs pro)
- Implement caching for common queries
- Add rate limiting per user
- Monitor token usage

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Firestore rules are deployed
3. Test API key in Google AI Studio
4. Review chat history in Firestore console

---

**Note**: This chatbot is designed as a study aid. Remind students to use it responsibly and not for completing assessments.
