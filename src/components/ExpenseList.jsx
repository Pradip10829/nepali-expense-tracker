import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Filter, 
  ReceiptText, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CalendarDays, 
  History, 
  ChevronDown, 
  ChevronUp,
  Banknote,
  QrCode
} from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS, formatNepaliCurrency, TRANSLATIONS } from '../data/nepaliData';
import CategoryIcon from './CategoryIcon';

// Helper to get YYYY-MM for N months ago
function getYearMonthOffset(monthsAgo) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - monthsAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

// Helper to format YYYY-MM into readable Month Year (e.g. "September 2026 / सेप्टेम्बर २०२६")
function formatYearMonthLabel(ym, lang = 'ne') {
  if (!ym || !ym.includes('-')) return ym;
  const [year, month] = ym.split('-').map(Number);
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthsNe = [
    'जनवरी (माघ)', 'फेब्रुअरी (फागुन)', 'मार्च (चैत)', 'अप्रिल (बैशाख)', 'मे (जेठ)', 'जुन (असार)',
    'जुलाई (साउन)', 'अगस्ट (भदौ)', 'सेप्टेम्बर (असोज)', 'अक्टोबर (कात्तिक)', 'नोभेम्बर (मंसिर)', 'डिसेम्बर (पुस)'
  ];
  const idx = (month - 1) % 12;
  return lang === 'ne' ? `${monthsNe[idx]} ${year}` : `${monthsEn[idx]} ${year}`;
}

