import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, X, Bell, Lightbulb } from 'lucide-react';
import { formatNepaliCurrency, TRANSLATIONS } from '../data/nepaliData';

export default function ExpenseReminderBanner({ expenses, totalMoney, dailyBudget = 1000, lang }) {
  const t = TRANSLATIONS[lang];
  const [dismissed, setDismissed] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = expenses
    .filter(e => e.date === todayStr)
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // Exact Today Extra Expense: if today is 1100 and budget is 1000 -> exactly 100 extra!
  const isOverDailyBudget = todayTotal > dailyBudget;
  const todayExtra = Math.max(0, todayTotal - dailyBudget);

  // Remaining money
  const totalAllExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = totalMoney - totalAllExpenses;
  const isOverTotalFunds = remaining < 0;

  // Manually tagged extra items
  const manualExtraExpenses = expenses.filter(e => e.category === 'extra' || e.isExtra);
  const manualExtraTotal = manualExtraExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  if (dismissed || (!isOverDailyBudget && manualExtraTotal === 0 && !isOverTotalFunds)) {
    return null;
  }

  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 shadow-sm relative animate-in fade-in">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3.5 right-3.5 text-rose-400 hover:text-rose-700 p-1 rounded-lg"
        title="बन्द गर्नुहोस्"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-rose-500 text-white shrink-0 shadow-md shadow-rose-500/20">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>

        <div className="grow pr-4">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm sm:text-base text-rose-900">
              {lang === 'ne' ? '⚠️ अतिरिक्त खर्चको सचेत सन्देश (Reminder)' : '⚠️ Spending & Extra Expense Reminder!'}
            </h4>
            <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
              {lang === 'ne' ? 'सावधान' : 'Alert'}
            </span>
          </div>

          <div className="mt-2 space-y-2 text-xs text-rose-800">
            {isOverDailyBudget && (
              <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200 text-rose-900 font-semibold space-y-1">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    {lang === 'ne'
                      ? `आजको खर्चले दैनिक बजेट सीमा नाघ्यो!`
                      : `Today's spending has exceeded your daily limit!`}
                  </span>
                </div>
                <div className="text-xs flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                  <span>बजेट: <strong className="text-slate-800">{formatNepaliCurrency(dailyBudget)}</strong></span>
                  <span>आजको कुल खर्च: <strong className="text-slate-900">{formatNepaliCurrency(todayTotal)}</strong></span>
                  <span className="text-rose-700 font-black bg-rose-100 px-1.5 py-0.5 rounded">
                    👉 {lang === 'ne' ? 'अतिरिक्त खर्च' : 'Extra Expense'}: +{formatNepaliCurrency(todayExtra)}
                  </span>
                </div>
              </div>
            )}

            {manualExtraTotal > 0 && !isOverDailyBudget && (
              <p className="flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {lang === 'ne'
                    ? `तपाईंले कुल ${formatNepaliCurrency(manualExtraTotal)} फजुल/अतिरिक्त खर्च गर्नुभएको छ।`
                    : `You have spent ${formatNepaliCurrency(manualExtraTotal)} on extra/unplanned items.`}
                </span>
              </p>
            )}

            {isOverTotalFunds && (
              <p className="flex items-center gap-1.5 font-bold text-rose-950">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>
                  {lang === 'ne'
                    ? `सावधान: कुल रकम सकिएर तपाईं ${formatNepaliCurrency(Math.abs(remaining))} घाटा (Deficit) मा हुनुहुन्छ!`
                    : `Warning: You have exhausted all total funds and are in a deficit of ${formatNepaliCurrency(Math.abs(remaining))}!`}
                </span>
              </p>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex items-center gap-1.5 text-[11px] text-rose-700 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {lang === 'ne'
                ? 'सुझाव: आज थप अनावश्यक खर्च रोक्नुहोस् र भोलिको दिनमा बजेट सन्तुलन मिलाउनुहोस्।'
                : 'Tip: Hold off on non-essentials for the rest of today to balance your budget tomorrow.'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
