# Frontend Integration Tasks - Ordered Checklist

## Phase 1: API Infrastructure (Foundation)

### Task 1: Create API Client Utility
- [ ] Create `src/utils/api.ts`
- [ ] Set base URL (`http://localhost:4000/api/v1` or from `VITE_API_URL` env var)
- [ ] Implement `api.get<T>(endpoint, params?)` method
- [ ] Implement `api.post<T>(endpoint, data)` method
- [ ] Implement `api.put<T>(endpoint, data)` method
- [ ] Implement `api.delete<T>(endpoint)` method
- [ ] Add error handling (network errors, API errors)
- [ ] Add TypeScript types matching backend `ApiResponse<T>`
- [ ] Test API client with a simple GET request

---

## Phase 2: Page Connections (Priority Order)

### Task 2: Connect Leaderboard Page ⭐ START HERE
**File**: `src/pages/Leaderboard.tsx`

- [ ] Import API client
- [ ] Add state: `data`, `isLoading`, `error`
- [ ] Fetch leaderboard on component mount (`GET /api/v1/leaderboard`)
- [ ] Replace hardcoded data with API response
- [ ] Display real user data (name, points, level, badges)
- [ ] Format points with commas (e.g., "1,240")
- [ ] Add loading state (skeleton loaders matching table structure)
- [ ] Add error state (user-friendly error message + retry button)
- [ ] Add empty state ("No users yet. Be the first!")
- [ ] Make responsive:
  - [ ] Desktop: Full table with all columns
  - [ ] Tablet: Scrollable table with horizontal scroll
  - [ ] Mobile: Card-based layout (stack vertically)
- [ ] Add visual hierarchy (highlight top 3 users with gold/silver/bronze)
- [ ] Style badges as chips/pills
- [ ] Test on mobile, tablet, desktop

---

### Task 3: Connect Pins Page - List View
**File**: `src/pages/Pins.tsx`

- [ ] Import API client
- [ ] Add state: `pins`, `isLoading`, `error`, `filters`, `page`
- [ ] Fetch pins on mount (`GET /api/v1/pins`)
- [ ] Replace hardcoded data with API response
- [ ] Display pin cards with metadata:
  - [ ] Image thumbnail (if photoUrl exists)
  - [ ] Status badge (color-coded: green=resolved, yellow=escalated, red=open)
  - [ ] Severity indicator (icon + color)
  - [ ] Category tag
  - [ ] Verification score
  - [ ] Location (address truncated on mobile)
- [ ] Add loading state (skeleton cards matching pin card structure)
- [ ] Add error state
- [ ] Add empty state ("No pins found. Create the first one!")
- [ ] Make responsive:
  - [ ] Desktop: Grid layout (2-3 columns)
  - [ ] Tablet: Grid layout (2 columns)
  - [ ] Mobile: Single column stack
- [ ] Test on mobile, tablet, desktop

---

### Task 4: Add Pins Page - Filters & Pagination
**File**: `src/pages/Pins.tsx`

- [ ] Add filter controls (status, severity, category dropdowns)
- [ ] Implement filter functionality (update query params on filter change)
- [ ] Add pagination controls:
  - [ ] Desktop: Page numbers + prev/next buttons
  - [ ] Mobile: "Load More" button or infinite scroll
- [ ] Update API call to include query params (`?status=open&severity=high&page=1&limit=20`)
- [ ] Display pagination metadata (total, current page, total pages)
- [ ] Make filter bar responsive:
  - [ ] Desktop: Horizontal filter bar with dropdowns
  - [ ] Mobile: Collapsible filter panel or bottom sheet
- [ ] Test filters work correctly
- [ ] Test pagination works correctly

---

### Task 5: Connect Dataset Page
**File**: `src/pages/Dataset.tsx`

