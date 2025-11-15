# Independent Subtasks - Parallel Work Guide

This document breaks down all tasks into **independent subtasks** that can be worked on simultaneously without conflicts. Each subtask is self-contained and won't interfere with others.

---

## ✅ ALREADY COMPLETED (No work needed)

- ✅ **Duplicate Vote Prevention** - Already implemented in `pinService.ts` (lines 65-72)
- ✅ **Pin Listing Filters/Sorting/Pagination** - Already implemented in `pinController.ts`
- ✅ **User Stats Endpoint** - Already exists: `GET /api/v1/users/:id/stats`
- ✅ **Input Validation** - Comprehensive validation utilities exist in `utils/validation.ts`
- ✅ **Most Error Handling** - Most controllers already have try-catch blocks

---

## 🟢 BACKEND TASKS (Can work in parallel)

### Group A: Error Handling Improvements (Independent Files)

#### Subtask A1: Add Error Handling to Leaderboard Controller
- **File**: `backend/src/controllers/leaderboardController.ts`
- **Task**: Wrap `getLeaderboard()` call in try-catch
- **Changes**: Add try-catch block, return 500 on error
- **Time**: 5 minutes
- **Conflicts**: None

#### Subtask A2: Add Error Handling to Dataset Controller
- **File**: `backend/src/controllers/datasetController.ts`
- **Task**: Wrap `getPublicDataset()` call in try-catch
- **Changes**: Add try-catch block, return 500 on error
- **Time**: 5 minutes
- **Conflicts**: None

#### Subtask A3: Add Error Handling to Confirmation List Handler
- **File**: `backend/src/controllers/confirmationController.ts` → `listConfirmationHandler()`
- **Task**: Wrap `listConfirmations()` call in try-catch
- **Changes**: Add try-catch block, return 500 on error
- **Time**: 5 minutes
- **Conflicts**: None

#### Subtask A4: Add Error Handling to Confirmation Create Handler
- **File**: `backend/src/controllers/confirmationController.ts` → `createConfirmation()`
- **Task**: Wrap `submitConfirmation()` call in try-catch
- **Changes**: Add try-catch block, handle specific errors (404 for pin not found)
- **Time**: 10 minutes
- **Conflicts**: None

#### Subtask A5: Add Error Handling to Points Rules Handler
- **File**: `backend/src/controllers/pointsController.ts` → `listPointRules()`
- **Task**: Wrap `getPointRules()` call in try-catch
- **Changes**: Add try-catch block, return 500 on error
- **Time**: 5 minutes
- **Conflicts**: None

#### Subtask A6: Add Error Handling to AI Controller
- **File**: `backend/src/controllers/aiController.ts` → `analyzeHazardHandler()`
- **Task**: Wrap `analyzeHazard()` call in try-catch
- **Changes**: Add try-catch block, return 500 on error
- **Time**: 5 minutes
- **Conflicts**: None

---

### Group B: Dataset Filtering Enhancements (Independent Feature)

#### Subtask B1: Add Query Parameters to Dataset Controller
- **File**: `backend/src/controllers/datasetController.ts`
- **Task**: Add filtering by category, severity, status
- **Changes**: 
  - Add query params: `category`, `severity`, `status`
  - Filter `getPublicDataset()` results
  - Update response meta with filtered count
- **Time**: 30 minutes
- **Conflicts**: None (only reads from service)

#### Subtask B2: Add Date Range Filtering to Dataset Controller
- **File**: `backend/src/controllers/datasetController.ts`
- **Task**: Add date range filtering
- **Changes**:
  - Add query params: `startDate`, `endDate`
  - Filter by `createdAt` date range
  - Validate date format
- **Time**: 30 minutes
- **Conflicts**: None (works with B1, just adds more filters)

#### Subtask B3: Add CSV Export Format to Dataset Controller
- **File**: `backend/src/controllers/datasetController.ts`
- **Task**: Add CSV export option
- **Changes**:
  - Add query param: `format=csv`
  - Convert JSON to CSV when format is csv
  - Set appropriate Content-Type header
- **Time**: 45 minutes
- **Conflicts**: None (adds new response format)

---

### Group C: Resolution Enhancements (Independent Feature)

