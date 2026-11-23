import React, { useState } from 'react';
import { Upload, Sparkles, Plus, CheckCircle, Video, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { Course } from '../types';

interface CourseBuilderProps {
  lang: Language;
  onCourseCreated: (newCourse: Course) => void;
  onCancel: () => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({
  lang,
  onCourseCreated,
  onCancel
}) => {
  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [category, setCategory] = useState<'ai_data' | 'web_dev' | 'bac_prep' | 'design' | 'soft_skills'>('ai_data');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isAiGenerated, setIsAiGenerated] = useState(true);
  const [initialContent, setInitialContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Simulate presigned R2 upload handshake
      setUploadProgress(40);
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: 'course_preview.mp4', fileType: 'video/mp4' })
      });
      await presignRes.json();
      setUploadProgress(100);

      // 2. Submit course creation
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_ar: titleAr,
          title_fr: titleFr,
          description_ar: descriptionAr,
          category,
          difficulty,
          is_ai_generated: isAiGenerated,
          initial_content: initialContent
        })
      });

      const data = (await res.json()) as any;
      if (data.success && data.course) {
        onCourseCreated(data.course);
      }
    } catch (err) {
      console.error(err);
      // Fallback create
      const fallback: Course = {
        id: `c_${Date.now()}`,
        creator_id: 'u_community',
        creator_name: 'مساهم مجتمعي',
        title_ar: titleAr,
        title_fr: titleFr,
        description_ar: descriptionAr,
        thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        category,
        difficulty,
        language: 'ar',
        estimated_hours: 4.0,
        is_published: 1,
        is_ai_generated: isAiGenerated ? 1 : 0,
        enrolled_count: 1
      };
      onCourseCreated(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm text-neutral-muted hover:text-primary mb-6 transition-colors"
      >
        {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.exploreCourses}</span>
      </button>

      <div className="bg-white rounded-card border border-neutral-border p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-4 border-b border-neutral-border">
          <h1 className="text-2xl font-bold text-neutral-text font-arabic">
            {t.createCourseTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-muted mt-1">
            {lang === 'ar'
              ? 'شارك معرفتك مع الشباب التونسي عبر دورة مجانية مفتوحة المصدر.'
              : 'Partagez vos compétences avec la communauté tunisienne via un cours libre.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-text mb-1">
                {t.courseTitle} (بالعربية / الدارجة) *
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: مقدمة في لغة بايثون والذكاء الاصطناعي"
                className="w-full bg-neutral-bg border border-neutral-border rounded-btn py-2 px-3 text-sm focus:border-primary focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-text mb-1">
                {t.courseTitle} (Français / English)
              </label>
              <input
                type="text"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex: Introduction à Python & IA"
                className="w-full bg-neutral-bg border border-neutral-border rounded-btn py-2 px-3 text-sm focus:border-primary focus:bg-white outline-hidden"
              />
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-text mb-1">
                {t.courseCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-neutral-bg border border-neutral-border rounded-btn py-2 px-3 text-sm focus:border-primary focus:bg-white outline-hidden"
              >
                <option value="ai_data">{t.aiAndData}</option>
                <option value="web_dev">{t.webDev}</option>
                <option value="bac_prep">{t.bacPrep}</option>
                <option value="design">{t.design}</option>
                <option value="soft_skills">{t.softSkills}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-text mb-1">
                {lang === 'ar' ? 'مستوى الصعوبة' : 'Niveau de difficulté'}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-neutral-bg border border-neutral-border rounded-btn py-2 px-3 text-sm focus:border-primary focus:bg-white outline-hidden"
              >
                <option value="beginner">{lang === 'ar' ? 'مبتدئ' : 'Débutant'}</option>
                <option value="intermediate">{lang === 'ar' ? 'متوسط' : 'Intermédiaire'}</option>
                <option value="advanced">{lang === 'ar' ? 'متقدم' : 'Avancé'}</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-text mb-1">
              {t.courseDesc} *
            </label>
            <textarea
              required
              rows={3}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="وصف مختصر لأهداف الدورة والمهارات العملية التي سيكتسبها المتعلم..."
              className="w-full bg-neutral-bg border border-neutral-border rounded-btn p-3 text-sm focus:border-primary focus:bg-white outline-hidden leading-relaxed"
            />
          </div>

          {/* AI-Generated Toggle */}
          <div className="p-4 bg-sky-50 rounded-btn border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <span className="text-sm font-bold text-neutral-text block">
                  {t.aiGeneratedLabel}
                </span>
                <span className="text-xs text-neutral-muted">
                  {lang === 'ar'
                    ? 'ضع علامة إذا تم توليد نصوص أو محتوى الفيديو بأدوات الذكاء الاصطناعي.'
                    : 'Indiquez si le contenu a été généré avec l aide d outils d IA.'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAiGenerated}
              onChange={(e) => setIsAiGenerated(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
          </div>

          {/* Initial Lesson Content (Markdown) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-text mb-1">
              {lang === 'ar' ? 'نص الدرس الأول (Markdown)' : 'Contenu de la 1ère leçon (Markdown)'}
            </label>
            <textarea
              rows={5}
              value={initialContent}
              onChange={(e) => setInitialContent(e.target.value)}
              placeholder="# مرحباً بكم في الدورة!&#10;&#10;في هذا الدرس الأول سنتعلم..."
              className="w-full font-mono bg-neutral-bg border border-neutral-border rounded-btn p-3 text-xs sm:text-sm focus:border-primary focus:bg-white outline-hidden leading-relaxed"
            />
          </div>

          {/* Upload Progress Bar if active */}
          {uploadProgress !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-muted font-medium">
                <span>{lang === 'ar' ? 'رفع وحفظ في Cloudflare R2...' : 'Téléversement vers Cloudflare R2...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-neutral-muted hover:text-neutral-text font-medium"
            >
              {lang === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-btn transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? '...' : t.publishCourse}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
