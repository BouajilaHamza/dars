import { Course } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c_py_ai',
    creator_id: 'u_hamza',
    creator_name: 'Hamza Bouajila',
    title_ar: 'أساسيات بايثون والذكاء الاصطناعي من الصفر',
    title_fr: 'Python & IA pour Débutants',
    title_en: 'Python & AI Fundamentals for Beginners',
    description_ar: 'دورة عملية وشاملة تشرح البرمجة بلغة بايثون من البداية، وتطبيقات نماذج الذكاء الاصطناعي الحديثة بالدارجة والعربية لمساعدتك على دخول سوق العمل الحر والشركات الناشئة.',
    description_fr: 'Cours pratique pour apprendre la programmation Python et l intégration des modèles d IA modernes pour les étudiants tunisiens.',
    description_en: 'Practical hands-on course covering Python fundamentals and modern AI LLM integrations tailored for the Tunisian tech ecosystem.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: 'ai_data',
    difficulty: 'beginner',
    language: 'ar',
    estimated_hours: 6.5,
    is_published: 1,
    is_ai_generated: 1,
    enrolled_count: 142,
    modules: [
      {
        id: 'm_py_1',
        title_ar: 'الوحدة 1: البداية مع بايثون وإعداد بيئة العمل',
        title_fr: 'Module 1: Démarrer avec Python',
        sort_order: 1,
        lessons: [
          {
            id: 'l_py_1_1',
            title_ar: 'مقدمة للدورة: علاش بايثون في 2026؟',
            title_fr: 'Pourquoi Python en 2026?',
            type: 'video',
            content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            content_text: '### أهلاً بك في الدورة!\n\nفي هذا الدرس سنتعرف على قوة لغة بايثون في معالجة البيانات، وكيف أصبحت اللغة الأولى لتطوير تطبيقات الذكاء الاصطناعي.\n\n- مميزات بايثون للشركات التونسية والعمل عن بعد\n- مجالات التطبيق (Web, Automation, AI)\n- كيف تستفيد من هذه الدورة المجانية',
            duration_minutes: 8,
            sort_order: 1
          },
          {
            id: 'l_py_1_2',
            title_ar: 'تثبيت الأدوات وكتابة أول كود Hello World',
            title_fr: 'Installation & Premier Script',
            type: 'video',
            content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            content_text: '### إعداد بيئة التطوير\n\nسنقوم بتثبيت بيئة بايثون و VS Code، ثم نكتب أول برنامج لنا بلغة بايثون.\n\n```python\nprint("مرحبا بكم في منصة درس!")\n```',
            duration_minutes: 12,
            sort_order: 2
          }
        ]
      },
      {
        id: 'm_py_2',
        title_ar: 'الوحدة 2: المنطق البرمجي والقوائم والدوال',
        title_fr: 'Module 2: Logique et Fonctions',
        sort_order: 2,
        lessons: [
          {
            id: 'l_py_2_1',
            title_ar: 'المتغيرات وأنواع البيانات (Variables & Data Types)',
            title_fr: 'Variables et Types',
            type: 'text',
            content_text: '### المتغيرات في بايثون\n\nالمتغير هو وعاء لحفظ البيانات داخل الذاكرة.\n\n```python\nname = "تونس"\nyear = 2026\nis_free = True\n\nif is_free:\n    print(f"منصة {name} تقدم محتوى مجاني للجميع!")\n```\n\nجرب كتابة الكود بنفسك وملاحظة النتيجة.',
            duration_minutes: 15,
            sort_order: 1
          },
          {
            id: 'l_py_2_2',
            title_ar: 'اختبار سريع: اختبر معلوماتك في الدوال والشرطيات',
            title_fr: 'Quiz Module 2',
            type: 'quiz',
            quiz_data: JSON.stringify({
              questions: [
                {
                  q: 'ما هو ناتج 5 + 3 * 2 في بايثون؟',
                  options: ['16', '11', '10', '13'],
                  answer: 1
                },
                {
                  q: 'أي كلمة مفتاحية نستخدمها لتعريف دالة (Function) في بايثون؟',
                  options: ['function', 'func', 'def', 'define'],
                  answer: 2
                }
              ]
            }),
            duration_minutes: 10,
            sort_order: 2
          }
        ]
      }
    ]
  },
  {
    id: 'c_cf_web',
    creator_id: 'u_sami',
    creator_name: 'سامي بن نصر',
    title_ar: 'تطوير تطبيقات الويب الحديثة والـ Fullstack',
    title_fr: 'Développement Web Fullstack Moderne',
    title_en: 'Modern Fullstack Web Development',
    description_ar: 'تعلم بناء تطبيقات ويب سريعة وحديثة باستعمال React و TypeScript و Hono مع قواعد بيانات سحابية وتطوير واجهات متجاوبة وخفيفة.',
    description_fr: 'Guide complet pour architecturer et déployer des applications web performantes et modernes.',
    description_en: 'Complete roadmap to building serverless apps with React, Vite, TypeScript, and modern edge databases.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    category: 'web_dev',
    difficulty: 'intermediate',
    language: 'fr',
    estimated_hours: 8.0,
    is_published: 1,
    is_ai_generated: 1,
    enrolled_count: 89,
    modules: [
      {
        id: 'm_cf_1',
        title_ar: 'الوحدة 1: بنية التطبيقات الحديثة والـ Serverless',
        title_fr: 'Module 1: Architecture Serverless Moderne',
        sort_order: 1,
        lessons: [
          {
            id: 'l_cf_1_1',
            title_ar: 'كيف تبني وتطلق تطبيق ويب بسرعة فائقة؟',
            title_fr: 'Comment déployer une application ultra-rapide?',
            type: 'video',
            content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            content_text: '### البنية الحديثة لتطبيقات الويب\n\nنظرة عامة على تصميم وبناء واجهات أمامية سريعة وخفيفة على شبكة الإنترنت.\nكيف تبني تطبيقاً يتحمل آلاف الزيارات بدون بطء.',
            duration_minutes: 14,
            sort_order: 1
          }
        ]
      }
    ]
  },
  {
    id: 'c_bac_math',
    creator_id: 'u_hamza',
    creator_name: 'Hamza Bouajila',
    title_ar: 'مراجعة البكالوريا: ملخصات وتمارين الرياضيات التفاعلية',
    title_fr: 'Bac Tunisie: Révision Mathématiques & Exercices',
    title_en: 'Tunisian Baccalaureate: Mathematics Crash Course',
    description_ar: 'ملخصات ذكية ومحلولة بالفيديو لأهم محاور الرياضيات لشعب العلوم التجريبية والرياضيات والتقنية مع نصائح حل الامتحانات الوطنية.',
    description_fr: 'Fiches synthétiques et vidéos explicatives pour réussir l épreuve de mathématiques au Baccalauréat tunisien.',
    description_en: 'Concise interactive revision modules and past-paper video breakdowns for Tunisian Bac students.',
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    category: 'bac_prep',
    difficulty: 'intermediate',
    language: 'ar',
    estimated_hours: 12.0,
    is_published: 1,
    is_ai_generated: 0,
    enrolled_count: 310,
    modules: [
      {
        id: 'm_bac_1',
        title_ar: 'الوحدة 1: الدوال الأسية واللوغاريتمية',
        title_fr: 'Module 1: Fonctions Exponentielles et Logarithmes',
        sort_order: 1,
        lessons: [
          {
            id: 'l_bac_1_1',
            title_ar: 'دراسة الدوال والمسائل النموذجية للباكالوريا',
            title_fr: 'Étude de fonctions et problèmes types',
            type: 'video',
            content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            content_text: '### تذكير بالقواعد الأساسية\n\n- حساب النهايات (Limites)\n- الاشتقاق وجدول التغيرات\n- الرسم البياني ونقاط الانعطاف',
            duration_minutes: 20,
            sort_order: 1
          }
        ]
      }
    ]
  }
];