#### Subtask C1: Add Resolution Notes Field
- **Files**: 
  - `backend/src/types/index.ts` (add `resolutionNotes?: string` to Pin)
  - `backend/src/services/pinService.ts` → `markResolved()` (accept notes param)
  - `backend/src/controllers/pinController.ts` → `resolvePinHandler()` (accept notes in body)
- **Task**: Add optional resolution notes/reason field
- **Changes**: Update types, service, and controller
- **Time**: 30 minutes
- **Conflicts**: None (adds optional field)

#### Subtask C2: Add Resolution Photo Requirement
- **Files**:
  - `backend/src/types/index.ts` (add `resolutionPhotoUrl?: string` to Pin)
  - `backend/src/services/pinService.ts` → `markResolved()` (accept photoUrl param)
  - `backend/src/controllers/pinController.ts` → `resolvePinHandler()` (accept photoUrl in body, validate URL)
- **Task**: Add optional resolution photo URL field
- **Changes**: Update types, service, and controller
- **Time**: 30 minutes
- **Conflicts**: None (adds optional field, works with C1)

#### Subtask C3: Track Resolution Time Metrics
- **Files**:
  - `backend/src/types/index.ts` (add `resolvedAt?: string` to Pin)
  - `backend/src/services/pinService.ts` → `markResolved()` (set resolvedAt timestamp)
- **Task**: Track when pin was resolved
- **Changes**: Add timestamp field, set on resolution
- **Time**: 15 minutes
- **Conflicts**: None (adds new field)

---

### Group D: Confirmation Improvements (Independent Feature)

#### Subtask D1: Improve Text Extraction Validation
- **File**: `backend/src/services/confirmationService.ts`
- **Task**: Enhance validation logic for reportText
- **Changes**: Add more robust text validation (min length, pattern matching)
- **Time**: 30 minutes
- **Conflicts**: None (improves existing validation)

#### Subtask D2: Add Confirmation Status Tracking
- **Files**:
  - `backend/src/types/index.ts` (add `status?: string` to ReportConfirmation)
  - `backend/src/services/confirmationService.ts` (set status: pending/approved/rejected)
- **Task**: Track confirmation status
- **Changes**: Add status field, set default status
- **Time**: 30 minutes
- **Conflicts**: None (adds new field)

---

### Group E: Analytics Endpoints (New Feature - Completely Independent)

#### Subtask E1: Create Stats Controller
- **File**: `backend/src/controllers/statsController.ts` (NEW FILE)
- **Task**: Create new controller file with overview endpoint
- **Changes**: 
  - Create file with `getOverview()` handler
  - Return platform stats (total pins, users, verifications, etc.)
- **Time**: 45 minutes
- **Conflicts**: None (new file)

#### Subtask E2: Create Stats Service
- **File**: `backend/src/services/statsService.ts` (NEW FILE)
- **Task**: Create service with stats calculation logic
- **Changes**:
  - Create `getOverviewStats()` function
  - Calculate totals from dataStore
- **Time**: 45 minutes
- **Conflicts**: None (new file, only reads from store)

#### Subtask E3: Add Category Breakdown Endpoint
- **Files**: 
  - `backend/src/services/statsService.ts` (add `getCategoryBreakdown()`)
  - `backend/src/controllers/statsController.ts` (add `getCategoryBreakdown()` handler)
- **Task**: Add endpoint for category statistics
- **Changes**: Count pins by category
- **Time**: 30 minutes
- **Conflicts**: None (new endpoint)

#### Subtask E4: Add Severity Distribution Endpoint
- **Files**:
  - `backend/src/services/statsService.ts` (add `getSeverityDistribution()`)
  - `backend/src/controllers/statsController.ts` (add `getSeverityDistribution()` handler)
- **Task**: Add endpoint for severity statistics
- **Changes**: Count pins by severity
- **Time**: 30 minutes
- **Conflicts**: None (new endpoint)

#### Subtask E5: Add Resolution Rate Endpoint
- **Files**:
  - `backend/src/services/statsService.ts` (add `getResolutionRate()`)
  - `backend/src/controllers/statsController.ts` (add `getResolutionRate()` handler)
- **Task**: Add endpoint for resolution metrics
- **Changes**: Calculate resolution rate, average resolution time
- **Time**: 45 minutes
- **Conflicts**: None (new endpoint)

