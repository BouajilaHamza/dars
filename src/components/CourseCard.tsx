import React from 'react';
import { Clock, Users, PlayCircle, Sparkles, BookOpen, CheckCircle } from 'lucide-react';
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

  // Resolve title and description based on current language
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

  return (
    <div 
      onClick={() => onSelect(course)}
      className="group bg-white rounded-card border border-neutral-border hover:border-primary/40 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 shadow-xs hover:shadow-md"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        <img 
          src={course.thumbnail_url} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Minimal Badges on Top */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          {/* Category Tag */}
          <span className="text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-neutral-text px-2.5 py-1 rounded-md shadow-xs">
            {categoryLabels[course.category] || course.category}
          </span>

          {/* AI-Generated badge or Community tag */}
          {course.is_ai_generated ? (
            <span className="text-[10px] font-medium bg-sky-500/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
              <Sparkles className="w-3 h-3" />
              <span>AI</span>
            </span>
          ) : (
            <span className="text-[10px] font-medium bg-emerald-600/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
              <span>تطوعي</span>
            </span>
          )}
        </div>

        {/* Enrolled Indicator */}
        {isEnrolled && (
          <div className="absolute bottom-3 start-3 bg-white/95 text-state-success text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t.enrolled}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-neutral-text text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-neutral-muted line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Enrolled Progress Bar */}
          {isEnrolled && progressPercent > 0 && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-muted font-medium">
                <span>{lang === 'ar' ? 'نسبة الإنجاز' : 'Progression'}</span>
                <span className="text-primary font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Metadata */}
        <div className="mt-4 pt-3 border-t border-neutral-border flex items-center justify-between text-xs text-neutral-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{course.estimated_hours} {t.hours}</span>
            </span>

            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-neutral-muted" />
              <span>{course.enrolled_count} {t.students}</span>
            </span>
          </div>

          {/* Quick CTA icon */}
          <div className="text-primary group-hover:translate-x-0.5 transition-transform">
            <PlayCircle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
