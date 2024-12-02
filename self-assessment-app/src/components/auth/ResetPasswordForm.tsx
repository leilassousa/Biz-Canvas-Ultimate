import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting password reset...');

    try {
      setError(null);
      setLoading(true);
      await resetPassword(email);
      console.log('Password reset email sent');
      setSuccess(true);
    } catch (err) {
      console.error('Password reset failed:', err);
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      
      if (error) {
        console.error('Password reset error:', error)
        throw error
      }
      
      console.log('Password reset successful:', data)
      // Handle success
    } catch (error) {
      console.error('Password reset failed:', error)
      // Handle error
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We have sent a password reset link to your email address.
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:text-primary/90"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Reset your password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </div>

        <div className="text-center">
          <a href="/login" className="text-sm text-primary hover:text-primary/90">
            Back to login
          </a>
        </div>
      </form>
    </div>
  );
} 