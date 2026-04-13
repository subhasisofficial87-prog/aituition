'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">AITuition</span>
            </div>
            <p className="text-sm leading-relaxed">{t('footer.tagline')}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#pricing" className="text-sm hover:text-white transition-colors">{t('nav.pricing')}</Link></li>
              <li><Link href="/#faq" className="text-sm hover:text-white transition-colors">{t('nav.faq')}</Link></li>
              <li><Link href="/register" className="text-sm hover:text-white transition-colors">{t('common.free.trial')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><a href="mailto:support@aituition.in" className="text-sm hover:text-white transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© {year} AITuition. {t('footer.rights')}.</p>
          <p className="text-gray-500">Made with ❤️ for India</p>
        </div>
      </div>
    </footer>
  );
}
