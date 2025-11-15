# Quick Reference - Independent Subtasks

## 🎯 Start Here (Highest Impact, No Dependencies)

### Frontend Foundation (1 person)
- **G1**: Create API Client Utility (`frontend/src/utils/api.ts`) - **1 hour**
  - Foundation for all frontend API calls
  - No dependencies

### Quick Backend Fixes (1 person)
- **A1-A6**: Add error handling to 6 controllers - **45 minutes total**
  - Leaderboard, Dataset, Confirmation (2), Points, AI controllers
  - Each is 5-10 minutes, can do all in one session

### Frontend Quick Wins (1 person)
- **H1**: Connect Leaderboard Page - **1.5 hours**
  - Replace hardcoded data with API call
  - High visibility, quick to complete

---

## 📋 Parallel Work Assignments

### Person A: Backend Error Handling + Enhancements
1. **A1-A6**: Error handling (45 min)
2. **B1-B3**: Dataset filtering (1.5 hours)
3. **C1-C3**: Resolution enhancements (1.25 hours)

### Person B: Frontend Core Pages
1. **G1**: API Client (1 hour) ⚠️ Do this first!
2. **H1**: Leaderboard (1.5 hours)
3. **H2-H3**: Dataset page (1.5 hours)
4. **H4-H5**: Home page (1.75 hours)

### Person C: Frontend Interactive Features
1. **G1**: API Client (1 hour) - if Person B hasn't done it
2. **I1-I2**: Pins filters & pagination (3 hours)
3. **I3-I4**: Voting & resolve actions (3 hours)

### Person D: Components + Polish
1. **J1-J7**: Shared components (2 hours)
2. **D1-D2**: Confirmation improvements (1 hour)
3. **K1**: TypeScript types (30 min)
4. **L1**: Environment config (10 min)

---

## 🔥 Critical Path (Do in Order)

1. **G1** (API Client) → Must be done before any frontend API work
2. **H1** (Leaderboard) → Quick win, high visibility
3. **A1-A6** (Error Handling) → Quick fixes, improves stability

Everything else can be done in parallel!

---

## 📁 File Conflict Matrix

### ✅ Safe to Edit Simultaneously
- Different controllers (A1-A6)
- Different pages (H1, H2, H3, H4, H5)
- New files (G1, J1-J7, E1-E6, F1-F2)

### ⚠️ Coordinate Before Editing
- `pinController.ts` - Used by C1-C2 (resolution enhancements)
- `pinService.ts` - Used by C1-C3 (resolution enhancements)
- `types/index.ts` - Used by C1-C3, D2 (adds fields)

**Solution**: Assign C1-C3 to one person, or coordinate timing.

---

## ⏱️ Time Estimates

### Quick Wins (< 1 hour each)
- A1-A6: 5-10 min each
- H3: 30 min
- J1-J7: 15-30 min each
- L1: 10 min

### Medium Tasks (1-2 hours)
- G1: 1 hour
- H1: 1.5 hours
- H2: 1 hour
- H4: 1 hour
- B1-B3: 30-45 min each
- C1-C2: 30 min each

### Larger Tasks (2-3 hours)
- H5: 45 min
- I1-I2: 1.5 hours each
- I3-I4: 2 hours each
- E1-E6: 30-45 min each

---

## 🎯 Recommended Starting Points

**If you have 1 teammate:**
- Start with G1 (API Client) + H1 (Leaderboard) = 2.5 hours
- Then H2-H3 (Dataset) = 1.5 hours
- Then I1-I2 (Pins filters/pagination) = 3 hours

**If you have 2 teammates:**
- Teammate 1: G1 → H1 → H2-H3 → H4-H5
- Teammate 2: A1-A6 → B1-B3 → I1-I2

**If you have 3+ teammates:**
- See "Parallel Work Assignments" above

---

## 📝 Notes

- All tasks are independent and won't conflict
- Only dependency: G1 (API Client) must be done before frontend API calls
- Use feature branches for each subtask group
- Test independently before merging

