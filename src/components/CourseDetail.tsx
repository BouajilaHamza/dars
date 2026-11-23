import React from 'react';
import { 
  Clock, 
  Users, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  ArrowLeft,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';
import { Course, Lesson, Module } from '../types';
import { Language, translations } from '../lib/i18n';

interface CourseDetailProps {
  course: Course;
  lang: Language;
  onBack: () => void;
  onStartLesson: (lesson: Lesson) => void;
  isEnrolled: boolean;
  onEnroll: (courseId: string) => void;
  completedLessonIds: string[];
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  lang,
  onBack,
  onStartLesson,
  isEnrolled,
  onEnroll,
  completedLessonIds
}) => {
  const t = translations[lang];

  const title = lang === 'ar' 
    ? course.title_ar 
    : lang === 'fr' 
    ? (course.title_fr || course.title_ar) 
    : (course.title_en || course.title_ar);

  const description = lang === 'ar' 
    ? course.description_ar 
    : lang === 'fr' 
    ? (course.description_fr || course.description_ar) 
    : (course.description_en || course.description_ar);

  // Find first lesson to start
  const firstLesson = course.modules?.[0]?.lessons?.[0];

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-neutral-muted hover:text-primary mb-6 transition-colors"
      >
        {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.exploreCourses}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left / Main Column: Details & Modules */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold bg-primary-surface text-primary px-3 py-1 rounded-md">
                {course.category}
              </span>
              {course.is_ai_generated && (
                <span className="text-xs font-medium bg-sky-100 text-sky-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.aiGeneratedLabel}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-text font-arabic leading-tight">
              {title}
            </h1>

            <p className="mt-4 text-neutral-muted text-sm sm:text-base leading-relaxed">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-neutral-muted border-y border-neutral-border py-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>{course.estimated_hours} {t.hours}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>{totalLessons} {t.lessons}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-neutral-muted" />
                <span>{course.enrolled_count} {t.students}</span>
              </span>
            </div>
          </div>

          {/* Syllabus Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-text mb-4 font-arabic">
              {t.syllabus}
            </h2>

            <div className="space-y-4">
              {course.modules?.map((module, mIdx) => (
                <div 
                  key={module.id} 
                  className="bg-white rounded-card border border-neutral-border overflow-hidden"
                >
                  <div className="p-4 bg-slate-50/60 border-b border-neutral-border flex items-center justify-between">
                    <span className="font-semibold text-sm text-neutral-text">
                      {lang === 'ar' ? module.title_ar : (module.title_fr || module.title_ar)}
                    </span>
                    <span className="text-xs text-neutral-muted">
                      {module.lessons.length} {t.lessons}
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-border/60">
                    {module.lessons.map((lesson) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => onStartLesson(lesson)}
                          className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-sky-50/40 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-state-success shrink-0" />
                            ) : lesson.type === 'video' ? (
                              <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                            ) : lesson.type === 'quiz' ? (
                              <HelpCircle className="w-4 h-4 text-state-warning shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-neutral-muted shrink-0" />
                            )}

                            <div>
                              <p className="text-sm font-medium text-neutral-text group-hover:text-primary transition-colors">
                                {lang === 'ar' ? lesson.title_ar : (lesson.title_fr || lesson.title_ar)}
                              </p>
                              <span className="text-[11px] text-neutral-muted">
                                {lesson.type === 'video' ? t.videoLesson : lesson.type === 'quiz' ? t.quizLesson : t.textLesson}
                              </span>
                            </div>
                          </div>

                          <span className="text-xs text-neutral-muted">
                            {lesson.duration_minutes} دقيقة
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Card Preview & CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-neutral-border p-5 shadow-xs sticky top-24">
            <div className="aspect-video rounded-btn overflow-hidden mb-5 bg-slate-100">
              <img 
                src={course.thumbnail_url} 
                alt={title} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-primary font-arabic">
                {t.heroStats.zeroCost}
              </div>
              <span className="text-xs text-neutral-muted">
                {lang === 'ar' ? 'متاح بالكامل بدون اشتراك' : 'Accès 100% libre et gratuit'}
              </span>
            </div>

            {/* Direct Open Learning CTA */}
            <button
              onClick={() => firstLesson && onStartLesson(firstLesson)}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-btn shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              <span>{isEnrolled ? (lang === 'ar' ? 'مواصلة الدرس' : 'Continuer le cours') : t.startCourse}</span>
            </button>

            {!isEnrolled && (
              <p className="text-[11px] text-center text-neutral-muted mt-2">
                {t.publicAccessNotice}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-neutral-border text-xs text-neutral-muted space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-state-success" />
                <span>{t.offlineAvailable} (PWA)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-state-success" />
                <span>{lang === 'ar' ? 'شهادة إتمام رقمية مجانية' : 'Attestation de réussite gratuite'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-state-success" />
                <span>{lang === 'ar' ? 'محتوى معتمد للمجتمع التونسي' : 'Contenu certifié communauté'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
