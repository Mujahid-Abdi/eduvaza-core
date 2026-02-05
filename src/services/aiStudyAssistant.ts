 import { supabase } from "@/integrations/supabase/client";
 import { auth } from "@/lib/firebase";
 
 export interface AIStudyRequest {
   action: "summarize" | "generate_questions";
   pdfText: string;
   role: string;
   questionType?: "multiple_choice" | "true_false" | "short_answer" | "fill_blank";
   difficulty?: "easy" | "medium" | "hard";
   questionCount?: number;
   filename?: string;
 }
 
 export interface AIStudyResponse {
   success: boolean;
   output: string;
   resultId: string | null;
   resultType: string;
   error?: string;
 }
 
 export interface AIResult {
   id: string;
   user_id: string;
   user_role: string;
   result_type: string;
   source_filename: string | null;
   content: string;
   metadata: Record<string, unknown>;
   created_at: string;
 }
 
 export const aiStudyAssistantService = {
   async processDocument(request: AIStudyRequest): Promise<AIStudyResponse> {
     // Get Firebase auth token instead of Supabase
     const currentUser = auth.currentUser;
     if (!currentUser) {
       throw new Error("You must be logged in to use AI features");
     }
 
     const token = await currentUser.getIdToken();
 
     const response = await fetch(
       `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-study-assistant`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(request),
       }
     );
 
     const data = await response.json();
 
     if (!response.ok) {
       throw new Error(data.error || "Failed to process document");
     }
 
     return data;
   },
 
   async getHistory(): Promise<AIResult[]> {
     const { data, error } = await supabase
       .from("ai_results")
       .select("*")
       .order("created_at", { ascending: false })
       .limit(20);
 
     if (error) {
       console.error("Error fetching AI history:", error);
       return [];
     }
 
     return data as unknown as AIResult[];
   },
 
   async deleteResult(id: string): Promise<boolean> {
     const { error } = await supabase
       .from("ai_results")
       .delete()
       .eq("id", id);
 
     if (error) {
       console.error("Error deleting result:", error);
       return false;
     }
 
     return true;
   },
 
   // Extract text from PDF using pdf.js (client-side)
   async extractTextFromPDF(file: File): Promise<string> {
     const pdfjsLib = await import("pdfjs-dist");
     
     // Set worker
     pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
 
     const arrayBuffer = await file.arrayBuffer();
     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
     
     let fullText = "";
     const maxPages = Math.min(pdf.numPages, 20); // Limit to first 20 pages
 
     for (let i = 1; i <= maxPages; i++) {
       const page = await pdf.getPage(i);
       const textContent = await page.getTextContent();
       const pageText = textContent.items
         .map((item: any) => item.str)
         .join(" ");
       fullText += pageText + "\n\n";
     }
 
     return fullText.trim();
   },
 };