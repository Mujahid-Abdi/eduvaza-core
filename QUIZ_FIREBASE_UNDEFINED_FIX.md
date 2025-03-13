# Quiz Firebase Undefined Fields Fix

## Issue
When students completed quizzes, Firebase threw errors:
```
FirebaseError: Function updateDoc() called with invalid data. 
Unsupported field value: undefined (found in document quizAttempts/...)
```

## Root Cause
The `submitAnswer` function in `quizService` was saving the entire `QuizAnswer` object to Firebase, which included optional fields that could be `undefined`. Firebase doesn't allow `undefined` values in documents.

## Solution
Modified the `submitAnswer` function to clean the answer data before saving:
- Only include fields that have defined values
- Conditionally add `selectedOptionId` and `textAnswer` only if they exist
- This prevents `undefined` values from being written to Firebase

## Code Changes

### Before
```typescript
async submitAnswer(attemptId: string, answer: QuizAnswer): Promise<QuizAttempt> {
  const updatedAnswers = [...attempt.answers, answer]; // answer may have undefined fields
  await updateDoc(doc(db, 'quizAttempts', attemptId), {
    answers: updatedAnswers,
    score,
  });
}
```

### After
```typescript
async submitAnswer(attemptId: string, answer: QuizAnswer): Promise<QuizAttempt> {
  // Clean answer data - remove undefined fields
  const cleanAnswer: any = {
    questionId: answer.questionId,
    isCorrect: answer.isCorrect,
    pointsEarned: answer.pointsEarned,
    timeTaken: answer.timeTaken,
  };
  
  // Only add optional fields if they exist
  if (answer.selectedOptionId !== undefined) {
    cleanAnswer.selectedOptionId = answer.selectedOptionId;
  }
  if (answer.textAnswer !== undefined) {
    cleanAnswer.textAnswer = answer.textAnswer;
  }
  
  const updatedAnswers = [...attempt.answers, cleanAnswer];
  await updateDoc(doc(db, 'quizAttempts', attemptId), {
    answers: updatedAnswers,
    score,
  });
}
```

## Testing
1. Start a quiz as a student
2. Answer multiple choice questions (uses `selectedOptionId`)
3. Answer short answer questions (uses `textAnswer`)
4. Complete the quiz
5. Verify no Firebase errors in console
6. Verify quiz results are saved correctly

## Files Modified
- `src/services/quizzes.ts` - Fixed `submitAnswer` function

## Status
✅ Fixed and tested
✅ No TypeScript errors
✅ Quiz completion now works without Firebase errors
