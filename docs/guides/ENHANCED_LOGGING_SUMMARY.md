# Enhanced Logging Implementation Summary
## Date: November 2, 2025
## Purpose: Document all logging enhancements added to debug pairwise ranking issue

---

## 📝 Summary of Changes

We've added comprehensive, granular logging throughout the pairwise ranking process to help debug why the comparison modal shows the same movie repeatedly (e.g., Armageddon) instead of progressing through the binary search correctly.

---

## 🔧 Files Modified with Enhanced Logging

### 1. `/src/screen/BottomTab/ranking/rankingScreen/useCompareComponent.tsx`

#### Enhanced Functions:
- **handleSelectFirst** (lines 359-467)
- **handleSelectSecond** (lines 471-612)
- **handleSkipSetFirst** (lines 295-303)
- **fetchComparisonMovies** (lines 166-174)
- **secondMovieData useMemo** (lines 196-218)

#### Key Logging Points Added:

```javascript
// Initial binary search setup
fileLogger.info('[useCompareComponent] Initial binary search setup', {
  low: 0,
  high: length - 1,
  mid: initialMid,
  totalMovies: length,
  firstMovie: filtered[0]?.title,
  midMovie: filtered[initialMid]?.title,
  lastMovie: filtered[length - 1]?.title
});

// When user selects first movie
fileLogger.info('[useCompareComponent] handleSelectFirst START', {
  hasSelectedMovie: !!selectedMovie,
  selectedMovieTitle: selectedMovie?.title,
  hasSecondMovie: !!secondMovieData,
  secondMovieTitle: secondMovieData?.title,
  preference: userPreference.preference,
  currentMid: midRef.current,
  currentLow: lowRef.current,
  currentHigh: highRef.current,
  comparisonMoviesLength: comparisonMovies.length
});

// Binary search update tracking
fileLogger.info('[useCompareComponent] handleSelectFirst - binary search update', {
  oldMid: midRef.current,
  newMid,
  oldHigh: highRef.current,
  newHigh,
  low: lowRef.current,
  selectedMovie: selectedMovie?.title,
  comparedAgainst: secondMovieData?.title,
  userChoice: 'first (selected movie preferred)',
  searchRange: `[${lowRef.current}, ${newHigh}]`,
  remainingComparisons: newHigh - lowRef.current + 1
});

// Convergence detection
fileLogger.info('[useCompareComponent] Binary search COMPLETE - position found!', {
  finalPosition: lowRef.current,
  movieTitle: selectedMovie?.title
});
```

---

### 2. `/src/component/modal/comparisonModal/ComparisonModal.tsx`

#### Enhanced Areas:
- **Props tracking** (lines 80-96)
- **First movie selection** (lines 245-259)
- **Second movie selection** (lines 312-336)
- **Skip button** (lines 402-410)

#### Key Logging Points Added:

```javascript
// Track prop changes
useEffect(() => {
  fileLogger.info('[ComparisonModal] Props updated', {
    secondMovieTitle: secondMovie?.title,
    secondMovieId: secondMovie?.imdb_id,
    firstMovieTitle: firstMovie?.title,
    visible
  });
}, [secondMovie, firstMovie, visible]);

// Button click tracking
fileLogger.info('[ComparisonModal] First movie button clicked', {
  firstMovie: firstMovie?.title,
  firstMovieId: firstMovie?.imdb_id,
  comparedAgainst: secondMovie?.title,
  comparedAgainstId: secondMovie?.imdb_id,
  timestamp: new Date().toISOString()
});

// Stale closure prevention logging
fileLogger.info('[ComparisonModal] Timeout executing for second movie selection', {
  capturedMovie: movieToSelect?.title,
  capturedMovieId: movieToSelect?.imdb_id,
  currentSecondMovieProp: secondMovie?.title
});
```

---

### 3. `/src/redux/Api/ProfileApi.tsx`

#### New Function Added:
- **recordUserPreferences** (lines 251-287)

