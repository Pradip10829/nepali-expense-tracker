# खर्च-किताब (KharchaKitab) - नेपाली दैनिक खर्च नियन्त्रण एप

A production-ready, mobile-first daily expense tracking web application crafted specifically for Nepali users. Simple, fast, and easy to understand.

---

## 🌟 Key Features

1. **📱 Mobile-First & PWA Installable:**
   - Works like a native mobile app with a **Bottom Navigation Bar** (Home, Expenses, Diary, Settings).
   - Installable on Android & iPhone with **"Add to Home Screen"** prompt.
   - Haptic feedback on mobile tap.
   - Works **100% offline** with zero internet connection needed.

2. **📝 Handwritten Diary Note (कापीको पानामा हिसाब):**
   - Renders a realistic lined notebook paper with human ballpoint pen handwriting (**Kalam** font).
   - Blue pen 🔵 or Black pen ⚫ ink switch.
   - **Save PNG:** Download crisp `.png` image of the handwritten page to share on WhatsApp/Viber or save to gallery.
   - **Export Excel (.xlsx):** Download structured Microsoft Excel spreadsheets.

3. **💰 Total Funds & Balance Control:**
   - Set your starting pocket money, salary, or total bank balance.
   - Real-time **बाँकी बचत (Remaining Balance)** tracking.
   - Visual alert if balance drops into a deficit.

4. **⚠️ Overspending & Extra Expense Reminders:**
   - Mark transactions as **"अतिरिक्त / फजुल खर्च (Extra / Unplanned)"**.
   - Warning banner triggers when spending exceeds the daily budget or when extra expenses occur.

5. **🇳🇵 100% Nepali Localization:**
   - Payment modes: **नगद (Cash)**, **Fonepay QR**, **eSewa**, **Khalti**, **Mobile Banking**.
   - Everyday categories: खाजा, तरकारी/किराना, कोठा भाडा, रिचार्ज, गाडी भाडा, औषधि, सापटी।
   - Nepali currency formatting (`रु १,५०,०००`).
   - Bikram Sambat (वि.सं.) date.
   - 1-tap bilingual switch (**नेपाली / English**).

6. **🔒 Private Data Backup & Restore:**
   - Export backup JSON file or restore anytime. No account required.

---

## 🚀 How to Run Locally

```bash
cd nepali-expense-tracker
npm install
npm run dev
```

* **Laptop / Desktop:** `http://localhost:5173/`
* **Mobile (Same Wi-Fi):** `http://[YOUR_LOCAL_IP]:5173/`

---

## 🌐 Deploy to Vercel / Netlify in 1 Minute

1. Push this folder to your GitHub repo.
2. Import to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Build command: `npm run build`, Output directory: `dist`.
4. Your live app is instantly online with free SSL!