#### Subtask E6: Register Stats Routes
- **File**: `backend/src/routes/index.ts` or create `backend/src/routes/stats.ts`
- **Task**: Add routes for stats endpoints
- **Changes**: Import controller, add routes, register in main router
- **Time**: 15 minutes
- **Conflicts**: None (adds routes)

---

### Group F: Rate Limiting (New Feature - Completely Independent)

#### Subtask F1: Create Rate Limit Middleware
- **File**: `backend/src/middleware/rateLimit.ts` (NEW FILE)
- **Task**: Create rate limiting middleware
- **Changes**:
  - Use `express-rate-limit` package (or implement custom)
  - Create middleware for general API (100 req/min)
  - Create middleware for pin creation (10 req/hour)
- **Time**: 1 hour
- **Conflicts**: None (new file)

#### Subtask F2: Apply Rate Limiting to Routes
- **Files**: `backend/src/routes/pins.ts`, `backend/src/routes/index.ts`
- **Task**: Apply rate limiting middleware to routes
- **Changes**: Import middleware, apply to pin creation route and general routes
- **Time**: 15 minutes
- **Conflicts**: None (adds middleware)

---

## 🔵 FRONTEND TASKS (Can work in parallel)

### Group G: API Infrastructure (Foundation - Do First)

#### Subtask G1: Create API Client Utility
- **File**: `frontend/src/utils/api.ts` (NEW FILE)
- **Task**: Create reusable API client
- **Changes**:
  - Create file with base URL from env
  - Implement `get<T>()`, `post<T>()`, `put<T>()`, `delete<T>()` methods
  - Add error handling
  - Add TypeScript types matching backend `ApiResponse<T>`
- **Time**: 1 hour
- **Conflicts**: None (new file)
- **Dependencies**: None (foundation for other frontend tasks)

---

### Group H: Page Integrations (Independent Pages)

#### Subtask H1: Connect Leaderboard Page
- **File**: `frontend/src/pages/Leaderboard.tsx`
- **Task**: Replace hardcoded data with API call
- **Changes**:
  - Import API client
  - Add state: `data`, `isLoading`, `error`
  - Fetch on mount: `GET /api/v1/leaderboard`
  - Replace hardcoded `leaders` array with API data
  - Add loading skeleton
  - Add error state
  - Add empty state
- **Time**: 1.5 hours
- **Conflicts**: None (only modifies Leaderboard.tsx)
- **Dependencies**: G1 (needs API client)

#### Subtask H2: Connect Dataset Page - Data Fetching
- **File**: `frontend/src/pages/Dataset.tsx`
- **Task**: Replace hardcoded data with API call
- **Changes**:
  - Import API client
  - Add state: `data`, `isLoading`, `error`
  - Fetch on mount: `GET /api/v1/dataset`
  - Replace hardcoded `datasetRows` with API data
  - Display record count from meta
  - Add loading skeleton
  - Add error state
- **Time**: 1 hour
- **Conflicts**: None (only modifies Dataset.tsx)
- **Dependencies**: G1 (needs API client)

#### Subtask H3: Add Dataset Download Functionality
- **File**: `frontend/src/pages/Dataset.tsx`
- **Task**: Implement JSON download button
- **Changes**:
  - Create download handler function
  - Convert data to JSON string
  - Create blob and download link
  - Update button onClick handler
  - Show loading state while generating
- **Time**: 30 minutes
- **Conflicts**: None (adds functionality to existing page)
- **Dependencies**: H2 (needs data from API)

#### Subtask H4: Connect Home Page - Stats Cards
- **File**: `frontend/src/pages/Home.tsx`
- **Task**: Replace hardcoded stats with API calls
- **Changes**:
  - Import API client
  - Add state for stats
  - Fetch active pins: `GET /api/v1/pins?status=open` (use meta.total)
  - Fetch dataset stats: `GET /api/v1/dataset` (use meta.recordCount)
  - Replace hardcoded numbers with real data
  - Add loading states
  - Add error handling
- **Time**: 1 hour
- **Conflicts**: None (only modifies Home.tsx)
- **Dependencies**: G1 (needs API client)