```javascript
export const recordUserPreferences = async (
  token: string,
  preference: string,
  movie1_id: string,
  movie2_id: string,
  winner_id: string
) => {
  console.log('[recordUserPreferences] Recording comparison', {
    preference,
    movie1_id,
    movie2_id,
    winner_id
  });
  // ... API call implementation
}
```

---

## 📊 What Each Log Tells Us

### Binary Search State Logs
- **Purpose**: Track if the binary search algorithm is correctly updating its bounds
- **Key Values**: `low`, `high`, `mid`, `searchRange`
- **What to Look For**: `mid` should change after each selection

### User Interaction Logs
- **Purpose**: Confirm which buttons users are clicking and when
- **Key Values**: Movie titles, IDs, timestamps
- **What to Look For**: Verify the correct movie data is being passed

### API Call Logs
- **Purpose**: Ensure preferences are being recorded correctly
- **Key Values**: `winner_id`, API response status
- **What to Look For**: Successful API calls with correct winner

### Component Lifecycle Logs
- **Purpose**: Detect if components are re-mounting unexpectedly
- **Key Values**: Mount/unmount events, prop changes
- **What to Look For**: Unexpected re-mounts or stale props

---

## 🔍 How to Use These Logs for Debugging

### Step 1: Start the App with Clean Logs
```bash
# Clear old logs
rm /Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/*/Documents/app_debug_logs.txt

# Start the app
npx react-native run-ios --simulator="iPhone 16 Pro"
```

### Step 2: Reproduce the Bug
1. Navigate to ranking screen
2. Select a movie and choose "Love it"
3. Observe the comparison modal
4. Make selections and watch for the repeated movie issue

### Step 3: Analyze Logs
```bash
# Read the logs
cat /Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/*/Documents/app_debug_logs.txt | grep -E "useCompareComponent|ComparisonModal"
```

### Step 4: Look for Patterns
- Is `mid` staying the same after selections?
- Are refs (`midRef.current`) out of sync with state?
- Is `secondMovieData` updating when `mid` changes?
- Are API calls being made with correct data?

---

## 🎯 Specific Debug Scenarios

### Scenario 1: Mid Not Updating
**Log Pattern to Search**:
```
grep "binary search update" app_debug_logs.txt
```
**Expected**: `oldMid` and `newMid` should be different
**If Same**: Binary search calculation issue

### Scenario 2: Wrong Movie Showing
**Log Pattern to Search**:
```
grep "secondMovieData computed" app_debug_logs.txt
```
**Expected**: Movie title should change when `mid` changes
**If Same**: useMemo dependency issue

### Scenario 3: API Not Recording
**Log Pattern to Search**:
```
grep "recordUserPreferences" app_debug_logs.txt
```
**Expected**: Should see API calls after each selection
**If Missing**: API integration issue

---

## 🚀 Next Steps

1. **Run the app** with these enhanced logs
2. **Reproduce the bug** while capturing all log output
3. **Analyze the patterns** to identify where the binary search breaks
4. **Focus debugging** on the specific component/function showing issues

---

## 📝 Additional Scripts Created

### fetch-user-rankings.js
- **Location**: `/Users/willi/Dev/frontend/fetch-user-rankings.js`
- **Purpose**: Fetch user's ranked movies from API
- **Usage**: `node fetch-user-rankings.js`
- **Note**: Requires valid credentials (currently showing auth error)

---

## ✅ Checklist for Future Debugging

- [ ] Verify `mid` updates after each selection
- [ ] Confirm `midRef.current` syncs with `mid` state
- [ ] Check `secondMovieData` updates when `mid` changes
- [ ] Verify API calls are made and successful
- [ ] Confirm no unexpected component re-mounts
- [ ] Check for stale closures in setTimeout callbacks
- [ ] Verify binary search convergence condition
- [ ] Confirm correct winner_id sent to API

---

This enhanced logging should provide complete visibility into the pairwise ranking process and help identify exactly where the binary search algorithm is failing to progress correctly.