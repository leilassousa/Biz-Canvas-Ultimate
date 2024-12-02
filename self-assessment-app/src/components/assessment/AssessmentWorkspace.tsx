import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessmentStore } from '../../store/assessment-store';
import { supabase } from '../../lib/supabase';
import { Question, Category, Preamble } from '../../types/database.types';
import { useAuth } from '../../contexts/AuthContext';

interface QuestionWithCategory extends Question {
  category: Category;
  preamble?: Preamble;
}

export const AssessmentWorkspace = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentAssessment, setLoading: setStoreLoading, setError: setStoreError } = useAssessmentStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionWithCategory[]>([]);
  const [answers, setAnswers] = useState<Record<string, { answer: string; confidence: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create new assessment if none exists
  useEffect(() => {
    const createAssessment = async () => {
      if (!assessmentId && user) {
        try {
          console.log('Creating new assessment...');
          const { data, error: createError } = await supabase
            .from('assessments')
            .insert({
              user_id: user.id,
              status: 'in_progress'
            })
            .select()
            .single();

          if (createError) throw createError;
          
          console.log('New assessment created:', data);
          navigate(`/assessment/${data.id}`);
        } catch (err) {
          console.error('Error creating assessment:', err);
          setError('Failed to create assessment');
        }
      }
    };

    createAssessment();
  }, [assessmentId, user, navigate]);

  // Load questions and existing answers
  useEffect(() => {
    const loadAssessment = async () => {
      if (!assessmentId) return;

      try {
        console.log('Loading assessment data...');
        setLoading(true);
        setStoreLoading(true);
        
        // Fetch questions with categories and preambles
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            *,
            category:categories(*),
            preamble:preambles(*)
          `)
          .order('category_id')
          .order('order');

        if (questionsError) throw questionsError;

        // Fetch assessment details
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (assessmentError) throw assessmentError;

        // If this is an existing assessment, load previous answers
        const { data: responsesData, error: responsesError } = await supabase
          .from('responses')
          .select('*')
          .eq('assessment_id', assessmentId);

        if (responsesError) throw responsesError;

        // Convert responses to answers format
        const existingAnswers = responsesData.reduce((acc, response) => ({
          ...acc,
          [response.question_id]: {
            answer: response.answer,
            confidence: response.confidence_level
          }
        }), {});

        setQuestions(questionsData as QuestionWithCategory[]);
        setAnswers(existingAnswers);
        setCurrentAssessment(assessmentData);
        console.log('Assessment data loaded successfully');
      } catch (err) {
        console.error('Error loading assessment:', err);
        const errorMessage = 'Failed to load assessment';
        setError(errorMessage);
        setStoreError(errorMessage);
      } finally {
        setLoading(false);
        setStoreLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId, setCurrentAssessment, setStoreLoading, setStoreError]);

  // Save progress
  const saveProgress = async () => {
    if (!assessmentId) return;
    
    try {
      console.log('Saving assessment progress...');
      setSaving(true);

      // Update responses in the database
      const { error: saveError } = await supabase
        .from('responses')
        .upsert(
          Object.entries(answers).map(([questionId, data]) => ({
            assessment_id: assessmentId,
            question_id: questionId,
            answer: data.answer,
            confidence_level: data.confidence
          }))
        );

      if (saveError) throw saveError;
      console.log('Progress saved successfully');
    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      await saveProgress();
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Handle assessment completion
      navigate(`/assessment/${assessmentId}/review`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Answer handlers
  const handleAnswerChange = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        answer
      }
    }));
  };

  const handleConfidenceChange = (confidence: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        confidence
      }
    }));
  };

  if (loading) {
    return <div>Loading assessment...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Category and Preamble */}
      {currentQuestion?.category && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentQuestion.category.name}
          </h2>
          {currentQuestion.preamble && (
            <p className="mt-2 text-gray-600">
              {currentQuestion.preamble.content}
            </p>
          )}
        </div>
      )}

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          {currentQuestion?.content}
        </h3>
        <textarea
          value={currentAnswer?.answer || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your answer here..."
        />
      </div>

      {/* Confidence Slider */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How confident are you about this answer?
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={currentAnswer?.confidence || 3}
          onChange={(e) => handleConfidenceChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Not Confident</span>
          <span>Very Confident</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Review' : 'Next'}
        </button>
      </div>

      {/* Saving indicator */}
      {saving && (
        <div className="mt-4 text-sm text-gray-600">
          Saving progress...
        </div>
      )}
    </div>
  );
}; 