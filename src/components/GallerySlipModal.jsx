import React, { useRef, useState } from 'react';
import { X, Download, FileSpreadsheet, Check, Receipt, Calendar, Clock, Filter, Banknote, QrCode, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { exportToExcel } from '../utils/excelExporter';
import { CATEGORIES, PAYMENT_METHODS, formatNepaliCurrency, generate100SampleExpenses } from '../data/nepaliData';

export default function GallerySlipModal({ isOpen, onClose, expenses, setExpenses, totalMoney, dailyBudget = 1000, lang }) {
  const receiptRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');
  const [filterLimit, setFilterLimit] = useState('100'); // '100', 'all', 'today', '50', '25'

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

  // Filter expenses according to selected limit
  let displayedExpenses = [...expenses];
  if (filterLimit === 'today') {
    displayedExpenses = displayedExpenses.filter(e => e.date === todayStr);
  } else if (filterLimit === '25') {
    displayedExpenses = displayedExpenses.slice(0, 25);
  } else if (filterLimit === '50') {
    displayedExpenses = displayedExpenses.slice(0, 50);
  } else if (filterLimit === '100') {
    displayedExpenses = displayedExpenses.slice(0, 100);
  }

  const totalSpent = displayedExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = totalMoney - totalSpent;

  // Accurate Extra Expense Calculation for displayed items
  const todayExpenses = displayedExpenses.filter(e => e.date === todayStr);
  const todayTotal = todayExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const todayExtra = Math.max(0, todayTotal - dailyBudget);

  const expensesByDate = displayedExpenses.reduce((acc, item) => {
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
  const cashSpent = displayedExpenses
    .filter(e => e.paymentMethod === 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const digitalSpent = displayedExpenses
    .filter(e => e.paymentMethod !== 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // Save as PNG directly to phone gallery / downloads
  const handleSaveToGallery = async () => {
    if (!receiptRef.current) return;
    setIsSaving(true);
    setSavedSuccess('');

    try {
      const cardEl = receiptRef.current;
      const fullWidth = cardEl.scrollWidth || cardEl.offsetWidth;
      const fullHeight = cardEl.scrollHeight || cardEl.offsetHeight;

      // Dynamically adjust pixelRatio so 100 items (3000-4000px tall) don't exceed browser canvas limits
      let dynamicPixelRatio = 2.0;
      if (fullHeight > 3500) {
        dynamicPixelRatio = 1.15;
      } else if (fullHeight > 2000) {
        dynamicPixelRatio = 1.45;
      } else if (fullHeight > 1000) {
        dynamicPixelRatio = 1.75;
      }

      const dataUrl = await toPng(cardEl, {
        quality: 0.95,
        pixelRatio: dynamicPixelRatio,
        backgroundColor: '#ffffff',
        width: fullWidth,
        height: fullHeight,
        style: {
          height: `${fullHeight}px`,
          maxHeight: 'none',
          overflow: 'visible',
          transform: 'none',
        }
      });

      // Check if mobile device supports native sharing / save to Photos
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `kharcha-statement-${todayStr}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'मेरो खर्च स्टेटमेन्ट',
              text: `खर्च विवरण रसिद (${displayedExpenses.length} वटा कारोबार)`,
            });
            setIsSaving(false);
            setSavedSuccess(lang === 'ne' ? 'ग्यालरीमा सेभ भयो!' : 'Saved to Gallery!');
            setTimeout(() => setSavedSuccess(''), 4000);
            return;
          }
        } catch (shareErr) {
          // Fallback to standard download
        }
      }

      // Standard direct download
      const link = document.createElement('a');
      link.download = `kharcha-statement-${todayStr}.png`;
      link.href = dataUrl;
      link.click();

      setSavedSuccess(lang === 'ne' ? 'फोटो ग्यालरी / Downloads मा सेभ भयो!' : 'Photo saved to Gallery / Downloads!');
      setTimeout(() => setSavedSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to save image:', err);
      alert(lang === 'ne' ? 'फोटो सेभ गर्दा समस्या आयो। धेरै कारोबार भए Excel मा पनि डाउनलोड गर्न सक्नुहुन्छ।' : 'Failed to save image. Try Excel export for very large lists.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Controls */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-tight truncate">
                {lang === 'ne' ? 'खर्च रसिद (१०० कारोबार डाउनलोड)' : 'Expense Statement (100 Items)'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                {lang === 'ne' ? '१०० वटासम्म कारोबार ग्यालरीमा सेभ गर्न सकिन्छ' : 'Download up to 100 transactions to gallery'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Excel button */}
            <button
              onClick={handleExcelExport}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition"
              title="Excel फाइल"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Excel</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Limit & Filter Selector (100 items, All, Today, 50, 25) */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
            <Filter className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="text-[11px] font-bold">
              {lang === 'ne' ? 'रसिदमा देखाउने:' : 'Show in Slip:'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {[
              { id: '100', label: lang === 'ne' ? '१०० वटा' : '100 Items' },
              { id: 'all', label: lang === 'ne' ? 'सबै' : 'All' },
              { id: 'today', label: lang === 'ne' ? 'आजको' : 'Today' },
              { id: '50', label: lang === 'ne' ? '५० वटा' : '50 Items' },
              { id: '25', label: lang === 'ne' ? '२५ वटा' : '25 Items' },
            ].map(btn => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterLimit(btn.id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  filterLimit === btn.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Success toast */}
        {savedSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-1.5 animate-in fade-in shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{savedSuccess}</span>
          </div>
        )}

        {/* Scrollable Preview Area (Optimized for Mobile Screens) */}
        <div className="p-2 sm:p-4 overflow-y-auto overflow-x-hidden bg-slate-100/70 grow flex flex-col items-center">
          
          {/* Quick Helper: Load 100 Sample Items for immediate test if user currently has fewer items */}
          {expenses.length < 100 && setExpenses && (
            <div className="w-full max-w-[360px] sm:max-w-md bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 mb-3 flex items-center justify-between gap-2">
              <div className="text-[11px] text-emerald-900 min-w-0">
                <span className="font-bold block truncate">
                  {lang === 'ne'
                    ? `हाल ${expenses.length} वटा कारोबार दर्ता छ।`
                    : `You have ${expenses.length} transactions.`}
                </span>
                <span className="text-[10px] text-emerald-700 block truncate">
                  {lang === 'ne'
                    ? '१०० वटाको रसिद परीक्षण गर्न नमुना डाटा लोड गर्नुहोस्:'
                    : 'Load 100 sample items to test full download:'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const samples = generate100SampleExpenses();
                  setExpenses(samples);
                  setFilterLimit('100');
                  alert(lang === 'ne' ? '१०० वटा कारोबार सफलतापूर्वक लोड भयो!' : '100 transactions loaded!');
                }}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[11px] rounded-lg shrink-0 shadow-xs flex items-center gap-1 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? '१०० लोड गर्नुहोस्' : 'Load 100'}</span>
              </button>
            </div>
          )}

          {/* THE DIGITAL SLIP CARD (Target for PNG download to gallery) */}
          <div
            ref={receiptRef}
            className="w-full max-w-[360px] sm:max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 sm:p-5 select-none text-slate-900 overflow-hidden"
          >
            {/* Clean Statement Header */}
            <div className="border-b-2 border-slate-900 pb-2.5 mb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
                    <Receipt className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{lang === 'ne' ? 'कारोबार हिसाब स्टेटमेन्ट' : 'Transaction Statement'}</span>
                  </h2>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5">
                    <span>{nepaliDateStr}</span>
                    <span>•</span>
                    <span>{todayStr}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {lang === 'ne' ? 'कुल संख्या' : 'Entries'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-emerald-800">
                    {displayedExpenses.length} {lang === 'ne' ? 'वटा' : 'items'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Financial Overview Bar */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3 text-center">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'ne' ? 'कुल खर्च' : 'Total Spent'}
                </span>
                <span className="text-xs sm:text-sm font-black text-rose-600 block mt-0.5">
                  {formatNepaliCurrency(totalSpent)}
                </span>
              </div>
              <div className="border-x border-slate-200 px-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'ne' ? 'बाँकी बचत' : 'Balance'}
                </span>
                <span className={`text-xs sm:text-sm font-black block mt-0.5 ${remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formatNepaliCurrency(remaining)}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'ne' ? 'अतिरिक्त' : 'Extra'}
                </span>
                <span className={`text-xs sm:text-sm font-black block mt-0.5 ${exactExtra > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {exactExtra > 0 ? `+${formatNepaliCurrency(exactExtra)}` : 'रु ०'}
                </span>
              </div>
            </div>

            {/* Itemized Transactions Table (Compact, clean 2-line ledger format for 100+ transactions) */}
            <div className="mb-3">
              {/* Table Column Title */}
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-slate-500 pb-1 border-b border-slate-200 tracking-wider">
                <span>{lang === 'ne' ? 'क्र.सं. / विवरण / मिति र समय' : 'S.N. / Note / Date & Time'}</span>
                <span>{lang === 'ne' ? 'रकम (Amount)' : 'Amount'}</span>
              </div>

              {/* Transactions List (All displayed items rendered with NO max-height cutoff) */}
              {displayedExpenses.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 italic">
                  {lang === 'ne' ? 'कुनै खर्च दर्ता गरिएको छैन।' : 'No transactions recorded.'}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {displayedExpenses.map((item, idx) => {
                    const cat = CATEGORIES.find(c => c.id === item.category)?.nameNe || item.category;
                    const pm = PAYMENT_METHODS.find(p => p.id === item.paymentMethod)?.nameNe || item.paymentMethod;
                    const isExtra = item.isExtra || item.category === 'extra';

                    return (
                      <div
                        key={item.id}
                        className={`py-1.5 px-1 text-xs ${
                          isExtra ? 'bg-rose-50/60 rounded-lg' : ''
                        }`}
                      >
                        {/* Top Line: S.N. + Note + Amount */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-mono text-[10px] font-bold text-slate-400 w-6 shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 truncate text-[11px] sm:text-xs">
                              {item.note}
                            </span>
                            {isExtra && (
                              <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1 py-0.2 rounded shrink-0">
                                {lang === 'ne' ? 'अतिरिक्त' : 'Extra'}
                              </span>
                            )}
                          </div>

                          <span className={`font-black text-xs sm:text-sm shrink-0 ${isExtra ? 'text-rose-600' : 'text-slate-900'}`}>
                            -{formatNepaliCurrency(item.amount)}
                          </span>
                        </div>

                        {/* Bottom Line: Date & Time • Category • Mode */}
                        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] text-slate-500 mt-0.5 pl-7 flex-wrap">
                          <span className="font-mono text-slate-600 font-medium">
                            {item.date} {item.time ? `• ${item.time}` : ''}
                          </span>
                          <span>•</span>
                          <span className="text-slate-600">{cat}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-1 rounded border border-emerald-100">
                            {pm}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Total & Payment Breakdown */}
            <div className="border-t-2 border-slate-800 pt-2.5 bg-slate-50/80 rounded-xl p-2.5 sm:p-3 mt-1">
              <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold pb-1.5 border-b border-slate-200">
                <span className="text-slate-700">{lang === 'ne' ? 'जम्मा कुल खर्च (Total):' : 'Grand Total:'}</span>
                <span className="text-sm sm:text-base text-rose-600 font-black">{formatNepaliCurrency(totalSpent)}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-600 pt-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 font-semibold">
                    <Banknote className="w-3 h-3 text-emerald-700" /> नगद: {formatNepaliCurrency(cashSpent)}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <QrCode className="w-3 h-3 text-teal-700" /> QR: {formatNepaliCurrency(digitalSpent)}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-medium">
                  {lang === 'ne' ? 'प्रमाणित स्टेटमेन्ट' : 'Official Record'} • {todayStr}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Action Button: Big "Save to Gallery" */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <button
            onClick={handleSaveToGallery}
            disabled={isSaving}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>
              {isSaving
                ? (lang === 'ne' ? 'ग्यालरीमा सेभ हुँदैछ...' : 'Saving to Gallery...')
                : (lang === 'ne' ? `📸 ग्यालरीमा सेभ गर्नुहोस् (${displayedExpenses.length} वटा कारोबार)` : `Save to Gallery (${displayedExpenses.length} transactions)`)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
