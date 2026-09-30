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
  Tag, 
  Check, 
  HelpCircle,
  X
} from 'lucide-react';
import { formatNepaliCurrency, CATEGORIES, PAYMENT_METHODS } from '../data/nepaliData';

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

// Convert Nepali Devanagari numerals to standard numbers
function parseNepaliNumber(str) {
  const nepaliDigits = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
  const normalized = str.replace(/[०-९]/g, d => nepaliDigits[d] || d);
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

// Smart Parser: Extracts items and amounts from text
// Examples supported:
// - "milk 50 dahi 50"
// - "milk 50\ndahi 50"
// - "milk 50, dahi 50, sugar 100"
// - "दूध ५० दही ५०"
// - "50 milk 50 dahi"
export function parseNoteToExpenses(rawText) {
  if (!rawText || !rawText.trim()) return [];

  // 1. Convert Nepali digits to standard digits
  const nepaliDigits = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
  let normalized = rawText.replace(/[०-९]/g, d => nepaliDigits[d] || d);

  // 2. Remove currency symbols like Rs, Rs., रु, रू, etc.
  normalized = normalized.replace(/रु\.?|Rs\.?|रू/gi, ' ');

  const items = [];
  
  // Strategy: parse line by line or split by commas/semicolons
  const lines = normalized.split(/[\n,;]+/);
  
  // Regex to match "item_name amount"
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
      // Check if number was written first: e.g. "50 milk" or "50 for milk"
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
  const [autoAddOnEnter, setAutoAddOnEnter] = useState(true);
  const [recentAddedMessage, setRecentAddedMessage] = useState(null);
  const textareaRef = useRef(null);

  // Save draft locally
  useEffect(() => {
    localStorage.setItem('kharcha_smart_note_draft', noteText);
  }, [noteText]);

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

    const now = new Date();
    const dateToUse = selectedDate || now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

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

    // Trigger batch add in parent
    onAddBatchExpenses(newExpenseObjects);

    // Provide feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }

    const itemsSummary = parsedItems.map(i => `${i.title} (रु ${i.amount})`).join(', ');
    setRecentAddedMessage(
      lang === 'ne'
        ? `✅ ${parsedItems.length} वटा खर्च थपियो (${dateToUse}): ${itemsSummary}`
        : `✅ ${parsedItems.length} expenses added (${dateToUse}): ${itemsSummary}`
    );

    // Clear note text
    setNoteText('');
    localStorage.removeItem('kharcha_smart_note_draft');

    // Hide message after 5 seconds
    setTimeout(() => {
      setRecentAddedMessage(null);
    }, 5000);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-2xs">
            <NotebookPen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-amber-950 font-['Mukta',sans-serif] tracking-tight">
                Note <span className="text-xs font-bold text-amber-800">/ नोट</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 border border-amber-300">
                <Zap className="w-3 h-3 text-amber-700" />
                <span>{lang === 'ne' ? 'स्वत: हिसाब' : 'Auto-Add'}</span>
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80 font-medium">
              {lang === 'ne' 
                ? 'जस्तै: "milk 50 dahi 50" लेख्नुहोस्, तुरुन्तै हिसाब जोडिएर खर्चमा थपिनेछ।' 
                : 'e.g. Type "milk 50 dahi 50" or line by line to automatically record expenses.'}
            </p>
          </div>
        </div>

        {/* Date & Payment mode selector */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 bg-white border border-amber-300 rounded-xl text-[11px] font-bold text-amber-950 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            title={lang === 'ne' ? 'खर्च मिति' : 'Expense Date'}
          />

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
