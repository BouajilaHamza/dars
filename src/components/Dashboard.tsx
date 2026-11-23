import React, { useEffect, useState } from 'react';
import { BookOpen, Award, CheckCircle, Download, Clock } from 'lucide-react';
import { Course } from '../types';
import { Language, translations } from '../lib/i18n';
import { getAllOfflineLessons } from '../lib/offline-db';

interface DashboardProps {
  courses: Course[];
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  lang: Language;
  onSelectCourse: (course: Course) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  courses,
  enrolledCourseIds,
  completedLessonIds,
  lang,
  onSelectCourse
}) => {
  const [offlineCount, setOfflineCount] = useState(0);
  const t = translations[lang];

  useEffect(() => {
    getAllOfflineLessons().then(lessons => setOfflineCount(lessons.length));
  }, []);

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-text font-arabic">
          {t.myLearning}
        </h1>
        <p className="text-sm text-neutral-muted mt-1">
          {lang === 'ar'
            ? 'تابع تقدمك في الدورات، الدروس المحفوظة دون إنترنت، وشهادات الإنجاز.'
            : 'Suivez vos cours en cours, téléchargements hors-ligne et attestations.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-card border border-neutral-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-surface text-primary flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-neutral-text block">
              {enrolledCourses.length}
            </span>
            <span className="text-xs text-neutral-muted">
              {lang === 'ar' ? 'دورات مسجل فيها' : 'Cours suivis'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-card border border-neutral-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-state-success flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-neutral-text block">
              {completedLessonIds.length}
            </span>
            <span className="text-xs text-neutral-muted">
              {lang === 'ar' ? 'دروس مكتملة' : 'Leçons complétées'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-card border border-neutral-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-neutral-text block">
              {offlineCount}
            </span>
            <span className="text-xs text-neutral-muted">
              {lang === 'ar' ? 'دروس محفوظة Offline' : 'Leçons hors-ligne'}
            </span>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <div>
        <h2 className="text-lg font-bold text-neutral-text mb-4 font-arabic">
          {lang === 'ar' ? 'الدورات الجارية' : 'Cours en cours'}
        </h2>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-card border border-neutral-border p-8">
            <BookOpen className="w-10 h-10 text-neutral-muted mx-auto mb-3 opacity-60" />
            <p className="text-sm font-medium text-neutral-text">
              {lang === 'ar' ? 'لم تسجل في أي دورة بعد.' : 'Vous n êtes inscrit à aucun cours pour le moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => {
              const title = lang === 'ar' ? course.title_ar : (course.title_fr || course.title_ar);
              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className="bg-white rounded-card border border-neutral-border p-4 hover:border-primary transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
                >
                  <div className="aspect-video rounded-btn overflow-hidden mb-3 bg-slate-100">
                    <img src={course.thumbnail_url} alt={title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-text line-clamp-1 mb-2">
                    {title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-neutral-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{course.estimated_hours} {t.hours}</span>
                    </span>
                    <span className="text-primary font-bold">
                      {lang === 'ar' ? 'متابعة ←' : 'Reprendre →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
