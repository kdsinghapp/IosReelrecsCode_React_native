# Complete Project Context & Debug Session
## ReelRecs - Movie Ranking Application
### Date: November 1, 2025

---

## 🎬 APPLICATION OVERVIEW

### What is ReelRecs?
A React Native mobile application for iOS that revolutionizes movie and TV show discovery through personalized recommendations based on your unique taste profile.

### Why ReelRecs Exists - The Problem It Solves
Traditional rating systems (1-5 stars, thumbs up/down) fail to capture nuanced preferences:
- **Rating inflation**: Users tend to rate everything 7-10/10
- **Inconsistent scales**: Your "7" might be someone else's "9"
- **Context ignorance**: Mood, genre expectations affect ratings
- **Poor recommendations**: Netflix/Amazon often miss the mark

ReelRecs solves this through **relative comparisons** rather than absolute ratings. By asking "Which did you prefer?" instead of "Rate this 1-10", the app builds a true preference hierarchy that reflects your actual taste.

### Core Value Propositions for Users
1. **Accurate Recommendations**: Get suggestions based on your actual preferences, not generic algorithms
2. **Friend Compatibility**: See how your taste aligns with friends
3. **Discover Hidden Gems**: Find movies you'll love but would never have found
4. **No More Rating Fatigue**: Simple A vs B choices instead of agonizing over scores
5. **Evolving Taste Profile**: System learns and adapts as your preferences change

### Complete Feature Set

#### Core Features
1. **Movie/Show Discovery**
   - Browse trending titles
   - Search functionality
   - Filter by genre, year, rating
   - View detailed information (cast, synopsis, trailers)

2. **Pairwise Ranking System** (PRIMARY FEATURE)
   - Rank new movies through simple comparisons
   - Build personal preference hierarchy
   - No numerical ratings needed

3. **Recommendation Engine**
   - "Rec Score" - Personalized score predicting enjoyment
   - Based on your ranking history
   - Learns from similar users' preferences

4. **Social Features**
   - Friend connections
   - See friends' rankings
   - Taste compatibility scores
   - Shared watchlists

5. **Progress Tracking**
   - Step progress modal showing ranking progress
   - Visual feedback during comparisons
   - Ranking history

6. **Categories/Lists**
   - "Love" list - Your top-tier favorites
   - "Good" list - Solid recommendations
   - "Okay" list - Decent but not amazing
   - "Bad" list - Movies to avoid
   - Custom lists creation

---

## 🔄 HOW PAIRWISE RANKING WORKS

### From User's Perspective

#### Step 1: Initial Categorization
User sees a movie and picks initial reaction:
- 😍 "I love it" - This is one of my favorites
- 👍 "It was good" - I enjoyed it
- 😐 "It was okay" - It was fine
- 👎 "It was bad" - Didn't like it

#### Step 2: Refinement Through Comparisons
The app asks: "Which did you prefer?"
- Shows two movie posters side by side
- User simply taps the one they liked more
- No numbers, no stress about "is this a 7 or 8?"
- Usually takes 3-5 comparisons to find exact position

#### Step 3: Smart Questions
The app uses binary search to minimize questions:
- Instead of comparing against ALL movies
- Strategically picks comparison points
- Cuts possibilities in half each time

#### Step 4: Final Placement
Movie gets ranked in exact position:
- #1 favorite in "Love" category
- #7 out of 23 in "Good" category
- Etc.

### From Technical Perspective

#### The Binary Search Algorithm
```
GOAL: Insert "Inception" into "Love" list with 17 existing movies

Initial State:
Love List = [MobLand(#1), Skyfall(#2), ..., Movie17(#17)]

Step 1: Compare with middle movie (#9)
- If Inception > Movie#9: Search upper half (#1-#8)
- If Inception < Movie#9: Search lower half (#10-#17)

Step 2: Compare with new middle of remaining range
- Range narrows by half each time

Step 3-5: Continue until exact position found
- Maximum comparisons = log2(n) ≈ 5 for 17 movies

Result: Inception ranked at exact position (e.g., #6)
```

#### Why Binary Search?
- **Efficiency**: O(log n) vs O(n) comparisons
- **Consistency**: Builds transitive preferences
- **Scalability**: Works well even with hundreds of movies

