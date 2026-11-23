import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { cors } from 'hono/cors';

export interface Env {
  DB?: D1Database;
  BUCKET?: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>().basePath('/api');

app.use('*', cors());

// Default mock courses for local/edge fallback if D1 is not initialized
const MOCK_COURSES = [
  {
    id: 'c_py_ai',
    creator_id: 'u_hamza',
    creator_name: 'Hamza Bouajila',
    title_ar: 'أساسيات بايثون والذكاء الاصطناعي من الصفر',
    title_fr: 'Python & IA pour Débutants',
    title_en: 'Python & AI Fundamentals for Beginners',
    description_ar: 'دورة عملية شاملة بالدارجة التونسية والعربية لشرح البرمجة بلغة بايثون وتطبيقات نماذج الذكاء الاصطناعي وكيفية الاستفادة منها في سوق الشغل.',
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
            content_url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
            content_text: '### أهلاً بك في الدورة!\n\nفي هذا الدرس سنتعرف على قوة لغة بايثون في معالجة البيانات، وكيف أصبحت اللغة الأولى لتطوير تطبيقات الذكاء الاصطناعي.\n\n- مميزات بايثون للشركات التونسية والعمل عن بعد\n- مجالات التطبيق (Web, Automation, AI)\n- كيف تستفيد من هذه الدورة المجانية',
            duration_minutes: 8,
            sort_order: 1
          },
          {
            id: 'l_py_1_2',
            title_ar: 'تثبيت الأدوات وكتابة أول كود Hello World',
            title_fr: 'Installation & Premier Script',
            type: 'video',
            content_url: 'https://www.youtube.com/watch?v=mvZHDpCHphk',
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
    title_ar: 'تطوير تطبيقات الويب الحديثة والشاملة (Full-Stack)',
    title_fr: 'Développement Web Fullstack Moderne',
    title_en: 'Modern Fullstack Web Development',
    description_ar: 'تعلم بناء تطبيقات ويب تفاعلية متكاملة من الصفر باستعمال React و Node.js وقواعد البيانات مع نشرها على الويب مجاناً.',
    description_fr: 'Guide complet pour architecturer et déployer des applications web performantes et modernes.',
    description_en: 'Complete roadmap to building fullstack web apps with modern frontend and backend tools.',
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
        title_ar: 'الوحدة 1: أساسيات وهيكلة تطبيقات الويب الحديثة',
        title_fr: 'Module 1: Architecture Web Moderne',
        sort_order: 1,
        lessons: [
          {
            id: 'l_cf_1_1',
            title_ar: 'كيف تبني وتطلق تطبيق ويب بسرعة فائقة؟',
            title_fr: 'Comment déployer une application ultra-rapide?',
            type: 'video',
            content_url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
            content_text: '### البنية الحديثة لتطبيقات الويب\n\nنظرة عامة على تصميم وبناء واجهات أمامية وخلفية سريعة وخفيفة على شبكة الإنترنت.\nكيف تبني تطبيقاً متكاملاً يتحمل آلاف الزيارات بدون بطء.',
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
            content_url: 'https://www.youtube.com/watch?v=0e3GPea1Tyg',
            content_text: '### تذكير بالقواعد الأساسية\n\n- حساب النهايات (Limites)\n- الاشتقاق وجدول التغيرات\n- الرسم البياني ونقاط الانعطاف',
            duration_minutes: 20,
            sort_order: 1
          }
        ]
      }
    ]
  }
];

// User Management Store
interface UserRecord {
  id: string;
  email: string;
  displayName: string;
  role: 'learner' | 'educator' | 'admin';
  language: string;
}

const ADMIN_EMAILS = new Set([
  'bouajilahamza@outlook.com',
  'hamza@dars.community'
]);

const USERS: UserRecord[] = [
  { id: 'u_hamza_outlook', email: 'bouajilahamza@outlook.com', displayName: 'Hamza Bouajila', role: 'admin', language: 'ar' },
  { id: 'u_demo_hamza', email: 'hamza@dars.community', displayName: 'Hamza Bouajila', role: 'admin', language: 'ar' },
  { id: 'u_creator_sami', email: 'sami@dars.community', displayName: 'سامي بن نصر', role: 'admin', language: 'ar' },
  { id: 'u_learner_nour', email: 'nour@dars.community', displayName: 'نور الماجري', role: 'learner', language: 'ar' }
];

