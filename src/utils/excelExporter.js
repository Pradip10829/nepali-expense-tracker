import * as XLSX from 'xlsx';
import { CATEGORIES, PAYMENT_METHODS } from '../data/nepaliData';

export function exportToExcel({ expenses, totalMoney, dailyBudget = 1000, lang = 'ne' }) {
  if (!expenses || expenses.length === 0) {
    alert(lang === 'ne' ? 'डाउनलोड गर्न कुनै खर्च फेला परेन।' : 'No expenses recorded to export.');
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = totalMoney - totalSpent;

  // Accurate Extra Expense Calculation (Overflow beyond daily budget + manual tagged)
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const todayTotal = todayExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const todayExtra = Math.max(0, todayTotal - dailyBudget);

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

  const exactExtra = todayExtra > 0 ? todayExtra : cumulativeExtra;

  // 1. Transactions Data rows
  const transactionRows = expenses.map((e, index) => {
    const cat = CATEGORIES.find(c => c.id === e.category);
    const catName = lang === 'ne' ? (cat?.nameNe || e.category) : (cat?.nameEn || e.category);
    
    const pm = PAYMENT_METHODS.find(p => p.id === e.paymentMethod);
    const pmName = lang === 'ne' ? (pm?.nameNe || e.paymentMethod) : (pm?.nameEn || e.paymentMethod);

    const isExtra = (e.isExtra || e.category === 'extra') ? (lang === 'ne' ? 'हो (अतिरिक्त)' : 'Yes') : (lang === 'ne' ? 'होइन' : 'No');

    return {
      'क्र.सं. (S.N.)': index + 1,
      'मिति (Date)': e.date,
      'समय (Time)': e.time || '-',
      'विवरण / कैफियत (Remarks)': e.note || '-',
      'खर्च शीर्षक (Category)': catName,
      'भुक्तानी माध्यम (Mode)': pmName,
      'अतिरिक्त खर्च? (Extra?)': isExtra,
      'रकम रु (Amount NPR)': Number(e.amount),
    };
  });

  // Create WorkSheet for Transactions
  const ws = XLSX.utils.json_to_sheet(transactionRows);

  // Set column widths for clean viewing in Excel
  ws['!cols'] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 32 },
    { wch: 22 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
  ];

  // 2. Summary Sheet
  const summaryData = [
    { 'शीर्षक (Metric)': 'कुल जम्मा बजेट / रकम (Total Funds)', 'रकम रु (NPR)': totalMoney },
    { 'शीर्षक (Metric)': 'दैनिक बजेट सीमा (Daily Budget Limit)', 'रकम रु (NPR)': dailyBudget },
    { 'शीर्षक (Metric)': 'कुल खर्च रकम (Total Spent)', 'रकम रु (NPR)': totalSpent },
    { 'शीर्षक (Metric)': 'बाँकी बचत रकम (Remaining Balance)', 'रकम रु (NPR)': remaining },
    { 'शीर्षक (Metric)': 'अतिरिक्त खर्च (बजेट नाघेको) (Extra Expense)', 'रकम रु (NPR)': exactExtra },
    { 'शीर्षक (Metric)': 'कुल कारोबार संख्या (Total Entries)', 'रकम रु (NPR)': expenses.length },
    { 'शीर्षक (Metric)': 'स्टेटमेन्ट मिति (Export Date)', 'रकम रु (NPR)': todayStr },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 42 }, { wch: 20 }];

  // Create Workbook and append sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, lang === 'ne' ? 'दैनिक खर्च सूची' : 'Expenses List');
  XLSX.utils.book_append_sheet(wb, summaryWs, lang === 'ne' ? 'कुल हिसाब सारांश' : 'Summary');

  // Trigger Excel file download (.xlsx)
  const fileName = `nepali-kharcha-statement-${todayStr}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