#### Subtask H5: Add Recent Pins to Home Page
- **File**: `frontend/src/pages/Home.tsx`
- **Task**: Display recent pins preview
- **Changes**:
  - Fetch recent pins: `GET /api/v1/pins?sortBy=createdAt&order=desc&limit=5`
  - Display pins in preview section
  - Add "View All" link to Pins page
- **Time**: 45 minutes
- **Conflicts**: None (adds section to Home.tsx)
- **Dependencies**: G1 (needs API client)

---

### Group I: Pins Page Enhancements (Independent Features)

#### Subtask I1: Add Filters UI to Pins Page
- **File**: `frontend/src/pages/Pins.tsx`
- **Task**: Add filter controls (status, severity, category dropdowns)
- **Changes**:
  - Add filter state
  - Create filter UI components (dropdowns)
  - Update API call to include query params
  - Make filters responsive (collapsible on mobile)
- **Time**: 1.5 hours
- **Conflicts**: None (adds UI, backend already supports filters)
- **Dependencies**: G1 (needs API client)

#### Subtask I2: Add Pagination to Pins Page
- **File**: `frontend/src/pages/Pins.tsx`
- **Task**: Add pagination controls
- **Changes**:
  - Add pagination state (page, limit)
  - Create pagination UI (page numbers, prev/next)
  - Update API call to include page/limit params
  - Display pagination metadata
  - Make responsive (simplified on mobile)
- **Time**: 1.5 hours
- **Conflicts**: None (adds UI, backend already supports pagination)
- **Dependencies**: G1 (needs API client)

#### Subtask I3: Add Verification Voting UI to Pins Page
- **File**: `frontend/src/pages/Pins.tsx`
- **Task**: Add upvote/downvote buttons
- **Changes**:
  - Add vote buttons to pin cards/popups
  - Track user's vote state (if voted, disable or show current vote)
  - Call API: `POST /api/v1/verifications`
  - Update verification score optimistically
  - Handle errors (already voted, etc.)
- **Time**: 2 hours
- **Conflicts**: None (adds interactive feature)
- **Dependencies**: G1 (needs API client)

#### Subtask I4: Add Resolve Pin Action to Pins Page
- **File**: `frontend/src/pages/Pins.tsx`
- **Task**: Add resolve button
- **Changes**:
  - Add "Resolve" button to pin cards (only for open/escalated pins)
  - Add confirmation dialog
  - Call API: `POST /api/v1/pins/:id/resolve`
  - Update pin status optimistically
  - Show success message
- **Time**: 1 hour
- **Conflicts**: None (adds interactive feature)
- **Dependencies**: G1 (needs API client)

---

### Group J: Shared Components (Independent Components)

#### Subtask J1: Create LoadingSpinner Component
- **File**: `frontend/src/components/LoadingSpinner.tsx` (NEW FILE)
- **Task**: Create reusable loading spinner
- **Changes**: Create component with spinner animation
- **Time**: 15 minutes
- **Conflicts**: None (new file)

#### Subtask J2: Create ErrorMessage Component
- **File**: `frontend/src/components/ErrorMessage.tsx` (NEW FILE)
- **Task**: Create reusable error message component
- **Changes**: Create component with error styling and retry button
- **Time**: 20 minutes
- **Conflicts**: None (new file)

#### Subtask J3: Create EmptyState Component
- **File**: `frontend/src/components/EmptyState.tsx` (NEW FILE)
- **Task**: Create reusable empty state component
- **Changes**: Create component with message and optional CTA
- **Time**: 20 minutes
- **Conflicts**: None (new file)

#### Subtask J4: Create SkeletonLoader Component
- **File**: `frontend/src/components/SkeletonLoader.tsx` (NEW FILE)
- **Task**: Create reusable skeleton loader
- **Changes**: Create component with shimmer animation
- **Time**: 30 minutes
- **Conflicts**: None (new file)

#### Subtask J5: Create StatusBadge Component
- **File**: `frontend/src/components/StatusBadge.tsx` (NEW FILE)
- **Task**: Create reusable status badge
- **Changes**: Create component with color-coded status (open/escalated/resolved)
- **Time**: 20 minutes
- **Conflicts**: None (new file)

#### Subtask J6: Create SeverityIndicator Component
- **File**: `frontend/src/components/SeverityIndicator.tsx` (NEW FILE)
- **Task**: Create reusable severity indicator
- **Changes**: Create component with icon + color for severity levels
- **Time**: 20 minutes
- **Conflicts**: None (new file)

