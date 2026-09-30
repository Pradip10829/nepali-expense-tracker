import React, { useState, useEffect, useRef } from 'react';
import { 
  NotebookPen, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Zap, 
  CornerDownLeft, 
  Clock, 
  Calendar,
  Tag, 
  Check, 
  HelpCircle,
  X
} from 'lucide-react';
import { formatNepaliCurrency, CATEGORIES, PAYMENT_METHODS, formatTime24To12, formatReadableDate } from '../data/nepaliData';

function getNowTime24() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// Map of keywords to auto-detect categories
const CATEGORY_KEYWORDS = {
  groceries: [
    'milk', 'dudh', 'दूध', 'dahi', 'दही', 'curd', 'paneer', 'bread', 'egg', 'anda', 
    'अण्डा', 'vegetable', 'tarkari', 'तरकारी', 'aalu', 'आलु', 'tomato', 'tamatar', 
    'rice', 'chamal', 'चामल', 'dal', 'दाल', 'oil', 'tel', 'तेल', 'salt', 'nun', 
    'नुन', 'sugar', 'chini', 'चिनी', 'fruits', 'syau', 'kera', 'grocery', 'kirana', 
    'किराना', 'masala', 'मसाला', 'onion', 'pyaj', 'lasun', 'garlic', 'ginger', 'adhuwa'
  ],
  snacks: [
    'tea', 'chiya', 'चिया', 'coffee', 'samosa', 'समौसा', 'momo', 'मम', 'chowmein', 
    'चाउमिन', 'khaja', 'खाजा', 'snack', 'breakfast', 'lunch', 'dinner', 'khana', 
    'खाना', 'bhat', 'भात', 'roti', 'रोटी', 'restaurant', 'hotel', 'bhojan', 'sweets', 
    'mithai', 'coke', 'cold drink', 'juice', 'biscuit', 'noodles', 'waiwai'
  ],
  transport: [
    'bus', 'गाडी', 'tempo', 'ट्याम्पो', 'micro', 'fare', 'भाडा', 'ticket', 'petrol', 
    'पेट्रोल', 'diesel', 'डीजल', 'bike', 'car', 'pathao', 'indrive', 'taxi', 
    'ट्याक्सी', 'parking', 'toll'
  ],
  recharge: [
    'recharge', 'रिचार्ज', 'ntc', 'ncell', 'smartcell', 'wifi', 'internet', 
    'इन्टरनेट', 'bill', 'बिजुली', 'electricity', 'water', 'pani', 'खानेपानी'
  ],
  rent: [
    'rent', 'room', 'flat', 'घरभाडा', 'कोठा'
  ],
  medical: [
    'medicine', 'dawa', 'औषधि', 'doctor', 'डाक्टर', 'hospital', 'अस्पताल', 
    'clinic', 'test', 'checkup', 'pharmacy'
  ],
  shopping: [
    'cloth', 'kapada', 'कपडा', 'shoe', 'jutta', 'जुत्ता', 'pant', 'shirt', 
    'shopping', 'किनमेल', 'bag'
  ],
  extra: [
    'party', 'treat', 'gift', 'fun', 'movie', 'cinema', 'game'
  ]
};

// Smart Category Detector
function detectCategory(title = '') {
  const clean = title.toLowerCase().trim();
  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => clean.includes(kw.toLowerCase()))) {
      return catId;
    }
  }
  return 'other';
}

// Detect if user wrote a date directly in the note text, e.g. "26 sep milk 50" or "2026-09-26 milk 50"
const MONTH_NAME_MAP = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

