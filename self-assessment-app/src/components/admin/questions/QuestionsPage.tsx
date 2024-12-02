import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Question } from '../../../types/database.types';

interface QuestionForm {
  content: string;
  category_id: string;
  order: number;
}

export function QuestionsPage() {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<QuestionForm>({
    content: '',
    category_id: '',
    order: 0,
  });
  const queryClient = useQueryClient();

  // Fetch questions with category information
  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      console.log('Fetching questions...');
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          category:categories (
            id,
            name
          )
        `)
        .order('category_id')
        .order('order');

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      return data;
    },
  });

  // Fetch categories for the dropdown
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data;
    },
  });

  // Create question mutation
  const createMutation = useMutation({
    mutationFn: async (question: QuestionForm) => {
      console.log('Creating question:', question);
      const { data, error } = await supabase
        .from('questions')
        .insert([question])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setNewQuestion({ content: '', category_id: '', order: 0 });
    },
  });

  // Update question mutation
  const updateMutation = useMutation({
    mutationFn: async (question: Question) => {
      console.log('Updating question:', question);
      const { data, error } = await supabase
        .from('questions')
        .update({
          content: question.content,
          category_id: question.category_id,
          order: question.order,
        })
        .eq('id', question.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setEditingQuestion(null);
    },
  });

  // Delete question mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting question:', id);
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      updateMutation.mutate({
        ...editingQuestion,
        content: newQuestion.content || editingQuestion.content,
        category_id: newQuestion.category_id || editingQuestion.category_id,
        order: newQuestion.order || editingQuestion.order,
      });
    } else {
      createMutation.mutate(newQuestion);
    }
  };

  if (isLoadingQuestions || isLoadingCategories) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Questions</h1>
      </div>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Question Content
            </label>
            <textarea
              id="content"
              rows={3}
              value={newQuestion.content}
              onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={newQuestion.category_id}
                onChange={(e) => setNewQuestion({ ...newQuestion, category_id: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <input
                type="number"
                id="order"
                value={newQuestion.order}
                onChange={(e) => setNewQuestion({ ...newQuestion, order: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          {editingQuestion && (
            <button
              type="button"
              onClick={() => {
                setEditingQuestion(null);
                setNewQuestion({ content: '', category_id: '', order: 0 });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            {editingQuestion ? 'Update' : 'Add'} Question
          </button>
        </div>
      </form>

      {/* Questions List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          {categories?.map((category) => {
            const categoryQuestions = questions?.filter(
              (q) => q.category_id === category.id
            );

            if (!categoryQuestions?.length) return null;

            return (
              <div key={category.id}>
                <div className="bg-gray-50 px-6 py-3">
                  <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {categoryQuestions.map((question) => (
                    <div key={question.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{question.content}</p>
                          <p className="mt-1 text-xs text-gray-500">Order: {question.order}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingQuestion(question);
                              setNewQuestion({
                                content: question.content,
                                category_id: question.category_id,
                                order: question.order,
                              });
                            }}
                            className="text-primary hover:text-primary/90 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this question?')) {
                                deleteMutation.mutate(question.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 