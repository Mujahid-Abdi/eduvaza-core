import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  BookOpen,
  HelpCircle,
  Loader2,
  Upload,
  X,
  Copy,
  Check,
  History,
  Trash2,
  Download,
  Send,
  Eye,
  EyeOff,
  Edit2,
  Play,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { aiStudyAssistantService, AIResult } from "@/services/aiStudyAssistant";
import { quizService } from "@/services/quizzes";
import ReactMarkdown from "react-markdown";
import { QuestionEditor, type EditableQuestion } from "@/components/quiz/QuestionEditor";
import { QuizPreviewMode } from "@/components/quiz/QuizPreviewMode";

interface ParsedQuestion {
  id: number;
  question: string;
  type: string;
  difficulty: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
}

export const AIStudyAssistant = () => {
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const canGenerateQuestions = userRole !== "student";
  const canUploadToPublic = userRole !== "student";

  // State
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>("");
  const [resultType, setResultType] = useState<"summary" | "questions" | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Edit and Preview modes
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Quiz upload configuration
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [quizUploadConfig, setQuizUploadConfig] = useState({
    isMultiplayer: false,
    scheduledStartTime: '',
    scheduledEndTime: '',
    registrationDeadline: '',
    maxParticipants: 100,
  });

  // Question generation options
  const [questionType, setQuestionType] = useState<string>("multiple_choice");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [questionCount, setQuestionCount] = useState<number>(5);

  // History
  const [history, setHistory] = useState<AIResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const results = await aiStudyAssistantService.getHistory();
      setHistory(results);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Parse questions from JSON result
  const parseQuestionsFromResult = (text: string): ParsedQuestion[] => {
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*"questions"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.questions || [];
      }
    } catch (error) {
      console.error("Failed to parse questions:", error);
    }
    return [];
  };

  // Handle file drop/select
  const handleFileChange = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setResult("");
    setResultType(null);
    setParsedQuestions([]);
    setSelectedAnswers({});
    setIsEditing(false);
    setIsPreviewMode(false);
    setIsExtracting(true);

    try {
      const text = await aiStudyAssistantService.extractTextFromPDF(selectedFile);
      setExtractedText(text);
      toast.success("PDF text extracted successfully!");
    } catch (error) {
      console.error("PDF extraction error:", error);
      toast.error("Failed to extract text from PDF");
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    },
    [handleFileChange]
  );

  const handleSummarize = async () => {
    if (!extractedText) {
      toast.error("Please upload a PDF first");
      return;
    }

    setIsProcessing(true);
    setResult("");
    setParsedQuestions([]);
    setIsEditing(false);
    setIsPreviewMode(false);

    try {
      const response = await aiStudyAssistantService.processDocument({
        action: "summarize",
        pdfText: extractedText,
        role: userRole,
        filename: file?.name,
      });

      setResult(response.output);
      setResultType("summary");
      toast.success("Summary generated!");
      loadHistory();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate summary");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!extractedText) {
      toast.error("Please upload a PDF first");
      return;
    }

    if (!canGenerateQuestions) {
      toast.error("Only teachers and schools can generate questions");
      return;
    }

    setIsProcessing(true);
    setResult("");
    setParsedQuestions([]);
    setSelectedAnswers({});
    setShowAnswers(false);
    setIsEditing(false);
    setIsPreviewMode(false);

    try {
      const response = await aiStudyAssistantService.processDocument({
        action: "generate_questions",
        pdfText: extractedText,
        role: userRole,
        questionType: questionType as any,
        difficulty: difficulty as any,
        questionCount,
        filename: file?.name,
      });

      setResult(response.output);
      setResultType("questions");
      
      // Parse questions
      const questions = parseQuestionsFromResult(response.output);
      setParsedQuestions(questions);
      
      toast.success("Questions generated!");
      loadHistory();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate questions");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadAsQuiz = async () => {
    if (!canUploadToPublic) {
      toast.error("Students cannot upload quizzes to public");
      return;
    }

    if (parsedQuestions.length === 0) {
      toast.error("No questions to upload");
      return;
    }

    // Validate multiplayer scheduling
    if (quizUploadConfig.isMultiplayer) {
      if (!quizUploadConfig.scheduledStartTime || !quizUploadConfig.scheduledEndTime || !quizUploadConfig.registrationDeadline) {
        toast.error("Please fill in all scheduling fields for multiplayer quiz");
        return;
      }

      const startTime = new Date(quizUploadConfig.scheduledStartTime);
      const endTime = new Date(quizUploadConfig.scheduledEndTime);
      const regDeadline = new Date(quizUploadConfig.registrationDeadline);

      if (endTime <= startTime) {
        toast.error("End time must be after start time");
        return;
      }

      if (regDeadline >= startTime) {
        toast.error("Registration deadline must be before start time");
        return;
      }
    }

    setIsUploading(true);

    try {
      const quizQuestions = parsedQuestions.map((q, index) => ({
        id: `q-${Date.now()}-${index}`,
        quizId: "",
        type: q.type === "multiple_choice" ? "mcq" : q.type === "true_false" ? "true_false" : "short_answer",
        question: q.question,
        options: q.options ? q.options.map((opt, optIndex) => ({
          id: `opt-${Date.now()}-${index}-${optIndex}`,
          text: opt,
          isCorrect: opt.charAt(0) === q.correctAnswer,
        })) : undefined,
        correctAnswer: q.correctAnswer,
        points: 10,
        timeLimit: 30,
        order: index + 1,
      }));

      const quizData: any = {
        title: file?.name?.replace(".pdf", "") || "AI Generated Quiz",
        description: `Quiz generated from ${file?.name || "uploaded PDF"} using AI Study Assistant`,
        questions: quizQuestions,
        teacherId: user?.id || "",
        teacherName: user?.name || "",
        schoolId: user?.schoolId || undefined,
        difficulty: difficulty as any,
        isPublished: true,
        isMultiplayer: quizUploadConfig.isMultiplayer,
        quizType: quizUploadConfig.isMultiplayer ? "scheduled" : "practice",
      };

      // Add scheduling fields for multiplayer
      if (quizUploadConfig.isMultiplayer) {
        quizData.scheduledStartTime = new Date(quizUploadConfig.scheduledStartTime);
        quizData.scheduledEndTime = new Date(quizUploadConfig.scheduledEndTime);
        quizData.registrationDeadline = new Date(quizUploadConfig.registrationDeadline);
        quizData.maxParticipants = quizUploadConfig.maxParticipants;
        quizData.registeredStudents = [];
      }

      await quizService.createQuiz(quizData);

      toast.success(`Quiz uploaded to public ${quizUploadConfig.isMultiplayer ? 'multiplayer' : 'self-practice'} page!`);
      setIsPreviewMode(false);
      setShowUploadDialog(false);
      
      // Reset config
      setQuizUploadConfig({
        isMultiplayer: false,
        scheduledStartTime: '',
        scheduledEndTime: '',
        registrationDeadline: '',
        maxParticipants: 100,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload quiz");
    } finally {
      setIsUploading(false);
    }
  };

  const openUploadDialog = () => {
    setShowUploadDialog(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteHistoryItem = async (id: string) => {
    const success = await aiStudyAssistantService.deleteResult(id);
    if (success) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully");
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleExport = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resultType === "summary" ? "summary" : "questions"}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported successfully!");
  };

  const clearFile = () => {
    setFile(null);
    setExtractedText("");
    setResult("");
    setResultType(null);
    setParsedQuestions([]);
    setSelectedAnswers({});
    setIsEditing(false);
    setIsPreviewMode(false);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleQuestionsChange = (newQuestions: EditableQuestion[]) => {
    setParsedQuestions(newQuestions);
  };

  // Render questions in quiz mode (with checkboxes and hidden answers)
  const renderQuestions = () => {
    if (parsedQuestions.length === 0) {
      return (
        <div className="whitespace-pre-wrap text-sm">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {parsedQuestions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-xl p-5 bg-card shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {index + 1}
                </span>
                <Badge variant="outline" className="capitalize">
                  {q.type.replace("_", " ")}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {q.difficulty}
                </Badge>
              </div>
            </div>

            <p className="font-medium text-base mb-4 leading-relaxed">{q.question}</p>

            {q.options && (
              <div className="space-y-2 ml-2">
                {q.options.map((option, optIndex) => {
                  const optionLetter = option.charAt(0);
                  const isSelected = selectedAnswers[q.id] === optionLetter;
                  const isCorrect = optionLetter === q.correctAnswer;

                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? showAnswers && isCorrect
                              ? "border-accent bg-accent/10"
                              : showAnswers && !isCorrect
                              ? "border-destructive bg-destructive/10"
                              : "border-primary bg-primary/5"
                            : showAnswers && isCorrect
                            ? "border-accent bg-accent/10"
                            : "border-muted hover:border-primary/50"
                        }`}
                      onClick={() => handleAnswerSelect(q.id, optionLetter)}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                      />
                      <span className="text-sm flex-1">{option}</span>
                      {showAnswers && isCorrect && (
                        <Badge variant="default">
                          <Check className="w-3 h-3 mr-1" /> Correct
                        </Badge>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {showAnswers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 rounded-lg bg-muted"
              >
                <p className="text-sm font-medium text-primary mb-1">
                  ✅ Answer: {q.correctAnswer}
                </p>
                <p className="text-sm text-muted-foreground">
                  💡 {q.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Preview Mode
  if (isPreviewMode && parsedQuestions.length > 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <QuizPreviewMode
            questions={parsedQuestions}
            title={file?.name?.replace(".pdf", "") || "AI Generated Quiz"}
            onClose={() => setIsPreviewMode(false)}
            onPublish={openUploadDialog}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {userRole === "student" ? "Study Helper" : "AI Study Assistant"}
            </h1>
            <p className="text-muted-foreground">
              {canGenerateQuestions
                ? "Summarize PDFs and generate assessment questions"
                : "Get AI-powered summaries of your study materials"}
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList>
            <TabsTrigger value="generate" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload PDF
                    </CardTitle>
                    <CardDescription>
                      Upload a PDF document to analyze (max 10MB, 20 pages)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Drop Zone */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        file
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {isExtracting ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-10 w-10 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">Extracting text...</p>
                        </div>
                      ) : file ? (
                        <div className="flex flex-col items-center gap-3">
                          <FileText className="h-10 w-10 text-primary" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={clearFile}>
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-3">
                          <FileText className="h-10 w-10 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Drop PDF here or click to upload</p>
                            <p className="text-sm text-muted-foreground">PDF files only, max 10MB</p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                          />
                        </label>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        className="w-full gap-2"
                        onClick={handleSummarize}
                        disabled={!extractedText || isProcessing}
                      >
                        {isProcessing && resultType !== "questions" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BookOpen className="h-4 w-4" />
                        )}
                        Summarize PDF
                      </Button>

                      {canGenerateQuestions && (
                        <>
                          <Separator />

                          {/* Question Options */}
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="space-y-2">
                              <Label>Question Type</Label>
                              <Select value={questionType} onValueChange={setQuestionType}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                  <SelectItem value="true_false">True/False</SelectItem>
                                  <SelectItem value="short_answer">Short Answer</SelectItem>
                                  <SelectItem value="fill_blank">Fill in Blank</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Difficulty</Label>
                              <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Count (1-10)</Label>
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                value={questionCount}
                                onChange={(e) =>
                                  setQuestionCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 5)))
                                }
                              />
                            </div>
                          </div>

                          <Button
                            variant="secondary"
                            className="w-full gap-2"
                            onClick={handleGenerateQuestions}
                            disabled={!extractedText || isProcessing}
                          >
                            {isProcessing && resultType === "questions" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <HelpCircle className="h-4 w-4" />
                            )}
                            Generate Questions
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Result Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Result
                        {resultType && (
                          <Badge variant="secondary">
                            {resultType === "summary" ? "Summary" : "Questions"}
                          </Badge>
                        )}
                      </CardTitle>
                      {result && (
                        <div className="flex gap-2">
                          {resultType === "questions" && parsedQuestions.length > 0 && (
                            <>
                              <Button
                                variant={isEditing ? "default" : "outline"}
                                size="icon"
                                onClick={() => {
                                  setIsEditing(!isEditing);
                                  setShowAnswers(false);
                                }}
                                title={isEditing ? "View Mode" : "Edit Questions"}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              {!isEditing && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setShowAnswers(!showAnswers)}
                                  title={showAnswers ? "Hide Answers" : "Show Answers"}
                                >
                                  {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              )}
                            </>
                          )}
                          <Button variant="outline" size="icon" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="icon" onClick={handleExport}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-[400px] rounded-lg border p-4 bg-muted/30">
                      {isProcessing ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          <p className="text-muted-foreground">
                            {resultType === "questions"
                              ? "Generating questions..."
                              : "Creating summary..."}
                          </p>
                        </div>
                      ) : result ? (
                        isEditing && resultType === "questions" ? (
                          <QuestionEditor
                            questions={parsedQuestions}
                            onQuestionsChange={handleQuestionsChange}
                          />
                        ) : resultType === "questions" && parsedQuestions.length > 0 ? (
                          renderQuestions()
                        ) : resultType === "summary" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{result}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-sm">{result}</div>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Sparkles className="h-12 w-12 mb-3 opacity-50" />
                          <p>Upload a PDF and click an action to see results</p>
                        </div>
                      )}
                    </ScrollArea>

                    {/* Action Buttons for Questions */}
                    {canUploadToPublic && resultType === "questions" && parsedQuestions.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => setIsPreviewMode(true)}
                        >
                          <Play className="h-4 w-4" />
                          Preview as Quiz
                        </Button>
                        <Button
                          className="flex-1 gap-2"
                          onClick={openUploadDialog}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Upload as Public Quiz
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Results
                </CardTitle>
                <CardDescription>Your previously generated summaries and questions</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No history yet. Generate a summary or questions to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge>
                                {item.result_type === "summary" ? "Summary" : "Questions"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {item.source_filename || "Uploaded PDF"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteHistoryItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <ScrollArea className="h-32 rounded border p-3 bg-muted/30">
                          <div className="whitespace-pre-wrap text-sm">{item.content}</div>
                        </ScrollArea>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(item.content);
                            toast.success("Copied!");
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quiz Upload Configuration Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Quiz Upload</DialogTitle>
            <DialogDescription>
              Choose quiz type and configure settings before publishing to the public quiz page
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Quiz Type Selection */}
            <div className="space-y-2">
              <Label>Quiz Type</Label>
              <Select
                value={quizUploadConfig.isMultiplayer ? 'multiplayer' : 'self-practice'}
                onValueChange={(value) => {
                  setQuizUploadConfig(prev => ({ 
                    ...prev, 
                    isMultiplayer: value === 'multiplayer'
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self-practice">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Self Practice</span>
                      <span className="text-xs text-muted-foreground">Students can take anytime</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="multiplayer">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Multiplayer (Scheduled)</span>
                      <span className="text-xs text-muted-foreground">Live competitive quiz with registration</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Multiplayer Scheduling Fields */}
            {quizUploadConfig.isMultiplayer && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold text-sm">Multiplayer Schedule</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-startDate">Start Date *</Label>
                    <Input
                      id="upload-startDate"
                      type="date"
                      value={quizUploadConfig.scheduledStartTime ? quizUploadConfig.scheduledStartTime.split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value;
                        const time = quizUploadConfig.scheduledStartTime ? quizUploadConfig.scheduledStartTime.split('T')[1] : '00:00';
                        setQuizUploadConfig(prev => ({ ...prev, scheduledStartTime: `${date}T${time}` }));
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upload-startTime">Start Time *</Label>
                    <Input
                      id="upload-startTime"
                      type="time"
                      value={quizUploadConfig.scheduledStartTime ? quizUploadConfig.scheduledStartTime.split('T')[1] : ''}
                      onChange={(e) => {
                        const time = e.target.value;
                        const date = quizUploadConfig.scheduledStartTime ? quizUploadConfig.scheduledStartTime.split('T')[0] : new Date().toISOString().split('T')[0];
                        setQuizUploadConfig(prev => ({ ...prev, scheduledStartTime: `${date}T${time}` }));
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-endDate">End Date *</Label>
                    <Input
                      id="upload-endDate"
                      type="date"
                      value={quizUploadConfig.scheduledEndTime ? quizUploadConfig.scheduledEndTime.split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value;
                        const time = quizUploadConfig.scheduledEndTime ? quizUploadConfig.scheduledEndTime.split('T')[1] : '23:59';
                        setQuizUploadConfig(prev => ({ ...prev, scheduledEndTime: `${date}T${time}` }));
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upload-endTime">End Time *</Label>
                    <Input
                      id="upload-endTime"
                      type="time"
                      value={quizUploadConfig.scheduledEndTime ? quizUploadConfig.scheduledEndTime.split('T')[1] : ''}
                      onChange={(e) => {
                        const time = e.target.value;
                        const date = quizUploadConfig.scheduledEndTime ? quizUploadConfig.scheduledEndTime.split('T')[0] : new Date().toISOString().split('T')[0];
                        setQuizUploadConfig(prev => ({ ...prev, scheduledEndTime: `${date}T${time}` }));
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upload-registrationDeadline">Registration Deadline *</Label>
                    <Input
                      id="upload-registrationDeadline"
                      type="datetime-local"
                      value={quizUploadConfig.registrationDeadline}
                      onChange={(e) => setQuizUploadConfig(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upload-maxParticipants">Max Participants</Label>
                    <Input
                      id="upload-maxParticipants"
                      type="number"
                      min={1}
                      value={quizUploadConfig.maxParticipants}
                      onChange={(e) => setQuizUploadConfig(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 100 }))}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Students must register before the deadline. The quiz will automatically convert to self-practice after the end time.
                </p>
              </div>
            )}

            {/* Quiz Info Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Quiz Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Title:</span> {file?.name?.replace(".pdf", "") || "AI Generated Quiz"}</p>
                  <p><span className="text-muted-foreground">Questions:</span> {parsedQuestions.length}</p>
                  <p><span className="text-muted-foreground">Difficulty:</span> {difficulty}</p>
                  <p><span className="text-muted-foreground">Type:</span> {quizUploadConfig.isMultiplayer ? 'Multiplayer (Scheduled)' : 'Self Practice'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadAsQuiz} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Upload Quiz
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AIStudyAssistant;
