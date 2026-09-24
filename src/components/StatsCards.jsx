import React from 'react';
import { 
  Wallet, 
  PiggyBank, 
  Calendar, 
  CalendarDays, 
  TrendingDown, 
  AlertTriangle, 
  PlusCircle, 
  Banknote, 
  QrCode,
  Flame
} from 'lucide-react';
import { formatNepaliCurrency, TRANSLATIONS } from '../data/nepaliData';

export default function StatsCards({ expenses, totalMoney, dailyBudget = 1000, onOpenSetFunds, lang }) {
  const t = TRANSLATIONS[lang];
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Today's Expenses
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const todayTotal = todayExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  // Accurate Today's Extra Expense (e.g. Spent 1100 with 1000 budget = 100 extra)
  const todayExtra = Math.max(0, todayTotal - dailyBudget);

  // 2. Weekly Expenses (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const weeklyExpenses = expenses.filter(e => e.date >= sevenDaysAgoStr && e.date <= todayStr);
  const weeklyTotal = weeklyExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  // 3. Monthly Expenses (current month)
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  // 4. Total All-time Expenses
  const totalAllExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  // 5. Remaining Balance
  const remainingBalance = totalMoney - totalAllExpenses;
  const isBalanceLow = remainingBalance < (totalMoney * 0.15) && totalMoney > 0;
  const isBalanceNegative = remainingBalance < 0;

  // 6. Accurate Cumulative Extra Expenses across all days
  // If user spent 1100 with budget 1000 on day A -> 100 extra.
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

  // Display extra: prioritize today's extra if today is active, else cumulative
  const displayExtra = todayExtra > 0 ? todayExtra : cumulativeExtra;

  // 7. Cash vs Digital
  const cashTotal = expenses
    .filter(e => e.paymentMethod === 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const digitalTotal = expenses
    .filter(e => e.paymentMethod !== 'cash')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="space-y-3 sm:space-y-4 mb-6">
      
      {/* Top Banner Cards: Total Funds & Remaining Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        
        {/* Total Funds Card */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-5 text-white shadow-lg shadow-emerald-800/20 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs text-emerald-200">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                {t.totalMoney}
              </span>
            </div>
            <button
              onClick={onOpenSetFunds}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'रकम तोक्नुहोस् / थप्नुहोस्' : 'Set / Add Funds'}</span>
            </button>
          </div>

          <div className="my-3">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formatNepaliCurrency(totalMoney)}
            </div>
            <p className="text-xs text-emerald-100/80 mt-1">
              {lang === 'ne' ? 'तपाईंको कुल उपलब्ध बजेट वा आम्दानी' : 'Total available budget or salary'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100">
            <span>{lang === 'ne' ? 'कुल खर्च भएको:' : 'Total Spent:'}</span>
            <span className="font-bold">{formatNepaliCurrency(totalAllExpenses)}</span>
          </div>
        </div>

        {/* Remaining Balance Card */}
        <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
          isBalanceNegative
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : isBalanceLow
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-white border-emerald-100 text-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${
                isBalanceNegative ? 'bg-rose-200 text-rose-800' : isBalanceLow ? 'bg-amber-200 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <PiggyBank className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.remainingBalance}
              </span>
            </div>
            {(isBalanceNegative || isBalanceLow) && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isBalanceNegative ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
              }`}>
                <AlertTriangle className="w-3 h-3" />
                {isBalanceNegative ? (lang === 'ne' ? 'ऋणमा / सीमा नाघ्यो' : 'Deficit') : (lang === 'ne' ? 'बचत धेरै कम' : 'Low Funds')}
              </span>
            )}
          </div>

          <div className="my-3">
            <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isBalanceNegative ? 'text-rose-600' : isBalanceLow ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              {formatNepaliCurrency(remainingBalance)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isBalanceNegative
                ? (lang === 'ne' ? '⚠️ बजेटभन्दा बढी खर्च भयो!' : '⚠️ Overspent beyond total funds!')
                : (lang === 'ne' ? 'अहिले हातमा र खातामा बाँकी रकम' : 'Safe to spend remaining funds')}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{lang === 'ne' ? 'नगद vs डिजिटल खर्च:' : 'Cash vs Digital:'}</span>
            <span className="font-semibold text-slate-700">
              {formatNepaliCurrency(cashTotal)} (नगद) / {formatNepaliCurrency(digitalTotal)} (QR)
            </span>
          </div>
        </div>

      </div>

      {/* 4 Periodic & Extra Expense Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Today's Expense */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">{t.todaySpend}</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {formatNepaliCurrency(todayTotal)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {todayExpenses.length} {lang === 'ne' ? 'कारोबार' : 'items today'}
          </div>
        </div>

        {/* 2. Weekly Expense */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">{t.weeklySpend}</span>
            <span className="p-1 rounded-md bg-teal-50 text-teal-700">
              <CalendarDays className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {formatNepaliCurrency(weeklyTotal)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {weeklyExpenses.length} {lang === 'ne' ? 'कारोबार (पछिल्लो ७ दिन)' : 'items (last 7 days)'}
          </div>
        </div>

        {/* 3. Monthly Expense */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">{t.monthlySpend}</span>
            <span className="p-1 rounded-md bg-blue-50 text-blue-700">
              <TrendingDown className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {formatNepaliCurrency(monthlyTotal)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {monthlyExpenses.length} {lang === 'ne' ? 'कारोबार (यस महिना)' : 'items this month'}
          </div>
        </div>

        {/* 4. Extra Expense (Accurate: If budget 1000 & spent 1100 -> Extra = 100) */}
        <div className={`rounded-2xl p-4 border transition-all ${
          displayExtra > 0 ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200' : 'bg-white border-emerald-100'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <span>{lang === 'ne' ? 'अतिरिक्त खर्च' : 'Extra Expense'}</span>
            </span>
            <span className={`p-1 rounded-md ${displayExtra > 0 ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight ${displayExtra > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatNepaliCurrency(displayExtra)}
          </div>
          <div className="mt-1 text-[11px]">
            {todayExtra > 0 ? (
              <span className="text-rose-700 font-bold bg-rose-100 px-1.5 py-0.5 rounded">
                {lang === 'ne' 
                  ? `बजेट (${formatNepaliCurrency(dailyBudget)}) भन्दा +${formatNepaliCurrency(todayExtra)} बढी!`
                  : `+${formatNepaliCurrency(todayExtra)} over budget!`}
              </span>
            ) : (
              <span className="text-slate-400">
                {cumulativeExtra > 0 
                  ? (lang === 'ne' ? `कुल अतिरिक्त: ${formatNepaliCurrency(cumulativeExtra)}` : `Total extra: ${formatNepaliCurrency(cumulativeExtra)}`)
                  : (lang === 'ne' ? 'बजेट सीमाभित्रै (० अतिरिक्त)' : 'Within budget (0 extra)')}
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
