import React, { useState } from 'react';
import { X, TrendingUp, Check, Plus, Coins, ArrowRight, History, Trash2 } from 'lucide-react';
import { formatNepaliCurrency } from '../data/nepaliData';

const EXTRA_MONEY_SOURCES = [
  { id: 'salary', nameNe: 'तलब / Salary', nameEn: 'Salary', icon: '💼' },
  { id: 'bonus', nameNe: 'बोनस / भत्ता', nameEn: 'Bonus / Allowance', icon: '🎁' },
  { id: 'side_income', nameNe: 'साइड आम्दानी', nameEn: 'Side Income / Freelance', icon: '🚀' },
  { id: 'loan_repaid', nameNe: 'सापटी फिर्ता', nameEn: 'Loan Repaid', icon: '🤝' },
  { id: 'gift', nameNe: 'उपहार / दक्षिणा', nameEn: 'Gift / Dakshina', icon: '🎈' },
  { id: 'other', nameNe: 'अन्य आम्दानी', nameEn: 'Other Extra Money', icon: '💰' },
];

export default function AddExtraMoneyModal({
  isOpen,
  onClose,
  totalMoney,
  onAddExtraMoney,
  extraMoneyLogs = [],
  onDeleteExtraMoneyLog,
  lang
}) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('bonus');
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const newTotal = totalMoney + numAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      setError(lang === 'ne' ? 'कृपया थप्न चाहेको रकम राख्नुहोस्।' : 'Please enter a valid amount.');
      return;
    }

    const selectedSource = EXTRA_MONEY_SOURCES.find(s => s.id === source);
    const sourceName = lang === 'ne' ? selectedSource?.nameNe : selectedSource?.nameEn;

    const extraEntry = {
      id: `extra-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      amount: numAmount,
      source,
      sourceName,
      note: note.trim() || sourceName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    onAddExtraMoney(extraEntry);

    // Reset & Close
    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  const handleQuickAdd = (val) => {
    const current = Number(amount) || 0;
    setAmount((current + val).toString());
    setError('');
  };

  const QUICK_CHIPS = [1000, 2000, 5000, 10000, 20000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-emerald-100 p-4 sm:p-6 relative text-slate-800 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Mukta',sans-serif]">
              {lang === 'ne' ? '+ थप रकम / आम्दानी थप्नुहोस्' : '+ Add Extra Money / Income'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'ne' 
                ? 'थपिएको रकम सिधै तपाईंको कुल बजेट र बचतमा जोडिनेछ।' 
                : 'Extra funds will be added directly to your total balance.'}
            </p>
          </div>
        </div>

        {/* Calculation Preview Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              {lang === 'ne' ? 'हालको रकम' : 'Current'}
            </span>
            <span className="font-extrabold text-slate-700 text-sm font-['Mukta',sans-serif]">
              {formatNepaliCurrency(totalMoney)}
            </span>
          </div>

          <div className="text-emerald-600 font-black text-lg">➔</div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
              {lang === 'ne' ? 'थपिएपछिको नयाँ रकम' : 'New Total'}
            </span>
            <span className="font-black text-emerald-800 text-sm sm:text-base font-['Mukta',sans-serif]">
              {formatNepaliCurrency(newTotal)}
            </span>
            {numAmount > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 block">
                (+{formatNepaliCurrency(numAmount)})
              </span>
            )}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'ne' ? 'थप्ने रकम (Amount):' : 'Amount to Add (रु):'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-emerald-700 text-lg">
                रु
              </span>
              <input
                type="number"
                inputMode="decimal"
                autoFocus
                placeholder={lang === 'ne' ? 'उदा: ५०००' : 'e.g. 5000'}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
            {error && <p className="text-xs text-rose-600 mt-1 font-semibold">{error}</p>}

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_CHIPS.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition active:scale-95 cursor-pointer"
                >
                  +{val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Income Source Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {lang === 'ne' ? 'आम्दानीको स्रोत / शीर्षक:' : 'Source of Money:'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {EXTRA_MONEY_SOURCES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition text-left border cursor-pointer ${
                    source === s.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="truncate">{lang === 'ne' ? s.nameNe : s.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note / Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'ne' ? 'कैफियत / विवरण (वैकल्पिक):' : 'Remarks / Note (Optional):'}
            </label>
            <input
              type="text"
              placeholder={lang === 'ne' ? 'उदा: दसैं बोनस / दशैं खर्च पाएको' : 'e.g. Festival bonus / Freelance project'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              {lang === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-700/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>
                {numAmount > 0 
                  ? (lang === 'ne' ? `+रु ${numAmount} थप्नुहोस्` : `+ Add रु ${numAmount}`) 
                  : (lang === 'ne' ? 'थप रकम थप्नुहोस्' : 'Add Extra Money')}
              </span>
            </button>
          </div>
        </form>

        {/* History Toggle if records exist */}
        {extraMoneyLogs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-emerald-700 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'ne' ? `पहिले थपिएका रकमहरू (${extraMoneyLogs.length})` : `Extra Money History (${extraMoneyLogs.length})`}</span>
              </span>
              <span className="text-[11px] underline">
                {showHistory ? (lang === 'ne' ? 'लुकाउनुहोस्' : 'Hide') : (lang === 'ne' ? 'हेर्नुहोस्' : 'Show')}
              </span>
            </button>

            {showHistory && (
              <div className="mt-2.5 space-y-1.5 max-h-40 overflow-y-auto">
                {extraMoneyLogs.map(item => (
                  <div 
                    key={item.id} 
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{item.note || item.sourceName}</span>
                      <span className="text-[10px] text-slate-400">{item.date} • {item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-700 font-['Mukta',sans-serif]">
                        +{formatNepaliCurrency(item.amount)}
                      </span>
                      {onDeleteExtraMoneyLog && (
                        <button
                          type="button"
                          onClick={() => onDeleteExtraMoneyLog(item.id, item.amount)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
