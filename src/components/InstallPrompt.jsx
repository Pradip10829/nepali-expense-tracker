import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare } from 'lucide-react';

export default function InstallPrompt({ lang }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem('kharcha_install_dismissed');
    if (isDismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      setShowPrompt(true);
    }

    // Android / Desktop Chrome PWA prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('kharcha_install_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="bg-emerald-900 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sticky top-16 z-25 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2.5 grow mr-2">
        <div className="p-1.5 rounded-lg bg-emerald-700 text-emerald-200 shrink-0">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="leading-snug">
          <span className="font-bold block">
            {lang === 'ne' ? 'मोबाइलमा एप इन्स्टल गर्नुहोस्' : 'Install as Mobile App'}
          </span>
          <span className="text-[10px] text-emerald-200 block">
            {lang === 'ne' ? 'इन्टरनेट नहुँदा पनि चल्छ • Play Store बिना' : 'Works 100% offline on your home screen'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-lg transition active:scale-95 shadow-xs"
        >
          {lang === 'ne' ? 'इन्स्टल' : 'Install'}
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-emerald-300 hover:text-white"
          title="हटाउनुहोस्"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* iOS Instructions Sheet */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white text-slate-800 p-5 rounded-2xl max-w-sm w-full space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">
                {lang === 'ne' ? 'iPhone मा इन्स्टल गर्ने तरिका' : 'How to install on iPhone'}
              </h4>
              <button onClick={() => setShowIosGuide(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="text-xs space-y-2 list-decimal list-inside text-slate-600 font-medium">
              <li className="flex items-center gap-1.5">
                <span>1. तलको</span>
                <span className="p-1 rounded bg-slate-100"><Share2 className="w-3.5 h-3.5 text-blue-600 inline" /></span>
                <span>Share बटन थिच्नुहोस्</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>2. सूचीमा</span>
                <span className="p-1 rounded bg-slate-100 font-bold"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</span>
                <span>छान्नुहोस्</span>
              </li>
              <li>3. माथि दायाँपट्टि 'Add' थिच्नुहोस्। एप तयार भयो!</li>
            </ol>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
            >
              बुझें (Got it)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
