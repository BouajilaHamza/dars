import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CourseCard } from './components/CourseCard';
import { CourseDetail } from './components/CourseDetail';
import { LessonPlayer } from './components/LessonPlayer';
import { CourseBuilder } from './components/CourseBuilder';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { Course, Lesson, User } from './types';
import { Language, translations } from './lib/i18n';
import { Sparkles, Globe, Heart, ShieldCheck, Zap, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [view, setView] = useState<'home' | 'detail' | 'player' | 'builder' | 'dashboard'>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['c_py_ai']);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['l_py_1_1']);
  const [loading, setLoading] = useState(true);

  const t = translations[lang];

  // Set document direction whenever language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Load courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = '/api/courses';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('q', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = (await res.json()) as any;
      if (data.success && data.courses) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.warn('API fetch fallback to cache/local', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, searchQuery]);

  const handleSelectCourse = async (course: Course) => {
    try {
      const res = await fetch(`/api/courses/${course.id}`);
      const data = (await res.json()) as any;
      if (data.success && data.course) {
        setSelectedCourse(data.course);
      } else {
        setSelectedCourse(course);
      }
    } catch {
      setSelectedCourse(course);
    }
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    try {
      await fetch(`/api/enroll/${courseId}`, { method: 'POST' });
    } catch (e) {
      console.log('Enrolled in offline state');
    }
    setEnrolledCourseIds([...enrolledCourseIds, courseId]);
    if (selectedCourse?.modules?.[0]?.lessons?.[0]) {
      handleStartLesson(selectedCourse.modules[0].lessons[0]);
    }
  };

  const handleCompleteLesson = async (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
      try {
        await fetch(`/api/progress/${lessonId}`, { method: 'POST' });
      } catch (e) {
        console.log('Saved offline');
      }
    }
  };

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'ai_data', label: t.aiAndData },
    { id: 'web_dev', label: t.webDev },
    { id: 'bac_prep', label: t.bacPrep },
    { id: 'design', label: t.design },
    { id: 'soft_skills', label: t.softSkills }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg font-sans selection:bg-sky-100 selection:text-sky-800">
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
        onNavigate={(newView) => {
          setView(newView);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={view}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* VIEW 1: HOME CATALOG & HERO */}
        {view === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary-surface/70 via-neutral-bg to-neutral-bg pt-12 pb-14 border-b border-neutral-border/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Community Pill */}
                <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-neutral-border shadow-xs text-xs font-semibold text-neutral-text mb-6">
                  <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
                  <span>{t.communityCreated}</span>
                  <span className="text-neutral-muted">|</span>
                  <span className="text-primary">{t.heroStats.zeroCost}</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-text font-arabic tracking-tight max-w-4xl mx-auto leading-tight sm:leading-snug">
                  {lang === 'ar' ? (
                    <>
                      منصة التعلّم الحرة للمجتمع التونسي <br />
                      <span className="text-primary">0 مليم تكلفة. جودة عالية للجميع.</span>
                    </>
                  ) : (
                    <>
                      {t.tagline} <br />
                      <span className="text-primary">100% Gratuit. Pour tous les tunisiens.</span>
                    </>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-sm sm:text-base text-neutral-muted max-w-2xl mx-auto leading-relaxed">
                  {t.subtagline}
                </p>

                {/* Hero Feature Pills */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-neutral-text">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-neutral-border">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>{t.heroStats.edgeHosted}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-neutral-border">
                    <ShieldCheck className="w-4 h-4 text-state-success" />
                    <span>{t.heroStats.openCommunity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-neutral-border">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <span>{t.aiGeneratedLabel}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Courses Catalog Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-btn text-xs sm:text-sm font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white border border-neutral-border text-neutral-muted hover:border-primary/40 hover:text-neutral-text'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Course Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-card border border-neutral-border p-4 animate-pulse h-72">
                      <div className="bg-slate-200 aspect-video rounded-btn mb-4" />
                      <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2" />
                      <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-card border border-neutral-border p-8">
                  <BookOpen className="w-12 h-12 text-neutral-muted mx-auto mb-3 opacity-50" />
                  <p className="text-base font-semibold text-neutral-text">
                    {lang === 'ar' ? 'لا توجد دورات مطابقة للبحث حالياً.' : 'Aucun cours trouvé.'}
                  </p>
                  <p className="text-xs text-neutral-muted mt-1">
                    {lang === 'ar' ? 'كن أول من ينشئ دورة في هذا المجال عبر استوديو المحتوى.' : 'Créez le premier cours via le Creator Studio.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const isEnrolled = enrolledCourseIds.includes(course.id);
                    const totalLessons = course.modules?.flatMap(m => m.lessons).length || 2;
                    const completedForThis = course.modules?.flatMap(m => m.lessons).filter(l => completedLessonIds.includes(l.id)).length || (isEnrolled ? 1 : 0);
                    const percent = Math.min(100, Math.round((completedForThis / totalLessons) * 100));

                    return (
                      <CourseCard
                        key={course.id}
                        course={course}
                        lang={lang}
                        onSelect={handleSelectCourse}
                        isEnrolled={isEnrolled}
                        progressPercent={isEnrolled ? percent : 0}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: COURSE DETAIL */}
        {view === 'detail' && selectedCourse && (
          <CourseDetail
            course={selectedCourse}
            lang={lang}
            onBack={() => setView('home')}
            onStartLesson={handleStartLesson}
            isEnrolled={enrolledCourseIds.includes(selectedCourse.id)}
            onEnroll={handleEnroll}
            completedLessonIds={completedLessonIds}
          />
        )}

        {/* VIEW 3: LESSON PLAYER */}
        {view === 'player' && selectedCourse && currentLesson && (
          <LessonPlayer
            course={selectedCourse}
            currentLesson={currentLesson}
            lang={lang}
            onBackToCourse={() => setView('detail')}
            onSelectLesson={setCurrentLesson}
            onCompleteLesson={handleCompleteLesson}
            isCompleted={completedLessonIds.includes(currentLesson.id)}
            currentUser={currentUser}
            onRequireAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* VIEW 4: CREATOR STUDIO */}
        {view === 'builder' && (
          <CourseBuilder
            lang={lang}
            currentUser={currentUser}
            onRequireAuth={() => setAuthModalOpen(true)}
            onCourseCreated={(newCourse) => {
              setCourses([newCourse, ...courses]);
              handleSelectCourse(newCourse);
            }}
            onCancel={() => setView('home')}
          />
        )}

        {/* VIEW 5: LEARNER DASHBOARD */}
        {view === 'dashboard' && (
          <Dashboard
            courses={courses}
            enrolledCourseIds={enrolledCourseIds}
            completedLessonIds={completedLessonIds}
            lang={lang}
            onSelectCourse={handleSelectCourse}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-border py-8 text-center text-xs text-neutral-muted mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-text font-arabic">درس (Dars)</span>
            <span>—</span>
            <span>{lang === 'ar' ? 'مبادرة مجتمعية حرة للتعليم في تونس' : 'Initiative libre pour l éducation en Tunisie'}</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-muted">
            <span>Cloudflare Serverless ($0 Cost)</span>
            <span>•</span>
            <span>PWA & Offline First</span>
            <span>•</span>
            <span className="text-accent-red">❤️ تونس</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        onSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
};