// In-memory progress tracking for quick session responsiveness
const userProgress: Record<string, Set<string>> = {
  'u_demo_hamza': new Set(['l_py_1_1'])
};

// 1. List Courses (with category and search filters)
app.get('/courses', async (c) => {
  const category = c.req.query('category');
  const search = c.req.query('q')?.toLowerCase();

  let courses = [...MOCK_COURSES];

  if (category && category !== 'all') {
    courses = courses.filter(item => item.category === category);
  }

  if (search) {
    courses = courses.filter(item => 
      item.title_ar.toLowerCase().includes(search) || 
      (item.title_fr && item.title_fr.toLowerCase().includes(search)) ||
      (item.title_en && item.title_en.toLowerCase().includes(search)) ||
      item.description_ar.toLowerCase().includes(search)
    );
  }

  return c.json({ success: true, count: courses.length, courses });
});

// 2. Course Details with full modules and lessons
app.get('/courses/:id', async (c) => {
  const id = c.req.param('id');
  const course = MOCK_COURSES.find(item => item.id === id);

  if (!course) {
    return c.json({ success: false, error: 'Course not found' }, 404);
  }

  return c.json({ success: true, course });
});

// 3. Create New Course (Upload Studio - Restricted to Admin)
app.post('/courses', async (c) => {
  const authHeader = c.req.header('Authorization');
  const roleHeader = c.req.header('X-User-Role');
  const body = await c.req.json();

  const userRole = roleHeader || body.user_role;
  if (userRole !== 'admin') {
    return c.json({ success: false, error: 'Forbidden: Only admin users can create courses and upload content' }, 403);
  }

  const newCourse = {
    id: `c_${Date.now()}`,
    creator_id: body.creator_id || 'u_creator_community',
    creator_name: body.creator_name || 'مساهم مجتمعي',
    title_ar: body.title_ar || 'دورة تعليمية جديدة',
    title_fr: body.title_fr || '',
    title_en: body.title_en || '',
    description_ar: body.description_ar || 'وصف الدورة',
    description_fr: body.description_fr || '',
    description_en: body.description_en || '',
    thumbnail_url: body.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    category: body.category || 'ai_data',
    difficulty: body.difficulty || 'beginner',
    language: body.language || 'ar',
    estimated_hours: Number(body.estimated_hours) || 3.0,
    is_published: 1,
    is_ai_generated: body.is_ai_generated ? 1 : 0,
    enrolled_count: 1,
    modules: body.modules || [
      {
        id: `m_${Date.now()}`,
        title_ar: 'الوحدة التمهيدية',
        title_fr: 'Module d introduction',
        sort_order: 1,
        lessons: [
          {
            id: `l_${Date.now()}`,
            title_ar: body.title_ar || 'الدرس الأول',
            title_fr: body.title_fr || 'Première leçon',
            type: body.video_url ? 'video' : 'text',
            content_url: body.video_url || undefined,
            content_text: body.initial_content || '# مرحباً بكم في الدورة\n\nمحتوى تم إنشاؤه عبر استوديو درس.',
            duration_minutes: 10,
            sort_order: 1
          }
        ]
      }
    ]
  };

  MOCK_COURSES.unshift(newCourse);
  return c.json({ success: true, course: newCourse }, 201);
});

// 4. Enroll in course
app.post('/enroll/:courseId', async (c) => {
  const courseId = c.req.param('courseId');
  const course = MOCK_COURSES.find(item => item.id === courseId);
  if (course) {
    course.enrolled_count += 1;
  }
  return c.json({ success: true, message: 'Enrolled successfully', courseId });
});

// 5. Update Lesson Progress
app.post('/progress/:lessonId', async (c) => {
  const lessonId = c.req.param('lessonId');
  const userId = 'u_demo_hamza';

  if (!userProgress[userId]) {
    userProgress[userId] = new Set();
  }
  userProgress[userId].add(lessonId);

  return c.json({ 
    success: true, 
    lessonId, 
    completed: true, 
    completedCount: userProgress[userId].size 
  });
});

