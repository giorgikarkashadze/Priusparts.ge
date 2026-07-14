# PriusParts

Full-stack car parts e-commerce app — React + TypeScript frontend, Node.js/Express backend, PostgreSQL via Prisma.

## Quick start

### 1. Install dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Set up environment variables
```bash
# server/.env
cp server/.env.example server/.env
# Fill in your DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY
```

### 3. Set up the database
```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run both servers
```bash
# Terminal 1 — backend (port 4000)
cd server && npm run dev

# Terminal 2 — frontend (port 5173)
cd client && npm run dev
```

## Structure
```
priusparts/
├── client/          # React + Vite + TypeScript
│   └── src/
│       ├── components/   # Navbar, PartCard, CartDrawer, etc.
│       ├── pages/        # Home, Catalog, Cart, Admin, About
│       ├── store/        # Zustand cart + auth store
│       ├── hooks/        # useProducts, useCart, useAuth
│       ├── lib/          # axios instance, utils
│       └── types/        # shared TypeScript types
└── server/          # Express + Prisma + TypeScript
    └── src/
        ├── routes/       # products, orders, auth, admin
        ├── middleware/   # auth guard, admin guard
        └── prisma/       # schema, seed
```

## Tech stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Zustand, TanStack Query, React Router v6
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, Stripe, Zod
- **Deployment**: Vercel (client), Railway (server), Neon (DB)
