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
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-300 p-5 sm:p-6 select-none text-slate-900"
          >
            {/* Minimal Transaction Header (Focus on Statement details, not promotional branding) */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <Receipt className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>{lang === 'ne' ? 'कारोबार हिसाब स्टेटमेन्ट' : 'Transaction Statement'}</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium mt-1">
                    <span>{nepaliDateStr}</span>
                    <span>•</span>
                    <span>{todayStr}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {lang === 'ne' ? 'कुल कारोबार' : 'Transactions'}
                  </span>
                  <span className="text-sm sm:text-base font-black text-emerald-800">
                    {expenses.length} {lang === 'ne' ? 'वटा' : 'items'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Financial Overview Bar (Compact & Clean) */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'ne' ? 'कुल खर्च' : 'Total Spent'}
                </span>
                <span className="text-xs sm:text-sm font-black text-rose-600 block mt-0.5">
                  {formatNepaliCurrency(totalSpent)}
                </span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'ne' ? 'बाँकी बचत' : 'Balance'}
                </span>
                <span className={`text-xs sm:text-sm font-black block mt-0.5 ${remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formatNepaliCurrency(remaining)}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'ne' ? 'अतिरिक्त खर्च' : 'Extra Spent'}
                </span>
                <span className={`text-xs sm:text-sm font-black block mt-0.5 ${exactExtra > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {exactExtra > 0 ? `+${formatNepaliCurrency(exactExtra)}` : 'रु ०'}
                </span>
              </div>
            </div>

            {/* Itemized Transactions Table (No fixed height - all transactions included cleanly in downloaded image) */}
            <div className="mb-4">
              {/* Table Column Titles */}
              <div className="grid grid-cols-12 text-[11px] font-extrabold uppercase text-slate-500 pb-1.5 border-b border-slate-200 tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-7 pl-1">
                  {lang === 'ne' ? 'खर्च विवरण / मिति र समय' : 'Description / Date & Time'}
                </div>
                <div className="col-span-4 text-right">
                  {lang === 'ne' ? 'रकम (रु)' : 'Amount (NPR)'}
                </div>
              </div>

              {/* Transactions Rows */}
              {expenses.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  {lang === 'ne' ? 'कुनै खर्च दर्ता गरिएको छैन।' : 'No transactions recorded.'}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {expenses.map((item, idx) => {
                    const cat = CATEGORIES.find(c => c.id === item.category)?.nameNe || item.category;
                    const pm = PAYMENT_METHODS.find(p => p.id === item.paymentMethod)?.nameNe || item.paymentMethod;
                    const isExtra = item.isExtra || item.category === 'extra';

                    return (
                      <div
                        key={item.id}
                        className={`grid grid-cols-12 items-start py-2.5 text-xs ${
                          isExtra ? 'bg-rose-50/50 -mx-2 px-2 rounded-lg' : ''
                        }`}
                      >
                        {/* Serial Number */}
                        <div className="col-span-1 text-center font-bold text-slate-400 pt-0.5">
                          {idx + 1}
                        </div>

                        {/* Note & Metadata */}
                        <div className="col-span-7 pl-1 pr-2">
                          <span className="font-bold text-slate-900 leading-snug block">
                            {item.note}
                          </span>

                          {/* Date, Time, Category, Payment Mode */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                              📅 {item.date} {item.time ? `• ⏰ ${item.time}` : ''}
                            </span>
                            <span>•</span>
                            <span className="font-medium text-slate-600">{cat}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                              {pm}
                            </span>
                            {isExtra && (
                              <span className="font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                                {lang === 'ne' ? 'अतिरिक्त' : 'Extra'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="col-span-4 text-right pt-0.5">
                          <span className={`font-black text-sm block ${isExtra ? 'text-rose-600' : 'text-slate-900'}`}>
                            -{formatNepaliCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Total & Payment Breakdown */}
            <div className="border-t-2 border-slate-800 pt-3 bg-slate-50/80 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
              <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold pb-2 border-b border-slate-200">
                <span className="text-slate-700">{lang === 'ne' ? 'कुल खर्च रकम (Grand Total):' : 'Grand Total:'}</span>
                <span className="text-base sm:text-lg text-rose-600 font-black">{formatNepaliCurrency(totalSpent)}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-slate-600 pt-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold">
                    <Banknote className="w-3.5 h-3.5 text-emerald-700" /> नगद: {formatNepaliCurrency(cashSpent)}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <QrCode className="w-3.5 h-3.5 text-teal-700" /> डिजिटल QR: {formatNepaliCurrency(digitalSpent)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {lang === 'ne' ? 'प्रमाणित स्टेटमेन्ट' : 'Official Record'}
                </span>
              </div>
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
