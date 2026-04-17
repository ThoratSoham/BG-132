# 🏦 NeoBank – Digital Banking Web Application

## 📌 Overview

**NeoBank** is a **full-featured digital banking web application** built using **HTML, CSS, and Vanilla JavaScript** with **Supabase** as the backend.

It delivers a real-world **fintech banking experience**, including:

* Real authentication (Email/Password + Google OAuth)
* Protected routes with automatic session management
* Live database for linked bank accounts
* Transactions, payments, and card management
* Fully responsive UI with dark-mode design

> ✅ This project uses **Supabase** for authentication and data persistence. It is no longer a UI-only simulation.

---

## 🚀 Key Features

* ✅ **Real Login & Signup** via Supabase Auth (Email + Google OAuth)
* ✅ **Session-protected pages** — unauthenticated users are redirected to login
* ✅ **Dynamic user profile** — name, email, and avatar populated from logged-in user
* ✅ **Linked Accounts** — Add and persist bank accounts to Supabase PostgreSQL
* ✅ **Dashboard** with account balance, quick actions, and recent transactions
* ✅ **Card Management** — Freeze card, set spending limits, toggle international usage
* ✅ **Payments Module** — Send money, mobile recharge, and bill payments
* ✅ **Notifications** — Security alerts and transaction reminders
* ✅ **Logout** — Clears session securely and redirects to login

---

## 🏗️ System Architecture

NeoBank follows a **modular multi-page application (MPA)** architecture:

```
NeoBank/
├── index.html          # Login & Signup page
├── dashboard.html      # Main dashboard
├── accounts.html       # Account statement & transaction history
├── cards.html          # Card management UI
├── payments.html       # Payments (send money, recharge, bill pay)
├── notifications.html  # Notification center
├── profile.html        # User profile & linked accounts
├── css/
│   └── styles.css      # Global styles, dark theme, component library
└── js/
    ├── auth-guard.js   # Session management, route protection, user display
    └── app.js          # Global utilities (toast, sidebar toggle)
```

---

## 🧱 Architecture Layers

### 🔹 UI Layer
* HTML5 semantic structure
* CSS custom properties (design tokens)
* Responsive Flexbox/Grid layouts
* Glassmorphism dark-mode design

### 🔹 Logic Layer
* `auth-guard.js` — Runs on every page; checks Supabase session, redirects unauthenticated users, populates user info
* Inline JavaScript per page for page-specific functionality

### 🔹 Data Layer
* **Supabase Auth** — Handles email/password and Google OAuth sessions
* **Supabase PostgreSQL** — Stores user-linked bank accounts with Row Level Security (RLS)
* `localStorage` — Used for UI preferences (theme)

---

## 🔐 Authentication

### Providers Supported
| Provider | Status |
|---|---|
| Email / Password | ✅ Enabled |
| Google OAuth | ✅ Enabled |

### Auth Flow
1. User visits `index.html` → enters credentials or clicks Google
2. Supabase validates and creates a session stored in `localStorage`
3. `auth-guard.js` runs on every page load:
   - If **not logged in** → redirected to `index.html`
   - If **logged in** on `index.html` → redirected to `dashboard.html`
4. On logout → session cleared from `localStorage` + Supabase `signOut()` called

### Supabase Configuration
| Setting | Value |
|---|---|
| Project URL | `https://ozpfohheqvaxmzzrujuj.supabase.co` |
| Auth Callback URL | `https://ozpfohheqvaxmzzrujuj.supabase.co/auth/v1/callback` |
| Google Client ID | Configured in Supabase Dashboard → Auth → Providers → Google |

---

## 🗄️ Database Schema

### `linked_accounts` Table

Run the following SQL in your **Supabase SQL Editor** to set up the database:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS linked_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only insert their own accounts
DROP POLICY IF EXISTS "Users can insert their own accounts" ON linked_accounts;
CREATE POLICY "Users can insert their own accounts"
ON linked_accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only view their own accounts
DROP POLICY IF EXISTS "Users can view their own accounts" ON linked_accounts;
CREATE POLICY "Users can view their own accounts"
ON linked_accounts FOR SELECT
USING (auth.uid() = user_id);
```

---

## 📊 Pages & Modules

### 🏠 Dashboard (`dashboard.html`)
* Account balance display with show/hide toggle
* Quick actions: Send Money, Recharge, Bill Pay
* Recent transaction list
* Monthly spend doughnut chart (Chart.js)
* Recent security & payment alerts

### 📋 Accounts (`accounts.html`)
* Full transaction history
* Filter by All / Credits / Debits
* PDF statement download (print)

### 💳 Cards (`cards.html`)
* Animated credit card display
* Freeze/Unfreeze card toggle
* International usage toggle
* Monthly spending limit input

### 💸 Payments (`payments.html`)
* Send Money tab
* Mobile Recharge tab
* Bill Payments tab
* Confirmation + simulated processing screen

### 🔔 Notifications (`notifications.html`)
* Transaction alerts
* Payment reminders
* Security alerts
* Clear all functionality

### 👤 Profile (`profile.html`)
* Live user info from Supabase Auth (name, email, avatar)
* **Linked Accounts** — Add and save real bank accounts to Supabase DB
* Theme preference (Dark / Light)
* Language & currency display settings
* Terminate Session (logout)

---

## 🎨 UI/UX Design

| Aspect | Details |
|---|---|
| Theme | Dark-mode glassmorphism |
| Font | Inter (Google Fonts) |
| Icons | Lucide Icons |
| Colors | Indigo (`#6366f1`) + Cyan (`#0ea5e9`) gradient palette |
| Layout | Sidebar + Main Content (responsive grid) |
| Animations | Fade-in on page load, hover lift effects |

---

## 🔐 Security

* **Row Level Security (RLS)** on all database tables — users can only access their own data
* **Anon key only** exposed on the frontend — Service Role key never used client-side
* **Session enforcement** — every protected page is guarded by `auth-guard.js`
* **Secure logout** — both Supabase `signOut()` and manual `localStorage` clear

---

## 📱 Responsiveness

* Fully responsive on desktop, tablet, and mobile
* Sidebar collapses on small screens
* CSS Grid + Flexbox adaptive layouts

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 (Vanilla) | Styling, animations, dark theme |
| JavaScript (ES6+) | UI logic, Supabase integration |
| [Supabase](https://supabase.com) | Auth, PostgreSQL database |
| [Lucide Icons](https://lucide.dev) | Icon library |
| [Chart.js](https://chartjs.org) | Dashboard spending chart |
| [Google Fonts](https://fonts.google.com) | Inter typeface |

---

## ⚙️ Setup & Running Locally

1. **Clone the repository**
2. **Set up Supabase**:
   - Create a project at [supabase.com](https://supabase.com)
   - Enable Email and Google auth providers
   - Run the SQL schema above in the SQL Editor
3. **Update credentials** in `js/auth-guard.js` and `index.html`:
   ```js
   const SUPABASE_URL = 'your-project-url';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```
4. **Open `index.html`** directly in a browser, or serve via a local server (recommended):
   ```bash
   npx serve .
   ```

> ⚠️ For best results, use a local server (e.g. `npx serve` or VS Code Live Server) instead of opening files directly via `file://`, as some browsers restrict `localStorage` behavior for local files.

---

## 🔮 Future Enhancements

* Real transaction recording in Supabase DB
* Push notifications via Supabase Realtime
* Profile image upload via Supabase Storage
* Admin dashboard with analytics
* Full mobile app (React Native / PWA)

---

## 📜 License

Open for educational and development use. See [LICENSE](LICENSE) for details.

---

💡 *Bank smarter. Build faster. NeoBank.*
