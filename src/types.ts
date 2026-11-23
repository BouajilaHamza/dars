export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'learner' | 'educator' | 'moderator' | 'admin';
  language: 'ar' | 'fr' | 'en';
}

export interface Lesson {
  id: string;
  title_ar: string;
  title_fr?: string;
  type: 'video' | 'text' | 'quiz' | 'exercise';
  content_url?: string;
  content_text?: string;
  quiz_data?: string;
  duration_minutes: number;
  sort_order: number;
}

export interface Module {
  id: string;
  title_ar: string;
  title_fr?: string;
  sort_order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  creator_id: string;
  creator_name: string;
  title_ar: string;
  title_fr?: string;
  title_en?: string;
  description_ar: string;
  description_fr?: string;
  description_en?: string;
  thumbnail_url: string;
  category: 'ai_data' | 'web_dev' | 'bac_prep' | 'design' | 'soft_skills';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: 'ar' | 'fr' | 'en';
  estimated_hours: number;
  is_published: number;
  is_ai_generated: number;
  enrolled_count: number;
  modules?: Module[];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}
