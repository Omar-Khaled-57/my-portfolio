# Portfolio - Omar Khaled El-Khouly

A premium, production-ready personal portfolio website built with **React 18**, **Tailwind CSS**, and **Supabase**. This project features a stunning glassmorphism design, multi-language support (English & Arabic), a secure admin dashboard, and real-time interaction.

## 🚀 Live Demo
[https://omar-el-khouly.vercel.app](https://omar-el-khouly.vercel.app)

---

## ✨ Features

- **Glassmorphism UI**: Modern, premium design with smooth animations using Framer Motion and AOS.
- **Multi-Language Support**: Fully translated in English and Arabic.
- **Admin Dashboard**: Secure management of projects, certificates, and comments.
- **Real-time Comments**: Integrated comment system with the ability to pin/unpin or freeze comments.
- **Supabase Integration**: Backend-as-a-service for database, authentication, and storage.
- **SEO Optimized**: Meta tags, sitemap, and robots.txt configured for optimal search engine visibility.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Animations**: Framer Motion, GSAP, AOS, Lottie
- **Backend**: Supabase (Auth, DB, Storage, Realtime)
- **UI Components**: Material UI, Headless UI, Shadcn/UI
- **Alerts**: SweetAlert2

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/Omar-Khaled-57/Portfolio.git
cd Portfolio
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🗄️ Supabase Setup Guide

To set up the backend, go to your Supabase project's **SQL Editor** and run the scripts located in `dev/sqls/` in the following order:

### 1. Database Schema & Core RLS (`dev/sqls/main`)
Run this script to create the core tables (`projects`, `certificates`, `portfolio_comments`, `profiles`) and enable Row Level Security (RLS). It also sets up the storage buckets.

### 2. App Settings & Comment Control (`dev/sqls/rls`)
Run this to create the `app_settings` table, which controls features like "freezing" the comment section.

### 3. Multi-Language Support (`dev/sqls/addArabic`)
Run this to add Arabic support to the projects table (`title_ar` and `description_ar`).

### 4. User Profile Policies (`dev/sqls/admin`)
Run this to allow users to view their own profile data securely.

### 5. Create Admin Account
1. Go to **Authentication -> Users** and click **Add User**.
2. After creating the user, copy their **User ID (UUID)**.
3. Run the following SQL in the editor (replace `YOUR_USER_ID` with the copied UUID):
```sql
INSERT INTO public.profiles (id, username, role)
VALUES ('YOUR_USER_ID', 'admin', 'admin');
```

---

## 🛠️ Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

---

## 📄 License
This project is for personal use. Feel free to use it as inspiration for your own portfolio!

## 🤝 Contact
**Omar Khaled El-Khouly**
- GitHub: [@Omar-Khaled-57](https://github.com/Omar-Khaled-57)
- WhatsApp: [+20 112 302 9406](https://wa.me/201123029406)