export default function ExpenseList({ expenses, onDeleteExpense, lang }) {
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [onlyExtra, setOnlyExtra] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  // Time / Month Filter State
  // Options: 'all', 'today', '0m' (this month), '1m' (1 month ago), '2m' (2 months ago), 
  // '3m' (3 months ago), '6m' (6 months ago), '12m' (1 year ago month), 'last_year' (full year), or 'custom'
  const [timeFilter, setTimeFilter] = useState('all');
  const [customMonth, setCustomMonth] = useState(''); // 'YYYY-MM'
  const [showMonthlyArchive, setShowMonthlyArchive] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();

  // Group all recorded expenses by Month (YYYY-MM) for the Monthly Archive Explorer
  const monthlyArchiveGroups = useMemo(() => {
    const groups = {};
    expenses.forEach(item => {
      if (!item.date) return;
      const ym = item.date.slice(0, 7); // 'YYYY-MM'
      if (!groups[ym]) {
        groups[ym] = {
          ym,
          total: 0,
          count: 0,
          cash: 0,
          digital: 0
        };
      }
      const amt = Number(item.amount) || 0;
      groups[ym].total += amt;
      groups[ym].count += 1;
      if (item.paymentMethod === 'cash') {
        groups[ym].cash += amt;
      } else {
        groups[ym].digital += amt;
      }
    });
    // Sort newest month first
    return Object.values(groups).sort((a, b) => b.ym.localeCompare(a.ym));
  }, [expenses]);

  // Compute target YYYY-MM or date condition based on active timeFilter
  const activeYearMonth = useMemo(() => {
    if (timeFilter === '0m') return getYearMonthOffset(0);
    if (timeFilter === '1m') return getYearMonthOffset(1);
    if (timeFilter === '2m') return getYearMonthOffset(2);
    if (timeFilter === '3m') return getYearMonthOffset(3);
    if (timeFilter === '6m') return getYearMonthOffset(6);
    if (timeFilter === '12m') return getYearMonthOffset(12);
    if (timeFilter === 'custom') return customMonth;
    return null;
  }, [timeFilter, customMonth]);

  // Filter transactions
  const filteredExpenses = expenses.filter(item => {
    // 1. Time / Month match
    let matchesTime = true;
    if (timeFilter === 'today') {
      matchesTime = item.date === todayStr;
    } else if (timeFilter === 'this_year') {
      matchesTime = item.date && item.date.startsWith(`${currentYear}-`);
    } else if (timeFilter === 'last_year') {
      matchesTime = item.date && item.date.startsWith(`${currentYear - 1}-`);
    } else if (activeYearMonth) {
      matchesTime = item.date && item.date.startsWith(activeYearMonth);
    }

    // 2. Search match
    const matchesSearch = (item.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.toString().includes(searchTerm) ||
      (item.date || '').includes(searchTerm);

    // 3. Category match
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // 4. Payment method match
    const matchesMethod = selectedMethod === 'all' || item.paymentMethod === selectedMethod;

    // 5. Only extra match
    const matchesExtra = !onlyExtra || (item.isExtra || item.category === 'extra');

    return matchesTime && matchesSearch && matchesCategory && matchesMethod && matchesExtra;
  });

  // Calculate stats for currently filtered expenses
  const filteredTotalAmount = filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const filteredCashAmount = filteredExpenses
    .filter(e => e.paymentMethod === 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const filteredDigitalAmount = filteredExpenses
    .filter(e => e.paymentMethod !== 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const getCategoryDetails = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[CATEGORIES.length - 1];
  };

  const getPaymentDetails = (methodId) => {
    return PAYMENT_METHODS.find(p => p.id === methodId) || PAYMENT_METHODS[0];
  };

  const TIME_PRESETS = [
    { id: 'all', labelNe: 'सबै समय (All)', labelEn: 'All Time' },
    { id: 'today', labelNe: 'आज (Today)', labelEn: 'Today' },
    { id: '0m', labelNe: 'यो महिना (This Month)', labelEn: 'This Month' },
    { id: '1m', labelNe: '१ महिना अघि (1M Ago)', labelEn: '1 Month Ago' },
    { id: '2m', labelNe: '२ महिना अघि (2M Ago)', labelEn: '2 Months Ago' },
    { id: '3m', labelNe: '३ महिना अघि (3M Ago)', labelEn: '3 Months Ago' },
    { id: '6m', labelNe: '६ महिना अघि (6M Ago)', labelEn: '6 Months Ago' },
    { id: '12m', labelNe: '१ वर्ष अघि (1Y Ago)', labelEn: '1 Year Ago' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
      
      {/* Header & Search */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ReceiptText className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {t.recentTransactions}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredExpenses.length}
            </span>

            {/* Toggle All-Months Archive Button */}
            <button
              type="button"
              onClick={() => setShowMonthlyArchive(!showMonthlyArchive)}
              className={`ml-1 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                showMonthlyArchive
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'महिना अनुसार रिपोर्ट' : 'Monthly Archive'}</span>
              {showMonthlyArchive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Collapsible All-Months Archive Grid */}
        {showMonthlyArchive && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-700" />
                <span>
                  {lang === 'ne' 
                    ? 'सबै महिनाहरूको खर्च अभिलेख (जुनुसुकै महिनामा क्लिक गर्नुहोस्)' 
                    : 'All Recorded Months Archive (Click any month to view)'}
                </span>
              </h4>
              {timeFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => {
                    setTimeFilter('all');
                    setCustomMonth('');
                  }}
                  className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {lang === 'ne' ? 'सबै देखाउनुहोस्' : 'Reset to All'}
                </button>
              )}
            </div>

            {monthlyArchiveGroups.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">
                {lang === 'ne' ? 'अहिलेसम्म कुनै खर्च रेकर्ड गरिएको छैन।' : 'No monthly records found yet.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {monthlyArchiveGroups.map(group => {
                  const isSelected = activeYearMonth === group.ym;
                  return (
                    <button
                      key={group.ym}
                      type="button"
                      onClick={() => {
                        setCustomMonth(group.ym);
                        setTimeFilter('custom');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white hover:bg-emerald-50/60 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[11px] font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {formatYearMonthLabel(group.ym, lang)}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {group.count} {lang === 'ne' ? 'वटा' : 'items'}
                        </span>
                      </div>
                      <div className={`text-sm sm:text-base font-black mt-1 font-['Mukta',sans-serif] ${
                        isSelected ? 'text-emerald-100' : 'text-emerald-700'
                      }`}>
                        {formatNepaliCurrency(group.total)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Time / Month Quick Filter Bar (1M Ago, 2M Ago, 3M Ago, 1Y Ago + Calendar Month Picker) */}
        <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'ne' ? 'महिना / समय अनुसार हेर्नुहोस्:' : 'View by Month / Time:'}</span>
            </span>

            {/* Direct Month-Year Calendar Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-slate-500">
                {lang === 'ne' ? 'महिना रोज्नुहोस्:' : 'Pick Month:'}
              </span>
              <input
                type="month"
                value={activeYearMonth || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setCustomMonth(e.target.value);
                    setTimeFilter('custom');
                  } else {
                    setTimeFilter('all');
                    setCustomMonth('');
                  }
                }}
                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Preset Time Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-smooth no-scrollbar">
            {TIME_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setTimeFilter(preset.id);
                  if (preset.id !== 'custom') setCustomMonth('');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                  timeFilter === preset.id
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                {lang === 'ne' ? preset.labelNe : preset.labelEn}
              </button>
            ))}
          </div>

          {/* Active Month / Period Summary Strip */}
          {(timeFilter !== 'all' || selectedCategory !== 'all' || onlyExtra || searchTerm) && (
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">
                  {activeYearMonth 
                    ? `📅 ${formatYearMonthLabel(activeYearMonth, lang)}` 
                    : timeFilter === 'today' 
                    ? (lang === 'ne' ? '📅 आजको खर्च' : "📅 Today's Expenses")
                    : (lang === 'ne' ? '📊 छानिएको विवरण' : '📊 Filtered Summary')}:
                </span>
                <span className="font-black text-emerald-800 text-sm font-['Mukta',sans-serif] bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {formatNepaliCurrency(filteredTotalAmount)}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'ne' ? 'नगद:' : 'Cash:'} <b>{formatNepaliCurrency(filteredCashAmount)}</b>
                </span>
                <span className="flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  {lang === 'ne' ? 'QR/डिजिटल:' : 'Digital:'} <b>{formatNepaliCurrency(filteredDigitalAmount)}</b>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto pb-1 scroll-smooth no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3 shrink-0" />
            {t.filterBy}:
          </span>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setOnlyExtra(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedCategory === 'all' && !onlyExtra
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.all}
          </button>

          {/* Filter for Extra Expenses */}
          <button
            onClick={() => setOnlyExtra(!onlyExtra)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
              onlyExtra
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>{lang === 'ne' ? 'अतिरिक्त खर्च मात्र' : 'Extra Only'}</span>
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id);
                setOnlyExtra(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                selectedCategory === cat.id && !onlyExtra
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CategoryIcon iconName={cat.icon} className="w-3 h-3" />
              <span>{lang === 'ne' ? cat.nameNe : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className={`divide-y divide-slate-100 ${showAllRows ? 'max-h-none' : 'max-h-[600px]'} overflow-y-auto`}>
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
              <ReceiptText className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              {activeYearMonth
                ? (lang === 'ne' 
                    ? `${formatYearMonthLabel(activeYearMonth, lang)} मा कुनै खर्च भेटिएन।` 
                    : `No expenses recorded in ${formatYearMonthLabel(activeYearMonth, lang)}.`)
                : t.noExpenses}
            </p>
            {timeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  setTimeFilter('all');
                  setCustomMonth('');
                }}
                className="mt-3 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
              >
                {lang === 'ne' ? 'सबै समयको खर्च हेर्नुहोस्' : 'Show All Time Expenses'}
              </button>
            )}
          </div>
        ) : (
          filteredExpenses.map((item) => {
            const cat = getCategoryDetails(item.category);
            const pm = getPaymentDetails(item.paymentMethod);
            const isItemExtra = item.isExtra || item.category === 'extra';

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 hover:bg-emerald-50/30 transition flex items-center justify-between gap-3 group ${
                  isItemExtra ? 'bg-rose-50/20' : ''
                }`}
              >
                {/* Left: Category Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${cat.color}`}>
                    <CategoryIcon iconName={cat.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.note}
                      </p>
                      {isItemExtra && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-0.5 shrink-0">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {lang === 'ne' ? 'अतिरिक्त' : 'Extra'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                      {/* Date Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                        <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.date}</span>
                      </span>

                      {/* Time Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.time || '12:00 PM'}</span>
                      </span>

                      {/* Payment method badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pm.badge}`}>
                        {lang === 'ne' ? pm.nameNe : pm.nameEn}
                      </span>

                      {/* Category tag */}
                      <span className="hidden sm:inline-block text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {lang === 'ne' ? cat.nameNe : cat.nameEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete Button */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`font-extrabold text-sm sm:text-base ${
                      isItemExtra ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      -{formatNepaliCurrency(item.amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(t.deleteConfirm)) {
                        onDeleteExpense(item.id);
                      }
                    }}
                    title="हटाउनुहोस् / Delete"
                    className="p-2 sm:p-1.5 rounded-lg text-slate-400 sm:text-slate-300 hover:text-rose-600 hover:bg-rose-50 active:scale-90 transition cursor-pointer opacity-100 sm:opacity-70 sm:group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show All / Collapse Button for 100+ items */}
      {filteredExpenses.length > 8 && (
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => setShowAllRows(!showAllRows)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 transition cursor-pointer"
          >
            {showAllRows
              ? (lang === 'ne' ? 'छोटो सूची देखाउनुहोस् (Collapse)' : 'Show Less')
              : (lang === 'ne' ? `सबै ${filteredExpenses.length} वटा कारोबार देखाउनुहोस् (Show All ${filteredExpenses.length})` : `Show All ${filteredExpenses.length} Transactions`)}
          </button>
        </div>
      )}

    </div>
  );
}
