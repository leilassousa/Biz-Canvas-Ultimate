export type UserRole = 'user' | 'admin';
export type AssessmentStatus = 'draft' | 'in_progress' | 'completed';

export interface Profile {
  id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Preamble {
  id: string;
  category_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  category_id: string;
  content: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  status: AssessmentStatus;
  created_at: string;
  updated_at: string;
}

export interface Response {
  id: string;
  assessment_id: string;
  question_id: string;
  answer: string;
  confidence_level: number;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ReportSection {
  id: string;
  report_id: string;
  category_id: string;
  confidence_level: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;
      };
      preambles: {
        Row: Preamble;
        Insert: Omit<Preamble, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Preamble, 'id' | 'created_at' | 'updated_at'>>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>;
      };
      assessments: {
        Row: Assessment;
        Insert: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Assessment, 'id' | 'created_at' | 'updated_at'>>;
      };
      responses: {
        Row: Response;
        Insert: Omit<Response, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Response, 'id' | 'created_at' | 'updated_at'>>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Report, 'id' | 'created_at' | 'updated_at'>>;
      };
      report_sections: {
        Row: ReportSection;
        Insert: Omit<ReportSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ReportSection, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      assessment_status: AssessmentStatus;
    };
  };
} 