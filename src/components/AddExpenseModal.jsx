import React, { useState, useEffect } from 'react';
import { X, Check, Plus, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS, TRANSLATIONS, formatNepaliCurrency } from '../data/nepaliData';
import CategoryIcon from './CategoryIcon';

const QUICK_AMOUNTS = [25, 50, 100, 250, 500, 1000];

export default function AddExpenseModal({ isOpen, onClose, onAddExpense, lang, todayTotal = 0, dailyBudget = 1000 }) {
  const t = TRANSLATIONS[lang];

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [paymentMethod, setPaymentMethod] = useState('fonepay');
  const [note, setNote] = useState('');
  const [isExtra, setIsExtra] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  // Automatically check isExtra if the category selected is 'extra'
  useEffect(() => {
    if (category === 'extra') {
      setIsExtra(true);
    }
  }, [category]);

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const projectedTodayTotal = todayTotal + numAmount;
  const willExceedBudget = numAmount > 0 && projectedTodayTotal > dailyBudget;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) {
      setError(lang === 'ne' ? 'कृपया सही रकम राख्नुहोस्' : 'Please enter a valid amount');
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onAddExpense({
      id: 'exp-' + Date.now(),
      amount: num,
      category,
      paymentMethod,
      isExtra: isExtra || category === 'extra',
      note: note.trim() || (lang === 'ne' ? 'दैनिक खर्च' : 'Daily Expense'),
      date,
      time
    });

    // Reset form & close
    setAmount('');
    setNote('');
    setIsExtra(false);
    setError('');
    onClose();
  };

  const handleQuickAdd = (val) => {
    const current = Number(amount) || 0;
    setAmount((current + val).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-100 max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-emerald-50 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                {t.addExpense}
              </h2>
              <span className="text-[11px] text-emerald-600 font-medium">
                {lang === 'ne' ? 'नयाँ खर्च प्रविष्टि गर्नुहोस्' : 'Record a new daily transaction'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.amount} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-700 font-extrabold text-lg">
                रु
              </div>
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                placeholder={t.enterAmountPlaceholder}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-2xl font-extrabold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}

            {/* In-form reminder if this expense causes overspending */}
            {willExceedBudget && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {lang === 'ne'
                    ? `सचेत: यो खर्च जोड्दा आजको खर्च ${formatNepaliCurrency(projectedTodayTotal)} पुग्नेछ (बजेट सीमा ${formatNepaliCurrency(dailyBudget)} नाघ्नेछ)।`
                    : `Reminder: Adding this will make today's spend ${formatNepaliCurrency(projectedTodayTotal)}, exceeding your daily limit of ${formatNepaliCurrency(dailyBudget)}.`}
                </span>
              </div>
            )}

            {/* Quick Amount Chips */}
            <div className="mt-2.5">
              <span className="text-[11px] font-semibold text-slate-500 mr-2">
                {t.quickAmounts}:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAdd(val)}
                    className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition active:scale-95"
                  >
                    +रु {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.category}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition text-left cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border shrink-0 ${cat.color}`}>
                      <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold leading-tight line-clamp-1">
                      {lang === 'ne' ? cat.nameNe : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.paymentMethod}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lang === 'ne' ? pm.nameNe : pm.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra / Unplanned Expense Toggle */}
          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <div>
                <span className="text-xs font-bold text-rose-900 block">
                  {lang === 'ne' ? 'अतिरिक्त / फजुल खर्च (Extra / Unplanned)?' : 'Mark as Extra / Unplanned Expense?'}
                </span>
                <span className="text-[10px] text-rose-700 block">
                  {lang === 'ne' ? 'अनावश्यक खर्चको रूपमा पहिचान गरी सचेत रहन' : 'Flags unnecessary spending for reminder tracking'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isExtra}
                onChange={(e) => setIsExtra(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Remarks / Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.note}
            </label>
            <input
              type="text"
              placeholder={t.remarksPlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Date Picker (defaults to Today) */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="font-semibold">{lang === 'ne' ? 'मिति (Date):' : 'Date:'}</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>{t.saveExpense}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
