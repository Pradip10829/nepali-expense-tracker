import React, { useRef, useState } from 'react';
import { X, Image as ImageIcon, FileSpreadsheet, Printer, Check, PenTool } from 'lucide-react';
import { toPng } from 'html-to-image';
import { exportToExcel } from '../utils/excelExporter';
import { CATEGORIES, PAYMENT_METHODS, formatNepaliCurrency } from '../data/nepaliData';

export default function NepaliPaperModal({ isOpen, onClose, expenses, totalMoney, dailyBudget = 1000, lang }) {
  const paperRef = useRef(null);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');
  const [inkColor, setInkColor] = useState('blue'); // 'blue' or 'black'

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
  const nepaliDateStr = `२०८१ ${monthsNe[approxMonthIndex]} ${date.getDate()}`;
  const dayNameStr = daysNe[date.getDay()];

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = totalMoney - totalSpent;

  // Accurate Extra Expense Calculation (e.g. Spent 1100 with budget 1000 = exactly 100 extra)
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

  // Pen ink styling (Blue ballpoint vs Black ballpoint)
  const penColorClass = inkColor === 'blue' ? 'text-[#1d4ed8]' : 'text-[#0f172a]';

  // Handle Export to PNG Image
  const handleDownloadPng = async () => {
    if (!paperRef.current) return;
    setIsGeneratingPng(true);
    setDownloadSuccess('');

    try {
      const dataUrl = await toPng(paperRef.current, {
        quality: 0.98,
        pixelRatio: 2, // 2x for crisp high-resolution A4 image
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `A4-school-copy-diary-${todayStr}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(lang === 'ne' ? 'A4 कापीको पाना PNG फोटो सेभ भयो!' : 'A4 School Notebook PNG saved!');
      setTimeout(() => setDownloadSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to generate PNG:', err);
      alert('PNG सिर्जना गर्दा समस्या आयो।');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  // Handle Excel Export
  const handleExcelExport = () => {
    exportToExcel({ expenses, totalMoney, dailyBudget, lang });
    setDownloadSuccess(lang === 'ne' ? 'एक्सेल फाइल (.xlsx) डाउनलोड भयो!' : 'Excel file downloaded!');
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[96vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="p-3.5 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-blue-600" />
              <span>{lang === 'ne' ? 'A4 कापीको पाना (School Notebook Diary)' : 'A4 School Notebook Paper'}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ne' ? 'स्कुलको कापीमा डटपेनले लेखेको जस्तै वास्तविक हिसाब' : 'Real school exercise book with date box, red margin & blue lines'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Pen Ink Toggle */}
            <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-xs font-bold mr-1">
              <button
                type="button"
                onClick={() => setInkColor('blue')}
                className={`px-2 py-1 rounded-md transition ${inkColor === 'blue' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}
              >
                🔵 निलो मसी
              </button>
              <button
                type="button"
                onClick={() => setInkColor('black')}
                className={`px-2 py-1 rounded-md transition ${inkColor === 'black' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600'}`}
              >
                ⚫ कालो मसी
              </button>
            </div>

            {/* Download PNG Button */}
            <button
              onClick={handleDownloadPng}
              disabled={isGeneratingPng}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isGeneratingPng ? (lang === 'ne' ? 'PNG बन्दैछ...' : 'Saving...') : (lang === 'ne' ? 'A4 PNG सेभ' : 'Save A4 PNG')}</span>
            </button>

            {/* Download Excel Button */}
            <button
              onClick={handleExcelExport}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === 'ne' ? 'Excel (.xlsx)' : 'Export Excel'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition"
              title="प्रिन्ट गर्नुहोस्"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'ne' ? 'प्रिन्ट' : 'Print'}</span>
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

        {/* Success toast notification */}
        {downloadSuccess && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Scrollable Document Container */}
        <div className="p-3 sm:p-6 overflow-y-auto bg-slate-300/70 grow flex justify-center items-start">
          
          {/* THE AUTHENTIC A4 SCHOOL NOTEBOOK SHEET */}
          <div
            ref={paperRef}
            className={`w-full max-w-[760px] min-h-[960px] bg-white rounded-md shadow-2xl border border-slate-300 relative select-none font-handwritten ${penColorClass} overflow-hidden`}
            style={{
              // Classic Blue Ruled Horizontal Lines (every 32px)
              backgroundImage: 'linear-gradient(to bottom, transparent 31px, rgba(147, 197, 253, 0.5) 32px)',
              backgroundSize: '100% 32px',
              lineHeight: '32px',
            }}
          >
            
            {/* TOP MARGIN SECTION (School Book Top Header) */}
            <div className="h-[96px] bg-white border-b-2 border-rose-400 relative px-4 flex items-center justify-between">
              
              {/* Printed School Book Top Banner */}
              <div className="flex items-center gap-2 text-slate-400 font-sans text-[11px] font-bold tracking-widest uppercase">
                <span>EXERCISE BOOK</span>
                <span>•</span>
                <span>दैनिक हिसाब कापी</span>
              </div>

              {/* Classic Printed Top-Right Date Box (स्कूलको कापीको Date बक्स) */}
              <div className="border-2 border-rose-400 bg-rose-50/20 px-3 py-1 rounded text-xs leading-tight font-sans text-rose-800 shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-rose-200 pb-0.5">
                  <span className="font-bold text-[11px]">DATE:</span>
                  <span className="font-handwritten font-bold text-sm text-blue-700">{todayStr}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-rose-200 py-0.5">
                  <span className="font-bold text-[10px]">मिति:</span>
                  <span className="font-handwritten font-bold text-sm text-blue-700">{nepaliDateStr}</span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-0.5">
                  <span className="font-bold text-[10px]">वार (DAY):</span>
                  <span className="font-handwritten font-bold text-sm text-blue-700">{dayNameStr}</span>
                </div>
              </div>

              {/* Second subtle top red line */}
              <div className="absolute bottom-[3px] left-0 right-0 border-b border-rose-300"></div>
            </div>

            {/* MAIN NOTEBOOK BODY WITH LEFT RED MARGIN */}
            <div className="relative flex min-h-[850px]">
              
              {/* LEFT MARGIN (जहाँ प्रश्न/क्र.सं. लेखिन्छ) */}
              <div className="w-14 sm:w-16 shrink-0 border-r-2 border-rose-400 pr-1 text-center font-bold text-base sm:text-lg text-slate-500 pt-3 relative">
                {/* Second subtle vertical red margin line */}
                <div className="absolute top-0 bottom-0 right-[3px] border-r border-rose-300"></div>
                
                {/* Margin Labels */}
                <div className="space-y-0 text-slate-400 font-sans text-[10px] tracking-tighter mb-2">
                  <span>Q.N.</span>
                </div>
              </div>

              {/* RIGHT CONTENT AREA (Handwriting sitting right on the blue lines) */}
              <div className="grow pl-4 sm:pl-6 pr-4 sm:pr-8 pt-2 pb-12">
                
                {/* Title written by hand */}
                <div className="text-center my-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-wide inline-block border-b-2 border-dashed border-current pb-0.5">
                    {lang === 'ne' ? 'मेरो दैनिक खर्चको हिसाब-किताब' : 'My Daily Expense Notebook'}
                  </h1>
                </div>

                {/* Starting Total Funds Line in Ballpoint Pen */}
                <div className="my-2 text-lg sm:text-xl font-bold flex flex-wrap items-baseline justify-between border-b border-current pb-1">
                  <span>१) कुल जम्मा भएको रकम (Total Funds):</span>
                  <span className="text-xl sm:text-2xl font-black underline decoration-wavy">
                    {formatNepaliCurrency(totalMoney)}
                  </span>
                </div>

                {/* Heading: Today's Expenses */}
                <div className="text-lg font-bold mt-3 mb-1 text-slate-700 flex items-center justify-between">
                  <span>२) आज गरिएका खर्चहरू (Expenses List):</span>
                  <span className="text-xs font-sans text-slate-400">{expenses.length} कारोबार</span>
                </div>

                {/* Expense Rows Sitting Right on Blue Ruled Lines */}
                {expenses.length === 0 ? (
                  <div className="py-12 text-center text-xl text-slate-400 italic">
                    ~ आज कुनै खर्च लेखिएको छैन (No expenses recorded) ~
                  </div>
                ) : (
                  <div className="space-y-0 text-base sm:text-lg">
                    {expenses.map((item, idx) => {
                      const cat = CATEGORIES.find(c => c.id === item.category)?.nameNe || item.category;
                      const pm = PAYMENT_METHODS.find(p => p.id === item.paymentMethod)?.nameNe || item.paymentMethod;
                      const isExtra = item.isExtra || item.category === 'extra';

                      return (
                        <div
                          key={item.id}
                          className="flex items-baseline justify-between leading-[32px] group"
                        >
                          {/* Item Note and Mode */}
                          <div className="flex items-baseline gap-2 min-w-0 pr-2">
                            <span className="font-bold opacity-75">{idx + 1}.</span>
                            <span className="font-bold truncate">{item.note}</span>
                            <span className="text-xs opacity-65 font-sans">({cat} • {pm})</span>
                            {isExtra && (
                              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1 py-0 rounded border border-rose-300 shrink-0">
                                ⚠️ अतिरिक्त खर्च
                              </span>
                            )}
                          </div>

                          {/* Amount */}
                          <div className={`font-black text-right shrink-0 ${isExtra ? 'text-rose-600' : ''}`}>
                            -{formatNepaliCurrency(item.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Handwritten Separator Line */}
                <div className="my-4 border-t-2 border-dashed border-current opacity-70"></div>

                {/* Calculations & Exact Extra Calculation */}
                <div className="space-y-1 text-base sm:text-lg font-bold">
                  
                  {/* Total Spent */}
                  <div className="flex justify-between items-baseline leading-[32px]">
                    <span>कुल खर्च भएको रकम (Total Spent):</span>
                    <span className="text-xl sm:text-2xl text-rose-600 font-black underline decoration-2">
                      {formatNepaliCurrency(totalSpent)}
                    </span>
                  </div>

                  {/* Daily Budget Target */}
                  <div className="flex justify-between items-baseline text-slate-600 leading-[32px]">
                    <span>दैनिक खर्च बजेट सीमा (Daily Limit):</span>
                    <span>{formatNepaliCurrency(dailyBudget)}</span>
                  </div>

                  {/* Accurate Extra Expense Line (e.g. 1100 spent with 1000 budget = 100 extra) */}
                  {exactExtra > 0 && (
                    <div className="flex justify-between items-baseline text-rose-600 font-black text-lg sm:text-xl leading-[32px] bg-rose-50/70 px-2 py-0.5 rounded-lg border border-rose-300">
                      <span className="flex items-center gap-1">
                        <span>🔴</span>
                        <span>अतिरिक्त खर्च (बजेट नाघेको रकम):</span>
                      </span>
                      <span className="text-2xl font-black underline decoration-wavy">
                        +{formatNepaliCurrency(exactExtra)}
                      </span>
                    </div>
                  )}

                  {/* Remaining Balance Circled by Hand */}
                  <div className="pt-2">
                    <div className={`p-3 rounded-2xl border-2 flex justify-between items-center text-lg sm:text-xl shadow-xs ${
                      remaining < 0 
                        ? 'bg-rose-50 border-rose-500 text-rose-700' 
                        : 'bg-emerald-50/80 border-emerald-600 text-emerald-950'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <span>🎯</span>
                        <span>हातमा बाँकी रहेको बचत (Remaining Balance):</span>
                      </span>
                      <span className="text-2xl sm:text-3xl font-black underline decoration-double">
                        {formatNepaliCurrency(remaining)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* School Book Footer: Teacher/Self Verification & Signature */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  
                  {/* Red Pen Teacher's Remark with Star */}
                  <div className="text-rose-600 font-bold text-sm sm:text-base leading-snug">
                    <span className="text-lg">✓</span> <span>Check & Verified!</span>
                    <div className="text-amber-600 text-xs mt-0.5">
                      ★★★ "राम्रो हिसाब! दैनिक खर्च लेख्ने बानीले बचत बढाउँछ।"
                    </div>
                  </div>

                  {/* Handwritten Signature */}
                  <div className="text-right shrink-0">
                    <div className="w-36 border-b-2 border-current mb-0.5 ml-auto opacity-70"></div>
                    <span className="text-xs font-bold opacity-80 font-sans">खाता धनीको दस्तखत (Signature)</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
