import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalAssessments: number;
  completionRate: number;
  categoryStats: Array<{
    name: string;
    assessments: number;
  }>;
  recentAssessments: Array<{
    id: string;
    status: string;
    created_at: string;
    user: {
      email: string;
    };
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AdminOverview() {
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      console.log('Fetching admin stats...');

      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (userError) throw userError;

      // Get assessments with completion stats
      const { data: assessments, error: assessmentError } = await supabase
        .from('assessments')
        .select('status');

      if (assessmentError) throw assessmentError;

      const completedAssessments = assessments?.filter(a => a.status === 'completed') || [];
      const completionRate = assessments?.length ? (completedAssessments.length / assessments.length) * 100 : 0;

      // Get category stats
      const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('name, assessments:responses(distinct(assessment_id))');

      if (categoryError) throw categoryError;

      const categoryStats = (categories || []).map(category => ({
        name: category.name,
        assessments: (category.assessments as any[])?.length || 0
      }));

      // Get recent assessments
      const { data: recentAssessments, error: recentError } = await supabase
        .from('assessments')
        .select('id, status, created_at, user:profiles!inner(email)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      return {
        totalUsers: userCount || 0,
        totalAssessments: assessments?.length || 0,
        completionRate,
        categoryStats,
        recentAssessments: (recentAssessments || []).map(assessment => ({
          ...assessment,
          user: {
            email: (assessment.user as any).email
          }
        }))
      };
    }
  });

  console.log('Admin stats:', stats);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading stats</h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold">{stats?.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Assessments</h3>
          <p className="mt-2 text-3xl font-semibold">{stats?.totalAssessments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="mt-2 text-3xl font-semibold">{stats?.completionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Assessment Distribution by Category</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats?.categoryStats}
                dataKey="assessments"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats?.categoryStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Recent Assessments</h2>
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {stats?.recentAssessments.map((assessment) => (
              <li key={assessment.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {assessment.user.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assessment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assessment.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 