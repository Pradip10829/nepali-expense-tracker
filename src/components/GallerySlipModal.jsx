import React, { useRef, useState } from 'react';
import { X, Download, Share2, FileSpreadsheet, Check, Sparkles, Receipt, Calendar, ArrowDownRight, ShieldCheck, Wallet, QrCode, Banknote } from 'lucide-react';
import { toPng } from 'html-to-image';
import { exportToExcel } from '../utils/excelExporter';
import { CATEGORIES, PAYMENT_METHODS, formatNepaliCurrency } from '../data/nepaliData';
import CategoryIcon from './CategoryIcon';

export default function GallerySlipModal({ isOpen, onClose, expenses, totalMoney, dailyBudget = 1000, lang }) {
  const receiptRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const date = new Date();
  const bsYear = date.getFullYear() + 57;
  const monthsNe = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 
    'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
  ];
  const daysNe = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
  const approxMonthIndex = (date.getMonth() + 9) % 12;
  const nepaliDateStr = `वि.सं. ${bsYear} ${monthsNe[approxMonthIndex]} ${date.getDate()}, ${daysNe[date.getDay()]}`;

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = totalMoney - totalSpent;

  // Accurate Extra Expense Calculation
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const todayTotal = todayExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const todayExtra = Math.max(0, todayTotal - dailyBudget);

  const expensesByDate = expenses.reduce((acc, item) => {
    const d = item.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(item);
    return acc;
  }, {});

  let cumulativeExtra = 0;
  Object.values(expensesByDate).forEach(dayItems => {
    const daySum = dayItems.reduce((sum, item) => sum + Number(item.amount), 0);
    const overflow = Math.max(0, daySum - dailyBudget);
    const manualTagged = dayItems
      .filter(e => e.isExtra || e.category === 'extra')
      .reduce((sum, item) => sum + Number(item.amount), 0);
    cumulativeExtra += Math.max(overflow, manualTagged);
  });

  const exactExtra = todayExtra > 0 ? todayExtra : cumulativeExtra;

  // Cash vs Digital breakdown
  const cashSpent = expenses
    .filter(e => e.paymentMethod === 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const digitalSpent = expenses
    .filter(e => e.paymentMethod !== 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // Save as PNG directly to phone gallery / downloads
  const handleSaveToGallery = async () => {
    if (!receiptRef.current) return;
    setIsSaving(true);
    setSavedSuccess('');

    try {
      const dataUrl = await toPng(receiptRef.current, {
        quality: 0.98,
        pixelRatio: 2.5, // Ultra-sharp 2.5x resolution for mobile screens and gallery
        backgroundColor: '#ffffff',
      });

      // Check if mobile device supports sharing/saving to camera roll
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `kharcha-slip-${todayStr}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'मेरो खर्च रसिद',
              text: 'खर्च-किताबबाट डाउनलोड गरिएको खर्च रसिद',
            });
            setIsSaving(false);
            setSavedSuccess(lang === 'ne' ? 'ग्यालरीमा सेभ भयो!' : 'Saved to Gallery!');
            setTimeout(() => setSavedSuccess(''), 4000);
            return;
          }
        } catch (shareErr) {
          // Fallback to direct download
        }
      }

      // Standard direct download to gallery / downloads folder
      const link = document.createElement('a');
      link.download = `kharcha-slip-${todayStr}.png`;
      link.href = dataUrl;
      link.click();

      setSavedSuccess(lang === 'ne' ? 'फोटो ग्यालरी / Downloads मा सेभ भयो!' : 'Photo saved to Gallery / Downloads!');
      setTimeout(() => setSavedSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to save image:', err);
      alert('फोटो सेभ गर्दा समस्या आयो।');
    } finally {
      setIsSaving(false);
    }
  };

  // Excel export
  const handleExcelExport = () => {
    exportToExcel({ expenses, totalMoney, dailyBudget, lang });
    setSavedSuccess(lang === 'ne' ? 'एक्सेल फाइल डाउनलोड भयो!' : 'Excel file downloaded!');
    setTimeout(() => setSavedSuccess(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[96vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {lang === 'ne' ? 'खर्च रसिद (ग्यालरीमा सेभ)' : 'Expense Receipt'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'ne' ? 'मोबाइलको फोटो ग्यालरीमा डाउनलोड गर्नुहोस्' : 'Download directly to your photo gallery'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Excel button */}
            <button
              onClick={handleExcelExport}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition"
              title="Excel फाइल"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Excel</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success toast */}
        {savedSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{savedSuccess}</span>
          </div>
        )}

        {/* Scrollable Receipt Area */}
        <div className="p-3 sm:p-5 overflow-y-auto bg-slate-100/70 grow flex justify-center">
          
          {/* THE DIGITAL SLIP CARD (Target for PNG download to gallery) */}
          <div
            ref={receiptRef}
            className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden select-none"
          >
            {/* Receipt Top Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white text-center relative">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner">
                <Wallet className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold font-['Mukta',sans-serif] tracking-tight">
                खर्च-किताब (KharchaKitab)
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                दैनिक खर्च विवरण र रसिद
              </p>
              
              <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px] text-emerald-100 font-medium">
                <span>{nepaliDateStr}</span>
                <span>{todayStr}</span>
              </div>
            </div>

            {/* Middle Main Totals Box */}
            <div className="p-5 border-b border-slate-100 bg-[#F9FBFA]">
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  कुल खर्च रकम (Total Spent)
                </span>
                <span className="text-3xl font-black text-rose-600 tracking-tight block my-0.5">
                  {formatNepaliCurrency(totalSpent)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {expenses.length} वटा कारोबार दर्ता गरिएको
                </span>
              </div>

              {/* 3 Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-center">
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold block">जम्मा रकम</span>
                  <span className="text-xs font-extrabold text-slate-900 block">{formatNepaliCurrency(totalMoney)}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold block">बाँकी बचत</span>
                  <span className={`text-xs font-extrabold block ${remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {formatNepaliCurrency(remaining)}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-semibold block">अतिरिक्त खर्च</span>
                  <span className={`text-xs font-extrabold block ${exactExtra > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {exactExtra > 0 ? `+${formatNepaliCurrency(exactExtra)}` : 'रु ०'}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Expenses List */}
            <div className="p-5 space-y-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                खर्च विवरण सूची:
              </span>

              {expenses.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 italic">
                  कुनै खर्च दर्ता गरिएको छैन।
                </div>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {expenses.map((item, idx) => {
                    const cat = CATEGORIES.find(c => c.id === item.category)?.nameNe || item.category;
                    const pm = PAYMENT_METHODS.find(p => p.id === item.paymentMethod)?.nameNe || item.paymentMethod;
                    const isExtra = item.isExtra || item.category === 'extra';

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="text-slate-400 font-bold w-4 text-center">{idx + 1}</span>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 truncate block">
                              {item.note}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {cat} • <span className="font-semibold text-emerald-700">{pm}</span>
                              {isExtra && <span className="ml-1 text-rose-600 font-bold">(अतिरिक्त)</span>}
                            </span>
                          </div>
                        </div>
                        <span className={`font-black shrink-0 ${isExtra ? 'text-rose-600' : 'text-slate-900'}`}>
                          -{formatNepaliCurrency(item.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Summary Footer: Cash vs Digital */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-semibold">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" /> नगद: {formatNepaliCurrency(cashSpent)}
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <QrCode className="w-3.5 h-3.5 text-teal-600" /> डिजिटल QR: {formatNepaliCurrency(digitalSpent)}
              </span>
            </div>

            {/* Bottom Verification Seal */}
            <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>खर्च-किताब • सुरक्षित र भरपर्दो व्यक्तिगत हिसाब</span>
            </div>

          </div>

        </div>

        {/* Bottom Action Button: Big "Save to Gallery" */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <button
            onClick={handleSaveToGallery}
            disabled={isSaving}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{isSaving ? 'ग्यालरीमा सेभ हुँदैछ...' : '📸 ग्यालरीमा डाउनलोड गर्नुहोस् (Save to Gallery)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
