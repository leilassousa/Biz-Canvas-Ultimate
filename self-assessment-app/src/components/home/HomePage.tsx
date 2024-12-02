import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log('HomePage component mounted');
  }, []);

  const handleGetStarted = () => {
    console.log('Get Started button clicked');
    if (user) {
      navigate('/assessments');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Understand Your Business</span>
            <span className="block text-indigo-600">Like Never Before</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get a comprehensive assessment of your business in minutes. Our Business Canva Assessment tool helps you visualize your strengths and opportunities in a single, actionable report.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={handleGetStarted}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="h-12 w-12 text-indigo-600 mx-auto mb-4">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Comprehensive Analysis</h3>
                <p className="mt-2 text-base text-gray-500">Get detailed insights across all aspects of your business operations.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="h-12 w-12 text-indigo-600 mx-auto mb-4">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Instant Results</h3>
                <p className="mt-2 text-base text-gray-500">Receive your business assessment report immediately after completion.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="h-12 w-12 text-indigo-600 mx-auto mb-4">
                  <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Actionable Insights</h3>
                <p className="mt-2 text-base text-gray-500">Get practical recommendations to improve your business performance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your business?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Start your business assessment today and get clarity on your next steps.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Start Assessment Now
          </button>
        </div>
      </div>
    </div>
  );
}; 