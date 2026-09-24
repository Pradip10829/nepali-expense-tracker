import React, { useState } from 'react';
import { Search, Trash2, Filter, ReceiptText, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS, formatNepaliCurrency, TRANSLATIONS } from '../data/nepaliData';
import CategoryIcon from './CategoryIcon';

export default function ExpenseList({ expenses, onDeleteExpense, lang }) {
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [onlyExtra, setOnlyExtra] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  // Filter transactions
  const filteredExpenses = expenses.filter(item => {
    // Search match
    const matchesSearch = (item.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.toString().includes(searchTerm);

    // Category match
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // Payment method match
    const matchesMethod = selectedMethod === 'all' || item.paymentMethod === selectedMethod;

    // Only extra match
    const matchesExtra = !onlyExtra || (item.isExtra || item.category === 'extra');

    return matchesSearch && matchesCategory && matchesMethod && matchesExtra;
  });

  const getCategoryDetails = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[CATEGORIES.length - 1];
  };

  const getPaymentDetails = (methodId) => {
    return PAYMENT_METHODS.find(p => p.id === methodId) || PAYMENT_METHODS[0];
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
      
      {/* Header & Search */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ReceiptText className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {t.recentTransactions}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredExpenses.length}
            </span>
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

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            {t.filterBy}:
          </span>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setOnlyExtra(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
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
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
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
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
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
              {t.noExpenses}
            </p>
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
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer opacity-70 group-hover:opacity-100"
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
