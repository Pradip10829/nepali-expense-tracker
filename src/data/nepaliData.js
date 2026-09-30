// Nepali Expense Tracker Constants and Helpers

export const CATEGORIES = [
  { id: 'snacks', nameEn: 'Tea & Snacks', nameNe: 'खाजा / चिया', icon: 'Coffee', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'groceries', nameEn: 'Groceries & Veg', nameNe: 'तरकारी / किराना', icon: 'ShoppingBag', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'rent', nameEn: 'Rent & Utilities', nameNe: 'भाडा / बिजुली / पानी', icon: 'Home', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'transport', nameEn: 'Transport & Fuel', nameNe: 'गाडी भाडा / पेट्रोल', icon: 'Car', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'recharge', nameEn: 'Mobile & Internet', nameNe: 'रिचार्ज / इन्टरनेट', icon: 'Smartphone', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'medical', nameEn: 'Health & Medical', nameNe: 'औषधि / उपचार', icon: 'HeartPulse', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'lending', nameEn: 'Lent / Borrowed', nameNe: 'सापटी / उधारो', icon: 'HandCoins', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 'shopping', nameEn: 'Shopping & Clothes', nameNe: 'किनमेल / कपडा', icon: 'Tag', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { id: 'extra', nameEn: 'Extra / Unplanned', nameNe: 'अतिरिक्त / फजुल खर्च', icon: 'AlertTriangle', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'other', nameEn: 'Other Expense', nameNe: 'अन्य खर्च', icon: 'MoreHorizontal', color: 'bg-slate-100 text-slate-800 border-slate-200' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', nameEn: 'Cash', nameNe: 'नगद', badge: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { id: 'fonepay', nameEn: 'Fonepay QR', nameNe: 'Fonepay QR', badge: 'bg-red-50 text-red-700 border-red-300' },
  { id: 'esewa', nameEn: 'eSewa', nameNe: 'eSewa', badge: 'bg-green-50 text-green-700 border-green-300' },
  { id: 'khalti', nameEn: 'Khalti', nameNe: 'Khalti', badge: 'bg-purple-50 text-purple-700 border-purple-300' },
  { id: 'bank', nameEn: 'Bank / MoBank', nameNe: 'मोबाइल बैंकिङ', badge: 'bg-blue-50 text-blue-700 border-blue-300' },
];

export const TRANSLATIONS = {
  en: {
    appTitle: 'KharchaKitab',
    tagline: 'Simple Daily Expense Tracker for Nepal',
    totalMoney: 'Total Funds / Budget',
    remainingBalance: 'Remaining Balance',
    todaySpend: "Today's Expense",
    weeklySpend: 'This Week',
    monthlySpend: 'This Month',
    cashSpent: 'Cash (नगद)',
    digitalSpent: 'Digital (QR/Wallet)',
    addExpense: 'Add Expense',
    setTotalMoney: 'Set Total Funds',
    addMoney: '+ Add Money',
    recentTransactions: 'Transaction History',
    allExpenses: 'All Expenses',
    filterBy: 'Filter by',
    all: 'All',
    category: 'Category',
    paymentMethod: 'Payment Mode',
    amount: 'Amount (रु)',
    note: 'Remarks / Details',
    saveExpense: 'Save Expense',
    cancel: 'Cancel',
    noExpenses: 'No expenses recorded yet. Tap "+ Add Expense" to start!',
    dailyBudget: 'Daily Budget Limit',
    weeklyBudget: 'Weekly Budget Limit',
    monthlyBudget: 'Monthly Budget Limit',
    budgetUsed: 'used of',
    overBudget: 'Over budget today!',
    exportData: 'Export (Excel/CSV)',
    quickAmounts: 'Quick Amount',
    enterAmountPlaceholder: 'e.g. 150',
    remarksPlaceholder: 'e.g. Morning Tea & Samosa',
    deleteConfirm: 'Are you sure you want to delete this expense?',
    searchPlaceholder: 'Search expenses...',
    topCategories: 'Highest Spending Categories',
    totalEntries: 'Entries',
    extraExpenseFlag: 'Mark as Extra / Unplanned Expense',
    extraExpenseWarningTitle: '⚠️ Extra Expense Alert!',
    extraExpenseWarningDesc: 'You have recorded extra/unplanned expenses. Review them to keep your savings intact.',
    budgetWarningTitle: '🚨 Overspending Reminder!',
    budgetWarningDesc: 'Your spending has exceeded your target budget limit. Please cut down non-essential expenses.',
    lowBalanceWarning: '⚠️ Warning: Your remaining funds are running critically low!',
    clearAllData: 'Clear All Data',
  },
  ne: {
    appTitle: 'खर्च-किताब',
    tagline: 'दैनिक खर्च नियन्त्रण र हिसाब-किताब',
    totalMoney: 'कुल जम्मा रकम / तलब',
    remainingBalance: 'बाँकी बचत रकम',
    todaySpend: 'आजको खर्च',
    weeklySpend: 'यो हप्ताको खर्च',
    monthlySpend: 'यस महिनाको खर्च',
    cashSpent: 'नगद भुक्तानी',
    digitalSpent: 'डिजिटल (QR / वालेट)',
    addExpense: 'खर्च थप्नुहोस्',
    setTotalMoney: 'कुल रकम तोक्नुहोस्',
    addMoney: '+ रकम थप्नुहोस्',
    recentTransactions: 'खर्च विवरण इतिहास',
    allExpenses: 'सबै खर्च सूची',
    filterBy: 'छान्नुहोस्',
    all: 'सबै',
    category: 'वर्ग (Category)',
    paymentMethod: 'भुक्तानी माध्यम',
    amount: 'रकम (रु)',
    note: 'कैफियत / विवरण',
    saveExpense: 'खर्च सेभ गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    noExpenses: 'अहिले कुनै पनि खर्च छैन। नयाँ खर्च थप्न "+ खर्च थप्नुहोस्" दबाउनुहोस्!',
    dailyBudget: 'दैनिक बजेट सीमा',
    weeklyBudget: 'हप्ते बजेट सीमा',
    monthlyBudget: 'मासिक बजेट सीमा',
    budgetUsed: 'खर्च भयो / कुल सीमा',
    overBudget: 'सावधान: आजको बजेट सीमा नाघ्यो!',
    exportData: 'डाटा डाउनलोड (CSV)',
    quickAmounts: 'छिटो रकम छान्नुहोस्',
    enterAmountPlaceholder: 'जस्तै: १५०',
    remarksPlaceholder: 'जस्तै: बिहानी चिया र समोसा',
    deleteConfirm: 'के तपाईं यो खर्च हटाउन चाहनुहुन्छ?',
    searchPlaceholder: 'खर्च खोज्नुहोस्...',
    topCategories: 'बढी खर्च भएका शीर्षकहरू',
    totalEntries: 'कुल कारोबार',
    extraExpenseFlag: 'यसलाई अतिरिक्त / फजुल खर्चको रूपमा चिन्नुहोस्',
    extraExpenseWarningTitle: '⚠️ अतिरिक्त खर्चको सचेत सन्देश (Reminder)',
    extraExpenseWarningDesc: 'तपाईंले अनावश्यक वा अतिरिक्त खर्च गर्नुभएको छ। पैसा बचत गर्न यस्ता खर्च नियन्त्रण गर्नुहोस्।',
    budgetWarningTitle: '🚨 बजेट सीमा नाघेको चेतावनी!',
    budgetWarningDesc: 'तपाईंको खर्च तोकिएको बजेट सीमाभन्दा बढी भएको छ। अनावश्यक खर्च रोक्नुहोस्।',
    lowBalanceWarning: '⚠️ चेतावनी: तपाईंको बाँकी बचत रकम धेरै कम भएको छ!',
    clearAllData: 'सबै डाटा मेटाउनुहोस्',
  }
};

// Nepali Currency Formatter (e.g. रु 1,50,000)
export function formatNepaliCurrency(amount) {
  if (isNaN(amount) || amount === null) return 'रु ०';
  const num = Math.round(Number(amount));
  
  // Format with South Asian comma pattern (Lakhs/Crores)
  const numStr = Math.abs(num).toString();
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return `रु ${num < 0 ? '-' : ''}${formatted}`;
}

// Clean start: ZERO example/dummy expenses as requested by user - ONLY user added data
export const INITIAL_EXPENSES = [];

// Convert time string ("02:30 PM", "2:30\u202FPM", "14:30") into minutes since midnight (0 - 1439) for exact chronological sorting
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  // Normalize any special unicode spaces and trim
  const clean = timeStr.toString().replace(/[\u202F\u00A0]/g, ' ').trim().toUpperCase();
  const match = clean.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// Convert 12h time ("02:30 PM") to 24h ("14:30") for <input type="time" />
export function time12To24(timeStr) {
  if (!timeStr) return '12:00';
  const totalMins = timeToMinutes(timeStr);
  const h = String(Math.floor(totalMins / 60)).padStart(2, '0');
  const m = String(totalMins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// Convert 24h time ("14:30") to 12h ("02:30 PM")
export function formatTime24To12(time24) {
  if (!time24) {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/[\u202F\u00A0]/g, ' ');
  }
  if (time24.toUpperCase().includes('AM') || time24.toUpperCase().includes('PM')) {
    return time24.replace(/[\u202F\u00A0]/g, ' ').trim();
  }
  const parts = time24.split(':');
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${minutes} ${ampm}`;
  }
  return time24;
}

// Format YYYY-MM-DD into a human-friendly label like "26 September 2026"
export function formatReadableDate(dateStr, lang = 'ne') {
  if (!dateStr || !dateStr.includes('-')) return dateStr || '';
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;

  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'September', 'Oct', 'Nov', 'Dec'];
  const monthsFullEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthsNe = ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'];

  const idx = (m - 1) % 12;
  const baseLabel = lang === 'ne'
    ? `${d} ${monthsNe[idx]} ${y}`
    : `${d} ${monthsFullEn[idx]} ${y}`;

  if (dateStr === todayStr) {
    return lang === 'ne' ? `आज (${baseLabel})` : `Today (${baseLabel})`;
  }
  if (dateStr === yesterdayStr) {
    return lang === 'ne' ? `हिजो (${baseLabel})` : `Yesterday (${baseLabel})`;
  }
  return baseLabel;
}

// Sort expenses strictly by Date (Newest Date first) and Time (Newest Time within that Date first)
// So if today is Sep 30 and user adds a forgotten expense for Sep 26, it automatically goes to Sep 26's exact chronological position in history, never at the top!
export function sortExpensesByDateTime(expenses = []) {
  if (!Array.isArray(expenses)) return [];
  return [...expenses].sort((a, b) => {
    const dateA = (a.date || '').trim();
    const dateB = (b.date || '').trim();
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA); // Newer date first (e.g. 2026-09-30 before 2026-09-26)
    }
    const minA = timeToMinutes(a.time);
    const minB = timeToMinutes(b.time);
    if (minA !== minB) {
      return minB - minA; // Later time in that day first
    }
    return 0;
  });
}

