import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Preamble } from '../../../types/database.types';

interface PreambleForm {
  content: string;
  category_id: string;
}

export function PreamblePage() {
  const [editingPreamble, setEditingPreamble] = useState<Preamble | null>(null);
  const [newPreamble, setNewPreamble] = useState<PreambleForm>({
    content: '',
    category_id: '',
  });
  const queryClient = useQueryClient();

  // Fetch preambles with category information
  const { data: preambles, isLoading: isLoadingPreambles } = useQuery({
    queryKey: ['preambles'],
    queryFn: async () => {
      console.log('Fetching preambles...');
      const { data, error } = await supabase
        .from('preambles')
        .select(`
          *,
          category:categories (
            id,
            name
          )
        `)
        .order('category_id');

      if (error) {
        console.error('Error fetching preambles:', error);
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

  // Create preamble mutation
  const createMutation = useMutation({
    mutationFn: async (preamble: PreambleForm) => {
      console.log('Creating preamble:', preamble);
      const { data, error } = await supabase
        .from('preambles')
        .insert([preamble])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preambles'] });
      setNewPreamble({ content: '', category_id: '' });
    },
  });

  // Update preamble mutation
  const updateMutation = useMutation({
    mutationFn: async (preamble: Preamble) => {
      console.log('Updating preamble:', preamble);
      const { data, error } = await supabase
        .from('preambles')
        .update({
          content: preamble.content,
          category_id: preamble.category_id,
        })
        .eq('id', preamble.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preambles'] });
      setEditingPreamble(null);
    },
  });

  // Delete preamble mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting preamble:', id);
      const { error } = await supabase
        .from('preambles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preambles'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPreamble) {
      updateMutation.mutate({
        ...editingPreamble,
        content: newPreamble.content || editingPreamble.content,
        category_id: newPreamble.category_id || editingPreamble.category_id,
      });
    } else {
      createMutation.mutate(newPreamble);
    }
  };

  if (isLoadingPreambles || isLoadingCategories) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Preambles</h1>
      </div>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Preamble Content
            </label>
            <textarea
              id="content"
              rows={5}
              value={newPreamble.content}
              onChange={(e) => setNewPreamble({ ...newPreamble, content: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              required
              placeholder="Enter the introductory text for this category..."
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={newPreamble.category_id}
              onChange={(e) => setNewPreamble({ ...newPreamble, category_id: e.target.value })}
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
        </div>
        <div className="flex justify-end space-x-2">
          {editingPreamble && (
            <button
              type="button"
              onClick={() => {
                setEditingPreamble(null);
                setNewPreamble({ content: '', category_id: '' });
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
            {editingPreamble ? 'Update' : 'Add'} Preamble
          </button>
        </div>
      </form>

      {/* Preambles List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          {categories?.map((category) => {
            const categoryPreambles = preambles?.filter(
              (p) => p.category_id === category.id
            );

            if (!categoryPreambles?.length) return null;

            return (
              <div key={category.id}>
                <div className="bg-gray-50 px-6 py-3">
                  <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {categoryPreambles.map((preamble) => (
                    <div key={preamble.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {preamble.content}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingPreamble(preamble);
                              setNewPreamble({
                                content: preamble.content,
                                category_id: preamble.category_id,
                              });
                            }}
                            className="text-primary hover:text-primary/90 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this preamble?')) {
                                deleteMutation.mutate(preamble.id);
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