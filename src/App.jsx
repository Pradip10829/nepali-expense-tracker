import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldCheck, Smartphone, Laptop, Wallet, ScrollText, FileSpreadsheet, Image as ImageIcon, HelpCircle, Settings } from 'lucide-react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import ExpenseReminderBanner from './components/ExpenseReminderBanner';
import BudgetBar from './components/BudgetBar';
import CategoryBreakdown from './components/CategoryBreakdown';
import ExpenseList from './components/ExpenseList';
import AddExpenseModal from './components/AddExpenseModal';
import SetFundsModal from './components/SetFundsModal';
import NepaliPaperModal from './components/NepaliPaperModal';
import MobileBottomNav from './components/MobileBottomNav';
import InstallPrompt from './components/InstallPrompt';
import QuickGuideModal from './components/QuickGuideModal';
import SettingsModal from './components/SettingsModal';
import { exportToExcel } from './utils/excelExporter';
import { TRANSLATIONS } from './data/nepaliData';

export default function App() {
  // Mobile active tab ('home', 'expenses', 'paper', 'settings')
  const [activeTab, setActiveTab] = useState('home');

  // Load Language Preference (defaults to Nepali 'ne')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('kharcha_lang') || 'ne';
  });

  useEffect(() => {
    localStorage.setItem('kharcha_lang', lang);
  }, [lang]);

  // Load Expenses: Completely empty clean slate (no demo items)
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('kharcha_expenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(item => !item.id || !item.id.toString().startsWith('demo-'));
      } catch (e) {
        console.error('Failed to parse saved expenses:', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('kharcha_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Total Money / Available Balance
  const [totalMoney, setTotalMoney] = useState(() => {
    const saved = localStorage.getItem('kharcha_total_money');
    return saved !== null ? Number(saved) : 25000;
  });

  const handleUpdateTotalMoney = (newVal) => {
    setTotalMoney(newVal);
    localStorage.setItem('kharcha_total_money', newVal.toString());
  };

  // Daily Budget (defaults to Rs 1,000)
  const [dailyBudget, setDailyBudget] = useState(() => {
    const saved = localStorage.getItem('kharcha_daily_budget');
    return saved ? Number(saved) : 1000;
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSetFundsOpen, setIsSetFundsOpen] = useState(false);
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  // Calculate today's total for in-modal alerts
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = expenses
    .filter(e => e.date === todayStr)
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // Add new expense
  const handleAddExpense = (newExp) => {
    setExpenses(prev => [newExp, ...prev]);
  };

  // Delete single expense
  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Clear all data
  const handleClearAll = () => {
    const msg = lang === 'ne'
      ? 'के तपाईं साँच्चै सबै खर्चहरू मेटाउन चाहनुहुन्छ? यो फिर्ता गर्न सकिँदैन।'
      : 'Are you sure you want to clear all recorded expenses? This cannot be undone.';
    if (window.confirm(msg)) {
      setExpenses([]);
      localStorage.removeItem('kharcha_expenses');
    }
  };

  // Direct Excel Export shortcut
  const handleQuickExcel = () => {
    exportToExcel({ expenses, totalMoney, dailyBudget, lang });
  };

  // Handle Mobile Bottom Nav tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'paper') {
      setIsPaperModalOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-28 sm:pb-12 text-slate-800">
      
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenPaperModal={() => setIsPaperModalOpen(true)}
        onOpenAdd={() => setIsAddModalOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Mobile Install App Prompt Banner */}
      <InstallPrompt lang={lang} />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-7 w-full grow">
        
        {/* Banner with Mobile / Web indicators */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white mb-5 sm:mb-6 shadow-md shadow-emerald-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600/70 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/20">
                {lang === 'ne' ? 'सरल र भरपर्दो' : 'Simple & Reliable'}
              </span>
              <h1 className="text-base sm:text-lg font-bold font-['Mukta',sans-serif]">
                {lang === 'ne' ? 'आफ्नो कुल रकम, दैनिक, हप्ते र मासिक खर्च नियन्त्रण' : 'Control your daily, weekly & monthly expenses'}
              </h1>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
              {lang === 'ne'
                ? 'नगद वा QR जहाँबाट खर्च भएपनि हिसाब राख्नुहोस्, र कापीको पानामा (PNG) डाउनलोड गर्नुहोस्।'
                : 'Track Cash & QR payments, set spending targets, and export as handwritten diary paper.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 px-3 py-1.5 rounded-xl font-bold text-white transition active:scale-95 cursor-pointer border border-emerald-500/30"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'कसरी चलाउने?' : 'How it works'}</span>
            </button>
            <button
              onClick={() => setIsSetFundsOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-xl font-bold text-white transition active:scale-95 cursor-pointer border border-emerald-500/40"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'रकम तोक्नुहोस्' : 'Edit Funds'}</span>
            </button>
          </div>
        </div>

        {/* Overspending & Extra Expense Reminder Banner */}
        <ExpenseReminderBanner
          expenses={expenses}
          totalMoney={totalMoney}
          dailyBudget={dailyBudget}
          lang={lang}
        />

        {/* 1. Summary Cards (Total Funds, Remaining Balance, Today, Weekly, Monthly, Extra Expenses) */}
        <StatsCards
          expenses={expenses}
          totalMoney={totalMoney}
          dailyBudget={dailyBudget}
          onOpenSetFunds={() => setIsSetFundsOpen(true)}
          lang={lang}
        />

        {/* 2. A4 School Notebook Paper & Excel Quick Bar */}
        <div className="bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/80 border border-blue-200/80 rounded-2xl p-3.5 sm:p-4 mb-5 sm:mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 shrink-0">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-blue-950 flex items-center gap-1.5">
                <span>📖 {lang === 'ne' ? 'A4 कापीको पाना (स्कुलको कापी जस्तै हिसाब)' : 'A4 School Notebook Paper & Excel'}</span>
                <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded font-bold">A4 PNG</span>
              </h4>
              <p className="text-[11px] text-blue-800 mt-0.5">
                {lang === 'ne'
                  ? 'स्कुलको कापीमा डटपेनले मिति र मार्जिनसहित लेखेको जस्तै A4 पाना PNG फोटो वा Excel मा डाउनलोड गर्नुहोस्।'
                  : 'Download authentic A4 school copy page with Date box, red margins, and blue ruled lines.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsPaperModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition active:scale-95 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'A4 कापी हेर्नुहोस् (PNG)' : 'Preview A4 Sheet'}</span>
            </button>

            <button
              onClick={handleQuickExcel}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'Excel (.xlsx)' : 'Export Excel'}</span>
            </button>
          </div>
        </div>

        {/* 3. Grid with Budget Target & Category Breakdown (Desktop side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <BudgetBar
            expenses={expenses}
            dailyBudget={dailyBudget}
            setDailyBudget={setDailyBudget}
            lang={lang}
          />
          <CategoryBreakdown expenses={expenses} lang={lang} />
        </div>

        {/* 4. Transaction Log with Live Search, Extra Filter & Add */}
        <div id="expense-list-section">
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            lang={lang}
          />
        </div>

        {/* Desktop Footer options */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'ne'
                ? 'तपाईंको वित्तीय डाटा १००% तपाईंको आफ्नै डिभाइसमा सुरक्षित रहन्छ (100% Private & Offline)'
                : 'Your financial data is saved privately on your device.'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'सेटिङ र ब्याकअप' : 'Settings'}</span>
            </button>
            {expenses.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearAllData}</span>
              </button>
            )}
          </div>
        </div>

      </main>

      {/* Floating Action Button (FAB) for Desktop screens */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-extrabold text-sm rounded-full shadow-2xl shadow-emerald-800/40 transition cursor-pointer border-2 border-white/40"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>{t.addExpense}</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAdd={() => setIsAddModalOpen(true)}
        lang={lang}
      />

      {/* Add Expense Modal Drawer */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExpense={handleAddExpense}
        lang={lang}
        todayTotal={todayTotal}
        dailyBudget={dailyBudget}
      />

      {/* Set Funds / Total Money Modal */}
      <SetFundsModal
        isOpen={isSetFundsOpen}
        onClose={() => setIsSetFundsOpen(false)}
        totalMoney={totalMoney}
        onUpdateTotalMoney={handleUpdateTotalMoney}
        lang={lang}
      />

      {/* Handwritten Diary Receipt & PNG / Excel Export Modal */}
      <NepaliPaperModal
        isOpen={isPaperModalOpen}
        onClose={() => {
          setIsPaperModalOpen(false);
          setActiveTab('home');
        }}
        expenses={expenses}
        totalMoney={totalMoney}
        dailyBudget={dailyBudget}
        lang={lang}
      />

      {/* 3-Step Quick Guide Modal */}
      <QuickGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        lang={lang}
      />

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setActiveTab('home');
        }}
        totalMoney={totalMoney}
        onOpenSetFunds={() => setIsSetFundsOpen(true)}
        dailyBudget={dailyBudget}
        setDailyBudget={setDailyBudget}
        expenses={expenses}
        setExpenses={setExpenses}
        onClearAll={handleClearAll}
        lang={lang}
        setLang={setLang}
      />

    </div>
  );
}
