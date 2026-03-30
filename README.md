# Gaming Features Admin Panel

A React admin dashboard for managing three gaming features: **Leaderboards**, **Raffles**, and **Prize Wheels**. Built with a modular feature-based architecture, each feature is fully self-contained with its own API layer, forms, pages, validation schemas, and types. Uses json-server as a mock REST backend.

## Architecture

### Modular Feature Structure

The application follows a strict modular architecture where each feature is an independent module. Features communicate with the outside world only through their exported route configuration.

**Dependency Rules:**

```
features/{leaderboard,raffle,wheel} --> shared/     (allowed)
features/* --> features/*                            (NEVER)
shared/ --> features/*                               (NEVER)
```

Each feature exports only its route config via `index.ts`. This means:
- A crash in one feature (caught by per-feature `ErrorBoundary`) does not affect others
- Features can be developed, tested, and deployed independently
- Teams can own entire features without merge conflicts in shared code

### Folder Structure

```
src/
├── app/                              # Application shell
│   ├── hooks/
│   │   └── useColorMode.ts           # Dark mode context + hook
│   ├── layout/
│   │   ├── Breadcrumbs.tsx           # Auto-generated breadcrumbs from route path
│   │   ├── FeatureBoundary.tsx       # Per-feature ErrorBoundary wrapper
│   │   ├── MainLayout.tsx            # Sidebar + TopBar + content area
│   │   ├── Sidebar.tsx               # Permanent drawer navigation (240px)
│   │   └── TopBar.tsx                # AppBar with breadcrumbs + dark mode toggle
│   ├── pages/
│   │   └── NotFoundPage.tsx          # 404 catch-all
│   ├── providers/
│   │   ├── AppProviders.tsx          # QueryClient, Theme, Localization, Snackbar
│   │   └── ThemeProvider.tsx         # MUI theme with light/dark mode + localStorage
│   ├── App.tsx                       # createBrowserRouter + RouterProvider
│   └── routes.tsx                    # Route config with per-feature ErrorBoundary
│
├── features/
│   ├── leaderboard/
│   │   ├── api/
│   │   │   ├── leaderboard.api.ts    # Axios CRUD functions
│   │   │   └── leaderboard.queries.ts # React Query hooks with toast notifications
│   │   ├── components/
│   │   │   ├── LeaderboardForm.tsx    # Create/Edit form with Zod validation
│   │   │   └── PrizeListField.tsx     # Dynamic prize list with useFieldArray
│   │   ├── constants/
│   │   │   ├── queryKeys.ts          # Query key factory pattern
│   │   │   └── routes.ts             # Route path constants
│   │   ├── pages/
│   │   │   ├── LeaderboardCreatePage.tsx
│   │   │   ├── LeaderboardDetailPage.tsx
│   │   │   ├── LeaderboardEditPage.tsx
│   │   │   └── LeaderboardListPage.tsx
│   │   ├── schemas/
│   │   │   └── leaderboard.schema.ts # Zod schema with cross-field validation
│   │   ├── types/
│   │   │   └── leaderboard.types.ts  # TypeScript interfaces
│   │   └── index.ts                  # Exports route config only
│   │
│   ├── raffle/                       # Same structure as leaderboard
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── RaffleForm.tsx        # Includes "Unlimited tickets" checkbox logic
│   │   │   └── RafflePrizeField.tsx  # Prize list with quantity field
│   │   ├── constants/
│   │   ├── pages/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── wheel/                        # Same structure as leaderboard
│       ├── api/
│       ├── components/
│       │   ├── AnimatedWheelPreview.tsx  # SVG wheel with CSS spin animation
│       │   ├── SegmentListField.tsx      # Drag-and-drop reorderable segments
│       │   ├── WheelForm.tsx             # Form with live static wheel preview
│       │   └── WheelPreview.tsx          # Static SVG wheel visualization
│       ├── constants/
│       ├── pages/
│       ├── schemas/
│       ├── types/
│       └── index.ts
│
├── shared/                           # Cross-cutting code
│   ├── api/
│   │   ├── apiClient.ts             # Axios instance (localhost:3001) + error interceptor
│   │   └── index.ts
│   ├── components/
│   │   ├── ConfirmDialog.tsx         # Reusable confirmation modal
│   │   ├── DataTable.tsx             # Generic table with pagination, sorting, DnD
│   │   ├── EmptyState.tsx            # Empty state placeholder
│   │   ├── ErrorBoundary.tsx         # React error boundary with retry
│   │   ├── FormColorPicker.tsx       # Color picker field for react-hook-form
│   │   ├── FormDatePicker.tsx        # MUI DatePicker with ISO string conversion
│   │   ├── FormSelect.tsx            # Select field for react-hook-form
│   │   ├── FormTextField.tsx         # Text field with auto number coercion
│   │   ├── LoadingSkeleton.tsx       # Loading placeholder
│   │   ├── PageHeader.tsx            # Page title + action button slot
│   │   ├── QueryErrorState.tsx       # Error state with retry button
│   │   ├── StatusChip.tsx            # Colored status badge
│   │   └── UnsavedChangesGuard.tsx   # Navigation blocker for dirty forms
│   ├── hooks/
│   │   ├── useConfirmDialog.ts       # Dialog open/close/confirm state
│   │   └── useUnsavedChanges.ts      # React Router navigation blocker
│   ├── types/
│   │   └── table.ts                  # Column<T>, SortDirection
│   └── utils/
│       ├── formatDate.ts             # formatDate ("Mar 26, 2026"), formatDateTime
│       └── toast.ts                  # showSuccess, showError via notistack
│
├── main.tsx                          # Entry point
└── vite-env.d.ts                     # Vite type declarations
```