- [ ] Import API client
- [ ] Add state: `data`, `isLoading`, `error`
- [ ] Fetch dataset on mount (`GET /api/v1/dataset`)
- [ ] Replace hardcoded data with API response
- [ ] Display data in table format
- [ ] Show record count from meta
- [ ] Add loading state (skeleton table rows)
- [ ] Add error state
- [ ] Add empty state ("No data available yet")
- [ ] Implement download JSON button:
  - [ ] Create downloadable JSON file
  - [ ] Show loading state while generating
  - [ ] Display file size or record count
- [ ] Format data display:
  - [ ] Truncate long descriptions with "..." (expand on click)
  - [ ] Color-code severity (red=critical, orange=high, yellow=medium, green=low)
  - [ ] Format dates (e.g., "2 days ago" or "Jan 15, 2024")
- [ ] Make responsive:
  - [ ] Desktop: Full table with all columns
  - [ ] Tablet: Horizontal scroll with sticky first column
  - [ ] Mobile: Card-based layout or simplified table
- [ ] Test download functionality
- [ ] Test on mobile, tablet, desktop

---

### Task 6: Connect Home/Dashboard Page
**File**: `src/pages/Home.tsx`

- [ ] Import API client
- [ ] Add state for stats: `activePinsCount`, `datasetSize`, `isLoading`, `error`
- [ ] Fetch active pins count (`GET /api/v1/pins?status=open`)
- [ ] Fetch dataset stats (`GET /api/v1/dataset` - use meta.recordCount)
- [ ] Replace hardcoded stats with real data
- [ ] Display key metrics cards:
  - [ ] Active pins count
  - [ ] Verification rate (calculate from pins)
  - [ ] Dataset size
- [ ] Add animated number counters (count up on load)
- [ ] Add trend indicators (↑/↓ with percentage) - if applicable
- [ ] Fetch recent pins (last 3-5 pins)
- [ ] Display recent pins preview section
- [ ] Add quick action buttons (Create Pin, View Leaderboard)
- [ ] Add loading state (skeleton cards)
- [ ] Add error state
- [ ] Add empty state (welcome message with CTA)
- [ ] Make responsive:
  - [ ] Stats cards: Desktop (3-4 in row), Tablet (2x2 grid), Mobile (single column)
  - [ ] Recent pins: Horizontal scroll on mobile
  - [ ] Quick actions: Desktop (button group), Mobile (FAB or bottom bar)
- [ ] Test on mobile, tablet, desktop

---

## Phase 3: Interactive Features

### Task 7: Create Pin Form
**File**: `src/pages/Pins.tsx` or `src/components/CreatePinForm.tsx`

- [ ] Create form component (modal or separate page)
- [ ] Add form fields:
  - [ ] Description (textarea, required)
  - [ ] Severity (dropdown: low, medium, high, critical)
  - [ ] Location (lat, lng, address - or use map picker)
  - [ ] Photo URL (optional text input or file upload)
- [ ] Add form validation
- [ ] Call AI analyze endpoint (`POST /api/v1/ai/analyze`) on description change
- [ ] Display AI analysis preview (category, recommended agency, confidence)
- [ ] Submit form (`POST /api/v1/pins`)
- [ ] Show success message
- [ ] Refresh pins list after creation
- [ ] Handle errors
- [ ] Make form responsive
- [ ] Test form submission

---

### Task 8: Add Verification Voting UI
**File**: `src/pages/Pins.tsx` or `src/components/PinCard.tsx`

- [ ] Add upvote/downvote buttons to each pin card
- [ ] Track user's vote state (if already voted, disable or show current vote)
- [ ] Call verification endpoint (`POST /api/v1/verifications`)
- [ ] Update pin's verification stats optimistically
- [ ] Show verification score prominently
- [ ] Handle errors (e.g., already voted)
- [ ] Add loading state on button click
- [ ] Make buttons responsive and accessible
- [ ] Test voting functionality

---

### Task 9: Add Resolve Pin Action
**File**: `src/pages/Pins.tsx` or `src/components/PinCard.tsx`

