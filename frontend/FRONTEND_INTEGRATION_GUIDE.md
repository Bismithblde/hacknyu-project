# Frontend-Backend Integration Guide

## Overview

This guide outlines how to connect the frontend React app to the backend API, with focus on responsive design and intuitive UI/UX patterns.

---

## 🎯 Integration Checklist

### Phase 1: API Infrastructure

#### 1.1 Create API Client Utility
**File**: `src/utils/api.ts`

**Purpose**: Centralized API client with:
- Base URL configuration (`http://localhost:4000/api/v1`)
- Error handling
- Request/response interceptors
- Type-safe API calls

**Key Features**:
```typescript
- api.get<T>(endpoint, params?)
- api.post<T>(endpoint, data)
- api.put<T>(endpoint, data)
- api.delete<T>(endpoint)
- Automatic error handling
- Type-safe responses matching backend ApiResponse<T>
```

---

### Phase 2: Page Connections (Priority Order)

#### 2.1 Leaderboard Page ⭐ START HERE
**File**: `src/pages/Leaderboard.tsx`

**Backend Endpoint**: `GET /api/v1/leaderboard`

**What to Connect**:
- ✅ Fetch leaderboard data on mount
- ✅ Display real user data (name, points, level, badges)
- ✅ Show loading state while fetching
- ✅ Handle empty state (no users)
- ✅ Error handling with user-friendly message

**UI/UX Requirements**:
- **Responsive Table**: 
  - Desktop: Full table with all columns
  - Tablet: Scrollable table with horizontal scroll
  - Mobile: Card-based layout (stack vertically, one user per card)
- **Visual Hierarchy**:
  - Top 3 users get highlighted (gold/silver/bronze styling)
  - Badges displayed as chips/pills
  - Points formatted with commas (e.g., "1,240")
- **Loading State**: Skeleton loaders matching table structure
- **Empty State**: Friendly message "No users yet. Be the first!"

---

#### 2.2 Pins Page
**File**: `src/pages/Pins.tsx`

**Backend Endpoints**: 
- `GET /api/v1/pins` (with query params: `?status=open&severity=high&category=pothole&page=1&limit=20`)
- `POST /api/v1/pins` (create new pin)
- `POST /api/v1/pins/:id/resolve` (resolve pin)

**What to Connect**:
- ✅ Fetch pins list with filters
- ✅ Display pin cards with all metadata
- ✅ Filter controls (status, severity, category dropdowns)
- ✅ Search/filter functionality
- ✅ Pagination controls
- ✅ Create pin form (modal or separate page)
- ✅ Resolve pin action (button on each pin card)
- ✅ Verification voting (upvote/downvote buttons)

**UI/UX Requirements**:
- **Responsive Layout**:
  - Desktop: Grid layout (2-3 columns)
  - Tablet: Grid layout (2 columns)
  - Mobile: Single column stack
- **Pin Card Design**:
  - Image thumbnail (if photoUrl exists)
  - Status badge (color-coded: green=resolved, yellow=escalated, red=open)
  - Severity indicator (icon + color)
  - Category tag
  - Verification score display
  - Location (address truncated on mobile)
  - Action buttons (Verify, Resolve, View Details)
- **Filter Bar**:
  - Desktop: Horizontal filter bar with dropdowns
  - Mobile: Collapsible filter panel or bottom sheet
- **Loading State**: Skeleton cards matching pin card structure
- **Empty State**: "No pins found. Create the first one!"
- **Pagination**: 
  - Desktop: Page numbers + prev/next
  - Mobile: Infinite scroll or "Load More" button

---

#### 2.3 Dataset Page
**File**: `src/pages/Dataset.tsx`

**Backend Endpoint**: `GET /api/v1/dataset`

**What to Connect**:
- ✅ Fetch dataset on mount
- ✅ Display data in table format
- ✅ Download JSON button (creates downloadable file)
- ✅ Show record count from meta
- ✅ Filter by category/severity (optional enhancement)

**UI/UX Requirements**:
- **Responsive Table**:
  - Desktop: Full table with all columns
  - Tablet: Horizontal scroll with sticky first column
  - Mobile: Card-based layout or simplified table
- **Download Button**:
  - Prominent, always visible
  - Shows file size or record count
  - Loading state while generating download
- **Data Display**:
  - Truncate long descriptions with "..." and expand on click
  - Color-code severity (red=critical, orange=high, yellow=medium, green=low)
  - Format dates (e.g., "2 days ago" or "Jan 15, 2024")
- **Loading State**: Skeleton table rows
- **Empty State**: "No data available yet"

---

#### 2.4 Home/Dashboard Page
**File**: `src/pages/Home.tsx`

**Backend Endpoints**:
- `GET /api/v1/pins?status=open` (for active pins count)
- `GET /api/v1/dataset` (for dataset stats)
- `GET /api/v1/stats/overview` (if you create this endpoint)

**What to Connect**:
- ✅ Fetch real stats (active pins count, verification rate, dataset size)
- ✅ Display key metrics cards
- ✅ Recent pins preview (last 3-5 pins)
- ✅ Quick actions (Create Pin, View Leaderboard)

**UI/UX Requirements**:
- **Stats Cards**:
  - Desktop: 3-4 cards in a row
  - Tablet: 2x2 grid
  - Mobile: Single column stack
  - Animated number counters (count up on load)
  - Trend indicators (↑/↓ with percentage)
