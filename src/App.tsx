import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CourseCard } from './components/CourseCard';
import { CourseDetail } from './components/CourseDetail';
import { LessonPlayer } from './components/LessonPlayer';
import { CourseBuilder } from './components/CourseBuilder';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { Course, Lesson, User } from './types';
import { Language, translations } from './lib/i18n';
import { INITIAL_COURSES } from './data/courses';
import { 
  Sparkles, 
  Search, 
  Play, 
  BookOpen, 
  Award, 
  WifiOff, 
  Clock, 
  Users, 
  CheckCircle2, 
  GraduationCap, 
  Compass,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [view, setView] = useState<'home' | 'detail' | 'player' | 'builder' | 'dashboard' | 'admin'>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize synchronously with real data so there is ZERO skeleton delay!
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['c_py_ai']);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['l_py_1_1']);

  const t = translations[lang];

  // Set document direction whenever language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync background courses from server
  const fetchCourses = async () => {
    try {
      let url = '/api/courses';
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('q', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = (await res.json()) as any;
      if (data.success && data.courses && data.courses.length > 0) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.warn('API fetch fallback to local data', err);
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
    { id: 'all', label: t.allCategories, count: courses.length },
    { id: 'ai_data', label: t.aiAndData, count: courses.filter(c => c.category === 'ai_data').length },
    { id: 'web_dev', label: t.webDev, count: courses.filter(c => c.category === 'web_dev').length },
    { id: 'bac_prep', label: t.bacPrep, count: courses.filter(c => c.category === 'bac_prep').length }
  ];

  const featuredCourse = courses[0] || INITIAL_COURSES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-800">
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
            {/* HERO SECTION: Asymmetric Educational Hero */}
            <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-10 pb-16 lg:py-20">
              {/* Subtle background glow */}
              <div className="absolute top-0 end-0 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="absolute bottom-0 start-0 w-80 h-80 bg-blue-50/60 rounded-full blur-2xl pointer-events-none -z-10" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Text Column (7 cols) */}
                  <div className="lg:col-span-7 space-y-6 text-start">
                    {/* Mission Tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-800 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
                      <span>{lang === 'ar' ? 'مبادرة مجتمعية حرة تونسية' : 'Initiative libre pour la Tunisie'}</span>
                      <span className="text-sky-300">•</span>
                      <span>{lang === 'ar' ? '100% مجاني للجميع' : '100% Gratuit'}</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                      {lang === 'ar' ? (
                        <>
                          تعلّم البرمجة والذكاء الاصطناعي <br />
                          <span className="text-sky-600">بالمجان وبجودة استثنائية.</span>
                        </>
                      ) : (
                        <>
                          L éducation libre et de qualité <br />
                          <span className="text-sky-600">Accessible pour tous les tunisiens.</span>
                        </>
                      )}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                      {lang === 'ar'
                        ? 'منصة تعليمية مفتوحة المصدر بالدارجة والعربية تمنحك مهارات تقنية مطلوبة لسوق الشغل والعمل عن بعد دون أي رسوم.'
                        : 'Cours pratiques en IA, développement logiciel et préparation aux examens, conçus pour propulser les compétences des jeunes tunisiens.'}
                    </p>

                    {/* Hero Search & Quick Keywords */}
                    <div className="pt-2 max-w-lg">
                      <div className="relative flex items-center">
                        <Search className="w-4 h-4 absolute start-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={lang === 'ar' ? 'ماذا تريد أن تتعلم اليوم؟ (بايثون، ذكاء اصطناعي، ويب...)' : 'Que souhaitez-vous apprendre ?'}
                          className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-sky-600 text-sm rounded-xl py-3.5 pe-4 ps-11 outline-hidden shadow-xs transition-all"
                        />
                      </div>

                      {/* Keyword tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-400">{lang === 'ar' ? 'شائع:' : 'Populaire:'}</span>
                        {['بايثون', 'ذكاء اصطناعي', 'تطوير ويب', 'رياضيات باك'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="bg-slate-100 hover:bg-sky-50 hover:text-sky-700 px-2.5 py-1 rounded-md transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stat Badges Row */}
                    <div className="pt-4 flex items-center gap-8 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-slate-900 block font-arabic">+540</span>
                        <span className="text-slate-500 text-xs">{lang === 'ar' ? 'متعلم نشط' : 'Apprenants'}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-sky-600 block font-arabic">0 مليم</span>
                        <span className="text-slate-500 text-xs">{lang === 'ar' ? 'تكلفة الوصول' : 'Sans abonnement'}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-emerald-600 block font-arabic">100%</span>
                        <span className="text-slate-500 text-xs">{lang === 'ar' ? 'محتوى حر ومفتوح' : 'Libre d accès'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Featured Spotlight Card Column (5 cols) */}
                  <div className="lg:col-span-5">
                    <div className="relative mx-auto max-w-md">
                      {/* Decorative backdrop layer */}
                      <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur-sm opacity-20 -z-10" />

                      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                            <span>{lang === 'ar' ? 'دورة الأسبوع المختارة' : 'Cours en vedette'}</span>
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {lang === 'ar' ? 'متاح بالكامل' : 'Accès libre'}
                          </span>
                        </div>

                        {/* Thumbnail with overlay Play button */}
                        <div 
                          onClick={() => handleSelectCourse(featuredCourse)}
                          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group bg-slate-900"
                        >
                          <img 
                            src={featuredCourse.thumbnail_url} 
                            alt={featuredCourse.title_ar}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ms-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2.5 start-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {featuredCourse.estimated_hours} {t.hours} • فيديو عالي الجودة
                          </span>
                        </div>

                        {/* Title & Preview info */}
                        <div>
                          <h3 
                            onClick={() => handleSelectCourse(featuredCourse)}
                            className="font-bold text-slate-900 text-base hover:text-sky-600 cursor-pointer transition-colors"
                          >
                            {lang === 'ar' ? featuredCourse.title_ar : featuredCourse.title_fr}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {lang === 'ar' ? featuredCourse.description_ar : featuredCourse.description_fr}
                          </p>
                        </div>

                        {/* Quick Action */}
                        <button
                          onClick={() => handleSelectCourse(featuredCourse)}
                          className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'ابدأ الدورة الآن مجاناً' : 'Commencer le cours gratuitement'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* CATALOG SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {lang === 'ar' ? 'المسارات التعليمية المتاحة' : 'Formations disponibles'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {lang === 'ar' ? 'محتوى شامل، مجاني، ومصمم لتزويدك بمهارات حقيقية.' : 'Des cours structurés et complets pour tous.'}
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                        selectedCategory === cat.id
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-500 hover:text-slate-900'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        selectedCategory === cat.id ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Grid */}
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
            </section>

            {/* WHY DARS SECTION */}
            <section className="bg-white border-t border-slate-200/80 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                  {lang === 'ar' ? 'لماذا منصة درس؟' : 'Pourquoi choisir Dars ?'}
                </h2>
                <p className="text-sm text-slate-500 max-w-xl mx-auto mb-12">
                  {lang === 'ar'
                    ? 'صممت المبادرة لتقديم بديل مفتوح ومجاني يحترم وقت المتعلم وقدراته التقنية.'
                    : 'Une alternative ouverte et gratuite qui valorise l apprentissage réel.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {lang === 'ar' ? 'مهارات حقيقية لسوق الشغل' : 'Compétences concrètes'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {lang === 'ar'
                        ? 'مناهج برمجية وذكاء اصطناعي حديثة بالدارجة والعربية تمنحك تطبيقات تفاعلية وكود جاهز للبناء.'
                        : 'Des programmes modernes en IA et développement web adaptés aux exigences du marché.'}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <WifiOff className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {lang === 'ar' ? 'دراسة دون إنترنت (Offline)' : 'Mode hors-ligne PWA'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {lang === 'ar'
                        ? 'حمّل الدروس ومقاطع الفيديو بنقرة واحدة وتابع دراستك أينما كنت دون استهلاك باقة الإنترنت.'
                        : 'Téléchargez les leçons d un clic et continuez d étudier même sans connexion internet.'}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {lang === 'ar' ? 'شهادات إتمام واختبارات' : 'Certificats de réussite'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {lang === 'ar'
                        ? 'اختبر تحصيلك بعد كل وحدة دراسية واحصل على شهادة إنجاز رقمية تثبت مهاراتك.'
                        : 'Évaluez vos acquis après chaque leçon et obtenez une attestation attestant de votre travail.'}
                    </p>
                  </div>
                </div>
              </div>
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

        {/* VIEW 6: ADMIN USER & ROLE MANAGEMENT */}
        {view === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            lang={lang}
            onBack={() => setView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-arabic text-sm">درس (Dars)</span>
            <span>—</span>
            <span>{lang === 'ar' ? 'مبادرة تعليمية حرة ومفتوحة للمجتمع التونسي' : 'Initiative libre pour l éducation en Tunisie'}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>{lang === 'ar' ? 'محتوى تعليمي حر' : 'Contenu éducatif libre'}</span>
            <span>•</span>
            <span>{lang === 'ar' ? 'متاح دون إنترنت' : 'Accès hors-ligne'}</span>
            <span>•</span>
            <span className="text-accent-red font-bold">❤️ تونس</span>
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