export function extractInlineDateAndCleanText(rawText) {
  if (!rawText) return { detectedDate: null, cleanedText: '' };
  const nepaliDigits = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
  let text = rawText.replace(/[०-९]/g, d => nepaliDigits[d] || d);
  let detectedDate = null;
  const currentYear = new Date().getFullYear();

  // 1. Check YYYY-MM-DD (e.g. 2026-09-26)
  const isoMatch = text.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (isoMatch) {
    const yyyy = isoMatch[1];
    const mm = String(isoMatch[2]).padStart(2, '0');
    const dd = String(isoMatch[3]).padStart(2, '0');
    detectedDate = `${yyyy}-${mm}-${dd}`;
    text = text.replace(isoMatch[0], ' ');
  } else {
    // 2. Check "26 sep", "26 september", "sep 26", "september 26"
    const dmyMatch = text.match(/\b(\d{1,2})\s*(?:st|nd|rd|th)?\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+(\d{4}))?\b/i);
    const mdyMatch = text.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\b/i);

    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const monthNum = MONTH_NAME_MAP[dmyMatch[2].toLowerCase()];
      const year = dmyMatch[3] ? parseInt(dmyMatch[3], 10) : currentYear;
      if (day >= 1 && day <= 31 && monthNum) {
        detectedDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        text = text.replace(dmyMatch[0], ' ');
      }
    } else if (mdyMatch) {
      const monthNum = MONTH_NAME_MAP[mdyMatch[1].toLowerCase()];
      const day = parseInt(mdyMatch[2], 10);
      const year = mdyMatch[3] ? parseInt(mdyMatch[3], 10) : currentYear;
      if (day >= 1 && day <= 31 && monthNum) {
        detectedDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        text = text.replace(mdyMatch[0], ' ');
      }
    }
  }

  return { detectedDate, cleanedText: text };
}

// Smart Parser: Extracts items and amounts from text
export function parseNoteToExpenses(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const { cleanedText } = extractInlineDateAndCleanText(rawText);

  // Remove currency symbols like Rs, Rs., रु, रू, etc.
  let normalized = cleanedText.replace(/रु\.?|Rs\.?|रू/gi, ' ');

  const items = [];
  const lines = normalized.split(/[\n,;]+/);
  const regexWordNum = /([a-zA-Z\u0900-\u097F\s\/\-_.]+?)\s+(\d+(?:\.\d+)?)/g;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const lineMatches = [];
    let m;
    regexWordNum.lastIndex = 0;

    while ((m = regexWordNum.exec(trimmed)) !== null) {
      const title = m[1].replace(/^[,\s;:\-_]+|[,\s;:\-_]+$/g, '').trim();
      const amount = parseFloat(m[2]);
      if (title && !isNaN(amount) && amount > 0) {
        lineMatches.push({
          title,
          amount,
          category: detectCategory(title)
        });
      }
    }

    if (lineMatches.length > 0) {
      items.push(...lineMatches);
    } else {
      const numFirst = trimmed.match(/^(\d+(?:\.\d+)?)\s+(?:for\s+|ko\s+|को\s+)?([a-zA-Z\u0900-\u097F\s\/\-_.]+)$/);
      if (numFirst) {
        const amount = parseFloat(numFirst[1]);
        const title = numFirst[2].replace(/^[,\s;:\-_]+|[,\s;:\-_]+$/g, '').trim();
        if (title && !isNaN(amount) && amount > 0) {
          items.push({
            title,
            amount,
            category: detectCategory(title)
          });
        }
      }
    }
  }

  return items;
}

