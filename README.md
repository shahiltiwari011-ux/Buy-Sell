# 🎓 campusloop — new semester. new-to-you stuff.

**campusloop** is a modern, student-budget peer marketplace designed with a fresh neo-brutalist aesthetic for college classmates to buy and sell pre-loved textbooks, tech, dorm furniture, bikes, and fits.

---

## 🎨 UI/UX Features & Exact Design Fidelity

### 1. Navigation & Brand
- **Brand Logo:** `C campusloop` with the iconic circular loop arrow in solid black.
- **Header Actions:**
  - `⊞ Browse` (instant feed reset & scroll)
  - `♡ Saved` (live wishlist counter & toggle to view favorited drops)
  - `✉ Messages` (interactive campus chat modal with active student seller conversations)
  - `Sell your stuff ↗` prominent neon lime pill button (`#E2F952`) with black border and offset shadow.
  - Student profile avatar with yellow accent ring.

### 2. Hero Section
- **Typography:**
  - `new semester.`
  - `<mark>new-to-you</mark> stuff.` with the vibrant lime highlight box.
  - Subtitle: *Big finds. Student-budget energy.*
- **Search Pill:**
  - Round search input: *"Find your next campus obsession"* with a dark teal circular arrow button (`→`).
- **Interactive Neo-Brutalist Collage:**
  - Mint green checkered pattern backdrop.
  - Washi-taped elements: sneakers, textbooks stack, studio headphones, and green campus backpack.
  - Stickers: Pink `PRE-LOVED` ticket sticker and yellow starburst `BUDGET WIN` badge.
  - Handwritten arrow annotation: *not landfill material* in cursive Caveat font.

### 3. Forest Green Marquee Ribbon
- Continuous scrolling ticker banner:
  `★ LESS SPENDING / MORE FINDING / KEEP IT ON CAMPUS ★ GOOD STUFF. SMALL PRICES. LOCAL PICKUPS ★`

### 4. Category Filter Pills
- Clean pill buttons with solid black borders:
  - `🌐 All`
  - `📖 Books`
  - `💻 Tech`
  - `🛋 Room`
  - `🚲 Bikes`
  - `👕 Fits`
  - `💬 Other`

### 5. "the latest drops" Grid
- Header with tilted pink sticker badge: `JUST IN` and `Browse all ↗` action.
- 4-column responsive grid featuring the 8 authentic student drops:
  1. **Psychology textbooks** — `$24` • 📍 On campus • Maya • `STEAL` badge (mint green pastel frame)
  2. **Sony headphones** — `$85` • 📍 On campus • Daniel • `BARELY USED` badge (blush peach pastel frame)
  3. **city bike** — `$120` • 📍 On campus • Priya (butter yellow pastel frame)
  4. **desk & chair** — `$65` • 📍 On campus • Ethan (oat grey pastel frame)
  5. **Denim jacket** — `$40` • 📍 On campus • Alex (sand pastel frame)
  6. **Desk lamp** — `$18` • 📍 On campus • Sam (warm peach pastel frame)
  7. **Canon camera** — `$300` • 📍 On campus • Jo • `MAIN CHARACTER` badge (warm ivory pastel frame)
  8. **Backpack** — `$70` • 📍 On campus • Noor (sage oat pastel frame)

### 6. Interactive Functionality
- **Heart / Save Toggle:** Click the heart icon on any drop to save/unsave; updates the header counter and allows filtering down to your saved drops.
- **Direct Campus Messaging:** Click `Messages` to open conversational chat threads with Maya or Daniel, type responses, and send messages in real-time.
- **Product Details Modal:** Opens with high-resolution pastel frame, specs, student seller badge, and direct contact options (In-app Message, WhatsApp, Email, Phone, and 1-click clipboard message copy).
- **Sell Your Stuff:**
  - Name, category, condition, price, location, description.
  - Badge picker (`STEAL`, `BARELY USED`, `MAIN CHARACTER`).
  - Card background pastel color picker.
  - Dual photo upload (local file reader or instant presets).
  - **"Fill Demo Drop"** button for fast live demonstration.
  - Instant top-of-feed placement with `YOUR DROP` badge.
- **Footer:** Featuring the iconic centered note: *good stuff deserves a second semester.*

---

## 🗄️ Database & Production Setup (Supabase)

CampusLoop runs in **Hybrid Mode**:
- **Offline / Demo Mode**: Zero configuration needed. The app runs immediately with rich demo products, mock chats, and roommate listings saved to browser storage.
- **Production Mode**: Connect your Supabase project to enable real multi-user persistence, PostgreSQL RLS security, and cloud storage.

### 1. Configure Supabase Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your project credentials in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 2. Apply Database Schema

Open the Supabase SQL Editor and run the script found in [supabase/seed.sql](file:///c:/Users/ABHI/Desktop/Buy&Sell/supabase/seed.sql). This provisions:
- `marketplace_products` & `marketplace_reports` (with RLS policies)
- `roommate_listings`, `roommate_blocks`, & `roommate_reports` (with RLS policies)
- `profiles` table automatically linked to `auth.users` via trigger
- `campusloop_media` storage bucket for product and room images

---

## 🚀 Running & Building for Production

### Development Server:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```
Creates an optimized, chunked production bundle in `dist/` with separate vendor caches for React, Lucide Icons, and Supabase.

### Preview Production Build:
```bash
npm run preview
```


