import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FirebaseStatus } from "@/components/dev/FirebaseStatus";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SchoolDashboard from "./pages/school/SchoolDashboard";
import SchoolSettings from "./pages/school/SchoolSettings";
import SchoolAnalytics from "./pages/school/SchoolAnalytics";
import SchoolQuizPage from "./pages/school/SchoolQuizPage";
import SchoolCoursePage from "./pages/school/SchoolCoursePage";
import SchoolStudentQuestions from "./pages/school/SchoolStudentQuestions";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherQuizPage from "./pages/teacher/TeacherQuizPage";
import TeacherCoursePage from "./pages/teacher/TeacherCoursePage";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherEnrolledCourses from "./pages/teacher/TeacherEnrolledCourses";
import TeacherStudentQuestions from "./pages/teacher/TeacherStudentQuestions";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentQuizPage from "./pages/student/StudentQuizPage";
import StudentLeaderboard from "./pages/student/StudentLeaderboard";
import StudentSettings from "./pages/student/StudentSettings";
import StudentDownloads from "./pages/student/StudentDownloads";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/school" element={<ProtectedRoute allowedRoles={['school']}><SchoolDashboard /></ProtectedRoute>} />
              <Route path="/school/settings" element={<ProtectedRoute allowedRoles={['school']}><SchoolSettings /></ProtectedRoute>} />
              <Route path="/school/analytics" element={<ProtectedRoute allowedRoles={['school']}><SchoolAnalytics /></ProtectedRoute>} />
              <Route path="/school/quizzes" element={<ProtectedRoute allowedRoles={['school']}><SchoolQuizPage /></ProtectedRoute>} />
              <Route path="/school/courses" element={<ProtectedRoute allowedRoles={['school']}><SchoolCoursePage /></ProtectedRoute>} />
              <Route path="/school/questions" element={<ProtectedRoute allowedRoles={['school']}><SchoolStudentQuestions /></ProtectedRoute>} />
              <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/teacher/quizzes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherQuizPage /></ProtectedRoute>} />
              <Route path="/teacher/courses" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherCoursePage /></ProtectedRoute>} />
              <Route path="/teacher/settings" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSettings /></ProtectedRoute>} />
              <Route path="/teacher/analytics" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAnalytics /></ProtectedRoute>} />
              <Route path="/teacher/learning" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherEnrolledCourses /></ProtectedRoute>} />
              <Route path="/teacher/questions" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherStudentQuestions /></ProtectedRoute>} />
              <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/quizzes" element={<ProtectedRoute allowedRoles={['student']}><StudentQuizPage /></ProtectedRoute>} />
              <Route path="/student/leaderboard" element={<ProtectedRoute allowedRoles={['student']}><StudentLeaderboard /></ProtectedRoute>} />
              <Route path="/student/downloads" element={<ProtectedRoute allowedRoles={['student']}><StudentDownloads /></ProtectedRoute>} />
              <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['student']}><StudentSettings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          {/* Development helper - only shows in dev mode */}
          <FirebaseStatus />
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
