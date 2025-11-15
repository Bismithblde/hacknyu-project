# Backend Implementation Checklist

Quick reference for MVP implementation tasks.

## 🔴 Critical Fixes (Do First)

### 1. Duplicate Vote Prevention
- [ ] Add check in `recordVerification()` to prevent same user voting twice
- [ ] Use `store.listVerificationsForPin()` to check existing votes
- [ ] Return error if user already voted
- **File**: `services/pinService.ts`
- **Priority**: HIGH

### 2. Input Validation
- [ ] Validate location coordinates (lat: -90 to 90, lng: -180 to 180)
- [ ] Validate severity enum values
- [ ] Validate category enum values
- [ ] Validate required fields in all controllers
- **Files**: All controllers
- **Priority**: HIGH

### 3. Error Handling
- [ ] Add try-catch to all controller handlers
- [ ] Standardize error response format
- [ ] Add proper HTTP status codes
- **Files**: All controllers
- **Priority**: MEDIUM

---

## 🟡 High Priority Enhancements

### Pin Listing Enhancements
- [ ] Add query parameters: `?category=`, `?status=`, `?severity=`
- [ ] Add sorting: `?sortBy=createdAt&order=desc`
- [ ] Add pagination: `?page=1&limit=20`
- **File**: `controllers/pinController.ts` → `listPins()`

### User Stats Endpoint
- [ ] Create `GET /api/v1/users/:id/stats` endpoint
- [ ] Return: pins created, verified, resolved, points, badges, level
- **File**: `controllers/userController.ts`

### Points History (Optional)
- [ ] Track points awards with timestamps
- [ ] Add `GET /api/v1/users/:id/points-history` endpoint
- **File**: New service or extend `pointsService.ts`

---

## 🟢 Medium Priority Enhancements

### Dataset Filtering
- [ ] Add query params to dataset endpoint: `?category=`, `?severity=`, `?status=`
- [ ] Add date range: `?startDate=`, `?endDate=`
- [ ] Add CSV export option: `?format=csv`
- **File**: `controllers/datasetController.ts`

### Confirmation Improvements
- [ ] Add file upload handling (currently expects URL)
- [ ] Improve text extraction validation
- [ ] Add confirmation status tracking
- **Files**: `services/confirmationService.ts`, `controllers/confirmationController.ts`

### Resolution Enhancements
- [ ] Add resolution reason/notes field
- [ ] Add resolution photo requirement
- [ ] Track resolution time (createdAt → resolvedAt)
- **File**: `services/pinService.ts` → `markResolved()`

---

## 🔵 Low Priority / Nice to Have

### Analytics Endpoints
- [ ] `GET /api/v1/stats/overview` - Platform stats
- [ ] `GET /api/v1/stats/category-breakdown` - Issues by category
- [ ] `GET /api/v1/stats/severity-distribution` - Severity analysis
- **Files**: New `controllers/statsController.ts`, `services/statsService.ts`

### Pin Status History
- [ ] Track status changes with timestamps
- [ ] Add `GET /api/v1/pins/:id/history` endpoint
- **File**: Extend `Pin` type and `pinService.ts`

### Rate Limiting
- [ ] Add rate limiting middleware
- [ ] Limit: 100 requests per minute per IP
- [ ] Limit: 10 pin creations per hour per user
- **File**: New `middleware/rateLimit.ts`

---

## ✅ Already Implemented

- ✅ Pin CRUD operations
- ✅ AI analysis integration
- ✅ Verification voting system
- ✅ Points awarding system
- ✅ Leaderboard generation
- ✅ Dataset export
- ✅ Confirmation submission
- ✅ Resolution tracking
- ✅ In-memory data store with seed data

---

## 📝 Testing Tasks

### Unit Tests
- [ ] Test `aiService.ts` category detection
- [ ] Test `pointsService.ts` level progression
- [ ] Test `pinService.ts` verification aggregation
- [ ] Test `confirmationService.ts` validation

### Integration Tests
- [ ] Test pin creation → verification → resolution flow
- [ ] Test points awarding flow
- [ ] Test leaderboard generation
- [ ] Test dataset export

### API Tests
- [ ] Test all endpoints with Postman/Thunder Client
- [ ] Test error cases (missing fields, invalid IDs)
- [ ] Test query parameters
- [ ] Test authentication (if protecting routes)

---

## 🚀 Deployment Prep

- [ ] Document all environment variables
- [ ] Add error logging
- [ ] Configure CORS properly
- [ ] Test health check endpoint
- [ ] Review seed data for demo appropriateness
- [ ] Add API documentation (Swagger/OpenAPI optional)

---

## 📊 Success Criteria

- [ ] All critical fixes implemented
- [ ] Core workflows tested end-to-end
- [ ] No duplicate votes possible
- [ ] Input validation working
- [ ] Error handling consistent
- [ ] Performance acceptable (<200ms response time)
- [ ] Ready for demo

