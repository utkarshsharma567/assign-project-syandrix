# TastePoint Restaurant Web Application

A clean, modern, and responsive Restaurant Web App built with **React**, **Vite**, **Tailwind CSS**, and **React Router**.

Designed to be easy to understand, maintain, and expand—especially for fresher and junior developers!

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- npm (comes bundled with Node.js)

### 2. Installation & Running Locally
Open your terminal inside this project folder:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📁 Project Architecture (Fresher-Friendly Guide)

```text
restrarent-frontend/
├── index.html                 # HTML entry point
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind theme colors and styles
├── package.json               # Dependencies and scripts
└── src/
    ├── main.jsx               # React entry point, mounts <App />
    ├── App.jsx                # Router configuration & Cart state (localStorage)
    ├── index.css              # Global Tailwind CSS directives
    │
    ├── data/
    │   └── menu.js            # Central menu items (id, name, price, category, image)
    │
    ├── hooks/
    │   └── useCart.js         # Custom hook providing cart functions via useOutletContext()
    │
    ├── components/
    │   ├── Navbar.jsx         # Sticky header with responsive drawer & cart counter
    │   ├── Footer.jsx         # Global footer with links, hours, and contact details
    │   ├── Hero.jsx           # Landing page banner with call-to-actions
    │   ├── Features.jsx       # 4 key highlights (Quality, Freshness, Care, Speed)
    │   ├── MenuSection.jsx    # Category filter pills, dish grid, & "Add to Cart"
    │   └── CartToast.jsx      # Temporary popup notification when adding items
    │
    └── pages/
        ├── Home.jsx           # Landing page combining Hero, Features, Menu & About teaser
        ├── Menu.jsx           # Full menu page with category filters
        ├── About.jsx          # Dedicated About page (Story, stats, values, chef highlights)
        ├── Contact.jsx        # Dedicated Contact page (Address, phone, hours, and inquiry form)
        └── Cart.jsx           # Shopping cart page (quantity controls, order summary, checkout)
```

---

## 💡 Key Concepts Explained for Fresher Developers

### 1. Routing with React Router
In [App.jsx](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/App.jsx), `<BrowserRouter>` and `<Routes>` define all pages:
- `/` → [Home.jsx](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/pages/Home.jsx)
- `/menu` → [Menu.jsx](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/pages/Menu.jsx)
- `/about` → [About.jsx](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/pages/About.jsx)
- `/contact` → [Contact.jsx](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/pages/Contact.jsx)
- `/cart` → [Cart.jsx](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/pages/Cart.jsx)
- `*` → 404 Not Found fallback

### 2. How the Cart Works (`useCart` Hook)
Instead of complicated third-party state managers (like Redux), the cart state lives in `Layout` in [App.jsx](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/App.jsx) and is passed to `<Outlet context={cartContextValue} />`.
Any child page or component can simply do:
```javascript
import { useCart } from '../hooks/useCart';

function AnyComponent() {
  const { cartItems, addToCart, cartTotal } = useCart();
  // ...
}
```

### 3. Automatic LocalStorage Persistence
Cart items are automatically synced with the browser's `localStorage` (`tastepoint-cart`). If a customer refreshes the page or navigates between routes, their cart items remain intact.

---

## 🎨 Adding New Dishes
To add a new dish to the menu, simply add an object to [src/data/menu.js](file:///d:/new%20code/output/output/assign-project/restrarent-frontend/src/data/menu.js):

```javascript
{
  id: 9,
  name: 'Garlic Butter Naan',
  category: 'Sides',
  description: 'Soft tandoori naan brushed with herb garlic butter.',
  price: 69,
  rating: 4.8,
  image: 'https://images.unsplash.com/...',
}
```
The menu filtering and cart will immediately support the new item!