- [ ] Add "Resolve" button to each pin card (only show for open/escalated pins)
- [ ] Add confirmation dialog before resolving
- [ ] Call resolve endpoint (`POST /api/v1/pins/:id/resolve`)
- [ ] Update pin status optimistically
- [ ] Show success message
- [ ] Refresh pins list or update local state
- [ ] Handle errors
- [ ] Make button responsive
- [ ] Test resolve functionality

---

## Phase 4: Polish & Enhancement

### Task 10: Add Shared Components
**Files**: `src/components/`

- [ ] Create `LoadingSpinner.tsx` component
- [ ] Create `ErrorMessage.tsx` component
- [ ] Create `EmptyState.tsx` component
- [ ] Create `SkeletonLoader.tsx` component
- [ ] Create `StatusBadge.tsx` component
- [ ] Create `SeverityIndicator.tsx` component
- [ ] Create `BadgeChip.tsx` component
- [ ] Refactor pages to use shared components
- [ ] Ensure consistent styling

---

### Task 11: Add TypeScript Types
**File**: `src/types.ts` or `src/types/index.ts`

- [ ] Copy/import types from backend (`backend/src/types/index.ts`)
- [ ] Create frontend-specific types if needed
- [ ] Type all API responses
- [ ] Type all component props
- [ ] Ensure type safety throughout

---

### Task 12: Environment Configuration
**File**: `.env` or `.env.local`

- [ ] Create `.env` file
- [ ] Add `VITE_API_URL=http://localhost:4000/api/v1`
- [ ] Update API client to use env variable
- [ ] Document environment variables in README

---

### Task 13: Error Handling Enhancement
**Files**: All pages

- [ ] Add consistent error handling across all pages
- [ ] Create error message utility function
- [ ] Handle different error types (400, 404, 500, network)
- [ ] Add retry functionality where appropriate
- [ ] Add error boundaries (optional, for production)

---

### Task 14: Responsive Design Polish
**Files**: All pages

- [ ] Test all pages on mobile (< 640px)
- [ ] Test all pages on tablet (640px - 1024px)
- [ ] Test all pages on desktop (> 1024px)
- [ ] Fix any responsive issues
- [ ] Ensure touch targets are adequate on mobile (min 44x44px)
- [ ] Test horizontal scrolling where needed
- [ ] Ensure text is readable on all screen sizes

---

### Task 15: Accessibility Improvements
**Files**: All pages

- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader (optional)
- [ ] Ensure color contrast meets WCAG standards
- [ ] Add focus indicators
- [ ] Ensure form labels are properly associated

---

### Task 16: Performance Optimization
**Files**: All pages

- [ ] Check for unnecessary re-renders
- [ ] Add React.memo where appropriate
- [ ] Optimize images (lazy loading, proper sizing)
- [ ] Debounce search/filter inputs
- [ ] Consider code splitting for large pages
- [ ] Test performance with browser DevTools

---

### Task 17: Final Testing
**Files**: All pages

- [ ] Test all API endpoints work correctly
- [ ] Test loading states show properly
- [ ] Test error states show properly
- [ ] Test empty states show properly
- [ ] Test all interactive elements (buttons, links, forms)
- [ ] Test filters and pagination
- [ ] Test responsive design on multiple devices
- [ ] Check for console errors
- [ ] Test error scenarios (network offline, API errors)
- [ ] Verify data persists correctly

---

## Summary

**Total Tasks**: 17
**Estimated Time**: 
- Phase 1: 2-3 hours
- Phase 2: 8-12 hours
- Phase 3: 6-8 hours
- Phase 4: 4-6 hours
**Total**: ~20-30 hours

**Priority Order**:
1. Tasks 1-2 (API client + Leaderboard) - **Do First**
2. Tasks 3-4 (Pins list + filters) - **Core functionality**
3. Tasks 5-6 (Dataset + Home) - **Complete basic pages**
4. Tasks 7-9 (Interactive features) - **Add user actions**
5. Tasks 10-17 (Polish) - **Enhancement and refinement**

