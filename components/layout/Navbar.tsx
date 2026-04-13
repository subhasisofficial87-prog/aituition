'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  isLoggedIn?: boolean;
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-none">AITuition</span>
              <p className="text-xs text-gray-500 leading-none hidden sm:block">{t('nav.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/#pricing" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              {t('nav.pricing')}
            </Link>
            <Link href="/#faq" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              {t('nav.faq')}
            </Link>

            <div className="w-px h-5 bg-gray-200 mx-2" />

            <LanguageSwitcher />

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all shadow-sm"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link
              href="/#pricing"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.pricing')}
            </Link>
            <Link
              href="/#faq"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.faq')}
            </Link>
            <div className="border-t border-gray-100 pt-2 mt-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                    {t('nav.dashboard')}
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      {t('nav.logout')}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="block mx-4 mt-2 px-4 py-2 text-sm font-semibold text-center text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
