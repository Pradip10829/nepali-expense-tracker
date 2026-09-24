import React, { useRef } from 'react';
import { X, Settings, ShieldCheck, Download, Upload, Trash2, Wallet, Target, Globe } from 'lucide-react';
import { formatNepaliCurrency } from '../data/nepaliData';

export default function SettingsModal({
  isOpen,
  onClose,
  totalMoney,
  onOpenSetFunds,
  dailyBudget,
  setDailyBudget,
  expenses,
  setExpenses,
  onClearAll,
  lang,
  setLang
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle Backup Download
  const handleBackupDownload = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      totalMoney,
      dailyBudget,
      expenses,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kharcha-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Backup Restore
  const handleRestoreFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.expenses && Array.isArray(parsed.expenses)) {
          setExpenses(parsed.expenses);
          if (parsed.totalMoney) {
            localStorage.setItem('kharcha_total_money', parsed.totalMoney.toString());
          }
          alert(lang === 'ne' ? 'डाटा सफलतापूर्वक पुनर्स्थापना (Restore) भयो!' : 'Backup restored successfully!');
          onClose();
        } else {
          alert('अमान्य फाइल ढाँचा।');
        }
      } catch (err) {
        alert('फाइल पढ्न सकिएन।');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'ne' ? 'एप सेटिङ र ब्याकअप' : 'Settings & Backup'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ne' ? 'बजेट, ब्याकअप र सुरक्षा व्यवस्थापन' : 'Manage budgets and private data backups'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Total Funds Quick Access */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {lang === 'ne' ? 'कुल जम्मा रकम (Total Funds)' : 'Total Funds'}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {formatNepaliCurrency(totalMoney)}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenSetFunds();
              }}
              className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
            >
              {lang === 'ne' ? 'बदल्नुहोस्' : 'Change'}
            </button>
          </div>

          {/* Daily Budget */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Target className="w-4 h-4 text-teal-700" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {lang === 'ne' ? 'दैनिक बजेट सीमा (Daily Limit)' : 'Daily Budget Limit'}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {formatNepaliCurrency(dailyBudget)} / दिन
                </span>
              </div>
            </div>
            <input
              type="number"
              value={dailyBudget}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setDailyBudget(val);
                localStorage.setItem('kharcha_daily_budget', val.toString());
              }}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 text-right focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Language Switch */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-blue-700" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {lang === 'ne' ? 'भाषा (Language)' : 'App Language'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'ne' ? 'हाल नेपाली चयन गरिएको छ' : 'Currently English'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === 'ne' ? 'en' : 'ne')}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition"
            >
              {lang === 'ne' ? 'English' : 'नेपाली'}
            </button>
          </div>

          {/* Data Backup & Restore */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="font-bold text-slate-900 block">
              {lang === 'ne' ? 'डाटा ब्याकअप र सुरक्षा (Backup & Restore)' : 'Data Backup & Restore'}
            </span>
            <p className="text-[11px] text-slate-500">
              {lang === 'ne'
                ? 'मोबाईल फेर्दा वा सुरक्षित राख्न आफ्नो सबै खर्च डाटा डाउनलोड गर्नुहोस्।'
                : 'Download your expense data as a file to keep safe or transfer to another phone.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleBackupDownload}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'ब्याकअप डाउनलोड' : 'Download Backup'}</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'ne' ? 'ब्याकअप लोड' : 'Restore Backup'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleRestoreFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Danger Zone: Clear Data */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">
              {expenses.length} {lang === 'ne' ? 'खर्च सुरक्षित' : 'expenses recorded'}
            </span>
            <button
              onClick={() => {
                onClose();
                onClearAll();
              }}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'सबै खर्च मेटाउनुहोस्' : 'Clear All Data'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
