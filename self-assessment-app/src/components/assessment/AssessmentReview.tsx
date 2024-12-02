import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Question, Category, Response, Assessment } from '../../types/database.types';
import { useAssessmentStore } from '../../store/assessment-store';
import { useAuth } from '../../contexts/AuthContext';

interface QuestionResponse {
  question: Question & { category: Category };
  response: Response;
}

export const AssessmentReview = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentAssessment, setLoading: setStoreLoading, setError: setStoreError } = useAssessmentStore();
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResponses = async () => {
      if (!assessmentId) {
        navigate('/dashboard');
        return;
      }

      try {
        console.log('Loading assessment responses...');
        setLoading(true);
        setStoreLoading(true);

        // Fetch assessment details
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (assessmentError) throw assessmentError;
        setAssessment(assessmentData);
        setCurrentAssessment(assessmentData);

        // Fetch responses with questions and categories
        const { data, error: responsesError } = await supabase
          .from('responses')
          .select(`
            *,
            question:questions(
              *,
              category:categories(*)
            )
          `)
          .eq('assessment_id', assessmentId)
          .order('question.category_id')
          .order('question.order');

        if (responsesError) throw responsesError;

        setResponses(data.map(response => ({
          question: response.question,
          response: {
            id: response.id,
            assessment_id: response.assessment_id,
            question_id: response.question_id,
            answer: response.answer,
            confidence_level: response.confidence_level,
            created_at: response.created_at,
            updated_at: response.updated_at
          }
        })));

        console.log('Responses loaded successfully');
      } catch (err) {
        console.error('Error loading responses:', err);
        const errorMessage = 'Failed to load responses';
        setError(errorMessage);
        setStoreError(errorMessage);
      } finally {
        setLoading(false);
        setStoreLoading(false);
      }
    };

    loadResponses();
  }, [assessmentId, navigate, setCurrentAssessment, setStoreLoading, setStoreError]);

  const generateReport = async () => {
    if (!assessment || !user) return null;

    try {
      console.log('Generating report...');
      
      // Calculate confidence levels by category
      const categoryConfidence = responses.reduce((acc, { question, response }) => {
        const categoryId = question.category.id;
        if (!acc[categoryId]) {
          acc[categoryId] = {
            count: 0,
            total: 0,
            category: question.category
          };
        }
        acc[categoryId].count++;
        acc[categoryId].total += response.confidence_level;
        return acc;
      }, {} as Record<string, { count: number; total: number; category: Category }>);

      // Create report
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          assessment_id: assessment.id,
          title: `Business Assessment Report - ${new Date().toLocaleDateString()}`
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Create report sections
      const reportSections = Object.values(categoryConfidence).map(({ category, count, total }) => ({
        report_id: report.id,
        category_id: category.id,
        confidence_level: Math.round((total / count) * 10) / 10,
        content: responses
          .filter(r => r.question.category.id === category.id)
          .map(r => `${r.question.content}\nAnswer: ${r.response.answer}\nConfidence: ${r.response.confidence_level}/5`)
          .join('\n\n')
      }));

      const { error: sectionsError } = await supabase
        .from('report_sections')
        .insert(reportSections);

      if (sectionsError) throw sectionsError;

      return report.id;
    } catch (err) {
      console.error('Error generating report:', err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    try {
      console.log('Submitting assessment...');
      setSubmitting(true);

      // Update assessment status to completed
      const { error: updateError } = await supabase
        .from('assessments')
        .update({ status: 'completed' })
        .eq('id', assessment.id);

      if (updateError) throw updateError;

      // Generate report
      const reportId = await generateReport();
      
      console.log('Assessment submitted successfully');
      navigate(`/reports/${reportId}`);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading review...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Group responses by category
  const responsesByCategory = responses.reduce((acc, { question, response }) => {
    const categoryId = question.category.id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: question.category,
        responses: []
      };
    }
    acc[categoryId].responses.push({ question, response });
    return acc;
  }, {} as Record<string, { category: Category; responses: typeof responses }>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Your Answers</h1>

      {Object.values(responsesByCategory).map(({ category, responses }) => (
        <div key={category.id} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h2>
          
          <div className="space-y-6">
            {responses.map(({ question, response }) => (
              <div key={question.id} className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {question.content}
                </h3>
                <div className="mb-4">
                  <p className="text-gray-700">{response.answer}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(response.confidence_level / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {response.confidence_level}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate(`/assessment/${assessmentId}`)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Assessment
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
}; 