### Path Aliases

| Alias | Maps to |
|-------|---------|
| `@/*` | `src/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |

Configured in both `tsconfig.app.json` and `vite.config.ts`.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI library |
| TypeScript | 5.9.3 | Type safety (strict mode) |
| Vite | 8.0.1 | Build tool and dev server |
| MUI (Material UI) | 5.18.0 | Component library |
| MUI X Date Pickers | 8.27.2 | Date picker components |
| React Router | 6.30.3 | Client-side routing |
| TanStack React Query | 5.95.2 | Server state management and caching |
| React Hook Form | 7.72.0 | Form state management |
| Zod | 4.3.6 | Schema validation |
| @hookform/resolvers | 5.2.2 | Zod-to-React Hook Form bridge |
| Axios | 1.13.6 | HTTP client |
| notistack | 3.0.2 | Toast notifications |
| @dnd-kit/core | 6.3.1 | Drag-and-drop framework |
| @dnd-kit/sortable | 10.0.0 | Sortable list preset for dnd-kit |
| date-fns | 4.1.0 | Date utility for MUI pickers |
| uuid | 13.0.0 | Unique ID generation |
| Emotion | 11.14.0 | CSS-in-JS (MUI styling engine) |
| json-server | 0.17.4 | Mock REST API backend |
| ESLint | 9.39.4 | Linting (flat config) |
| concurrently | 9.2.1 | Run multiple npm scripts in parallel |

## Getting Started

### Prerequisites

- **Node.js** >= 18 (recommended: 22+)
- **npm** >= 9

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/badujgenti/gaming-features-admin-panel.git
cd gaming-features-admin-panel

# 2. Install dependencies
npm install

# 3. Start development servers
npm run dev
```

This starts both servers concurrently:
- **Frontend**: http://localhost:5173
- **API (json-server)**: http://localhost:3001

The mock database is stored in `db.json` at the project root. It comes pre-seeded with sample leaderboards, raffles, and wheels.

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `concurrently "npm run dev:client" "npm run dev:server"` | Start both Vite and json-server concurrently |
| `npm run dev:client` | `vite` | Start Vite dev server only (port 5173) |
| `npm run dev:server` | `json-server --watch db.json --port 3001` | Start json-server only (port 3001, watches db.json) |
| `npm run build` | `tsc -b && vite build` | Type-check with TypeScript then build for production |
| `npm run lint` | `eslint .` | Run ESLint with flat config |
| `npm run preview` | `vite preview` | Preview the production build locally |

## API Reference

Base URL: `http://localhost:3001`

All list endpoints support these query parameters (json-server convention):

| Parameter | Type | Description |
|---|---|---|
| `_page` | number | Page number (1-based) |
| `_limit` | number | Items per page |
| `_sort` | string | Field to sort by |
| `_order` | `asc` \| `desc` | Sort direction |
| `status` | string | Filter by status |

Total count is returned in the `x-total-count` response header.

---

### Leaderboards

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/leaderboards` | List all leaderboards |
| `GET` | `/leaderboards/:id` | Get single leaderboard |
| `POST` | `/leaderboards` | Create leaderboard |
| `PATCH` | `/leaderboards/:id` | Update leaderboard |
| `DELETE` | `/leaderboards/:id` | Delete leaderboard |

**Leaderboard shape:**

```typescript
{
  id: string
  title: string
  description: string
  startDate: string              // ISO 8601
  endDate: string                // ISO 8601
  status: 'draft' | 'active' | 'completed'
  scoringType: 'points' | 'wins' | 'wagered'
  prizes: Array<{
    id: string
    rank: number
    name: string
    type: 'coins' | 'freeSpin' | 'bonus'
    amount: number
    imageUrl: string
  }>
  maxParticipants: number
  createdAt: string
  updatedAt: string
}
```

---

### Raffles

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/raffles` | List all raffles |
| `GET` | `/raffles/:id` | Get single raffle |
| `POST` | `/raffles` | Create raffle |
| `PATCH` | `/raffles/:id` | Update raffle |
| `DELETE` | `/raffles/:id` | Delete raffle |

