import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Check, 
  FileText, 
  HelpCircle,
  Video,
  List
} from 'lucide-react';
import { Course, Lesson, QuizQuestion, User } from '../types';
import { Language, translations } from '../lib/i18n';
import { saveLessonOffline, isLessonOffline, removeLessonOffline } from '../lib/offline-db';
import { getYouTubeEmbedUrl } from '../lib/youtube';

interface LessonPlayerProps {
  course: Course;
  currentLesson: Lesson;
  lang: Language;
  onBackToCourse: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onCompleteLesson: (lessonId: string) => void;
  isCompleted: boolean;
  currentUser: User | null;
  onRequireAuth: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  course,
  currentLesson,
  lang,
  onBackToCourse,
  onSelectLesson,
  onCompleteLesson,
  isCompleted,
  currentUser,
  onRequireAuth
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = translations[lang];

  // Check offline status on lesson change
  useEffect(() => {
    isLessonOffline(currentLesson.id).then(setOfflineSaved);
    setQuizScore(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  }, [currentLesson.id]);

  const toggleOffline = async () => {
    if (offlineSaved) {
      await removeLessonOffline(currentLesson.id);
      setOfflineSaved(false);
    } else {
      await saveLessonOffline(course.id, currentLesson);
      setOfflineSaved(true);
    }
  };

  // Find all lessons flat
  const allLessons = course.modules?.flatMap(m => m.lessons) || [];
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Parse quiz questions if present
  let questions: QuizQuestion[] = [];
  if (currentLesson.type === 'quiz' && currentLesson.quiz_data) {
    try {
      const parsed = JSON.parse(currentLesson.quiz_data);
      questions = parsed.questions || [];
    } catch (e) {
      console.error('Quiz parse error', e);
    }
  }

  const handleQuizSubmit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score === questions.length) {
      onCompleteLesson(currentLesson.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-border">
        <button
          onClick={onBackToCourse}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-muted hover:text-primary transition-colors font-medium"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{lang === 'ar' ? course.title_ar : (course.title_fr || course.title_ar)}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Offline Save Toggle */}
          <button
            onClick={toggleOffline}
            className={`px-3 py-1.5 text-xs font-semibold rounded-btn border transition-all flex items-center gap-1.5 ${
              offlineSaved 
                ? 'bg-primary-surface border-primary text-primary' 
                : 'bg-white border-neutral-border text-neutral-muted hover:border-primary'
            }`}
          >
            {offlineSaved ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{offlineSaved ? t.downloaded : t.downloadOffline}</span>
          </button>

          {/* Toggle Modules List on Mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 bg-white border border-neutral-border rounded-btn text-neutral-muted"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Player & Lesson Content (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player Box */}
          {currentLesson.type === 'video' && (() => {
            const ytEmbedUrl = getYouTubeEmbedUrl(currentLesson.content_url);
            return (
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg aspect-video relative flex items-center justify-center">
                {ytEmbedUrl ? (
                  <iframe
                    src={ytEmbedUrl}
                    title={lang === 'ar' ? currentLesson.title_ar : (currentLesson.title_fr || currentLesson.title_ar)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : currentLesson.content_url ? (
                  <video
                    controls
                    className="w-full h-full object-contain"
                    src={currentLesson.content_url}
                    poster={course.thumbnail_url}
                  >
                    متصفحك لا يدعم تشغيل الفيديو المباشر.
                  </video>
                ) : (
                  <div className="text-white text-center p-6">
                    <Video className="w-12 h-12 text-primary mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-medium font-arabic">جاري تجهيز محتوى الفيديو...</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Lesson Header */}
          <div className="bg-white rounded-card border border-neutral-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-primary bg-primary-surface px-2.5 py-1 rounded-md">
                  {currentLesson.type === 'video' ? t.videoLesson : currentLesson.type === 'quiz' ? t.quizLesson : t.textLesson}
                </span>
                <h2 className="text-xl font-bold text-neutral-text font-arabic mt-2">
                  {lang === 'ar' ? currentLesson.title_ar : (currentLesson.title_fr || currentLesson.title_ar)}
                </h2>
              </div>

              {/* Mark Complete CTA */}
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={() => {
                    if (!currentUser) {
                      onRequireAuth();
                    } else {
                      onCompleteLesson(currentLesson.id);
                    }
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-btn transition-colors flex items-center gap-1.5 ${
                    isCompleted
                      ? 'bg-state-success text-white'
                      : 'bg-primary hover:bg-primary-hover text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isCompleted ? t.completed : t.markCompleted}</span>
                </button>
                {!currentUser && (
                  <span className="text-[10px] text-neutral-muted">
                    {t.loginToSaveProgress}
                  </span>
                )}
              </div>
            </div>

            {/* Tabs for Notes / Quiz */}
            <div className="mt-6 border-b border-neutral-border flex gap-4">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'content'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-muted hover:text-neutral-text'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t.notesTab}</span>
              </button>

              {questions.length > 0 && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'quiz'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-neutral-muted hover:text-neutral-text'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{t.quizTab}</span>
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="pt-5">
              {activeTab === 'content' ? (
                <div className="prose max-w-none text-sm text-neutral-text leading-relaxed space-y-4">
                  {currentLesson.content_text ? (
                    <div className="whitespace-pre-wrap font-sans bg-slate-50/70 p-4 rounded-btn border border-neutral-border">
                      {currentLesson.content_text}
                    </div>
                  ) : (
                    <p className="text-neutral-muted text-sm">
                      {lang === 'ar' ? 'تابع محتوى الفيديو في الأعلى.' : 'Suivez la vidéo ci-dessus.'}
                    </p>
                  )}
                </div>
              ) : (
                /* Interactive Quiz View */
                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-slate-50 rounded-btn border border-neutral-border">
                      <p className="font-semibold text-sm text-neutral-text mb-3">
                        {qIdx + 1}. {q.q}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-2.5 p-2.5 rounded-md border text-xs sm:text-sm cursor-pointer transition-colors ${
                              selectedAnswers[qIdx] === oIdx
                                ? 'bg-primary-surface border-primary text-primary font-semibold'
                                : 'bg-white border-neutral-border text-neutral-text hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question_${qIdx}`}
                              checked={selectedAnswers[qIdx] === oIdx}
                              onChange={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx })}
                              className="accent-primary"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(selectedAnswers).length < questions.length}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-btn transition-colors"
                    >
                      {t.submitQuiz}
                    </button>

                    {quizSubmitted && (
                      <span className={`text-sm font-semibold ${quizScore === questions.length ? 'text-state-success' : 'text-state-warning'}`}>
                        {quizScore === questions.length ? t.quizPassed : t.quizFailed} ({quizScore}/{questions.length})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Prev / Next Navigation */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {prevLesson ? (
              <button
                onClick={() => onSelectLesson(prevLesson)}
                className="px-4 py-2 border border-neutral-border bg-white text-xs sm:text-sm font-semibold rounded-btn hover:border-primary text-neutral-text flex items-center gap-1.5 transition-colors"
              >
                {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{lang === 'ar' ? 'الدرس السابق' : 'Précédent'}</span>
              </button>
            ) : <div />}

            {nextLesson && (
              <button
                onClick={() => onSelectLesson(nextLesson)}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold rounded-btn flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{lang === 'ar' ? 'الدرس التالي' : 'Suivant'}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Module & Lessons Sidebar (1 col) */}
        <div className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} space-y-4`}>
          <div className="bg-white rounded-card border border-neutral-border p-4 shadow-xs sticky top-24">
            <h3 className="font-bold text-sm text-neutral-text mb-3 pb-2 border-b border-neutral-border font-arabic">
              {t.syllabus}
            </h3>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pe-1">
              {course.modules?.map((module) => (
                <div key={module.id} className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-muted block px-2">
                    {lang === 'ar' ? module.title_ar : (module.title_fr || module.title_ar)}
                  </span>

                  {module.lessons.map((lesson) => {
                    const isSelected = lesson.id === currentLesson.id;
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`p-2 rounded-btn text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary text-white font-bold shadow-xs'
                            : 'text-neutral-text hover:bg-sky-50'
                        }`}
                      >
                        {lesson.type === 'video' ? (
                          <Video className="w-3.5 h-3.5 shrink-0" />
                        ) : lesson.type === 'quiz' ? (
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="truncate">
                          {lang === 'ar' ? lesson.title_ar : (lesson.title_fr || lesson.title_ar)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
