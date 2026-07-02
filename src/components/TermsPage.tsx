import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowLeft, HeartHandshake, HelpCircle, CheckCircle2 } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export default function TermsPage({ onBack }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-spiritual-dark text-slate-850 dark:text-slate-100 flex flex-col transition-colors duration-300 px-4 py-8">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* Header navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-spiritual-panel border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-spiritual-card transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Back to Sadhana</span>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-gold-500 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full">
            Terms & Conditions
          </span>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-saffron-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <FileText size={30} />
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-amber-950 dark:text-gold-400 mt-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Please read our humble service agreement. By using NaamSadhana, you agree to these guiding principles.
          </p>
        </motion.div>

        {/* Content Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-spiritual-panel rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-md space-y-6 text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans"
        >
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100">
              <CheckCircle2 size={16} className="text-saffron-600 dark:text-gold-400" />
              <h4>1. Sacred and Proper Usage</h4>
            </div>
            <p>
              NaamSadhana is designed strictly as a devotional, meditation-assisting counter (Japa Mala) to facilitate quietude, focus, and sacred sound vibrations. Any abuse, hacking, or attempt to modify or overload our synchronization servers is strictly forbidden.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100">
              <HeartHandshake size={16} className="text-saffron-600 dark:text-gold-400" />
              <h4>2. User Accounts & Login Security</h4>
            </div>
            <p>
              To maintain private counts across multiple devices, we utilize Google Authentication. You are solely responsible for keeping your credentials secure. Our developers will never ask you for your passwords or credentials.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100">
              <HelpCircle size={16} className="text-saffron-600 dark:text-gold-400" />
              <h4>3. Disclaimer of Warranties</h4>
            </div>
            <p>
              NaamSadhana is provided on an "as is" and "as available" basis without warranties of any kind. While our offline-first core is highly reliable and persists state to local storage, we cannot guarantee 100% server uptime or complete security against unforeseeable cloud-infrastructure catastrophes. We are not liable for any lost counts or streak records.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">4. Revisions to Terms</h4>
            <p>
              We reserve the right to refine or edit these guidelines as NaamSadhana grows. Continued use of the platform constitutes your peaceful acceptance of any updated terms.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center pt-2 text-[10px] text-slate-400 dark:text-slate-500">
          Guided by dharma and spiritual integrity.
        </div>
      </div>
    </div>
  );
}
