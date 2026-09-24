import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle, Edit3 } from 'lucide-react';
import { formatNepaliCurrency, TRANSLATIONS } from '../data/nepaliData';

export default function BudgetBar({ expenses, dailyBudget, setDailyBudget, lang }) {
  const t = TRANSLATIONS[lang];
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(dailyBudget);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = expenses
    .filter(e => e.date === todayStr)
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const percentage = Math.min(Math.round((todayTotal / dailyBudget) * 100), 100);
  const isOver = todayTotal > dailyBudget;
  const extraAmount = Math.max(0, todayTotal - dailyBudget);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const val = Number(tempBudget);
    if (!isNaN(val) && val > 0) {
      setDailyBudget(val);
      localStorage.setItem('kharcha_daily_budget', val.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-xs mb-6 ${
      isOver ? 'bg-rose-50/40 border-rose-200' : 'bg-white border-emerald-100'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isOver ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              {t.dailyBudget}
            </h3>
            <span className="text-[11px] text-slate-400">
              {lang === 'ne' ? 'दैनिक खर्च नियन्त्रण लक्ष्य' : 'Daily Spending Target'}
            </span>
          </div>
        </div>

        {/* Budget Setting / Edit */}
        {isEditing ? (
          <form onSubmit={handleSaveBudget} className="flex items-center gap-1.5">
            <input
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-24 text-xs font-bold px-2 py-1 border border-emerald-400 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
            >
              ✕
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              {formatNepaliCurrency(dailyBudget)}
            </span>
            <button
              onClick={() => {
                setTempBudget(dailyBudget);
                setIsEditing(true);
              }}
              title="बजेट परिवर्तन गर्नुहोस् / Change Budget"
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3 mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOver
              ? 'bg-rose-500'
              : percentage > 80
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Helper feedback text with exact extra amount */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-medium pt-0.5">
        <span className={isOver ? 'text-rose-600 font-bold flex items-center gap-1' : 'text-slate-500'}>
          {isOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
          <span>
            {isOver
              ? (lang === 'ne' 
                  ? `आजको खर्च ${formatNepaliCurrency(todayTotal)} भयो` 
                  : `Today's spend is ${formatNepaliCurrency(todayTotal)}`)
              : `${percentage}% ${t.budgetUsed} ${formatNepaliCurrency(dailyBudget)}`}
          </span>
        </span>
        
        {isOver ? (
          <span className="text-rose-700 font-extrabold bg-rose-100 px-2 py-0.5 rounded-full self-start sm:self-auto text-[10px] sm:text-[11px]">
            {lang === 'ne' 
              ? `अतिरिक्त खर्च: +${formatNepaliCurrency(extraAmount)}` 
              : `Extra expense: +${formatNepaliCurrency(extraAmount)}`}
          </span>
        ) : (
          <span className="text-emerald-700 font-semibold self-start sm:self-auto text-[10px] sm:text-[11px]">
            {formatNepaliCurrency(dailyBudget - todayTotal)} {lang === 'ne' ? 'बाँकी' : 'remaining'}
          </span>
        )}
      </div>
    </div>
  );
}
