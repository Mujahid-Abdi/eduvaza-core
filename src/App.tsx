import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FirebaseStatus } from "@/components/dev/FirebaseStatus";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/CoursesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import QuizzesPage from "./pages/QuizzesPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageSchools from "./pages/admin/ManageSchools";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import ManageReports from "./pages/admin/ManageReports";
import SchoolDashboard from "./pages/school/SchoolDashboard";
import SchoolSettings from "./pages/school/SchoolSettings";
import SchoolAnalytics from "./pages/school/SchoolAnalytics";
import SchoolQuizPage from "./pages/school/SchoolQuizPage";
import SchoolCoursePage from "./pages/school/SchoolCoursePage";
import SchoolStudentQuestions from "./pages/school/SchoolStudentQuestions";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherQuizPage from "./pages/teacher/TeacherQuizPage";
import TeacherCoursePage from "./pages/teacher/TeacherCoursePage";
import TeacherCourseDetailPage from "./pages/teacher/TeacherCourseDetailPage";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherEnrolledCourses from "./pages/teacher/TeacherEnrolledCourses";
import TeacherStudentQuestions from "./pages/teacher/TeacherStudentQuestions";
import TeacherDownloads from "./pages/teacher/TeacherDownloads";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentQuizPage from "./pages/student/StudentQuizPage";
import StudentLeaderboard from "./pages/student/StudentLeaderboard";
import StudentSettings from "./pages/student/StudentSettings";
import StudentDownloads from "./pages/student/StudentDownloads";
import QuizExplorePage from "./pages/student/QuizExplorePage";
import CourseDetailPage from "./pages/student/CourseDetailPage";
import LessonViewerPage from "./pages/student/LessonViewerPage";
import ContentTestPage from "./pages/test/ContentTestPage";
import QuizTakePage from "./pages/QuizTakePage";
import AIStudyAssistant from "./pages/shared/AIStudyAssistant";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import ManageOpportunities from "./pages/admin/ManageOpportunities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quiz/:quizId" element={<QuizTakePage />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageUsers /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageStudents /></ProtectedRoute>} />
              <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageTeachers /></ProtectedRoute>} />
              <Route path="/admin/schools" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageSchools /></ProtectedRoute>} />
              <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageCourses /></ProtectedRoute>} />
              <Route path="/admin/quizzes" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageQuizzes /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageReports /></ProtectedRoute>} />
              <Route path="/admin/opportunities" element={<ProtectedRoute allowedRoles={['super_admin']}><ManageOpportunities /></ProtectedRoute>} />
              <Route path="/school" element={<ProtectedRoute allowedRoles={['school']}><SchoolDashboard /></ProtectedRoute>} />
              <Route path="/school/settings" element={<ProtectedRoute allowedRoles={['school']}><SchoolSettings /></ProtectedRoute>} />
              <Route path="/school/analytics" element={<ProtectedRoute allowedRoles={['school']}><SchoolAnalytics /></ProtectedRoute>} />
              <Route path="/school/quizzes" element={<ProtectedRoute allowedRoles={['school']}><SchoolQuizPage /></ProtectedRoute>} />
              <Route path="/school/courses" element={<ProtectedRoute allowedRoles={['school']}><SchoolCoursePage /></ProtectedRoute>} />
              <Route path="/school/questions" element={<ProtectedRoute allowedRoles={['school']}><SchoolStudentQuestions /></ProtectedRoute>} />
              <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
              <Route path="/teacher/quizzes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherQuizPage /></ProtectedRoute>} />
              <Route path="/teacher/courses" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherCoursePage /></ProtectedRoute>} />
              <Route path="/teacher/course/:courseId" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherCourseDetailPage /></ProtectedRoute>} />
              <Route path="/teacher/settings" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSettings /></ProtectedRoute>} />
              <Route path="/teacher/analytics" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAnalytics /></ProtectedRoute>} />
              <Route path="/teacher/learning" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherEnrolledCourses /></ProtectedRoute>} />
              <Route path="/teacher/questions" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherStudentQuestions /></ProtectedRoute>} />
              <Route path="/teacher/downloads" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDownloads /></ProtectedRoute>} />
              <Route path="/teacher/ai-assistant" element={<ProtectedRoute allowedRoles={['teacher']}><AIStudyAssistant /></ProtectedRoute>} />
              <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/quizzes" element={<ProtectedRoute allowedRoles={['student']}><StudentQuizPage /></ProtectedRoute>} />
              <Route path="/student/quiz-explore" element={<ProtectedRoute allowedRoles={['student']}><QuizExplorePage /></ProtectedRoute>} />
              <Route path="/student/course/:courseId" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><CourseDetailPage /></ProtectedRoute>} />
              <Route path="/student/courses/:courseId" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><CourseDetailPage /></ProtectedRoute>} />
              <Route path="/student/courses/:courseId/learn" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><LessonViewerPage /></ProtectedRoute>} />
              <Route path="/student/leaderboard" element={<ProtectedRoute allowedRoles={['student']}><StudentLeaderboard /></ProtectedRoute>} />
              <Route path="/student/downloads" element={<ProtectedRoute allowedRoles={['student']}><StudentDownloads /></ProtectedRoute>} />
              <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['student']}><StudentSettings /></ProtectedRoute>} />
              <Route path="/student/ai-assistant" element={<ProtectedRoute allowedRoles={['student']}><AIStudyAssistant /></ProtectedRoute>} />
              <Route path="/school/ai-assistant" element={<ProtectedRoute allowedRoles={['school']}><AIStudyAssistant /></ProtectedRoute>} />
              <Route path="/test/content" element={<ContentTestPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          {/* Development helper - only shows in dev mode */}
          <FirebaseStatus />
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
