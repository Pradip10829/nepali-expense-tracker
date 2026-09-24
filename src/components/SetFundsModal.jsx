import React, { useState } from 'react';
import { X, Check, Wallet, Plus } from 'lucide-react';
import { formatNepaliCurrency, TRANSLATIONS } from '../data/nepaliData';

export default function SetFundsModal({ isOpen, onClose, totalMoney, onUpdateTotalMoney, lang }) {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState('add'); // 'set' or 'add'
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = Number(amount);
    if (isNaN(val) || val <= 0) return;

    if (mode === 'add') {
      onUpdateTotalMoney(totalMoney + val);
    } else {
      onUpdateTotalMoney(val);
    }

    setAmount('');
    onClose();
  };

  const QUICK_FUNDS = [1000, 5000, 10000, 25000, 50000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-emerald-100 p-5 sm:p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'ne' ? 'कुल रकम / आम्दानी थप्नुहोस्' : 'Manage Total Funds / Salary'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ne' ? `हालको कुल रकम: ${formatNepaliCurrency(totalMoney)}` : `Current Total: ${formatNepaliCurrency(totalMoney)}`}
            </p>
          </div>
        </div>

        {/* Tab: Add to existing vs Set New */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'add' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            {lang === 'ne' ? '+ रकम थप्नुहोस् (Add Funds)' : '+ Add to Balance'}
          </button>
          <button
            type="button"
            onClick={() => setMode('set')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'set' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            {lang === 'ne' ? 'नयाँ रकम तोक्नुहोस् (Set New)' : 'Set New Total'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {mode === 'add'
                ? (lang === 'ne' ? 'थप्ने रकम (रु)' : 'Amount to Add (रु)')
                : (lang === 'ne' ? 'नयाँ कुल रकम (रु)' : 'New Total Funds (रु)')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-emerald-700 text-lg">
                रु
              </span>
              <input
                type="number"
                autoFocus
                placeholder="e.g. 20000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xl font-extrabold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {QUICK_FUNDS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition"
                >
                  +{formatNepaliCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{lang === 'ne' ? 'अपडेट गर्नुहोस्' : 'Update Funds'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
