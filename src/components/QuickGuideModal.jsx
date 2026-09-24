import React from 'react';
import { X, CheckCircle2, Wallet, PlusCircle, ScrollText, Smartphone } from 'lucide-react';

export default function QuickGuideModal({ isOpen, onClose, lang }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-emerald-100 p-5 sm:p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pb-3 border-b border-slate-100 mb-4">
          <span className="text-2xl">📖</span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
            {lang === 'ne' ? 'खर्च-किताब कसरी चलाउने?' : 'How to Use KharchaKitab'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ne' ? '१ मिनेटमा बुझ्नुहोस् सजिलो तरिका' : 'Simple 3-step guide for daily expense control'}
          </p>
        </div>

        <div className="space-y-3.5 text-xs text-slate-700">
          
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 font-black text-xs">
              १
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                {lang === 'ne' ? 'कुल रकम (बजेट) तोक्नुहोस्' : 'Set Total Funds'}
              </h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {lang === 'ne'
                  ? 'आफ्नो महिनाको तलब, पकेट खर्च वा बैंकमा भएको कुल रकम "रकम तोक्नुहोस्" मा गएर लेख्नुहोस्।'
                  : 'Enter your monthly salary, pocket money, or wallet balance under Total Funds.'}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-50/60 border border-teal-100">
            <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0 font-black text-xs">
              २
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                {lang === 'ne' ? 'खर्च हुँदा तुरुन्तै + बटन दबाउनुहोस्' : 'Tap + to Record in 5 Seconds'}
              </h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {lang === 'ne'
                  ? 'चिया, तरकारी, गाडी भाडा खर्च गर्नासाथ ५ सेकेन्डमा रकम र माध्यम (नगद/Fonepay) छान्नुहोस्।'
                  : 'Quickly select amount and mode (Cash, Fonepay QR, eSewa) right after you spend.'}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 font-black text-xs">
              ३
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                {lang === 'ne' ? 'कापीको पानामा हिसाब हेर्नुहोस् र सेभ गर्नुहोस्' : 'Save as Handwritten Diary (PNG)'}
              </h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                {lang === 'ne'
                  ? 'आफ्नो दैनिक हिसाबलाई कापीको पाना शैलीमा हेर्नुहोस्, PNG फोटो डाउनलोड गर्नुहोस् वा Excel मा सेभ गर्नुहोस्।'
                  : 'View as lined notebook paper and download PNG image to keep or share.'}
              </p>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          {lang === 'ne' ? 'सुरु गर्नुहोस् (Get Started)' : 'Got it, let\'s go!'}
        </button>

      </div>
    </div>
  );
}
