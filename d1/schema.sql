-- D1 Database Schema for Dars MOOC

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'learner', -- 'learner', 'educator', 'moderator', 'admin'
  language TEXT NOT NULL DEFAULT 'ar',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_fr TEXT,
  title_en TEXT,
  description_ar TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL, -- 'ai_data', 'web_dev', 'bac_prep', 'design', 'soft_skills'
  difficulty TEXT NOT NULL DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  language TEXT NOT NULL DEFAULT 'ar',
  estimated_hours REAL DEFAULT 4,
  is_published INTEGER NOT NULL DEFAULT 1,
  is_ai_generated INTEGER NOT NULL DEFAULT 1,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_fr TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_fr TEXT,
  type TEXT NOT NULL DEFAULT 'video', -- 'video', 'text', 'quiz', 'exercise'
  content_url TEXT,
  content_text TEXT,
  quiz_data TEXT, -- JSON
  duration_minutes INTEGER DEFAULT 10,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS enrollments (
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'in_progress'
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, lesson_id)
);
