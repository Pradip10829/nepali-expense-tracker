import React from 'react';
import { Home, ReceiptText, Plus, Image as ImageIcon, Settings } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, onOpenAdd, onOpenGallery, lang }) {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg pb-safe">
      
      {/* 1. Home / Dashboard */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
          activeTab === 'home' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-medium'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{lang === 'ne' ? 'गृह' : 'Home'}</span>
      </button>

      {/* 2. Expenses List */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          setActiveTab('expenses');
          const el = document.getElementById('expense-list-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
          activeTab === 'expenses' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-medium'
        }`}
      >
        <ReceiptText className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{lang === 'ne' ? 'खर्च' : 'List'}</span>
      </button>

      {/* 3. Center Quick Add Button (Elevated) */}
      <div className="-mt-5">
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onOpenAdd();
          }}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 border-4 border-white active:scale-90 transition cursor-pointer"
          title="खर्च थप्नुहोस्"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* 4. Download to Gallery */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          onOpenGallery();
        }}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
          activeTab === 'gallery' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-medium'
        }`}
      >
        <ImageIcon className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{lang === 'ne' ? 'ग्यालरी' : 'Gallery'}</span>
      </button>

      {/* 5. Settings / Budget */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic();
          setActiveTab('settings');
        }}
        className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition ${
          activeTab === 'settings' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-medium'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{lang === 'ne' ? 'सेटिङ' : 'Settings'}</span>
      </button>

    </nav>
  );
}
