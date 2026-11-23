import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Globe, 
  User as UserIcon, 
  WifiOff, 
  PlusCircle, 
  GraduationCap,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { User } from '../types';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'dashboard' | 'builder') => void;
  currentView: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigate,
  currentView,
  onSearchChange
}) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const t = translations[lang];

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    onSearchChange(val);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-border shadow-xs">
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-sky-50 text-sky-800 text-xs sm:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-sky-100">
          <WifiOff className="w-4 h-4 text-sky-600" />
          <span>{t.offlineBadge}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 text-white transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-neutral-text font-arabic">
                {lang === 'ar' ? 'دَرْسْ' : 'Dars'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red" title="تونس"></span>
            </div>
            <span className="text-[11px] text-neutral-muted hidden sm:block">
              {lang === 'ar' ? 'منصة التعليم الحر' : 'Open Community MOOC'}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 text-neutral-muted start-3 pointer-events-none" />
            <input
              type="text"
              value={searchVal}
              onChange={handleSearch}
              placeholder={t.searchPlaceholder}
              className="w-full bg-neutral-bg border border-neutral-border focus:border-primary focus:bg-white text-sm rounded-btn py-2 pe-4 ps-9 outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 text-sm font-medium rounded-btn transition-colors ${
              currentView === 'home'
                ? 'bg-primary-surface text-primary font-semibold'
                : 'text-neutral-text hover:text-primary hover:bg-neutral-bg'
            }`}
          >
            {t.exploreCourses}
          </button>

          {currentUser && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 text-sm font-medium rounded-btn transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-primary-surface text-primary font-semibold'
                  : 'text-neutral-text hover:text-primary hover:bg-neutral-bg'
              }`}
            >
              {t.myLearning}
            </button>
          )}

          <button
            onClick={() => onNavigate('builder')}
            className={`px-3 py-1.5 text-sm font-medium rounded-btn flex items-center gap-1.5 transition-colors ${
              currentView === 'builder'
                ? 'bg-primary-surface text-primary font-semibold'
                : 'text-neutral-text hover:text-primary hover:bg-neutral-bg'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.uploadStudio}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-neutral-bg rounded-btn p-1 border border-neutral-border text-xs">
            <Globe className="w-3.5 h-3.5 text-neutral-muted mx-1" />
            {(['ar', 'fr', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => onLanguageChange(l)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  lang === l
                    ? 'bg-white text-primary shadow-xs font-bold'
                    : 'text-neutral-muted hover:text-neutral-text'
                }`}
              >
                {l === 'ar' ? 'عربي' : l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* User Auth Buttons */}
          {currentUser ? (
            <div className="flex items-center gap-2 ps-2 border-s border-neutral-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {currentUser.displayName.charAt(0)}
              </div>
              <span className="text-xs font-medium text-neutral-text max-w-[100px] truncate">
                {currentUser.displayName}
              </span>
              <button
                onClick={onLogout}
                title={t.logout}
                className="p-1.5 rounded-lg text-neutral-muted hover:text-accent-red hover:bg-accent-red-subtle transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-btn transition-colors shadow-xs"
            >
              {t.login}
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {/* Language Switcher (Compact for Mobile) */}
          <button
            onClick={() => onLanguageChange(lang === 'ar' ? 'fr' : lang === 'fr' ? 'en' : 'ar')}
            className="px-2 py-1 bg-neutral-bg border border-neutral-border rounded text-xs font-bold text-primary"
          >
            {lang === 'ar' ? 'عربي' : lang.toUpperCase()}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-text rounded-btn hover:bg-neutral-bg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-border px-4 py-3 space-y-3">
          <input
            type="text"
            value={searchVal}
            onChange={handleSearch}
            placeholder={t.searchPlaceholder}
            className="w-full bg-neutral-bg border border-neutral-border text-sm rounded-btn py-2 px-3 outline-hidden"
          />

          <div className="flex flex-col gap-1">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="text-start py-2 text-sm font-medium text-neutral-text hover:text-primary"
            >
              {t.exploreCourses}
            </button>
            {currentUser && (
              <button
                onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                className="text-start py-2 text-sm font-medium text-neutral-text hover:text-primary"
              >
                {t.myLearning}
              </button>
            )}
            <button
              onClick={() => { onNavigate('builder'); setMobileMenuOpen(false); }}
              className="text-start py-2 text-sm font-medium text-neutral-text hover:text-primary"
            >
              {t.uploadStudio}
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-border flex justify-between items-center">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium text-neutral-text">
                  {currentUser.displayName}
                </span>
                <button
                  onClick={onLogout}
                  className="text-xs text-accent-red flex items-center gap-1 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-sm font-medium bg-primary text-white rounded-btn"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
