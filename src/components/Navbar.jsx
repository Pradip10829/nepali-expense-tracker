import React from 'react';
import { Wallet, Globe, Sparkles, ScrollText, HelpCircle, Settings } from 'lucide-react';
import { TRANSLATIONS } from '../data/nepaliData';

export default function Navbar({ lang, setLang, onOpenPaperModal, onOpenAdd, onOpenHelp, onOpenSettings }) {
  const t = TRANSLATIONS[lang];

  // Helper to approximate Nepali BS Year/Month
  const getNepaliDateString = () => {
    const date = new Date();
    const bsYear = date.getFullYear() + 57;
    const monthsNe = [
      'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 
      'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
    ];
    const approxMonthIndex = (date.getMonth() + 9) % 12;
    return `${bsYear} ${monthsNe[approxMonthIndex]}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-950 font-['Mukta',sans-serif]">
                {t.appTitle}
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold tracking-wide bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                नेपाल संस्करण
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Nepali BS Date Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>वि.सं. {getNepaliDateString()}</span>
          </div>

          {/* Quick Help / कसरी चलाउने? */}
          <button
            onClick={onOpenHelp}
            title="कसरी चलाउने? / Quick Guide"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">{lang === 'ne' ? 'मद्दत' : 'Guide'}</span>
          </button>

          {/* A4 School Notebook Paper Trigger */}
          <button
            onClick={onOpenPaperModal}
            title="A4 साइजको स्कुल कापीमा हिसाब (PNG फोटो र Excel डाउनलोड)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ScrollText className="w-4 h-4 text-blue-700" />
            <span className="hidden sm:inline">📖 {lang === 'ne' ? 'A4 कापीको पाना' : 'A4 School Copy'}</span>
            <span className="sm:hidden font-bold">📖 {lang === 'ne' ? 'A4 कापी' : 'A4 Sheet'}</span>
          </button>

          {/* Settings Trigger on Desktop */}
          <button
            onClick={onOpenSettings}
            title="सेटिङ र ब्याकअप"
            className="hidden sm:flex items-center gap-1 p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ne' ? 'en' : 'ne')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
            title="भाषा बदल्नुहोस् / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'ne' ? 'EN' : 'ने'}</span>
          </button>

          {/* Desktop Add Button */}
          <button
            onClick={onOpenAdd}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