**Raffle shape:**

```typescript
{
  id: string
  name: string
  description: string
  startDate: string              // ISO 8601
  endDate: string                // ISO 8601
  drawDate: string               // ISO 8601
  status: 'draft' | 'active' | 'drawn' | 'cancelled'
  ticketPrice: number
  maxTicketsPerUser: number
  prizes: Array<{
    id: string
    name: string
    type: 'coins' | 'freeSpin' | 'bonus'
    amount: number
    quantity: number
    imageUrl: string
  }>
  totalTicketLimit: number | null   // null = unlimited
  createdAt: string
  updatedAt: string
}
```

---

### Wheels

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/wheels` | List all wheels |
| `GET` | `/wheels/:id` | Get single wheel |
| `POST` | `/wheels` | Create wheel |
| `PATCH` | `/wheels/:id` | Update wheel |
| `DELETE` | `/wheels/:id` | Delete wheel |

**Wheel shape:**

```typescript
{
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'inactive'
  segments: Array<{
    id: string
    label: string
    color: string                 // Hex color (#FF0000)
    weight: number                // Probability weight (all must sum to 100)
    prizeType: 'coins' | 'freeSpin' | 'bonus' | 'nothing'
    prizeAmount: number           // Must be 0 when prizeType is 'nothing'
    imageUrl: string
  }>
  maxSpinsPerUser: number
  spinCost: number
  backgroundColor: string        // Hex color
  borderColor: string            // Hex color
  createdAt: string
  updatedAt: string
}
```

## Design Decisions

### რატომ მოდულარული feature-based არქიტექტურა?

პროექტი სამ დამოუკიდებელ gaming ფიჩერს მართავს: ლიდერბორდები, გათამაშებები და საპრიზო ბორბლები. თითოეული ფიჩერი სრულიად თვითკმარია — აქვს საკუთარი API ფენა, კომპონენტები, გვერდები, ვალიდაციის სქემები და ტიპები. ფიჩერებს შორის იმპორტი აკრძალულია კონვენციით. ეს ნიშნავს, რომ ერთ ფიჩერში მომხდარი შეცდომა (ErrorBoundary-ით დაჭერილი) არ აფექტებს დანარჩენებს. გუნდის წევრებს შეუძლიათ სრული ფიჩერის მფლობელობა merge conflict-ების გარეშე. ახალი ფიჩერის დამატება ნიშნავს ახალი დირექტორიის შექმნას `features/`-ში და მარშრუტების რეგისტრაციას `routes.tsx`-ში — არსებული კოდი არ იცვლება.

### რატომ TanStack Query და არა Redux?

ამ აპლიკაციაში state-ის 90%+ სერვერული მონაცემებია (ლიდერბორდების სია, გათამაშების დეტალები და ა.შ.). TanStack Query სწორედ ამ პრობლემას ხსნის: ავტომატური caching, background refetch, stale-while-revalidate სტრატეგია, loading/error state-ები, და cache invalidation mutation-ების შემდეგ. Redux-ისთვის ეს ყველაფერი ხელით უნდა დაგვეწერა: action-ები, reducer-ები, thunk-ები, normalization. TanStack Query-ით mutation hook-ი ავტომატურად ანახლებს cache-ს, აჩვენებს toast notification-ს და აბრუნებს loading state-ს — ყველაფერი ერთ ადგილას, boilerplate-ის გარეშე.

### რატომ Zod და არა Yup?

Zod-ი TypeScript-first ბიბლიოთეკაა — სქემიდან ავტომატურად გამოდის TypeScript ტიპი `z.infer<typeof schema>`-ით, რაც ნიშნავს რომ ფორმის ტიპი და ვალიდაცია ყოველთვის სინქრონიზებულია. Yup-ში ტიპები ცალკე უნდა განისაზღვროს. Zod-ის `.refine()` მეთოდი კომპლექსური cross-field ვალიდაციისთვის გამოიყენება: მაგალითად, ბორბლის სეგმენტების წონების ჯამი ზუსტად 100 უნდა იყოს, ან გათამაშების draw date end date-ის შემდეგ უნდა იყოს. ეს ლოგიკა სქემაშივე ცხოვრობს და არა კომპონენტში.