// 6. User Status and Progress
app.get('/my/learning', async (c) => {
  const userId = 'u_demo_hamza';
  const completedSet = userProgress[userId] || new Set();

  return c.json({
    success: true,
    user: {
      id: userId,
      name: 'Hamza Bouajila',
      email: 'hamza@dars.community',
      role: 'admin'
    },
    enrolledCourseIds: ['c_py_ai', 'c_cf_web'],
    completedLessonIds: Array.from(completedSet)
  });
});

// 7. Presigned R2 Upload Mock endpoint (Restricted to Admin)
app.post('/upload/presign', async (c) => {
  const roleHeader = c.req.header('X-User-Role');
  const body = await c.req.json();
  const userRole = roleHeader || body.user_role;

  if (userRole !== 'admin') {
    return c.json({ success: false, error: 'Forbidden: Only admin users can upload videos to R2' }, 403);
  }

  const { fileName, fileType } = body;
  const fileKey = `uploads/${Date.now()}-${fileName}`;
  
  // Return presigned direct upload URL structure
  return c.json({
    success: true,
    fileKey,
    uploadUrl: `/api/upload/mock-receive?key=${encodeURIComponent(fileKey)}`,
    publicUrl: `https://media.dars.community/${fileKey}`
  });
});

// 8. Auth Endpoints
app.post('/auth/login', async (c) => {
  const { email } = await c.req.json();
  const normalizedEmail = (email || '').trim().toLowerCase();

  const isAdmin = ADMIN_EMAILS.has(normalizedEmail) || normalizedEmail.includes('hamza');
  let user = USERS.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    user = {
      id: `u_${Date.now()}`,
      email: normalizedEmail || 'hamza@dars.community',
      displayName: normalizedEmail.split('@')[0] || 'مستخدم',
      role: isAdmin ? 'admin' : 'learner',
      language: 'ar'
    };
    USERS.push(user);
  }

  return c.json({
    success: true,
    token: `dars_jwt_${Date.now()}`,
    user: {
      ...user,
      role: isAdmin ? 'admin' : user.role
    }
  });
});

app.post('/auth/register', async (c) => {
  const { email, displayName } = await c.req.json();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const isAdmin = ADMIN_EMAILS.has(normalizedEmail);

  const newUser: UserRecord = {
    id: `u_${Date.now()}`,
    email: normalizedEmail,
    displayName: displayName || normalizedEmail.split('@')[0],
    role: isAdmin ? 'admin' : 'learner',
    language: 'ar'
  };
  USERS.push(newUser);

  return c.json({
    success: true,
    token: `dars_jwt_${Date.now()}`,
    user: newUser
  });
});

// 9. Admin User & Permission Management (Add/Promote admins)
app.get('/admin/users', async (c) => {
  const roleHeader = c.req.header('X-User-Role');
  if (roleHeader !== 'admin') {
    return c.json({ success: false, error: 'Forbidden' }, 403);
  }

  return c.json({
    success: true,
    users: USERS
  });
});

app.post('/admin/users/role', async (c) => {
  const roleHeader = c.req.header('X-User-Role');
  if (roleHeader !== 'admin') {
    return c.json({ success: false, error: 'Forbidden' }, 403);
  }

  const { email, role } = await c.req.json();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (role === 'admin') {
    ADMIN_EMAILS.add(normalizedEmail);
  } else {
    ADMIN_EMAILS.delete(normalizedEmail);
  }

  let user = USERS.find(u => u.email.toLowerCase() === normalizedEmail);
  if (user) {
    user.role = role;
  } else {
    user = {
      id: `u_${Date.now()}`,
      email: normalizedEmail,
      displayName: normalizedEmail.split('@')[0],
      role: role || 'admin',
      language: 'ar'
    };
    USERS.push(user);
  }

  // Also sync to D1 if DB binding exists
  if (c.env?.DB) {
    try {
      await c.env.DB.prepare(
        'INSERT OR REPLACE INTO users (id, email, password_hash, display_name, role) VALUES (?, ?, ?, ?, ?)'
      ).bind(user.id, user.email, 'pass_hash_admin', user.displayName, user.role).run();
    } catch (e) {
      console.warn('D1 role sync warning', e);
    }
  }

  return c.json({
    success: true,
    message: `Role for ${normalizedEmail} updated to ${role}`,
    user
  });
});

export const onRequest = handle(app);
