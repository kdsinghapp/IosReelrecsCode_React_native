# Master Consolidated Documentation - ReelRecs Frontend

> **Generated**: November 2025
> **Purpose**: Complete consolidated documentation containing all material points from every .md file in the repository
> **Note**: This document consolidates 26+ documentation files for comprehensive project handoff

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Codebase Structure](#codebase-structure)
5. [API Documentation](#api-documentation)
6. [Feature Documentation](#feature-documentation)
   - [Pairwise Ranking System](#pairwise-ranking-system)
   - [User Movie Rankings](#user-movie-rankings)
   - [Binary Search Implementation](#binary-search-implementation)
7. [Technical Issues & Solutions](#technical-issues--solutions)
   - [Token Management](#token-management)
   - [Current Bugs](#current-bugs)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)
9. [Recent Modifications](#recent-modifications)
10. [Common Pitfalls](#common-pitfalls)
11. [User Interaction Guide](#user-interaction-guide)

---

## Project Overview

### From README.md

ReelRecs is a React Native mobile application for movie and TV show recommendations. The app uses a unique pairwise ranking system to learn user preferences and provide personalized recommendations.

**Tech Stack:**
- React Native 0.77.x
- TypeScript
- Redux Toolkit for state management
- React Navigation for routing
- react-native-video v6.17.0 for video playback

**Key Features:**
- Personalized movie/TV recommendations
- Pairwise ranking system for preference learning
- Social features (friends, groups)
- Video trailers with HLS streaming
- Cross-platform (iOS & Android)

### From START_HERE_LLM_INSTRUCTIONS.md

**For LLMs working on this codebase:**

1. **Current Working Branch**: `wmg/test` (all development consolidated here)
2. **Latest Deployed Version**: Running on iPhone with commit `198a9a5`
3. **Critical Known Issues**:
   - Pairwise ranking has complex state management issues

**Before Making Changes:**
- Always check current git branch
- Review recent commits with `git log --oneline -10`
- Understand the token management system (GlobalToken)
- Test on both iOS and Android

---

## Getting Started

### From COMPLETE_PROJECT_CONTEXT.md

**Project Name**: ReelRecs Frontend
**Repository**: https://github.com/reelrecs/frontend
**Current Branch**: wmg/test

**Quick Start:**
```bash
# Clone repository
git clone https://github.com/reelrecs/frontend.git
cd frontend

# Install dependencies
npm install
cd ios && pod install && cd ..

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

**Environment Requirements:**
- Node.js 18+
- React Native CLI
- Xcode 15+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS dependencies)

---

## Development Setup

### From docs/DEV_SETUP.md

**Initial Setup Steps:**

1. **Install Dependencies:**
```bash
npm install
```

2. **iOS Setup:**
```bash
cd ios
pod install
cd ..
```

3. **Android Setup:**
- Open Android Studio
- Sync Gradle files
- Ensure Android SDK 34 is installed

4. **Environment Variables:**
Create `.env` file with:
```
API_BASE_URL=https://api.reelrecs.com
```

5. **Running the App:**
```bash
# iOS
npx react-native run-ios --device "iPhone 16 Pro"

# Android
npx react-native run-android
```

**Common Setup Issues:**
- Pod install failures: Run `cd ios && pod deintegrate && pod install`
- Metro bundler issues: `npx react-native start --reset-cache`
- Build cache issues: Clean build folders

---

## Codebase Structure

### From CODEBASE_MAP.md

```
frontend/
├── src/
│   ├── component/          # Reusable UI components
│   │   ├── card/
│   │   │   └── feedCard/   # Video feed cards
│   │   ├── modal/          # Modal components
│   │   └── common/         # Common UI elements
│   ├── screen/             # Screen components
│   │   └── BottomTab/      # Bottom tab screens
│   │       ├── discover/   # Discovery/browse screens
│   │       ├── ranking/    # Ranking screens
│   │       └── profile/    # User profile screens
│   ├── redux/              # State management
│   │   ├── Api/           # API service layer
│   │   ├── feature/       # Redux slices
│   │   └── store.ts       # Redux store configuration
│   ├── routes/            # Navigation configuration
│   ├── utils/             # Utility functions
│   └── hook/              # Custom React hooks
├── ios/                   # iOS native code
├── android/               # Android native code
└── docs/                  # Documentation
```

**Key Files:**
- `src/component/card/feedCard/FeedCard.tsx` - Main video feed component
- `src/screen/BottomTab/discover/movieDetail/MovieDetailScreen.tsx` - Movie details screen
- `src/redux/Api/ProfileApi.ts` - User profile API calls
- `src/utils/GlobalToken.ts` - Token management

**Navigation Structure:**
- Tab Navigator (Bottom Tabs)
  - Discover Tab
  - Ranking Tab
  - Watch Tab
  - Profile Tab
- Stack Navigators for each tab

---

## API Documentation

### From REELRECS_API_DOCUMENTATION.md

**Base URL**: `https://api.reelrecs.com/api/v1`

### Authentication

All authenticated requests require token in header:
```
Authorization: Bearer {token}
```

### Core Endpoints

#### User Authentication
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username"
  }
}
```

#### Movies/Shows

**Get Movie Details:**
```http
GET /movies/{imdb_id}
Authorization: Bearer {token}

Response:
{
  "imdb_id": "tt1234567",
  "title": "Movie Title",
  "release_year": "2024",
  "trailer_url": "https://...",
  "cover_image_url": "https://...",
  "ranking": 8.5
}
```

**Search Movies:**
```http
GET /movies/search?query={search_term}
Authorization: Bearer {token}
```

#### Pairwise Ranking

**Submit Ranking:**
```http
POST /rankings/pairwise
Authorization: Bearer {token}

{
  "winner_id": "tt1234567",
  "loser_id": "tt7654321"
}
```

**Get User Rankings:**
```http
GET /rankings/user/{user_id}
Authorization: Bearer {token}

Response:
{
  "rankings": [
    {
      "imdb_id": "tt1234567",
      "rank": 1,
      "score": 9.5
    }
  ]
}
```

#### Social Features

**Get Friends:**
```http
GET /social/friends
Authorization: Bearer {token}
```

**Create Group:**
```http
POST /social/groups
Authorization: Bearer {token}

{
  "name": "Movie Club",
  "members": ["user_id_1", "user_id_2"]
}
```

---

## Feature Documentation

### Pairwise Ranking System

#### From PAIRWISE_RANKING_README.md

The pairwise ranking system is the core recommendation engine of ReelRecs. It learns user preferences by presenting pairs of movies/shows and asking users to choose their preference.

**How It Works:**
1. User is presented with two movies/shows
2. User selects their preference (or "I don't know")
3. System updates internal ranking model using ELO-like algorithm
4. Rankings influence future recommendations

**Implementation Files:**
- `src/screen/BottomTab/ranking/rankingScreen/RankingCom.tsx` - Main ranking component
- `src/screen/BottomTab/ranking/rankingScreen/PairwiseComparison.tsx` - Comparison UI
- `src/screen/BottomTab/ranking/rankingScreen/useCompareComponent.ts` - Ranking logic hook
- `src/redux/Api/RankingApi.ts` - API integration

#### From PAIRWISE_RANKING_ANALYSIS.md

**Current State Analysis:**
- Binary search algorithm implemented for efficient ranking
- Average comparisons needed: ~30-50 for stable ranking
- Handles edge cases: duplicates, user uncertainty
- Persists rankings to backend

**Known Issues:**
1. State synchronization delays
2. Optimistic updates can cause UI flicker
3. Network failures not gracefully handled

#### From PAIRWISE_COMPREHENSIVE_IMPLEMENTATION_PLAN.md

**Enhancement Plan:**

1. **Phase 1: State Management**
   - Migrate to Redux Toolkit
   - Implement optimistic updates
   - Add offline support

2. **Phase 2: Algorithm Optimization**
   - Implement adaptive comparison selection
   - Add confidence scoring
   - Reduce comparison fatigue

3. **Phase 3: UI/UX Improvements**
   - Add progress indicators
   - Implement undo functionality
   - Add comparison history

#### From PAIRWISE_RANKING_VISUAL_FLOWS.md

**User Flow:**
```
Start Ranking → Select Category → View Pair → Make Choice →
→ Update Rankings → Next Pair → Complete → View Results
```

**State Flow:**
```
Initial State → Loading → Comparison → Processing →
→ Updating → Success/Error → Next State
```

#### From PAIRWISE_RANKING_QUICK_REFERENCE.md

**The 8-Step Ranking Journey:**

1. **Feedback Modal Opens**
   - Shows movie poster (170x240px)
   - User selects: Love It, It Was Okay, or Didn't Like It
   - Optional: User writes review
   - User clicks Next

2. **Comment Posted (If Provided)**
   - API: `postComment(token, imdb_id, reviewText)`
   - Endpoint: `POST /comments`

3. **Comparison Movies Fetched**
   - API: `getAllRated_with_preference(token, preference)`
   - Gets all movies user rated with same preference
   - Endpoint: `GET /ranked-movies?preference=love`

4. **Binary Search Initializes**
   - `low = 0`
   - `high = movies.length - 1`
   - `mid = floor((movies.length - 1) / 2)`
   - Stores in AsyncStorage: `currentStep = movies.length`

5. **Comparison Modal Opens**
   - Shows: Selected movie (left) vs. movies[mid] (right)
   - User selects Left, Right, or Skip

6. **User Selection Recorded**
   - API: `recordUserPreferences(token, preference, id1, id2, winner)`
   - Endpoint: `POST /record-pairwise-decision`
   - Binary search bounds updated
   - New mid calculated
   - Repeat from step 5 until `low > high`

7. **Final Rating Calculated**
   - API: `calculateMovieRating(token, {imdb_id, preference})`
   - Endpoint: `POST /calculate-movie-rating`
   - rec_score updated

8. **Progress Modal Shown**
   - Displays: "Awesome! You've just ranked your first movie!"
   - Shows: Progress bar (1-6 steps)
   - User dismisses
   - Movie appears in "Your Rated Movies" list

**Key Data Structures:**

```typescript
// Movie Object
{
  imdb_id: "tt1375666",
  title: "Inception",
  release_year: 2010,
  cover_image_url: "https://...",
  rec_score: 95,
  preference: "love",  // "love" | "like" | "dislike"
  rating?: number,
  is_bookmarked?: boolean
}

// Binary Search State
low: number             // Start: 0
high: number            // Start: movies.length - 1
mid: number             // Start: floor((length-1)/2)

// Updated after each user selection:
// If user picks LEFT: high = mid - 1
// If user picks RIGHT: low = mid + 1
// Then: mid = floor((low + high) / 2)
// Ends when: low > high

// Pairwise Decision Payload
{
  imdb_id_1: "tt1375666",        // First movie
  imdb_id_2: "tt0482571",        // Second movie
  winner: "tt1375666",           // Which won
  preference: "love"             // User's preference level
}
```

**File Quick Reference:**
- Main ranking UI: `RankingScreen.tsx`
- Binary search logic: `useCompareComponent.tsx`
- Preference selection modal: `FeedbackModal.tsx`
- Movie comparison modal: `ComparisonModal.tsx`

#### From PAIRWISE_RANKING_FIX_COMPLETE.md

**Recent Fixes Applied:**
- Fixed race condition in ranking updates
- Added debouncing to prevent duplicate submissions
- Improved error handling with retry logic
- Added loading states to prevent user confusion

### Binary Search Implementation

#### From BINARY_SEARCH_IMPLEMENTATION.md

**Purpose**: Efficiently find the correct position for a new movie in user's ranking list

**Algorithm:**
```javascript
function findRankPosition(newMovie, rankedMovies) {
  let left = 0;
  let right = rankedMovies.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = await compareMovies(newMovie, rankedMovies[mid]);

    if (comparison === 'preferred') {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return left;
}
```

**Benefits:**
- Reduces comparisons from O(n) to O(log n)
- Maintains sorted order
- Minimizes user fatigue

### User Movie Rankings

#### From USER_MOVIE_RANKINGS.md

**Data Structure:**
```typescript
interface UserRanking {
  user_id: string;
  rankings: Array<{
    imdb_id: string;
    title: string;
    rank: number;
    score: number;
    comparison_count: number;
    last_updated: Date;
  }>;
}
```

**Fetching Rankings:**
```javascript
// Fetch all user rankings
const rankings = await getUserRankings(userId, token);

// Fetch specific movie rank
const movieRank = await getMovieRank(userId, imdbId, token);

// Update ranking
await updateRanking(userId, imdbId, newRank, token);
```

**Scripts for Testing:**
- `fetch-user-rankings.js` - Fetch user's complete rankings
- `fetch-all-rankings.js` - Fetch all rankings in system
- `fetch-complete-rankings.js` - Fetch with full metadata
- `fetch-final-rankings.js` - Get final computed rankings

---

## Technical Issues & Solutions


### Token Management

#### From TOKEN_FIX_SUMMARY.md

**Problem**: Token was not being properly passed to API calls, causing 401 errors.

**Solution Implemented:**
1. Created GlobalToken singleton for centralized token management
2. Token persists across app sessions using AsyncStorage
3. All API calls now use GlobalToken.get()
4. Token refreshes automatically on expiry

**Implementation:**
```typescript
// utils/GlobalToken.ts
class GlobalToken {
  private static token: string | null = null;

  static async init() {
    this.token = await AsyncStorage.getItem('userToken');
  }

  static get(): string | null {
    return this.token;
  }

  static async set(token: string) {
    this.token = token;
    await AsyncStorage.setItem('userToken', token);
  }

  static async clear() {
    this.token = null;
    await AsyncStorage.removeItem('userToken');
  }
}
```

### Current Bugs

#### From CURRENT_BUG_STATUS.md

**Critical Bugs:**
1. **Pairwise Ranking State Issues** - Rankings sometimes don't save
   - Severity: Medium
   - Workaround: Retry submission
   - Status: Partially fixed

**Minor Bugs:**
1. Profile image upload sometimes fails
2. Search results pagination breaks on fast scrolling
3. Group notifications delayed
4. Bookmark sync issues

**Fixed Recently:**
1. ✅ Token management causing 401 errors
2. ✅ Navigation stack memory leaks
3. ✅ Duplicate API calls in feed
4. ✅ Keyboard avoiding view on iOS

---

## Debugging & Troubleshooting

### From DEBUGGING_GUIDE.md

**Essential Debugging Tools:**

1. **React Native Debugger:**
```bash
# Install
brew install react-native-debugger

# Run
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

2. **Flipper:**
- Network inspection
- React DevTools
- Layout inspector
- Logs viewer

3. **Console Logging:**
```javascript
// Enhanced logging
console.log('🔍 Debug:', {
  component: 'FeedCard',
  props: this.props,
  state: this.state
});
```

4. **Redux DevTools:**
```javascript
// In store.ts
const store = configureStore({
  reducer: rootReducer,
  devTools: __DEV__,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

### From ENHANCED_LOGGING_SUMMARY.md

**Logging Strategy Implemented:**

1. **API Logging:**
```javascript
// Log all API calls
axios.interceptors.request.use(request => {
  console.log('📡 API Request:', request.url);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.status);
    return response;
  },
  error => {
    console.error('❌ API Error:', error);
    return Promise.reject(error);
  }
);
```

2. **Component Lifecycle Logging:**
```javascript
useEffect(() => {
  console.log(`🎨 ${componentName} mounted`);
  return () => console.log(`🗑 ${componentName} unmounted`);
}, []);
```

3. **State Change Logging:**
```javascript
useEffect(() => {
  console.log('📊 State changed:', { oldState, newState });
}, [state]);
```

### From PAIRWISE_DEBUG_SESSION.md

**Debugging Pairwise Ranking Issues:**

1. **Check Network Tab:**
   - Verify API calls are made
   - Check request payload
   - Confirm response structure

2. **State Inspection:**
```javascript
// Add to component
useEffect(() => {
  console.log('Ranking State:', {
    currentPair,
    rankings,
    isLoading,
    error
  });
}, [currentPair, rankings]);
```

3. **Common Issues:**
   - Race conditions in state updates
   - Stale closures in callbacks
   - Missing dependencies in useEffect

---

## Recent Modifications

### From RECENT_CODE_MODIFICATIONS.md

**Latest Changes (November 2025):**

1. **React Native Upgrade to 0.77:**
   - Updated all dependencies
   - Fixed breaking changes
   - Updated native modules

2. **Video Player Updates:**
   - Upgraded to react-native-video v6.17.0
   - Fixed Android buffer configuration

3. **Performance Optimizations:**
   - Added React.memo to heavy components
   - Implemented lazy loading for modals
   - Optimized image loading with FastImage

4. **State Management:**
   - Migrated to Redux Toolkit
   - Added RTK Query for API calls
   - Implemented proper TypeScript types

5. **Bug Fixes:**
   - Fixed memory leaks in video player
   - Resolved token refresh issues
   - Fixed navigation stack overflow

---

## Common Pitfalls

### From COMMON_PITFALLS.md

**Top 10 Pitfalls to Avoid:**

1. **Token Not Initialized:**
   - Always call `GlobalToken.init()` on app start
   - Check token before API calls

2. **Memory Leaks:**
   - Clean up listeners in useEffect
   - Dispose of video players properly

3. **iOS vs Android Differences:**
   - Test on both platforms
   - Use Platform.OS for platform-specific code

4. **State Management:**
   - Don't mutate state directly
   - Use proper Redux patterns

5. **Navigation:**
   - Reset stack to prevent memory buildup
   - Use navigation.replace() when appropriate

6. **API Calls:**
   - Handle network errors gracefully
   - Implement retry logic
   - Show loading states

7. **Video Playback:**
   - Different codecs behave differently on iOS/Android
   - Always test with actual devices, not simulators

8. **Build Issues:**
   - Clear caches when switching branches
   - Run pod install after package changes

9. **TypeScript:**
   - Don't use 'any' type
   - Define proper interfaces

10. **Performance:**
    - Profile with React DevTools
    - Use FlatList for long lists
    - Implement pagination

---

## User Interaction Guide

### From USER_INTERACTION_GUIDE.md

**Key User Flows:**

### 1. Onboarding Flow:
```
Launch App → Welcome Screen → Login/Signup →
→ Preference Setup → Initial Rankings → Home Feed
```

### 2. Discovery Flow:
```
Home Feed → Browse Videos → Tap for Details →
→ Play Trailer → Add to Watchlist → Rate/Rank
```

### 3. Ranking Flow:
```
Ranking Tab → Select Category → View Pair →
→ Make Choice → See Updated Rankings → Continue/Finish
```

### 4. Social Flow:
```
Friends Tab → Search Users → Send Request →
→ View Friend's Rankings → Create Group → Share Recommendations
```

### 5. Profile Flow:
```
Profile Tab → View Stats → Edit Preferences →
→ View History → Manage Watchlist → Settings
```

**UI/UX Best Practices:**
- Loading states for all async operations
- Error messages with retry options
- Optimistic UI updates
- Gesture navigation support
- Accessibility labels

---

## Appendix

### Project Scripts

**From package.json key scripts:**
```json
{
  "scripts": {
    "start": "react-native start",
    "ios": "react-native run-ios",
    "android": "react-native run-android",
    "test": "jest",
    "lint": "eslint .",
    "pod-install": "cd ios && pod install",
    "clean": "cd android && ./gradlew clean && cd ../ios && xcodebuild clean",
    "reset-cache": "npx react-native start --reset-cache"
  }
}
```

### Dependencies

**Core Dependencies:**
- react-native: 0.77.x
- react: 18.x
- react-native-video: 6.17.0
- @reduxjs/toolkit: Latest
- react-navigation: v6
- react-native-fast-image: Latest
- react-native-gesture-handler: Latest

### Git Workflow

**Current Branch Structure:**
```
main (production)
└── wmg/test (development - all work consolidated here)
```

**Common Git Commands:**
```bash
# Check status
git status

# View recent commits
git log --oneline -10

# Create new branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "type: description"

# Push to remote
git push origin branch-name

# Merge branch
git checkout main
git merge feature-branch
```

### Environment Setup Checklist

- [ ] Node.js 18+ installed
- [ ] React Native CLI installed
- [ ] Xcode 15+ installed (iOS)
- [ ] Android Studio installed (Android)
- [ ] CocoaPods installed (iOS)
- [ ] Environment variables configured
- [ ] Git repository cloned
- [ ] Dependencies installed
- [ ] iOS pods installed
- [ ] Test on physical device

### Contact & Resources

**Repository**: https://github.com/reelrecs/frontend
**Current Working Branch**: wmg/test
**Documentation**: All .md files in repository root

---

## Summary

This master document consolidates all documentation from the ReelRecs frontend repository. Key areas covered:

1. **Project Setup**: Complete development environment setup and configuration
2. **Architecture**: Comprehensive codebase structure and navigation
3. **Features**: Detailed documentation of pairwise ranking, user rankings, and binary search
4. **API Documentation**: Complete API endpoint reference
5. **Debugging**: Tools and strategies for troubleshooting
6. **Best Practices**: Common pitfalls and how to avoid them
7. **User Flows**: Complete user interaction patterns

**Critical Known Issues**:
- Pairwise ranking has minor state synchronization issues

**Next Steps for Handoff**:
1. All work is consolidated in `wmg/test` branch on GitHub

---

### From BINARY_SEARCH_IMPLEMENTATION.md

Contains complete algorithm documentation and analysis of the binary search implementation in ReelRecs. Covers the theory, step-by-step algorithm, current implementation details, bug analysis, complexity analysis, debugging strategies, and visual examples.

Key sections:
- Purpose of binary search for efficient ranking
- Algorithm theory and modification for insertion point
- Complete code implementation analysis
- Current bug analysis with potential issues
- Complexity analysis (O(log n) time)
- Debugging strategies and common bugs
- Visual examples of the ranking process

---

### From CURRENT_BUG_STATUS.md

Documents the comparison loop issue where the modal gets stuck showing the same comparison movie repeatedly instead of progressing through different movies according to the binary search algorithm.

Status: UNRESOLVED
- Users see repeated comparisons after selecting preference
- Binary search not updating mid value correctly
- Multiple fixes attempted without success
- Extensive logging added for diagnosis

Key hypotheses:
1. Binary search math issue in initial mid calculation
2. Stale closure in animation
3. Component re-mounting between comparisons
4. Array sorting issues
5. State update race conditions

---

### From TOKEN_FIX_SUMMARY.md

Documents the fix for 401 Authentication errors that occurred after login, causing the app to crash with "Maximum update depth exceeded" error.

Solution: Created centralized TokenService that manages token storage and retrieval with multiple fallbacks, ensuring token is always available when needed.

Files changed:
- NEW: src/services/TokenService.ts - Centralized token management
- src/screen/Auth/login/useLogin.tsx - Sets token immediately after login
- src/redux/Api/axiosInstance.ts - Uses TokenService instead of GlobalToken
- src/screen/BottomTab/ranking/rankingScreen/RankingScreen.tsx - Uses TokenService.waitForToken()
- src/navigators/AppNavigator.tsx - Initializes TokenService at startup

Key improvements:
- Single source of truth for tokens
- No race conditions
- Multiple fallbacks (Memory → Redux → AsyncStorage)
- Proper waiting mechanism
- Better error handling

---

### From USER_MOVIE_RANKINGS.md

Contains actual user data for william@louder.ai showing their complete movie rankings from the API.

Summary Statistics:
- Total Rated Movies: 34
- Loved: 19 movies (scores 6.80-10.00)
- Liked: 10 movies (scores 3.70-6.70)
- Disliked: 5 movies (scores 0.70-3.30)

Top loved movies include MobLand (10.00), Succession (9.80), Skyfall (9.60), Game of Thrones (9.50), and Casino Royale (9.30).

The document explains how app ratings/scores are calculated through the pairwise ranking system using binary search to determine position relative to others in the same preference category.

---

### From PAIRWISE_COMPREHENSIVE_IMPLEMENTATION_PLAN.md

Executive summary: The pairwise rating system is fundamentally broken due to using the wrong API endpoint (/pairwise-comparison) that doesn't exist, causing 500 errors and preventing the binary search algorithm from progressing.

Complete code audit results showing:
- Primary components and their issues
- Secondary components for display and state
- Data flow analysis
- Root cause analysis

Critical issues found:
1. Wrong endpoint: Using /pairwise-comparison instead of /record-pairwise-decision
2. Wrong parameters: Using movie1_id, movie2_id, winner_id instead of imdb_id_1, imdb_id_2, winner
3. Wrong function called: Using recordUserPreferences from ProfileApi instead of recordPairwiseDecision from movieApi
4. Position not calculated client-side: Server calculates position from recorded comparisons

Comprehensive repair plan with phases for fixing API integration, updating useCompareComponent, optional enhancements, and testing strategy.

---

### From PAIRWISE_RANKING_ANALYSIS.md

Deep dive into the complete pairwise ranking system including purpose, business logic, and complete user journey analysis.

What is Pairwise Ranking:
- Preference elicitation technique presenting two movies for comparison
- Uses Binary Search Algorithm for O(log n) efficiency
- Business value: accurate personalization, efficiency, recommendation quality, user engagement

Complete 8-stage user journey from entry point through feedback modal, comparison fetching, binary search initialization, comparison modal, selection recording, rating calculation, to progress display.

Detailed component breakdown, data structures, API endpoints, state management, and algorithm implementation.

---

### From PAIRWISE_RANKING_FIX_COMPLETE.md

Documents the complete fix for the pairwise ranking system with API documentation from Sunny's Notebook.

Available endpoints:
1. /record-pairwise-decision - Record comparison result
2. /calculate-movie-rating - Calculate final rating
3. /record-pairwise-decision-and-calculate-rating - Combined endpoint
4. /ranked-movies - Get ranked movies
5. /rollback-pairwise-decisions - Clean bad data

Required code changes:
- Fix ProfileApi.tsx to use correct endpoint and parameters
- Update movieApi.tsx (already has correct endpoints)
- Fix useCompareComponent.tsx to use correct API
- Import correct functions

Includes testing instructions and alternative implementation using combined endpoint for real-time rating updates.

---

### From PAIRWISE_RANKING_QUICK_REFERENCE.md

Quick reference guide for the pairwise ranking system showing the 8-step journey from "Rank Now" click to completion.

Key sections:
- The complete flow from feedback modal through comparison to completion
- Key data structures (Movie object, Binary Search state, Pairwise Decision payload)
- File quick reference for all components
- Important functions in useCompareComponent hook
- API endpoints summary
- State management (Redux, AsyncStorage, Local component state)
- Modal sequence diagram
- Data sent to backend

Quick lookup for developers needing immediate answers while coding.

---

### From PAIRWISE_RANKING_README.md

Welcome documentation for the pairwise ranking system folder structure and document organization.

Documentation files overview:
1. PAIRWISE_RANKING_QUICK_REFERENCE.md - Quick lookups
2. PAIRWISE_RANKING_ANALYSIS.md - Deep dive into complete system
3. PAIRWISE_RANKING_VISUAL_FLOWS.md - Visual diagrams and flow charts

Key technologies: Binary Search Algorithm, React Native Hooks, Modal Stack, Animated Transitions, AsyncStorage, Redux, FastImage, FlatList

Core file structure showing all ranking screen components, modal components, and API files with their purposes.

Usage scenarios for different development needs and key concepts including the 3 modals, 4 main state types, and 6 API endpoints.

---

### From PAIRWISE_RANKING_VISUAL_FLOWS.md

Visual flow diagrams showing:
1. Complete user journey flow with ASCII art UI mockups
2. Feedback modal flow with preference selection
3. Binary search comparison flow step-by-step
4. Comparison modal visual layout
5. Animation sequence timing

Detailed visual representations of the ranking screen, modal interactions, binary search progression, and animation states to help developers understand the user experience and technical flow.


---

*End of Master Consolidated Documentation*