#### Ranking Properties
1. **Transitivity**: If A > B and B > C, then A > C
2. **Stability**: Rankings remain consistent over time
3. **Personalization**: Each user has unique hierarchy
4. **Context-Aware**: Compares within categories (comparing comedies to comedies)

### The Current Bug in This System
The pairwise comparison modal is supposed to show different movies as the binary search narrows, but it's stuck showing the same movie (MobLand) repeatedly, breaking the ranking flow.

### Technical Stack
- **Framework**: React Native 0.77
- **Platform**: iOS (tested on iPhone 16 Pro simulator)
- **State Management**: Redux (@reduxjs/toolkit)
- **Navigation**: React Navigation (Native Stack)
- **Key Libraries**:
  - react-native-fast-image (optimized image loading)
  - react-native-fs (file system for logging)
  - react-native-color-matrix-image-filters (grayscale effects)

---

## 🏗️ PROJECT STRUCTURE

### Key Directories
```
/Users/willi/Dev/frontend/
├── src/
│   ├── component/
│   │   ├── modal/
│   │   │   ├── comparisonModal/ComparisonModal.tsx  [CRITICAL - Shows comparison UI]
│   │   │   ├── CommentModal/CommentModal.tsx
│   │   │   └── FeedbackModal/FeedbackModal.tsx
│   │   ├── ranking/
│   │   │   ├── RankingCard.tsx
│   │   │   └── RankingWithInfo.tsx
│   │   ├── common/
│   │   │   └── CustomText.tsx
│   │   └── ErrorBoundary.tsx  [Added for debugging]
│   ├── screen/
│   │   └── BottomTab/
│   │       └── ranking/
│   │           └── rankingScreen/
│   │               ├── useCompareComponent.tsx  [CRITICAL - Binary search logic]
│   │               ├── CompareModals.tsx  [Orchestrates modal flow]
│   │               └── MovieDetailScreen.tsx
│   ├── redux/
│   │   └── feature/
│   │       └── modalSlice/modalSlice.ts
│   ├── utils/
│   │   ├── FileLogger.tsx  [Custom logging system we created]
│   │   └── PopupLogger.ts
│   ├── theme/
│   │   ├── color.ts
│   │   └── font.ts
│   └── assets/
│       └── imageIndex.ts
├── ios/
│   ├── ReelRece.xcworkspace  [Xcode workspace]
│   └── Podfile
└── package.json
```

---

## 🐛 CURRENT ISSUES

### Issue #1: Comparison Loop Bug (ACTIVE PROBLEM ❌)
**Symptom**: After selecting initial preference, the comparison modal shows the same movie (MobLand) repeatedly instead of progressing through different comparisons.