#### Subtask J7: Create BadgeChip Component
- **File**: `frontend/src/components/BadgeChip.tsx` (NEW FILE)
- **Task**: Create reusable badge chip
- **Changes**: Create component for displaying user badges
- **Time**: 15 minutes
- **Conflicts**: None (new file)

---

### Group K: TypeScript Types (Independent)

#### Subtask K1: Create Frontend Types File
- **File**: `frontend/src/types.ts` or `frontend/src/types/index.ts` (NEW FILE)
- **Task**: Copy/import backend types
- **Changes**: 
  - Copy types from `backend/src/types/index.ts`
  - Create frontend-specific types if needed
  - Export all types
- **Time**: 30 minutes
- **Conflicts**: None (new file)

---

### Group L: Environment Configuration (Independent)

#### Subtask L1: Create Environment Configuration
- **File**: `frontend/.env` or `frontend/.env.local` (NEW FILE)
- **Task**: Set up environment variables
- **Changes**:
  - Create `.env` file
  - Add `VITE_API_URL=http://localhost:4000/api/v1`
  - Update API client to use env variable
- **Time**: 10 minutes
- **Conflicts**: None (new file)

---

## 📊 TASK SUMMARY BY PRIORITY

### 🔴 Critical (Do First)
- **G1**: Create API Client Utility (foundation for frontend)
- **H1**: Connect Leaderboard Page (quick win)
- **A1-A6**: Error Handling Improvements (quick fixes)

### 🟡 High Priority (Core Features)
- **H2-H5**: Connect Dataset and Home Pages
- **I1-I2**: Add Filters and Pagination to Pins
- **I3-I4**: Add Voting and Resolve Actions

### 🟢 Medium Priority (Enhancements)
- **B1-B3**: Dataset Filtering Enhancements
- **C1-C3**: Resolution Enhancements
- **D1-D2**: Confirmation Improvements
- **J1-J7**: Shared Components

### 🔵 Low Priority (Nice to Have)
- **E1-E6**: Analytics Endpoints
- **F1-F2**: Rate Limiting
- **K1**: TypeScript Types
- **L1**: Environment Configuration

---

## 🚀 RECOMMENDED PARALLEL WORK ASSIGNMENTS

### Teammate 1 (Backend Focus)
- **Session 1**: A1-A6 (Error Handling - 45 min)
- **Session 2**: B1-B3 (Dataset Filtering - 1.5 hours)
- **Session 3**: C1-C3 (Resolution Enhancements - 1.25 hours)
- **Session 4**: E1-E6 (Analytics Endpoints - 3.5 hours)

### Teammate 2 (Frontend Focus)
- **Session 1**: G1 (API Client - 1 hour)
- **Session 2**: H1 (Leaderboard - 1.5 hours)
- **Session 3**: H2-H3 (Dataset Page - 1.5 hours)
- **Session 4**: H4-H5 (Home Page - 1.75 hours)

### Teammate 3 (Frontend/Backend Mix)
- **Session 1**: I1-I2 (Pins Filters/Pagination - 3 hours)
- **Session 2**: I3-I4 (Voting/Resolve Actions - 3 hours)
- **Session 3**: J1-J7 (Shared Components - 2 hours)
- **Session 4**: D1-D2 (Confirmation Improvements - 1 hour)

### Teammate 4 (Polish/Infrastructure)
- **Session 1**: F1-F2 (Rate Limiting - 1.25 hours)
- **Session 2**: K1 (TypeScript Types - 30 min)
- **Session 3**: L1 (Environment Config - 10 min)
- **Session 4**: Testing and bug fixes

---

## ⚠️ NOTES

1. **No Conflicts**: All subtasks are designed to be independent. Multiple people can work simultaneously without merge conflicts.

2. **Dependencies**: Only G1 (API Client) is a dependency for frontend tasks. All backend tasks are independent.

3. **File Conflicts**: Tasks are organized to avoid editing the same files simultaneously:
   - Backend: Each subtask group touches different controllers/services
   - Frontend: Each subtask touches different pages/components

4. **Testing**: After completing subtasks, test independently before integration.

5. **Git Workflow**: Use feature branches for each subtask group to avoid conflicts.

