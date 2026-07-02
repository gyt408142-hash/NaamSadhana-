import React from 'react';
import { Compass } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const links = [
    { name: 'About Us', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Contact Support', path: '/contact' }
  ];

  return (
    <footer className="w-full max-w-2xl mx-auto px-4 py-8 mt-auto flex flex-col items-center justify-center gap-4 text-center border-t border-slate-100/60 dark:border-slate-800/80 font-sans select-none">
      {/* Footer Navigation Link row */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => onNavigate(link.path)}
            className="hover:text-saffron-600 dark:hover:text-gold-400 transition-colors cursor-pointer"
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* App Credit & PWA Offline Indicator */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          NaamSadhana v1.0 • A beautiful offline-first Japa Yoga companion
        </span>
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400/80 dark:text-slate-500/80">
          <Compass size={10} className="text-saffron-500/80" />
          <span>Made with reverence for global practitioners</span>
        </div>
      </div>
    </footer>
  );
}
