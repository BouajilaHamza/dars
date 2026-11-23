import React from 'react';
import { Clock, Users, Play, BookOpen, CheckCircle, Sparkles, User as UserIcon } from 'lucide-react';
import { Course } from '../types';
import { Language, translations } from '../lib/i18n';

interface CourseCardProps {
  course: Course;
  lang: Language;
  onSelect: (course: Course) => void;
  isEnrolled?: boolean;
  progressPercent?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  lang,
  onSelect,
  isEnrolled = false,
  progressPercent = 0
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

  const categoryLabels: Record<string, string> = {
    ai_data: t.aiAndData,
    web_dev: t.webDev,
    bac_prep: t.bacPrep,
    design: t.design,
    soft_skills: t.softSkills
  };

  const difficultyLabels: Record<string, { ar: string; fr: string; en: string }> = {
    beginner: { ar: 'مبتدئ', fr: 'Débutant', en: 'Beginner' },
    intermediate: { ar: 'متوسط', fr: 'Intermédiaire', en: 'Intermediate' },
    advanced: { ar: 'متقدم', fr: 'Avancé', en: 'Advanced' }
  };

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 4;

  return (
    <div 
      onClick={() => onSelect(course)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-sky-500/50 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-sky-500/5"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img 
          src={course.thumbnail_url} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-95 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-lg shadow-sm">
            {categoryLabels[course.category] || course.category}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-md px-2 py-0.5 rounded-md">
              {difficultyLabels[course.difficulty]?.[lang] || course.difficulty}
            </span>
            {course.is_ai_generated ? (
              <span className="text-[10px] font-bold bg-sky-500 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                <span>AI</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                مساهمة
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar inside Thumbnail */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
          {isEnrolled ? (
            <div className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t.enrolled}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-white/90 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>{totalLessons} {t.lessons}</span>
            </div>
          )}

          <div className="w-8 h-8 rounded-full bg-white/90 text-sky-600 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all">
            <Play className="w-3.5 h-3.5 fill-current ms-0.5" />
          </div>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Creator byline */}
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
            <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold">
              {course.creator_name.charAt(0)}
            </div>
            <span className="font-medium text-slate-600">{course.creator_name}</span>
          </div>

          {/* Course Title */}
          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Progress bar if enrolled */}
          {isEnrolled && progressPercent > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">{lang === 'ar' ? 'تقدّمك' : 'Progression'}</span>
                <span className="text-sky-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Metadata */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{course.estimated_hours} {t.hours}</span>
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.enrolled_count} {t.students}</span>
            </span>
          </div>

          <span className="text-xs font-bold text-sky-600 group-hover:underline flex items-center gap-0.5">
            {lang === 'ar' ? 'ابدأ الآن ←' : 'Accéder →'}
          </span>
        </div>
      </div>
    </div>
  );
};
