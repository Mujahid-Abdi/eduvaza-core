import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Verify Firebase ID token by decoding and checking expiry
async function verifyFirebaseToken(token: string): Promise<{ uid: string } | null> {
  try {
    // Decode the JWT to get the payload (Firebase ID tokens are JWTs)
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.log("Token expired");
      return null;
    }
    
    // Check issuer is Firebase
    if (!payload.iss?.includes("securetoken.google.com")) {
      console.log("Invalid issuer:", payload.iss);
      return null;
    }
    
    // Return user ID
    if (payload.user_id || payload.sub) {
      return { uid: payload.user_id || payload.sub };
    }
    
    return null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Verify Firebase token
    const firebaseUser = await verifyFirebaseToken(token);
    if (!firebaseUser) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = firebaseUser.uid;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    const body = await req.json();
    const { action, pdfText, role, questionType, difficulty, questionCount, filename } = body;

    if (!action || !pdfText) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: action and pdfText" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Role-based access control
    const userRole = role || "student";
    if (action === "generate_questions" && userRole === "student") {
      return new Response(
        JSON.stringify({ error: "Students can only use the summarize feature" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
 
     // Limit text to prevent token overflow (approx 6000 chars)
     const truncatedText = pdfText.slice(0, 6000);
 
     let prompt = "";
     let resultType = "";
 
    if (action === "summarize") {
      resultType = "summary";
      prompt = `You are an expert educational content summarizer creating modern, visually appealing study notes.

Create a comprehensive yet easy-to-read summary of the following content using this EXACT format:

# 📚 Study Summary: [Topic Title]

Brief overview paragraph (2-3 sentences max).

---

## 🎯 Key Learning Objectives
• [Objective 1]
• [Objective 2]
• [Objective 3]

---

## 📖 Main Concepts

### 1. [First Major Concept]
**Definition:** [Clear definition]

**Key Points:**
- Point 1
- Point 2

💡 **Pro Tip:** [Helpful insight or memory trick]

### 2. [Second Major Concept]
(Follow same pattern)

---

## 📊 Quick Reference Table
| Term | Definition |
|------|------------|
| [Term 1] | [Brief definition] |
| [Term 2] | [Brief definition] |

---

## ✅ Summary Checklist
- [ ] I understand [concept 1]
- [ ] I can explain [concept 2]
- [ ] I know how to apply [concept 3]

---

## 🔑 Key Takeaways
1. [Most important point]
2. [Second most important point]
3. [Third most important point]

Content to summarize:
${truncatedText}`;
    } else if (action === "generate_questions") {
      resultType = "questions";
      const qType = questionType || "multiple_choice";
      const diff = difficulty || "medium";
      const count = Math.min(questionCount || 5, 10);

      const questionTypeLabels: Record<string, string> = {
        multiple_choice: "multiple choice questions with 4 options (A, B, C, D)",
        true_false: "true/false questions",
        short_answer: "short answer questions",
        fill_blank: "fill-in-the-blank questions"
      };

      const difficultyDescriptions: Record<string, string> = {
        easy: "basic understanding and recall",
        medium: "application and analysis",
        hard: "critical thinking and synthesis"
      };

      prompt = `You are an experienced teacher creating professional assessment questions.

Create EXACTLY ${count} ${questionTypeLabels[qType] || "multiple choice questions"} based on the content below.

Difficulty: ${diff.toUpperCase()} (${difficultyDescriptions[diff] || "application and analysis"})

IMPORTANT: You MUST use this EXACT JSON format for your response:

{
  "questions": [
    {
      "id": 1,
      "question": "What is the main purpose of software engineering?",
      "type": "${qType}",
      "difficulty": "${diff}",
      "options": ${qType === "multiple_choice" ? '["A) Option text", "B) Option text", "C) Option text", "D) Option text"]' : qType === "true_false" ? '["True", "False"]' : "null"},
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Rules:
- For multiple_choice: exactly 4 options labeled A, B, C, D
- For true_false: options should be ["True", "False"], correctAnswer is "True" or "False"
- For short_answer: options is null, correctAnswer is the expected answer text
- For fill_blank: question should have _____ for the blank, options is null
- Each question must have an explanation
- Questions must be clear and unambiguous
- Test understanding, not just memorization

Content:
${truncatedText}

Return ONLY valid JSON, no other text:`;
     } else {
       return new Response(
         JSON.stringify({ error: "Invalid action. Use 'summarize' or 'generate_questions'" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Call Lovable AI Gateway
     const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${lovableApiKey}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "google/gemini-3-flash-preview",
         messages: [
           { role: "system", content: "You are an expert educational AI assistant helping teachers and students with learning materials." },
           { role: "user", content: prompt },
         ],
         stream: false,
       }),
     });
 
     if (!aiResponse.ok) {
       if (aiResponse.status === 429) {
         return new Response(
           JSON.stringify({ error: "AI service is busy. Please try again in a moment." }),
           { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       if (aiResponse.status === 402) {
         return new Response(
           JSON.stringify({ error: "AI usage limit reached. Please contact support." }),
           { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       const errorText = await aiResponse.text();
       console.error("AI Gateway error:", aiResponse.status, errorText);
       return new Response(
         JSON.stringify({ error: "AI service error" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const aiData = await aiResponse.json();
     const output = aiData.choices?.[0]?.message?.content || "No response generated";
 
     // Save result to database
     const { data: savedResult, error: saveError } = await supabase
       .from("ai_results")
       .insert({
         user_id: userId,
         user_role: userRole,
         result_type: resultType,
         source_filename: filename || "Uploaded PDF",
         content: output,
         metadata: {
           action,
           questionType: questionType || null,
           difficulty: difficulty || null,
           questionCount: questionCount || null,
           textLength: truncatedText.length,
         },
       })
       .select()
       .single();
 
     if (saveError) {
       console.error("Error saving result:", saveError);
       // Still return the result even if save failed
     }
 
     return new Response(
       JSON.stringify({
         success: true,
         output,
         resultId: savedResult?.id || null,
         resultType,
       }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("AI Study Assistant error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });