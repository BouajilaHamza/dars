-- D1 Initial Seed Data for Dars Community MOOC

INSERT OR IGNORE INTO users (id, email, password_hash, display_name, role, language) VALUES
('u_demo_hamza', 'hamza@dars.community', 'demo_hash_bcrypt_123', 'Hamza Bouajila', 'admin', 'ar'),
('u_creator_sami', 'sami@dars.community', 'demo_hash_bcrypt_123', 'سامي بن نصر', 'educator', 'ar'),
('u_learner_nour', 'nour@dars.community', 'demo_hash_bcrypt_123', 'نور الماجري', 'learner', 'ar');

-- Course 1: Python & AI from Scratch for Tunisians
INSERT OR IGNORE INTO courses (id, creator_id, title_ar, title_fr, title_en, description_ar, description_fr, description_en, thumbnail_url, category, difficulty, language, estimated_hours, is_published, is_ai_generated, enrolled_count) VALUES
('c_py_ai', 'u_demo_hamza', 
 'أساسيات بايثون والذكاء الاصطناعي من الصفر', 
 'Python & IA pour Débutants', 
 'Python & AI Fundamentals for Beginners',
 'دورة عملية شاملة بالدارجة التونسية والعربية لشرح البرمجة بلغة بايثون وتطبيقات نماذج الذكاء الاصطناعي وكيفية الاستفادة منها في سوق الشغل.',
 'Cours pratique pour apprendre la programmation Python et l intégration des modèles d IA modernes pour les étudiants tunisiens.',
 'Practical hands-on course covering Python fundamentals and modern AI LLM integrations tailored for the Tunisian tech ecosystem.',
 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
 'ai_data', 'beginner', 'ar', 6.5, 1, 1, 142);

-- Modules for Course 1
INSERT OR IGNORE INTO modules (id, course_id, title_ar, title_fr, sort_order) VALUES
('m_py_1', 'c_py_ai', 'الوحدة 1: البداية مع بايثون وإعداد بيئة العمل', 'Module 1: Démarrer avec Python', 1),
('m_py_2', 'c_py_ai', 'الوحدة 2: المنطق البرمجي والقوائم والدوال', 'Module 2: Logique et Fonctions', 2),
('m_py_3', 'c_py_ai', 'الوحدة 3: التفاعل مع واجهات الذكاء الاصطناعي (APIs)', 'Module 3: Intégration IA & APIs', 3);

-- Lessons for Course 1
INSERT OR IGNORE INTO lessons (id, module_id, title_ar, title_fr, type, content_url, content_text, duration_minutes, sort_order) VALUES
('l_py_1_1', 'm_py_1', 'مقدمة للدورة: علاش بايثون في 2026؟', 'Pourquoi Python en 2026?', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '# مرحبا بكم في دورة بايثون والذكاء الاصطناعي\n\nفي هذا الدرس الأول سنتعرف على أهمية بايثون في تونس وفرص العمل المتاحة عن بعد وفي الشركات الناشئة.', 8, 1),
('l_py_1_2', 'm_py_1', 'تثبيت الأدوات وكتابة أول كود Hello World', 'Installation & Premier Script', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '# إعداد البيئة\n\nتعلم كيفية تثبيت بايثون وتشغيل بيئة VS Code واستخدام Terminal بكل سهولة.', 12, 2),
('l_py_2_1', 'm_py_2', 'المتغيرات وأنواع البيانات (Variables & Data Types)', 'Variables et Types', 'text', NULL, '# المتغيرات في بايثون\n\nالمتغير هو مساحة في الذاكرة لتخزين معلومة مثل الاسم أو العمر.\n\n```python\nname = "تونس"\nyear = 2026\nis_free = True\nprint(f"منصة {name} مجانية: {is_free}")\n```', 15, 1),
('l_py_2_2', 'm_py_2', 'اختبار سريع: اختبر معلوماتك في الدوال والشرطيات', 'Quiz Module 2', 'quiz', NULL, '{"questions": [{"q": "ما هو نوع المتغير x = 3.14؟", "options": ["int", "float", "string", "boolean"], "answer": 1}, {"q": "كيف نطبع نصاً في بايثون؟", "options": ["echo()", "console.log()", "print()", "write()"], "answer": 2}]}', 10, 2);

-- Course 2: Fullstack Cloudflare & Web Dev
INSERT OR IGNORE INTO courses (id, creator_id, title_ar, title_fr, title_en, description_ar, description_fr, description_en, thumbnail_url, category, difficulty, language, estimated_hours, is_published, is_ai_generated, enrolled_count) VALUES
('c_cf_web', 'u_creator_sami',
 'تطوير تطبيقات الويب الحديثة مجاناً مع Cloudflare',
 'Développement Web Fullstack avec Cloudflare',
 'Modern Fullstack Web Development on Cloudflare Zero-Cost Stack',
 'تعلم بناء تطبيقات ويب سريعة وحديثة باستعمال React, Hono, D1 و R2 دون دفع مليم واحد في الاستضافة.',
 'Guide complet pour architecturer et déployer des applications web performantes à 0$ de coût d hébergement.',
 'Complete roadmap to building serverless apps with React, Vite, Hono, and Cloudflare Pages/D1 at $0 cost.',
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
 'web_dev', 'intermediate', 'fr', 8.0, 1, 1, 89);

-- Course 3: Bac Preparation & Mathematics Revision
INSERT OR IGNORE INTO courses (id, creator_id, title_ar, title_fr, title_en, description_ar, description_fr, description_en, thumbnail_url, category, difficulty, language, estimated_hours, is_published, is_ai_generated, enrolled_count) VALUES
('c_bac_math', 'u_demo_hamza',
 'مراجعة البكالوريا: ملخصات وتمارين الرياضيات التفاعلية',
 'Bac Tunisie: Révision Mathématiques & Exercices',
 'Tunisian Baccalaureate: Mathematics Crash Course',
 'ملخصات ذكية ومحلولة بالفيديو لأهم محاور الرياضيات لشعب العلوم التجريبية والرياضيات والتقنية.',
 'Fiches synthétiques et vidéos explicatives pour réussir l épreuve de mathématiques au Baccalauréat tunisien.',
 'Concise interactive revision modules and past-paper video breakdowns for Tunisian Bac students.',
 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
 'bac_prep', 'intermediate', 'ar', 12.0, 1, 0, 310);
