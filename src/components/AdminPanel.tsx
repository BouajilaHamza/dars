import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, UserCheck, Trash2, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { User } from '../types';

interface AdminPanelProps {
  currentUser: User | null;
  lang: Language;
  onBack: () => void;
}

interface ManagedUser {
  id: string;
  email: string;
  displayName: string;
  role: 'learner' | 'educator' | 'admin';
  language: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  lang,
  onBack
}) => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const t = translations[lang];

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'X-User-Role': currentUser?.role || 'admin' }
      });
      const data = (await res.json()) as any;
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.warn('Failed to fetch admin users', e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin'
        },
        body: JSON.stringify({
          email: newAdminEmail.trim().toLowerCase(),
          role: 'admin'
        })
      });

      const data = (await res.json()) as any;
      if (data.success) {
        setMsg({
          text: lang === 'ar' ? `تم منح صلاحية المشرف إلى ${newAdminEmail} بنجاح!` : `Admin role granted to ${newAdminEmail}`,
          type: 'success'
        });
        setNewAdminEmail('');
        fetchUsers();
      } else {
        setMsg({ text: data.error || 'Failed to update role', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Error updating role', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (email: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'learner' : 'admin';
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'admin'
        },
        body: JSON.stringify({ email, role: nextRole })
      });
      const data = (await res.json()) as any;
      if (data.success) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Back to Home */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-neutral-muted hover:text-primary mb-6 transition-colors"
      >
        {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.exploreCourses}</span>
      </button>

      {/* Main Admin Card */}
      <div className="bg-white rounded-card border border-neutral-border p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-border">
          <div className="w-12 h-12 rounded-xl bg-accent-red-subtle text-accent-red flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-text font-arabic">
              {lang === 'ar' ? 'إدارة المشرفين وصلاحيات رفع المحتوى' : 'Gestion des Administrateurs & Droits Auteurs'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-muted mt-0.5">
              {lang === 'ar'
                ? 'بصفتك المشرف العام، يمكنك تعيين أو سحب صلاحيات إضافة الدروس ورفع الفيديوهات.'
                : 'En tant que Super-Admin, vous pouvez accorder ou révoquer les droits d ajout de cours et vidéos.'}
            </p>
          </div>
        </div>

        {/* Feedback alert */}
        {msg && (
          <div className={`mb-6 p-4 rounded-btn flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
            msg.type === 'success' 
              ? 'bg-emerald-50 text-state-success border border-emerald-200' 
              : 'bg-accent-red-subtle text-accent-red border border-accent-red/20'
          }`}>
            {msg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Add New Admin Form */}
        <div className="mb-8 p-5 bg-slate-50/70 rounded-btn border border-neutral-border">
          <h2 className="text-sm font-bold text-neutral-text mb-2 font-arabic flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            <span>{lang === 'ar' ? 'إضافة مشرف جديد (Admin)' : 'Ajouter un nouvel Administrateur'}</span>
          </h2>
          <p className="text-xs text-neutral-muted mb-4">
            {lang === 'ar'
              ? 'أدخل البريد الإلكتروني للشخص الذي ترغب في منحه صلاحية إضافة الدورات ورفع الفيديوهات.'
              : 'Entrez l adresse email de la personne autorisée à ajouter des cours et téléverser des vidéos.'}
          </p>

          <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="instructor@example.tn"
              className="flex-1 bg-white border border-neutral-border rounded-btn px-4 py-2 text-sm focus:border-primary outline-hidden"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold rounded-btn transition-colors shadow-xs disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? '...' : (lang === 'ar' ? 'منح صلاحية مشرف' : 'Accorder les droits Admin')}
            </button>
          </form>
        </div>

        {/* Current Admins & Users List */}
        <div>
          <h2 className="text-sm font-bold text-neutral-text mb-3 font-arabic">
            {lang === 'ar' ? 'قائمة المشرفين والمستخدمين' : 'Liste des Administrateurs & Utilisateurs'}
          </h2>

          <div className="border border-neutral-border rounded-btn overflow-hidden divide-y divide-neutral-border">
            {users.map((u) => {
              const isAdmin = u.role === 'admin';
              const isSuper = u.email === 'bouajilahamza@outlook.com' || u.email === 'hamza@dars.community';

              return (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      isAdmin ? 'bg-accent-red-subtle text-accent-red' : 'bg-slate-100 text-neutral-muted'
                    }`}>
                      {u.displayName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-text">{u.displayName}</span>
                        {isSuper && (
                          <span className="text-[10px] bg-slate-900 text-white px-2 py-0.2 rounded-full font-bold">
                            Super-Admin
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-muted block">{u.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isAdmin ? 'bg-accent-red-subtle text-accent-red' : 'bg-slate-100 text-neutral-muted'
                    }`}>
                      {isAdmin ? 'Admin (رافع محتوى)' : 'Apprenant (متعلم)'}
                    </span>

                    {!isSuper && (
                      <button
                        onClick={() => handleToggleRole(u.email, u.role)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                          isAdmin 
                            ? 'border-neutral-border text-neutral-muted hover:text-accent-red hover:bg-accent-red-subtle'
                            : 'border-primary text-primary hover:bg-primary-surface'
                        }`}
                      >
                        {isAdmin 
                          ? (lang === 'ar' ? 'سحب الصلاحية' : 'Révoquer') 
                          : (lang === 'ar' ? 'ترقية لمشرف' : 'Promouvoir Admin')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
