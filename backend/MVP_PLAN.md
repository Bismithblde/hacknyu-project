# Backend MVP Implementation Plan

## Overview

This document outlines the prioritized MVP plan for the backend of the Civic Hazard Hub. The backend is already scaffolded with all major routes and services. This plan focuses on **validating, testing, and enhancing** the core features for a successful demo.

---

## ✅ Already Scaffolded

All core backend modules are implemented:

- ✅ **Pins** - CRUD operations with AI analysis integration
- ✅ **AI Service** - Rule-based hazard classification
- ✅ **Verifications** - Community voting system
- ✅ **Confirmations** - Evidence upload and validation
- ✅ **Points System** - Gamification with levels and badges
- ✅ **Leaderboard** - User ranking by points
- ✅ **Dataset Export** - Public data endpoint
- ✅ **Data Store** - In-memory persistence with seed data
- ✅ **User Management** - Basic user CRUD

---

## 🎯 MVP Priority Phases

### Phase 1: Core Functionality (CRITICAL - Must Have)

**Goal**: Ensure the fundamental reporting and viewing workflow works flawlessly.

#### 1.1 Pin Creation & Listing ✅ DONE
- **Status**: ✅ Implemented
- **Endpoints**: 
  - `POST /api/v1/pins` - Create hazard report
  - `GET /api/v1/pins` - List all hazards
  - `GET /api/v1/pins/:id` - Get single hazard
- **Validation Needed**:
  - [ ] Test with various location formats
  - [ ] Verify AI analysis runs correctly
  - [ ] Ensure points are awarded on creation
  - [ ] Test duplicate image detection

#### 1.2 AI Analysis Integration ✅ DONE
- **Status**: ✅ Implemented
- **Endpoint**: `POST /api/v1/ai/analyze`
- **Enhancements Needed**:
  - [ ] Add more category keywords (traffic, sidewalk, etc.)
  - [ ] Improve severity detection accuracy
  - [ ] Test fraud flag detection edge cases
  - [ ] Consider adding confidence thresholds

#### 1.3 Basic Verification ✅ DONE
- **Status**: ✅ Implemented
- **Endpoint**: `POST /api/v1/verifications`
- **Validation Needed**:
  - [ ] Prevent duplicate votes from same user
  - [ ] Test vote aggregation logic
  - [ ] Verify points are awarded correctly
  - [ ] Test comment functionality

**Phase 1 Deliverable**: Users can report hazards, see them listed, and verify them. AI provides basic categorization.

---

### Phase 2: Gamification & Engagement (HIGH PRIORITY)

**Goal**: Make the platform engaging through points, badges, and leaderboards.

#### 2.1 Points System ✅ DONE
- **Status**: ✅ Implemented
- **Endpoints**:
  - `POST /api/v1/points` - Award points manually
  - `GET /api/v1/points/rules` - View point values
- **Enhancements Needed**:
  - [ ] Add rate limiting to prevent abuse
  - [ ] Verify level progression logic
  - [ ] Test badge awarding edge cases
  - [ ] Add points history/audit log (optional)

#### 2.2 Leaderboard ✅ DONE
- **Status**: ✅ Implemented
- **Endpoint**: `GET /api/v1/leaderboard`
- **Enhancements Needed**:
  - [ ] Add pagination (if > 100 users)
  - [ ] Add filtering by level/badges
  - [ ] Consider time-based leaderboards (weekly/monthly)

#### 2.3 User Profile Enhancement
- **Status**: ⚠️ Partial
- **Current**: Basic user CRUD exists
- **Needed**:
  - [ ] Add endpoint to get user stats (pins created, verified, etc.)
  - [ ] Add endpoint to get user's badge progress
  - [ ] Add endpoint to get user's recent activity

**Phase 2 Deliverable**: Users see their progress, compete on leaderboard, and earn badges.

---

### Phase 3: Data Quality & Trust (MEDIUM PRIORITY)

**Goal**: Ensure data quality through confirmations and resolution tracking.

#### 3.1 Confirmations System ✅ DONE
- **Status**: ✅ Implemented
- **Endpoints**:
  - `POST /api/v1/confirmations` - Submit evidence
  - `GET /api/v1/confirmations` - List confirmations
- **Enhancements Needed**:
  - [ ] Improve text extraction validation
  - [ ] Add file upload handling (currently expects URL)
  - [ ] Add confirmation status tracking
  - [ ] Test agency marker detection accuracy

#### 3.2 Resolution Tracking ✅ DONE
- **Status**: ✅ Implemented
- **Endpoint**: `POST /api/v1/pins/:id/resolve`
- **Enhancements Needed**:
  - [ ] Add resolution reason/notes
  - [ ] Add resolution photo requirement
  - [ ] Add auto-escalation for high-severity unresolved pins
  - [ ] Track resolution time metrics

**Phase 3 Deliverable**: High-quality data with verified confirmations and tracked resolutions.

---

### Phase 4: Open Data & Transparency (MEDIUM PRIORITY)

**Goal**: Make data accessible for public use and analysis.

#### 4.1 Dataset Export ✅ DONE
- **Status**: ✅ Implemented
- **Endpoint**: `GET /api/v1/dataset`
- **Enhancements Needed**:
  - [ ] Add filtering by category, severity, status
  - [ ] Add date range filtering
  - [ ] Add CSV export format option
  - [ ] Add JSON-LD schema for better discoverability
  - [ ] Add dataset metadata (last updated, record count, etc.)

