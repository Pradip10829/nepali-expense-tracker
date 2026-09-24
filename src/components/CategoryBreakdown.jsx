import React from 'react';
import { PieChart } from 'lucide-react';
import { CATEGORIES, formatNepaliCurrency, TRANSLATIONS } from '../data/nepaliData';
import CategoryIcon from './CategoryIcon';

export default function CategoryBreakdown({ expenses, lang }) {
  const t = TRANSLATIONS[lang];

  // Group expenses by category
  const categoryTotals = CATEGORIES.map(cat => {
    const total = expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    return {
      ...cat,
      total
    };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const grandTotal = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  if (categoryTotals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800">
            {t.topCategories}
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          {categoryTotals.length} {lang === 'ne' ? 'शीर्षक' : 'categories'}
        </span>
      </div>

      <div className="space-y-3">
        {categoryTotals.slice(0, 5).map(cat => {
          const percentage = grandTotal > 0 ? Math.round((cat.total / grandTotal) * 100) : 0;
          return (
            <div key={cat.id} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md border ${cat.color}`}>
                    <CategoryIcon iconName={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    {lang === 'ne' ? cat.nameNe : cat.nameEn}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span>{formatNepaliCurrency(cat.total)}</span>
                  <span className="text-[11px] text-slate-400 font-normal w-7 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