export default function SmartNote({ onAddBatchExpenses, lang }) {
  const [noteText, setNoteText] = useState(() => {
    return localStorage.getItem('kharcha_smart_note_draft') || '';
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(() => getNowTime24());
  const [autoAddOnEnter, setAutoAddOnEnter] = useState(true);
  const [recentAddedMessage, setRecentAddedMessage] = useState(null);
  const textareaRef = useRef(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Save draft locally
  useEffect(() => {
    localStorage.setItem('kharcha_smart_note_draft', noteText);
  }, [noteText]);

  // Check if user typed a date inside the note (e.g. "26 sep milk 50")
  const { detectedDate } = extractInlineDateAndCleanText(noteText);
  const effectiveDate = detectedDate || selectedDate || todayStr;
  const isPastDate = effectiveDate !== todayStr;

  // Real-time parsed items
  const parsedItems = parseNoteToExpenses(noteText);
  const totalParsedAmount = parsedItems.reduce((sum, item) => sum + item.amount, 0);

  // Quick preset loader
  const handleLoadExample = (example) => {
    setNoteText(example);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Perform Add to Expenses
  const handleAutoAdd = () => {
    if (parsedItems.length === 0) return;

    const dateToUse = effectiveDate;
    const timeStr = formatTime24To12(selectedTime);

    const newExpenseObjects = parsedItems.map((item, idx) => ({
      id: `exp-note-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      amount: item.amount,
      category: item.category || 'other',
      paymentMethod,
      isExtra: item.category === 'extra',
      note: item.title,
      date: dateToUse,
      time: timeStr
    }));

    // Trigger batch add in parent (sorted strictly into chronological queue by Date & Time)
    onAddBatchExpenses(newExpenseObjects);

    // Provide feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    const itemsSummary = parsedItems.map(i => `${i.title} (रु ${i.amount})`).join(', ');
    const readableDate = formatReadableDate(dateToUse, lang);
    setRecentAddedMessage(
      lang === 'ne'
        ? `✅ ${parsedItems.length} वटा खर्च [${readableDate}, ${timeStr}] को लाइनमा (Queue) राखियो: ${itemsSummary}`
        : `✅ ${parsedItems.length} expenses queued at [${readableDate}, ${timeStr}] in history: ${itemsSummary}`
    );

    // Clear note text
    setNoteText('');
    localStorage.removeItem('kharcha_smart_note_draft');

    // Hide message after 6 seconds
    setTimeout(() => {
      setRecentAddedMessage(null);
    }, 6000);
  };

  // Handle Enter key for quick submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && autoAddOnEnter) {
      if (parsedItems.length > 0) {
        e.preventDefault();
        handleAutoAdd();
      }
    }
  };

  return (
    <section 
      id="note-section" 
      className="bg-gradient-to-br from-[#FFFDF8] via-[#FEFCF4] to-[#FBF7EC] border-2 border-amber-300/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm mb-4 sm:mb-6 transition-all relative overflow-hidden"
    >
      {/* Decorative Notepad Accent Top Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

      {/* Header of Note Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-2xs">
            <NotebookPen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Mukta',sans-serif] tracking-tight">
                Note <span className="text-xs font-bold text-amber-800">/ नोट</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 border border-amber-300">
                <Zap className="w-3 h-3 text-amber-700" />
                <span>{lang === 'ne' ? 'स्वत: हिसाब' : 'Auto-Add'}</span>
              </span>
              {isPastDate && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  📅 {lang === 'ne' ? `पुरानो मिति: ${formatReadableDate(effectiveDate, lang)}` : `Backdated Queue: ${formatReadableDate(effectiveDate, lang)}`}
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-900/80 font-medium">
              {lang === 'ne' 
                ? 'जस्तै: "milk 50 dahi 50" वा पुरानो छुटेको भए "26 sep milk 50" लेख्नुहोस् — सिधै त्यही मितिको ठाउँमा बस्नेछ।' 
                : 'e.g. Type "milk 50 dahi 50" or "26 sep milk 50" — past expenses go directly to their date & time position.'}
            </p>
          </div>
        </div>

        {/* Date, Time & Payment mode selector */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start lg:self-center">
          {/* Date Picker */}
          <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-xl px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-amber-950 focus:outline-none cursor-pointer"
              title={lang === 'ne' ? 'खर्च मिति (पुरानो छुटेको मिति छान्न मिल्छ)' : 'Expense Date (Pick past date if forgotten)'}
            />
          </div>

          {/* Time Picker */}
          <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-xl px-2 py-1">
            <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-amber-950 focus:outline-none cursor-pointer"
              title={lang === 'ne' ? 'खर्च समय' : 'Expense Time'}
            />
          </div>

          {isPastDate && (
            <button
              type="button"
              onClick={() => {
                setSelectedDate(todayStr);
                setSelectedTime(getNowTime24());
              }}
              className="px-2 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-extrabold border border-emerald-300 transition cursor-pointer"
            >
              {lang === 'ne' ? 'आज (Today)' : 'Reset Today'}
            </button>
          )}

          <div className="flex items-center bg-amber-100/70 p-1 rounded-xl border border-amber-200 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`px-2 py-0.5 rounded-lg font-bold transition text-[11px] cursor-pointer ${
                paymentMethod === 'cash' 
                  ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200' 
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              💵 {lang === 'ne' ? 'नगद' : 'Cash'}
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('fonepay')}
              className={`px-2 py-0.5 rounded-lg font-bold transition text-[11px] cursor-pointer ${
                paymentMethod === 'fonepay' 
                  ? 'bg-white text-red-800 shadow-2xs border border-red-200' 
                  : 'text-amber-900 hover:text-amber-950'
              }`}
            >
              📱 QR / Fonepay
            </button>
          </div>
        </div>
      </div>

      {/* Main Text Area with Notepad Aesthetic */}
      <div className="mt-3 relative">
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder={
            lang === 'ne'
              ? 'यहाँ आफ्नो खर्चको नोट लेख्नुहोस्...\nउदा: milk 50 dahi 50 chiya 25\nवा: \nदूध ५०\nदही ५०'
              : 'Type your daily expenses here...\ne.g. milk 50 dahi 50 chiya 25\nor:\nmilk 50\ndahi 50\npetrol 200'
          }
          className="w-full bg-white/95 border border-amber-300/80 rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-amber-900/40 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition shadow-2xs resize-none"
        />

        {noteText && (
          <button
            type="button"
            onClick={() => setNoteText('')}
            className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs transition cursor-pointer"
            title="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Clickable Quick Example Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <span className="text-[10px] font-bold text-amber-900/70">
          {lang === 'ne' ? 'नमुना हेर्नुहोस्:' : 'Quick examples:'}
        </span>
        <button
          type="button"
          onClick={() => handleLoadExample('milk 50 dahi 50')}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300/60 transition cursor-pointer active:scale-95"
        >
          🥛 milk 50 dahi 50
        </button>
        <button
          type="button"
          onClick={() => handleLoadExample('chiya 25 samosa 40')}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300/60 transition cursor-pointer active:scale-95"
        >
          ☕ chiya 25 samosa 40
        </button>
        <button
          type="button"
          onClick={() => handleLoadExample('petrol 250')}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300/60 transition cursor-pointer active:scale-95"
        >
          ⛽ petrol 250
        </button>
      </div>

      {/* Live Detected Items Preview Chips */}
      {parsedItems.length > 0 && (
        <div className="mt-3.5 p-3 rounded-xl bg-white/90 border border-amber-200 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {lang === 'ne'
                  ? `पत्ता लागेका खर्चहरू (${parsedItems.length}):`
                  : `Detected Items (${parsedItems.length}):`}
              </span>
            </span>
            <span className="text-xs font-extrabold text-emerald-800 font-['Mukta',sans-serif] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {lang === 'ne' ? 'जम्मा:' : 'Total:'} {formatNepaliCurrency(totalParsedAmount)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {parsedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-xs font-semibold text-slate-800"
              >
                <span className="font-bold text-amber-950 capitalize">{item.title}</span>
                <span className="text-emerald-700 font-bold font-['Mukta',sans-serif]">
                  {formatNepaliCurrency(item.amount)}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200/60 text-amber-900 border border-amber-300/50">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer: Auto-Add Button + Toggle */}
      <div className="mt-3.5 pt-3 border-t border-amber-200/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <label className="flex items-center gap-1.5 text-xs text-amber-900/90 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoAddOnEnter}
            onChange={(e) => setAutoAddOnEnter(e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-[11px] font-medium">
            {lang === 'ne' ? 'Enter थिच्दा सिधै थप्ने' : 'Auto-add on Enter key'}
          </span>
        </label>

        <button
          type="button"
          onClick={handleAutoAdd}
          disabled={parsedItems.length === 0}
          className={`flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
            parsedItems.length > 0
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white cursor-pointer active:scale-95 shadow-emerald-800/20'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4 shrink-0 fill-current" />
          <span>
            {parsedItems.length > 0
              ? (lang === 'ne' 
                  ? `⚡ खर्चमा स्वतः थप्नुहोस् (${parsedItems.length} वटा - रु ${totalParsedAmount})` 
                  : `⚡ Auto-Add to Expenses (${parsedItems.length} items - रु ${totalParsedAmount})`)
              : (lang === 'ne' ? 'खर्चमा थप्नुहोस्' : 'Auto-Add to Expenses')}
          </span>
        </button>
      </div>

      {/* Notification Banner when expenses are successfully added */}
      {recentAddedMessage && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{recentAddedMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setRecentAddedMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}
