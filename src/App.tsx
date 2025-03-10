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
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherQuizPage from "./pages/teacher/TeacherQuizPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentQuizPage from "./pages/student/StudentQuizPage";

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
              <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/teacher/quizzes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherQuizPage /></ProtectedRoute>} />
              <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/quizzes" element={<ProtectedRoute allowedRoles={['student']}><StudentQuizPage /></ProtectedRoute>} />
              <Route path="/student/calendar" element={<ProtectedRoute allowedRoles={['student']}><StudentQuizPage /></ProtectedRoute>} />
              <Route path="/student/leaderboard" element={<ProtectedRoute allowedRoles={['student']}><StudentQuizPage /></ProtectedRoute>} />
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
