import React, { useState, useEffect } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';

export default function UserNameModal({ isOpen, onClose, currentName, onSaveName, lang }) {
  const [name, setName] = useState(currentName || '');

  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    onSaveName(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-emerald-100 p-5 sm:p-6 relative text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Mukta',sans-serif]">
              {lang === 'ne' ? 'आफ्नो नाम राख्नुहोस्' : 'Set Your Name'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'ne' 
                ? 'नाम राख्दा रसिद र रिपोर्टमा तपाईंको नाम देखिनेछ।' 
                : 'Your name will appear on greetings and receipt slips.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {lang === 'ne' ? 'तपाईंको नाम (Your Name):' : 'Full Name or Nickname:'}
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'ne' ? 'उदा: Pradip Gaire / प्रदिप' : 'e.g. Pradip Gaire'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Quick Suggestions if empty */}
          {!currentName && (
            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-slate-400 font-medium">{lang === 'ne' ? 'उदाहरण:' : 'Sample:'}</span>
              <button
                type="button"
                onClick={() => setName('Pradip Gaire')}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/60 cursor-pointer"
              >
                Pradip Gaire
              </button>
              <button
                type="button"
                onClick={() => setName('प्रदिप')}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/60 cursor-pointer"
              >
                प्रदिप
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              {lang === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-700/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'सेभ गर्नुहोस्' : 'Save Name'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
