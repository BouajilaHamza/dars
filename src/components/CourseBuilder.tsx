import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Plus, 
  CheckCircle, 
  Video, 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  ShieldAlert,
  Youtube,
  Film,
  ExternalLink,
  Check
} from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { Course, User } from '../types';
import { extractYouTubeId, getYouTubeThumbnail } from '../lib/youtube';

interface CourseBuilderProps {
  lang: Language;
  onCourseCreated: (newCourse: Course) => void;
  onCancel: () => void;
  currentUser: User | null;
  onRequireAuth: () => void;
}

export const CourseBuilder: React.FC<CourseBuilderProps> = ({
  lang,
  onCourseCreated,
  onCancel,
  currentUser,
  onRequireAuth
}) => {
  const [titleAr, setTitleAr] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [category, setCategory] = useState<'ai_data' | 'web_dev' | 'bac_prep' | 'design' | 'soft_skills'>('ai_data');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [initialContent, setInitialContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Video source state
  const [videoSource, setVideoSource] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState('');

  const t = translations[lang];

  // Derived YouTube validation
  const youtubeId = extractYouTubeId(youtubeUrl);
  const detectedThumbnail = youtubeId ? getYouTubeThumbnail(youtubeUrl) : null;

  // If user is not admin, show guard view
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-arabic mb-2">
            {t.adminOnly}
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            {t.adminUploadNotice}
          </p>
          {!currentUser ? (
            <button
              onClick={onRequireAuth}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t.login}
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-colors"
            >
              {lang === 'ar' ? 'العودة للدورات' : 'Retour aux cours'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalThumbnail = customThumbnailUrl || detectedThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
    const finalVideoUrl = videoSource === 'youtube' ? youtubeUrl.trim() : null;

    try {
      if (videoSource === 'upload') {
        // Direct upload simulation
        setUploadProgress(40);
        const presignRes = await fetch('/api/upload/presign', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-User-Role': currentUser?.role || 'admin'
          },
          body: JSON.stringify({ fileName: 'course_preview.mp4', fileType: 'video/mp4' })
        });
        await presignRes.json();
        setUploadProgress(100);
      }

      // Submit course creation to API
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin'
        },
        body: JSON.stringify({
          title_ar: titleAr,
          title_fr: titleFr,
          description_ar: descriptionAr,
          category,
          difficulty,
          is_ai_generated: isAiGenerated,
          initial_content: initialContent,
          thumbnail_url: finalThumbnail,
          video_url: finalVideoUrl
        })
      });

      const data = (await res.json()) as any;
      if (data.success && data.course) {
        onCourseCreated(data.course);
        return;
      }
    } catch (err) {
      console.warn('API course creation fallback:', err);
    }

    // Local fallback create if offline or edge api disconnected
    const fallbackCourse: Course = {
      id: `c_${Date.now()}`,
      creator_id: currentUser?.id || 'u_hamza',
      creator_name: currentUser?.displayName || 'Hamza Bouajila',
      title_ar: titleAr,
      title_fr: titleFr,
      title_en: titleFr,
      description_ar: descriptionAr,
      thumbnail_url: finalThumbnail,
      category,
      difficulty,
      language: 'ar',
      estimated_hours: 4.5,
      is_published: 1,
      is_ai_generated: isAiGenerated ? 1 : 0,
      enrolled_count: 1,
      modules: [
        {
          id: `m_${Date.now()}`,
          title_ar: 'الوحدة 1: مقدمة المحتوى التعليمي',
          title_fr: 'Module 1: Introduction',
          sort_order: 1,
          lessons: [
            {
              id: `l_${Date.now()}`,
              title_ar: titleAr,
              title_fr: titleFr || 'Première leçon',
              type: finalVideoUrl ? 'video' : 'text',
              content_url: finalVideoUrl || undefined,
              content_text: initialContent || '# مرحباً بكم في الدورة\n\nهذا المحتوى التعليمي أضيف بنجاح في منصة درس.',
              duration_minutes: 15,
              sort_order: 1
            }
          ]
        }
      ]
    };

    onCourseCreated(fallbackCourse);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 mb-6 transition-colors font-medium"
      >
        {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.exploreCourses}</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-arabic">
              {t.createCourseTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'ar'
                ? 'إضافة دورة تعليمية جديدة مجانية للمجتمع مع دعم روابط يوتيوب أو الرفع المباشر.'
                : 'Ajoutez un nouveau cours gratuit avec support des vidéos YouTube ou téléversement.'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg border border-sky-100">
            {lang === 'ar' ? 'صلاحيات المشرف' : 'Espace Admin'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.courseTitle} (بالعربية / الدارجة) *
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: أساسيات بايثون والذكاء الاصطناعي من الصفر"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:border-sky-500 focus:bg-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.courseTitle} (Français / English)
              </label>
              <input
                type="text"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex: Python & AI Fundamentals"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:border-sky-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.courseCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:border-sky-500 focus:bg-white outline-none transition-all"
              >
                <option value="ai_data">{t.aiAndData}</option>
                <option value="web_dev">{t.webDev}</option>
                <option value="bac_prep">{t.bacPrep}</option>
                <option value="design">{t.design}</option>
                <option value="soft_skills">{t.softSkills}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'مستوى الصعوبة' : 'Niveau de difficulté'}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:border-sky-500 focus:bg-white outline-none transition-all"
              >
                <option value="beginner">{lang === 'ar' ? 'مبتدئ' : 'Débutant'}</option>
                <option value="intermediate">{lang === 'ar' ? 'متوسط' : 'Intermédiaire'}</option>
                <option value="advanced">{lang === 'ar' ? 'متقدم' : 'Avancé'}</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.courseDesc} *
            </label>
            <textarea
              required
              rows={3}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="وصف مختصر لأهداف الدورة والمهارات العملية التي سيكتسبها المتعلم..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-sky-500 focus:bg-white outline-none leading-relaxed transition-all"
            />
          </div>

          {/* Video Section (YouTube vs Direct Upload) */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-sm font-bold text-slate-900 block font-arabic">
                  {lang === 'ar' ? 'محتوى الفيديو (يوتيوب أو رفع مباشر)' : 'Contenu Vidéo'}
                </span>
                <span className="text-xs text-slate-500">
                  {lang === 'ar' 
                    ? 'يمكنك وضع رابط أي فيديو تعليمي من يوتيوب، أو رفع فيديو مباشرة.' 
                    : 'Intégrez un lien YouTube ou téléversez votre fichier vidéo.'}
                </span>
              </div>

              {/* Source Switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setVideoSource('youtube')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    videoSource === 'youtube'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'يوتيوب (سريع)' : 'YouTube'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSource('upload')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    videoSource === 'upload'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع ملف' : 'Téléversement'}</span>
                </button>
              </div>
            </div>

            {/* YouTube Input Mode */}
            {videoSource === 'youtube' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ar' ? 'رابط فيديو يوتيوب (URL)' : 'Lien de la vidéo YouTube'}
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm focus:border-red-500 outline-none transition-all pr-10"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 text-red-500 pointer-events-none">
                      <Youtube className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* YouTube Detected Preview */}
                {youtubeId && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          {lang === 'ar' ? 'تم التعرف على فيديو يوتيوب بنجاح' : 'Vidéo YouTube validée'}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-mono">
                          ID: {youtubeId}
                        </span>
                      </div>
                    </div>
                    {detectedThumbnail && (
                      <img 
                        src={detectedThumbnail} 
                        alt="YouTube Preview" 
                        className="w-16 h-10 object-cover rounded-md border border-emerald-300 shadow-2xs" 
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Direct Upload Mode */}
            {videoSource === 'upload' && (
              <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 bg-white rounded-xl p-6 text-center transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-sky-600 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-slate-800">
                  {lang === 'ar' ? 'اسحب ملف الفيديو هنا أو اضغط للاختيار' : 'Glissez-déposez la vidéo ou cliquez pour parcourir'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">MP4, WebM (بحد أقصى 500MB)</p>
              </div>
            )}
          </div>

          {/* AI-Generated Toggle */}
          <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  {t.aiGeneratedLabel}
                </span>
                <span className="text-xs text-slate-500">
                  {lang === 'ar'
                    ? 'ضع علامة إذا تم إعداد المحتوى أو تلخيصه بمساعدة نماذج الذكاء الاصطناعي.'
                    : 'Indiquez si le cours utilise des résumés générés par IA.'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAiGenerated}
              onChange={(e) => setIsAiGenerated(e.target.checked)}
              className="w-5 h-5 accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Initial Lesson Content (Markdown) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'ar' ? 'نص الدرس وملخص الملاحظات (Markdown)' : 'Notes de cours (Markdown)'}
            </label>
            <textarea
              rows={5}
              value={initialContent}
              onChange={(e) => setInitialContent(e.target.value)}
              placeholder="# مرحباً بكم في الدورة!&#10;&#10;في هذا الدرس سنتعلم..."
              className="w-full font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:border-sky-500 focus:bg-white outline-none leading-relaxed transition-all"
            />
          </div>

          {/* Upload Progress Bar if active */}
          {uploadProgress !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>{lang === 'ar' ? 'جاري تجهيز وحفظ الفيديو...' : 'Traitement du fichier vidéo...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium"
            >
              {lang === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? '...' : t.publishCourse}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
