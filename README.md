# Elamriz - Premium Refurbished Hardware Marketplace

**Elamriz** is a modern, high-end e-commerce platform specializing in premium refurbished hardware. Built with a focus on performance, sustainability, and an elegant user experience inspired by premium tech brands.

## ✨ Key Features

- **Premium UI/UX**: Clean, modern design with smooth animations using Framer Motion.
- **Product Gallery**: High-performance product discovery with advanced filtering and search.
- **Shopping Cart & Checkout**: Seamless shopping experience with a dedicated checkout flow.
- **Admin Panel**: Complete backend interface for managing:
  - Products (Inventory, Pricing, Specifications)
  - Orders & Tracking
  - Categories
- **Secure Payments**: Integrated with **Mollie Payments** for safe and reliable transactions.
- **Robust Backend**: Powered by **Supabase** (PostgreSQL) for real-time data and authentication.
- **SEO Optimized**: Fully optimized for search engines with dynamic metadata and sitemaps.

## 🚀 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React (Icons)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Payments**: [Mollie API](https://www.mollie.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS)
- A Supabase project
- A Mollie account (for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/elamriz-shop.git
   cd elamriz-shop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MOLLIE_API_KEY=your_mollie_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

- `app/` - Next.js App Router (Pages, API routes, Layouts)
- `components/` - Reusable UI components (Home, Shop, Layout, Admin)
- `lib/` - Utility functions, Supabase client, and API helpers
- `store/` - Zustand store for state management
- `public/` - Static assets (images, fonts)

## ⚖️ License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [Zakariyae](https://github.com/elamriz)