**Expected Behavior**:
1. User ranks Inception as "loved"
2. First comparison: Inception vs MobLand (rank #1) ✓
3. User selects MobLand
4. SHOULD show: Inception vs Movie at index 4 (binary search midpoint)
5. ACTUALLY shows: Inception vs MobLand again ❌

**Investigation Status**:
- Identified dual state management conflict
- Applied fixes but problem persists
- Need deeper investigation

### Issue #2: Text Rendering Error (FIXED ✅)
**Original Error**: "Text strings must be rendered within a <Text> component"
**Solution**: Removed all JSX comments inside render methods, wrapped all text in String()
**Status**: RESOLVED

---

## 🔧 DEBUGGING INFRASTRUCTURE

### 1. Custom File Logger System
We built a persistent logging system because the app was crashing and losing console logs.

**Location**: `/src/utils/FileLogger.tsx`

**How to use**:
```javascript
import { fileLogger } from '../utils/FileLogger';

// In any component
fileLogger.info('[ComponentName] Action happening', {
  data: someData,
  state: someState
});
fileLogger.error('[ComponentName] Error occurred', error);
```

**Log file location in simulator**:
```
/Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/039CA727-7B38-4D74-BA25-EDA0F7320233/Documents/app_debug_logs.txt
```

**To read logs**:
```javascript
// Use the Read tool with the full path above
Read("/Users/willi/Library/Developer/CoreSimulator/Devices/...")
```

### 2. Error Boundaries
Added React Error Boundaries to catch render errors without crashing.

**Implementation**: Each modal wrapped in ErrorBoundary
```jsx
<ErrorBoundary name="ComparisonModal">
  <ComparisonModal ... />
</ErrorBoundary>
```

### 3. Logging Strategy
Current logging points:
- Modal render cycles
- State changes (mid, low, high in binary search)
- Movie selection events
- Data validation
- Prop passing

---

## ⚡ WHAT'S BEEN FIXED

### 1. Text Rendering Error ✅
**Problem**: JSX comments inside components causing "Text strings must be rendered within a <Text> component"

**Files Changed**:
- `ComparisonModal.tsx`: Removed all JSX comments (lines 200-201, 224-228, 374-378, 384-390, 417-420)
- `CompareModals.tsx`: Added `.toString()` for year values, fallback empty strings
- Added `String()` wrapper for all displayed text

**Result**: No more crashes from text rendering errors

### 2. NaN Display Issues ✅
**Problem**: Progress bar showing "NaN%"
**Solution**: Added safe calculation with fallback to 0
**File**: `StepProgressBar.tsx`

### 3. Missing Semicolons & Syntax ✅
**File**: `FeedbackModal.tsx` line 173
**Fixed**: Added missing semicolon

---

## 🔴 WHAT'S STILL BROKEN

### The Comparison Loop Problem
Despite removing conflicting state management, the modal still shows MobLand repeatedly.

**What we tried that DIDN'T work**:
1. Removed `currentIndex` state from ComparisonModal
2. Removed `currentSecondMovie` state
3. Removed useEffect that was overriding parent data
4. Changed all UI to use `secondMovie` prop directly

**The Mystery**:
- Parent component (`useCompareComponent`) correctly updates `mid` index
- Parent correctly computes `secondMovieData` from `comparisonMovies[mid]`
- Props are passed correctly to modal
- BUT modal still displays wrong movie

---

## 🎯 HOW THE BINARY SEARCH SHOULD WORK

### Example Scenario
User has 17 loved movies ranked 1-17. Adding "Inception":

```
Initial state:
- comparisonMovies = [MobLand(1), Movie2(2), ..., Movie17(17)]
- low = 0, high = 16, mid = 8

Step 1: Compare Inception vs comparisonMovies[8] (middle movie)
- If Inception preferred: high = 7, mid = 3
- If other preferred: low = 9, mid = 12

Step 2: Compare with new mid movie
- Continue narrowing range

Step 3-4: Continue until exact position found
```

### Current Implementation

**Parent Hook** (`useCompareComponent.tsx`):
```javascript
// Key state
const [mid, setMid] = useState(0);
const midRef = useRef(0);

// Compute comparison movie
const secondMovieData = useMemo(() => {
  if (!comparisonMovies.length) return null;
  if (mid < 0 || mid >= comparisonMovies.length) return null;
  return comparisonMovies[mid];
}, [comparisonMovies, mid]);

// Selection handlers update binary search
const handleSelectSecond = useCallback(async (movie) => {
  // Updates low/high/mid based on selection
  const newLow = midRef.current + 1;
  const newMid = Math.floor((newLow + highRef.current) / 2);
  setMid(newMid);
}, [...]);
```

---

## 🔍 NEXT DEBUGGING STEPS

### Immediate Actions
1. **Add logging to track `mid` value**:
   ```javascript
   fileLogger.info('[useCompareComponent] Mid changed', {
     oldMid: midRef.current,
     newMid,
     low: lowRef.current,
     high: highRef.current
   });
   ```

2. **Verify prop updates in modal**:
   ```javascript
   useEffect(() => {
     fileLogger.info('[ComparisonModal] Props updated', {
       secondMovieTitle: secondMovie?.title,
       secondMovieId: secondMovie?.imdb_id
     });
   }, [secondMovie]);
   ```

3. **Check if modal is re-mounting**:
   ```javascript
   useEffect(() => {
     fileLogger.info('[ComparisonModal] Mounted');
     return () => fileLogger.info('[ComparisonModal] Unmounted');
   }, []);
   ```

### Hypotheses to Test
1. **Stale closure**: Animation callbacks might capture old values
2. **Memoization issue**: `secondMovieData` not recomputing
3. **Modal remounting**: Resetting state on each comparison
4. **Prop mutation**: Something modifying the movie object

---

## 💻 DEVELOPMENT ENVIRONMENT

### Running the App
```bash
# Terminal 1: Start Metro bundler
cd /Users/willi/Dev/frontend
npx react-native start --reset-cache

# Terminal 2: Run on iOS simulator
npx react-native run-ios --simulator="iPhone 16 Pro"
```

### Common Commands
```bash
# Clear everything and restart
watchman watch-del-all
cd ios && pod cache clean --all && pod install
cd .. && npx react-native start --reset-cache

# Kill stuck processes
lsof -ti:8081 | xargs kill -9

# Check simulator logs
xcrun simctl spawn 9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8 log stream --process ReelRece
```

### Simulator Paths
- **App Container**: `/Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/`
- **Find current app folder**: Look for newest folder with `Documents/app_debug_logs.txt`

---

## 🗣️ USER COMMUNICATION STYLE

### Important Notes
- User values **accuracy over confidence**
- Dislikes premature victory declarations
- Prefers understanding root cause before applying fixes
- Appreciates thorough analysis and justification

### Key Quotes
- "lets not be very confident here and think we found the issue when we haven't"
- "dont be afraid to say you dont know. be accurate and justify your proposals"
- "why are you always so over confident"

### Effective Approach
1. Analyze thoroughly before proposing solutions
2. Explain reasoning and evidence
3. Test hypotheses before declaring success
4. Be humble about uncertainties

---

## 📊 API & DATA FLOW

### Movie Data Structure
```javascript
{
  imdb_id: "tt1074638",
  title: "Skyfall",
  release_year: 2012,
  cover_image_url: "https://reelrecs.s3.us-east-1.amazonaws.com/...",
  rating: 8.5,  // Rec score
  preference: "love" // User's categorization
}
```

### API Endpoints (Inferred)
- Fetch comparison movies for preference category
- Submit pairwise decisions
- Calculate final movie rating/position

### Redux State
- Modal visibility states
- User preferences
- Selection history

---

## 🎪 TESTING THE BUG

### Steps to Reproduce
1. Open app, navigate to movies
2. Click on "Inception" (or any unranked movie)
3. Select "I love it" (or any preference)
4. First comparison appears: Inception vs MobLand
5. Select either option
6. **BUG**: Next comparison still shows MobLand instead of different movie

### What to Check in Logs
```javascript
// Look for these patterns:
"[useCompareComponent] Mid changed"  // Should show mid changing
"[ComparisonModal] Props updated"     // Should show different movie titles
"secondMovieTitle:"                    // Should change between comparisons
```

---

## 🚀 IMMEDIATE NEXT STEPS FOR NEW SESSION

1. **Read the logs first**:
   ```bash
   # Check latest debug logs
   Read /Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/039CA727-7B38-4D74-BA25-EDA0F7320233/Documents/app_debug_logs.txt
   ```

2. **Add strategic logging** to understand why modal shows wrong movie

3. **Test specific hypothesis**: Is `mid` actually changing in parent?

4. **Consider workarounds** if root cause can't be found

---

## ⚠️ CRITICAL REMINDERS

1. **The problem is NOT fixed** - Modal still shows same movie repeatedly
2. **User has been patient** through multiple failed attempts
3. **Binary search logic is correct** - Issue is in UI/prop passing
4. **Test everything** - Don't assume fixes work without verification
5. **Communication style matters** - Be thorough, humble, accurate

---

## 📝 SESSION HANDOFF CHECKLIST

- [ ] Read this entire document
- [ ] Check latest logs for new patterns
- [ ] Understand the binary search algorithm
- [ ] Know where to add logging (FileLogger)
- [ ] Test the actual bug flow yourself
- [ ] Be prepared for user frustration
- [ ] Focus on finding WHY props aren't updating UI
- [ ] Don't declare victory prematurely

The core question remains: **Why does ComparisonModal display MobLand repeatedly even though we're passing different movies via props?**