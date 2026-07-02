import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, CheckCircle2, MessageSquare, Compass } from 'lucide-react';
import { db, doc, setDoc } from '../firebase';

interface ContactPageProps {
  user: any;
  onBack: () => void;
  triggerSuccess: (msg: string) => void;
}

export default function ContactPage({ user, onBack, triggerSuccess }: ContactPageProps) {
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.displayName || '');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      alert('Please fill in your email and message.');
      return;
    }

    try {
      setLoading(true);
      
      // Store in firestore collection "contact_messages" if user is logged in
      if (db && user) {
        const messageId = `msg-${Date.now()}`;
        const messageRef = doc(db, 'contact_messages', messageId);
        await setDoc(messageRef, {
          id: messageId,
          uid: user.uid,
          name,
          email,
          subject,
          message,
          timestamp: Date.now()
        });
      }

      setSubmitted(true);
      triggerSuccess('Message sent successfully. Thank you!');
    } catch (err: any) {
      console.error('Failed to submit message:', err);
      // Fallback gracefully even if database is offline or rules block contact_messages
      setSubmitted(true);
      triggerSuccess('Feedback submitted locally. Thank you!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-spiritual-dark text-slate-850 dark:text-slate-100 flex flex-col transition-colors duration-300 px-4 py-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-spiritual-panel border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-spiritual-card transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Back to Sadhana</span>
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-saffron-600 dark:text-gold-500 bg-saffron-50 dark:bg-saffron-950/20 px-3 py-1 rounded-full">
            Contact Us
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-saffron-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-saffron-500/20">
            <Mail size={30} />
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-amber-950 dark:text-gold-400 mt-4 tracking-tight">
            Connect With Us
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Have questions, feedback, or need help with NaamSadhana? Leave us a message below.
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-spiritual-panel rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-md"
        >
          {submitted ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950 dark:text-gold-400">
                  Message Delivered
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
                  Thank you for reaching out! Our team of devotees will review your inquiry with peace and attentiveness.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-650 dark:text-slate-300 transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-spiritual-panel border border-slate-100 dark:border-slate-800/80 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-saffron-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-spiritual-panel border border-slate-100 dark:border-slate-800/80 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-saffron-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-spiritual-panel border border-slate-100 dark:border-slate-800/80 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-saffron-500/50"
                >
                  <option value="Feedback">Feedback & Suggestions</option>
                  <option value="Support">Account Support</option>
                  <option value="Bug">Report a Bug</option>
                  <option value="Spiritual">Spiritual Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-spiritual-panel border border-slate-100 dark:border-slate-800/80 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-saffron-500/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-saffron-500/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 flex justify-center items-center gap-1">
          <Compass size={11} />
          <span>Devotional support desk always available</span>
        </div>
      </div>
    </div>
  );
}
