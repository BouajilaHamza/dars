import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle } from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = tab === 'login' 
        ? { email, password }
        : { email, password, displayName };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as any;
      if (data.success && data.user) {
        onSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'فشل تسجيل الدخول، يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      // Offline fallback: create guest learner session
      const fallbackUser: User = {
        id: `u_${Date.now()}`,
        email: email || 'learner@dars.community',
        displayName: displayName || email.split('@')[0] || 'متعلم جديد',
        role: 'learner',
        language: lang
      };
      onSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-card border border-neutral-border shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-neutral-muted hover:text-neutral-text p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-neutral-text font-arabic">
            {tab === 'login' ? t.login : t.signup}
          </h2>
          <p className="text-xs text-neutral-muted mt-1">
            {lang === 'ar' 
              ? 'انضم إلى مجتمع التعلم التونسي المفتوح والمجاني'
              : 'Rejoignez la communauté MOOC libre de Tunisie'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-neutral-bg p-1 rounded-btn border border-neutral-border mb-5">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'login' ? 'bg-white text-primary shadow-xs' : 'text-neutral-muted'
            }`}
          >
            {t.login}
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === 'register' ? 'bg-white text-primary shadow-xs' : 'text-neutral-muted'
            }`}
          >
            {t.signup}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-accent-red-subtle border border-accent-red/20 text-accent-red text-xs rounded-btn flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-text mb-1">
                {lang === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="محمد الطرابلسي"
                  className="w-full bg-neutral-bg border border-neutral-border rounded-btn py-2 pe-3 ps-9 text-sm focus:border-primary focus:bg-white outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-text mb-1">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Adresse e-mail'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-muted pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.tn"
                className="w-full bg-neutral-bg border border-neutral-border rounded-btn py-2 pe-3 ps-9 text-sm focus:border-primary focus:bg-white outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-text mb-1">
              {lang === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-neutral-muted pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-bg border border-neutral-border rounded-btn py-2 pe-3 ps-9 text-sm focus:border-primary focus:bg-white outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-btn transition-colors shadow-xs disabled:opacity-50 mt-2"
          >
            {loading ? '...' : tab === 'login' ? t.login : t.signup}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-4 pt-4 border-t border-neutral-border flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={() => {
              onSuccess({
                id: 'u_hamza_outlook',
                email: 'bouajilahamza@outlook.com',
                displayName: 'Hamza Bouajila',
                role: 'admin',
                language: lang
              });
              onClose();
            }}
            className="text-xs text-primary font-bold hover:underline"
          >
            {lang === 'ar' ? 'الدخول السريع كمسؤول عام (Super-Admin Hamza)' : 'Connexion rapide Super-Admin (Hamza)'}
          </button>
        </div>
      </div>
    </div>
  );
};
