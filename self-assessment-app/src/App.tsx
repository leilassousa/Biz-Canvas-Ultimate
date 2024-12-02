import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/overview/AdminOverview';
import { CategoriesPage } from './components/admin/categories/CategoriesPage';
import { QuestionsPage } from './components/admin/questions/QuestionsPage';
import { PreamblePage } from './components/admin/preambles/PreamblePage';
import { UsersPage } from './components/admin/users/UsersPage';
import { HomePage } from './components/home/HomePage';
import { AssessmentWorkspace } from './components/assessment/AssessmentWorkspace';
import { AssessmentReview } from './components/assessment/AssessmentReview';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

console.log('QueryClient initialized with default options');

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/" element={<HomePage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>Dashboard Page</div>
                  </ProtectedRoute>
                }
              />

              {/* Assessment routes */}
              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <AssessmentWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/:id"
                element={
                  <ProtectedRoute>
                    <AssessmentWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessment/:id/review"
                element={
                  <ProtectedRoute>
                    <AssessmentReview />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="questions" element={<QuestionsPage />} />
                <Route path="preambles" element={<PreamblePage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;