- **Recent Pins Section**:
  - Horizontal scroll on mobile
  - Click to navigate to full pin details
- **Quick Actions**:
  - Desktop: Button group
  - Mobile: Floating action button (FAB) or bottom bar
- **Loading State**: Skeleton cards
- **Empty State**: Welcome message with CTA to create first pin

---

## 🎨 UI/UX Design Patterns

### Color System
```typescript
// Status Colors
open: red-500
escalated: yellow-500
resolved: green-500

// Severity Colors
critical: red-600
high: orange-500
medium: yellow-500
low: green-500

// Primary Actions
primary: emerald-500
secondary: slate-500
danger: red-500
```

### Typography Scale
- **Page Titles**: `text-3xl font-bold` (24px)
- **Section Headers**: `text-xl font-semibold` (20px)
- **Card Titles**: `text-lg font-semibold` (18px)
- **Body Text**: `text-sm` or `text-base` (14px/16px)
- **Labels**: `text-xs uppercase tracking-wide` (12px)

### Spacing System
- **Card Padding**: `p-5` or `p-6` (20px/24px)
- **Card Gap**: `gap-4` or `gap-6` (16px/24px)
- **Section Spacing**: `space-y-6` (24px vertical)
- **Page Padding**: `px-6 py-10` (24px horizontal, 40px vertical)

### Component Patterns

#### Loading States
```tsx
// Skeleton Loader Pattern
<div className="animate-pulse">
  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
  <div className="h-4 bg-slate-200 rounded w-1/2 mt-2"></div>
</div>
```

#### Error States
```tsx
// Error Message Pattern
<div className="rounded-lg bg-red-50 border border-red-200 p-4">
  <p className="text-red-800 font-semibold">Error</p>
  <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
  <button onClick={retry}>Try Again</button>
</div>
```

#### Empty States
```tsx
// Empty State Pattern
<div className="text-center py-12">
  <p className="text-slate-400 text-lg">No items found</p>
  <p className="text-slate-500 text-sm mt-2">Be the first to create one!</p>
  <button className="mt-4">Create Now</button>
</div>
```

---

## 📱 Responsive Breakpoints

Use Tailwind's default breakpoints:
- **Mobile**: `< 640px` (default, no prefix)
- **Tablet**: `sm: 640px` and `md: 768px`
- **Desktop**: `lg: 1024px` and `xl: 1280px`

### Responsive Patterns

#### Cards/Grids
```tsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

#### Tables
```tsx
// Responsive Table
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Desktop: full table */}
    {/* Mobile: consider card layout instead */}
  </table>
</div>
```

#### Navigation
```tsx
// Responsive Nav
<nav className="hidden md:flex gap-4">
  {/* Desktop nav */}
</nav>
<button className="md:hidden">
  {/* Mobile menu button */}
</button>
```

---

## 🔄 State Management

### Recommended Approach
- **Local State**: Use `useState` for component-specific state
- **Server State**: Use `useEffect` + `useState` for API calls
- **Loading States**: Track `isLoading`, `error`, `data` separately
- **Future Enhancement**: Consider React Query/TanStack Query for caching

### State Pattern
```typescript
const [data, setData] = useState<DataType | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<DataType>('/endpoint');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);
```

---

## 🎯 Implementation Priority

### Week 1: Core Integration
1. ✅ Create API utility (`utils/api.ts`)
2. ✅ Connect Leaderboard page
3. ✅ Connect Pins page (list view)
4. ✅ Add loading/error states

### Week 2: Enhanced Features
1. ✅ Connect Dataset page
2. ✅ Connect Home/Dashboard page
3. ✅ Add filters and search
4. ✅ Add pagination

### Week 3: Polish
1. ✅ Add create pin form
2. ✅ Add verification voting UI
3. ✅ Add resolve pin action
4. ✅ Polish responsive design
5. ✅ Add animations/transitions

---

## 🐛 Error Handling Best Practices

### API Errors
- **400 Bad Request**: Show validation error message
- **404 Not Found**: Show "Not found" with helpful message
- **500 Server Error**: Show generic error, suggest retry
- **Network Error**: Show "Connection failed, check internet"

### User-Friendly Messages
```typescript
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('Network')) {
      return 'Unable to connect. Please check your internet connection.';
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};
```

---

## ✅ Testing Checklist

After connecting each page:

- [ ] Data displays correctly
- [ ] Loading state shows while fetching
- [ ] Error state shows on failure
- [ ] Empty state shows when no data
- [ ] Responsive on mobile (< 640px)
- [ ] Responsive on tablet (640px - 1024px)
- [ ] Responsive on desktop (> 1024px)
- [ ] All interactive elements work (buttons, links)
- [ ] No console errors
- [ ] Accessibility: keyboard navigation works
- [ ] Performance: no unnecessary re-renders

---

## 📝 Notes

- **API Base URL**: Use environment variable `VITE_API_URL` (default: `http://localhost:4000/api/v1`)
- **CORS**: Already configured on backend
- **Type Safety**: Use TypeScript types from backend (`types/index.ts`)
- **Error Boundaries**: Consider adding React Error Boundary for production
- **Optimistic Updates**: Consider for better UX (update UI before API confirms)

---

## 🔗 Related Files

- Backend API docs: `backend/README.md`
- Backend types: `backend/src/types/index.ts`
- Frontend types: `frontend/src/types.ts` (create if needed)

