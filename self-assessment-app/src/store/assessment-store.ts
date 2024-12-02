import { create } from 'zustand';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  confidenceLevel: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface AssessmentStore {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  loading: boolean;
  error: string | null;
  setAssessments: (assessments: Assessment[]) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAssessmentStore = create<AssessmentStore>()((set) => ({
  assessments: [],
  currentAssessment: null,
  loading: false,
  error: null,
  setAssessments: (assessments: Assessment[]) => {
    console.log('Setting assessments:', assessments);
    set({ assessments });
  },
  setCurrentAssessment: (assessment: Assessment | null) => {
    console.log('Setting current assessment:', assessment);
    set({ currentAssessment: assessment });
  },
  setLoading: (loading: boolean) => {
    console.log('Setting loading state:', loading);
    set({ loading });
  },
  setError: (error: string | null) => {
    console.log('Setting error state:', error);
    set({ error });
  },
})); 