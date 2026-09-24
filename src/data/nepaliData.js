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

// Clean start: ZERO example/dummy expenses as requested by user
export const INITIAL_EXPENSES = [];

// Helper to generate 100 realistic Nepali transactions for testing 100-item download
export function generate100SampleExpenses() {
  const sampleItems = [
    { note: 'बिहानी चिया र पाउरोटी', cat: 'snacks', pm: 'fonepay', min: 40, max: 90 },
    { note: 'दैनिक तरकारी र आलु', cat: 'groceries', pm: 'cash', min: 100, max: 280 },
    { note: 'बस भाडा / माइक्रो भाडा', cat: 'transport', pm: 'cash', min: 25, max: 50 },
    { note: 'एनसेल / नमस्ते रिचार्ज', cat: 'recharge', pm: 'esewa', min: 50, max: 200 },
    { note: 'दिउँसोको खाजा मोमो र कोक', cat: 'snacks', pm: 'fonepay', min: 150, max: 320 },
    { note: 'बाइक पेट्रोल पम्प', cat: 'transport', pm: 'fonepay', min: 250, max: 600 },
    { note: 'डेरी दुध र दही', cat: 'groceries', pm: 'cash', min: 65, max: 160 },
    { note: 'औषधि पसल (सिटामोल / भिटामिन)', cat: 'medical', pm: 'fonepay', min: 80, max: 400 },
    { note: 'किराना सामान (दाल, चामल, तेल)', cat: 'groceries', pm: 'fonepay', min: 350, max: 1200 },
    { note: 'साथीसँग कफी', cat: 'snacks', pm: 'fonepay', min: 120, max: 260 },
    { note: 'अतिरिक्त फजुल खर्च', cat: 'extra', pm: 'fonepay', min: 180, max: 650, isExtra: true },
    { note: 'बिजुली र इन्टरनेट महशुल', cat: 'rent', pm: 'esewa', min: 600, max: 1600 },
    { note: 'कपडा धुने सर्फ र साबुन', cat: 'shopping', pm: 'cash', min: 110, max: 260 },
    { note: 'फलफूल (केरा, स्याउ)', cat: 'groceries', pm: 'cash', min: 130, max: 350 },
  ];

  const now = new Date();
  const list = [];

  for (let i = 0; i < 100; i++) {
    const template = sampleItems[i % sampleItems.length];
    // Spread dates over the last 14 days
    const dayOffset = Math.floor(i / 8);
    const dateObj = new Date(now.getTime() - dayOffset * 86400000);
    const dateStr = dateObj.toISOString().split('T')[0];

    // Hour and minute
    const hour = (7 + (i % 14)); // 7 AM to 9 PM
    const minute = (i * 9) % 60;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    const timeStr = `${String(h12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;

    const amount = Math.floor(Math.random() * (template.max - template.min) / 10) * 10 + template.min;

    list.push({
      id: `exp-${Date.now()}-${i}`,
      note: `${template.note} #${i + 1}`,
      category: template.cat,
      paymentMethod: template.pm,
      isExtra: !!template.isExtra,
      amount,
      date: dateStr,
      time: timeStr
    });
  }

  return list;
}