#### 4.2 Analytics Endpoints (OPTIONAL)
- **Status**: ❌ Not Implemented
- **Proposed Endpoints**:
  - `GET /api/v1/stats/overview` - Platform-wide statistics
  - `GET /api/v1/stats/category-breakdown` - Issues by category
  - `GET /api/v1/stats/severity-distribution` - Severity analysis
  - `GET /api/v1/stats/resolution-rate` - Resolution metrics

**Phase 4 Deliverable**: Public dataset with filtering and analytics.

---

## 🔧 Critical Fixes & Enhancements

### Immediate Fixes Needed

1. **Duplicate Vote Prevention**
   - **Issue**: Users can vote multiple times on same pin
   - **Fix**: Track user votes in `VerificationVote` and check before allowing new vote
   - **Priority**: HIGH
   - **File**: `services/pinService.ts` → `recordVerification()`

2. **Input Validation**
   - **Issue**: Missing validation on location coordinates, severity values
   - **Fix**: Add validation middleware or service-level checks
   - **Priority**: HIGH
   - **Files**: All controllers

3. **Error Handling**
   - **Issue**: Some errors may not be caught properly
   - **Fix**: Add try-catch blocks and consistent error responses
   - **Priority**: MEDIUM
   - **Files**: All controllers

### Enhancements for Better UX

1. **Query Parameters for Pins**
   - Add filtering: `?category=pothole&status=open&severity=high`
   - Add sorting: `?sortBy=createdAt&order=desc`
   - Add pagination: `?page=1&limit=20`
   - **Priority**: MEDIUM
   - **File**: `controllers/pinController.ts` → `listPins()`

2. **User Activity Tracking**
   - Track when users last logged in
   - Track user's recent pins/verifications
   - **Priority**: LOW
   - **File**: `services/userService.ts`

3. **Pin Status Transitions**
   - Add validation for status changes (open → escalated → resolved)
   - Add status change history
   - **Priority**: LOW
   - **File**: `services/pinService.ts`

---

## 📋 Testing Checklist

### Unit Tests Needed

- [ ] `aiService.ts` - Test category detection, severity heuristics
- [ ] `pointsService.ts` - Test level progression, badge awarding
- [ ] `pinService.ts` - Test pin creation, verification aggregation
- [ ] `confirmationService.ts` - Test agency marker detection

### Integration Tests Needed

- [ ] Pin creation flow (create → verify → resolve)
- [ ] Points awarding flow (create pin → check points → check level)
- [ ] Verification flow (vote → check stats → check points)
- [ ] Confirmation flow (submit → check validation → check points)

### API Tests Needed

- [ ] All endpoints return correct status codes
- [ ] Error responses are consistent
- [ ] Request validation works correctly
- [ ] Authentication middleware works (if protecting routes)

---

## 🚀 Deployment Readiness

### Pre-Deployment Checklist

- [ ] Environment variables documented
- [ ] Error logging configured
- [ ] Rate limiting added (if needed)
- [ ] CORS configured correctly
- [ ] Health check endpoint working
- [ ] Seed data appropriate for demo

### Production Considerations (Post-MVP)

- [ ] Replace in-memory store with database (PostgreSQL/MongoDB)
- [ ] Add database migrations
- [ ] Add caching layer (Redis)
- [ ] Add file upload service (S3/Cloudinary)
- [ ] Add email notifications
- [ ] Add background job processing
- [ ] Add API rate limiting
- [ ] Add monitoring/logging (Sentry, DataDog)

---

## 📊 Success Metrics

### MVP Success Criteria

1. **Functionality**
   - ✅ Users can create hazard reports
   - ✅ AI categorizes hazards correctly (>80% accuracy)
   - ✅ Users can verify hazards
   - ✅ Points system works end-to-end
   - ✅ Leaderboard displays correctly

2. **Performance**
   - API responses < 200ms for simple queries
   - Can handle 100+ concurrent requests
   - No memory leaks in in-memory store

3. **Data Quality**
   - Duplicate detection works
   - Verification scores are accurate
   - Confirmation validation works

---

## 🎯 Recommended Implementation Order

### Week 1: Core Validation
1. Fix duplicate vote prevention
2. Add input validation
3. Test pin creation/listing flow
4. Test AI analysis accuracy

### Week 2: Gamification Polish
1. Test points system thoroughly
2. Enhance leaderboard with pagination
3. Add user stats endpoints
4. Test badge awarding logic

### Week 3: Data Quality
1. Improve confirmation validation
2. Add resolution tracking enhancements
3. Test end-to-end workflows
4. Add error handling improvements

### Week 4: Polish & Demo Prep
1. Add dataset filtering
2. Add analytics endpoints (if time)
3. Performance testing
4. Documentation updates

---

## 📝 Notes

- **In-Memory Store**: Current implementation uses in-memory storage. This is fine for MVP/demo but will need database migration for production.
- **AI Service**: Currently rule-based. Can be enhanced with ML models later.
- **Authentication**: Auth routes exist but may need to be integrated with other endpoints if protecting routes.
- **File Uploads**: Currently expects URLs. May need actual file upload handling for production.

---

## 🔗 Related Documentation

- [README.md](./README.md) - API documentation
- [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) - Code structure
- [AUTH.md](./AUTH.md) - Authentication guide

