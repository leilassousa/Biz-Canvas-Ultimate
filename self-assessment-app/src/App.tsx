import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { SignInForm } from './components/auth/SignInForm'
import { SignUpForm } from './components/auth/SignUpForm'
import { ResetPasswordForm } from './components/auth/ResetPasswordForm'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminOverview } from './components/admin/overview/AdminOverview'
import { CategoriesPage } from './components/admin/categories/CategoriesPage'
import { QuestionsPage } from './components/admin/questions/QuestionsPage'
import { PreamblePage } from './components/admin/preambles/PreamblePage'
import { UsersPage } from './components/admin/users/UsersPage'
import { HomePage } from './components/home/HomePage'
import { AssessmentWorkspace } from './components/assessment/AssessmentWorkspace'
import { AssessmentReview } from './components/assessment/AssessmentReview'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

console.log('QueryClient initialized with default options')

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Add logging
    console.log('Setting up auth subscription')
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id)
        setSession(currentSession)
        setLoading(false)
      }
    )

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session check:', initialSession?.user?.id)
      setSession(initialSession)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route 
                path="/" 
                element={session ? <Navigate to="/assessments" /> : <HomePage />} 
              />

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
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
