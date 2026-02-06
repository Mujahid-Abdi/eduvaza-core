# 🚀 AI Chatbot Quick Start Guide

## ✅ Status: READY TO USE

Your AI Study Assistant chatbot is fully configured and operational!

## 🎯 What You Have

A complete Gemini AI-powered chatbot with:
- ✅ Conversational AI (gemini-2.5-flash-lite)
- ✅ File upload & analysis
- ✅ Document summarization
- ✅ Practice question generation
- ✅ Persistent chat history
- ✅ Draggable floating interface
- ✅ Student-only access

## 🏃 How to Test

### 1. Start the Development Server
```bash
cd eduvaza-core
npm run dev
```

### 2. Login as a Student
- Go to http://localhost:5173
- Login with a student account
- Navigate to any student page (Dashboard, Courses, etc.)

### 3. Use the Chatbot
- Look for the floating chat button on the right side
- Click to open the chat interface
- Try these commands:
  - "Explain photosynthesis"
  - "What is algebra?"
  - Upload a file and click summarize
  - Upload a file and generate questions

## 📱 Features to Test

### Basic Chat
1. Click the floating button
2. Type: "Hello, can you help me study?"
3. Press Enter
4. See AI response

### File Upload
1. Click the paperclip icon
2. Select an image or PDF
3. Click the document icon to summarize
4. Or click the question icon to generate practice questions

### Draggable Button
1. Hover over the chat button
2. Drag the grip handle up or down
3. Position it where you prefer

### Chat History
1. Have a conversation
2. Close the chat
3. Refresh the page
4. Open chat again - history is preserved!

### Clear History
1. Click the trash icon in the header
2. Confirm - all messages deleted

## 🔧 Configuration

### Current Settings
- **Model**: gemini-2.5-flash-lite
- **API Key**: Configured in `.env`
- **Database**: Firestore `chatHistory` collection
- **Access**: Students only

### Environment Variable
```env
VITE_GEMINI_API_KEY="AIzaSyDtv-v7atoaC27r1R9h3CwjzxzIbEzt_m4"
```

## 📊 API Limits (Free Tier)

Your API key is on the free tier with these limits:
- **Requests per minute**: Limited
- **Requests per day**: Limited
- **Monitor usage**: https://ai.dev/rate-limit

If you hit limits:
- Wait a few minutes
- Or upgrade to paid tier for higher quotas

## 🎨 User Interface

### Floating Button
- **Location**: Right side of screen
- **Color**: Primary theme color
- **Indicator**: Green pulse when closed
- **Draggable**: Yes (up/down only)

### Chat Window
- **Size**: 384px × 600px
- **Minimized**: 320px × 64px
- **Position**: Bottom-right corner
- **Theme**: Follows app theme

## 🔒 Security

- ✅ Student-only access (role-based)
- ✅ Private chat history per user
- ✅ Firestore security rules deployed
- ✅ Secure API communication

## 📚 Documentation

- **User Guide**: `AI_CHATBOT_README.md`
- **Features**: `AI_CHATBOT_FEATURES.md`
- **Setup**: `AI_CHATBOT_SETUP.md`
- **Fix Details**: `CHATBOT_FIXED.md`

## 🐛 Troubleshooting

### Chatbot not appearing?
- Check you're logged in as a student
- Verify you're on a student page
- Refresh the page

### API errors?
- Check console for error messages
- Verify API key in `.env`
- Check if quota exceeded

### Chat not saving?
- Check Firestore rules are deployed
- Verify user is authenticated
- Check browser console

## 🎉 Success Checklist

- [x] Gemini API configured
- [x] Model updated to gemini-2.5-flash-lite
- [x] All features tested and working
- [x] Firestore rules deployed
- [x] Student pages updated
- [x] Documentation complete
- [x] Build successful

## 🚀 Deploy to Production

When ready to deploy:

```bash
# Build the application
npm run build

# Deploy to Firebase
npm run firebase:deploy
```

Make sure your production environment has the API key set!

## 💡 Tips for Students

### Getting Best Results
1. Ask specific questions
2. Upload relevant study materials
3. Use summarize for long documents
4. Generate questions before exams
5. Review chat history regularly

### Example Questions
- "Explain [concept] in simple terms"
- "What is the difference between [A] and [B]?"
- "Give me an example of [topic]"
- "How does [process] work?"
- "Can you break down [complex topic]?"

## 📈 Monitor Usage

Keep an eye on:
- API quota usage
- Student engagement
- Error rates
- Response times

## 🎓 Educational Use

Remind students:
- ✅ Use for studying and learning
- ✅ Ask for explanations
- ✅ Generate practice questions
- ❌ Don't use for exams/assessments
- ❌ Always verify information

## 🔮 Future Enhancements

Consider adding:
- Voice input/output
- Multi-language support
- Study schedules
- Course integration
- Teacher oversight
- Analytics dashboard

---

## ✨ You're All Set!

Your AI Study Assistant is ready to help students learn better. Start the dev server and test it out!

**Questions?** Check the documentation files or review the code in:
- `src/services/geminiAI.ts`
- `src/components/student/AIChatbot.tsx`
- `src/components/student/AIChatbotButton.tsx`

**Happy Learning! 🎓📚**

---

**Version**: 1.0.0  
**Model**: gemini-2.5-flash-lite  
**Status**: ✅ Ready for Production  
**Last Updated**: February 6, 2026
