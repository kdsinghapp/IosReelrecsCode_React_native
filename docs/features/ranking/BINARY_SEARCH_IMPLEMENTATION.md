# Binary Search Implementation in ReelRecs
## Complete Algorithm Documentation & Analysis
### Date: November 1, 2025

---

## 🎯 Purpose

The binary search algorithm efficiently determines the exact ranking position for a movie within a user's preference list through minimal comparisons (typically 3-5 for lists of 20-30 movies).

---

## 📐 Algorithm Theory

### Traditional Binary Search
Used to find an element in a sorted array:
```
Array: [1, 3, 5, 7, 9, 11, 13]
Find: 7
Steps: Start at middle (7) → Found!
```

### ReelRecs Modified Binary Search
Used to find the INSERTION POINT for a new element:
```
Ranked Movies: [Movie1(best), Movie2, Movie3, ..., Movie17(worst)]
Insert: Inception
Steps: Compare with middle → Narrow range → Repeat until position found
```

---

## 🔄 The Algorithm Step-by-Step

### Initial Setup
```javascript
// When user selects "I love it" for Inception
comparisonMovies = [MobLand, Skyfall, Avatar, ...] // 17 movies sorted by rating
low = 0
high = 16 (length - 1)
mid = Math.floor((16 - 0) / 2) = 8
```

### Step 1: First Comparison
```
Compare: Inception vs comparisonMovies[8] (middle movie)
User picks: Inception is better
Result: Inception belongs in upper half (indices 0-7)
Update: high = 7, mid = 3
```

### Step 2: Second Comparison
```
Compare: Inception vs comparisonMovies[3]
User picks: Other movie is better
Result: Inception belongs between indices 4-7
Update: low = 4, mid = 5
```

### Step 3: Third Comparison
```
Compare: Inception vs comparisonMovies[5]
User picks: Inception is better
Result: Inception belongs at index 5
Update: high = 4, low still 4
Converged: Position found!
```

---

## 💻 Current Implementation

### File Location
`/src/screen/BottamTab/ranking/rankingScreen/useCompareComponent.tsx`

### Key Variables
```javascript
// State variables (React state)
const [low, setLow] = useState(0);
const [high, setHigh] = useState(0);
const [mid, setMid] = useState(0);

// Ref variables (for immediate access in callbacks)
const lowRef = useRef(0);
const highRef = useRef(0);
const midRef = useRef(0);
```

### Initialization (Lines 156-174)
```javascript
const length = filtered.length;
setLow(0);
lowRef.current = 0;
setHigh(length - 1);
highRef.current = length - 1;
const initialMid = Math.floor((length - 1) / 2);
setMid(initialMid);
midRef.current = initialMid;
```

### When User Prefers New Movie (Lines 357-375)
```javascript
const handleSelectFirst = useCallback(async () => {
  // User prefers the new movie (Inception)
  // So it ranks HIGHER than comparison movie
  // Search in upper half
  const newHigh = midRef.current - 1;
  const newMid = Math.floor((lowRef.current + newHigh) / 2);

  setHigh(newHigh);
  highRef.current = newHigh;
  setMid(newMid);
  midRef.current = newMid;

  // Check if search complete
  if (lowRef.current > highRef.current) {
    // Position found!
    finalizeRanking();
  }
}, [...]);
```

### When User Prefers Comparison Movie (Lines 420-438)
```javascript
const handleSelectSecond = useCallback(async () => {
  // User prefers the comparison movie
  // So new movie ranks LOWER
  // Search in lower half
  const newLow = midRef.current + 1;
  const newMid = Math.floor((newLow + highRef.current) / 2);

  setLow(newLow);
  lowRef.current = newLow;
  setMid(newMid);
  midRef.current = newMid;

  // Check if search complete
  if (lowRef.current > highRef.current) {
    // Position found!
    finalizeRanking();
  }
}, [...]);
```

---

## 🐛 Current Bug Analysis

### The Problem
The modal shows the same comparison movie repeatedly instead of showing `comparisonMovies[mid]` where `mid` changes after each selection.

### Potential Issues in Implementation

#### Issue 1: Initial Mid Calculation
```javascript
// Current (possibly wrong):
const initialMid = Math.floor((length - 1) / 2);

// Should be:
const initialMid = Math.floor((low + high) / 2);
// Which initially is the same but clearer intent
```

#### Issue 2: Edge Case Handling
```javascript
// When only 2 movies remain:
if (highRef.current - lowRef.current === 1) {
  // Need special handling
  setMid(lowRef.current); // Force comparison with first of the two
}
```

#### Issue 3: State vs Ref Synchronization
The code uses both state (`mid`) and refs (`midRef.current`). These might get out of sync:
```javascript
// State update (async)
setMid(newMid);

// Ref update (immediate)
midRef.current = newMid;

// If secondMovieData uses state 'mid', it might be stale
```

---

## 📊 Complexity Analysis

### Time Complexity
- **Best Case**: O(1) - User's preference matches first comparison
- **Average Case**: O(log n) - Binary search property
- **Worst Case**: O(log n) - Maximum comparisons = ceil(log₂(n))

### Space Complexity
- O(1) - Only storing pointers/indices, not duplicating arrays

### Comparison Count
| List Size | Max Comparisons |
|-----------|----------------|
| 10 movies | 4 comparisons  |
| 20 movies | 5 comparisons  |
| 50 movies | 6 comparisons  |
| 100 movies| 7 comparisons  |

---

## 🔍 How to Debug Binary Search Issues

### 1. Log the Array State
```javascript
fileLogger.info('Binary search state', {
  arrayLength: comparisonMovies.length,
  low: lowRef.current,
  high: highRef.current,
  mid: midRef.current,
  currentMovie: comparisonMovies[midRef.current]?.title
});
```

### 2. Track Each Step
```javascript
fileLogger.info('Binary search step', {
  step: stepCount++,
  comparison: `${newMovie.title} vs ${comparisonMovies[mid].title}`,
  userChoice: 'first' or 'second',
  newRange: `[${low}, ${high}]`,
  newMid: mid
});
```

### 3. Verify Convergence
```javascript
if (low > high) {
  fileLogger.info('Search complete', {
    finalPosition: low,
    insertBefore: comparisonMovies[low]?.title,
    insertAfter: comparisonMovies[low-1]?.title
  });
}
```

---

## 🎮 Visual Example

### Starting State
```
Movies (sorted by rating):
[0]: MobLand (10.0) ←
[1]: Skyfall (9.8)
[2]: Avatar (9.5)
[3]: Inception (9.3)
[4]: Matrix (9.0)
[5]: Gladiator (8.8)
[6]: Titanic (8.5)
[7]: Jaws (8.2)
[8]: Rocky (8.0) ← Start here (middle)
[9]: Cars (7.8)
...
[16]: Movie17 (6.0)

New movie: "The Dark Knight"
```

### Step 1
```
Compare: Dark Knight vs Rocky (index 8)
User picks: Dark Knight
Range narrows: [0, 7]
New mid: 3
```

### Step 2
```
Compare: Dark Knight vs Inception (index 3)
User picks: Inception
Range narrows: [4, 7]
New mid: 5
```

### Step 3
```
Compare: Dark Knight vs Gladiator (index 5)
User picks: Dark Knight
Range narrows: [4, 4]
Position found: Insert at index 5
```

### Final Result
```
[0]: MobLand (10.0)
[1]: Skyfall (9.8)
[2]: Avatar (9.5)
[3]: Inception (9.3)
[4]: Matrix (9.0)
[5]: Dark Knight (8.9) ← Inserted here
[6]: Gladiator (8.8)
[7]: Titanic (8.5)
...
```

---

## 🔧 Common Binary Search Bugs

### 1. Off-by-One Errors
```javascript
// Wrong:
const newMid = Math.floor((low + high + 1) / 2);

// Right:
const newMid = Math.floor((low + high) / 2);
```

### 2. Infinite Loops
```javascript
// Can cause infinite loop:
if (low >= high) return;

// Better:
if (low > high) return; // Proper termination
```

### 3. Integer Overflow (Not in JavaScript)
```javascript
// In other languages, this can overflow:
mid = (low + high) / 2;

// Safe version:
mid = low + Math.floor((high - low) / 2);
```

### 4. Wrong Comparison Direction
```javascript
// If movies are sorted descending (best first):
if (userPrefersFirst) {
  high = mid - 1; // Search upper half (better movies)
} else {
  low = mid + 1;  // Search lower half (worse movies)
}
```

---

## 🎯 Why Binary Search Here?

### Alternative: Linear Comparisons
Without binary search, finding position among 20 movies would require up to 20 comparisons.

### Binary Search Advantage
- 20 movies → 5 comparisons max
- 100 movies → 7 comparisons max
- Exponentially better as list grows

### User Experience
- Fewer comparisons = Less user fatigue
- Faster ranking process
- More consistent results

---

## 📝 Testing Binary Search

### Test Case 1: Insert at Beginning
```javascript
// All comparisons should favor new movie
// Final position: index 0
```

### Test Case 2: Insert at End
```javascript
// All comparisons should favor existing movies
// Final position: index n
```

### Test Case 3: Insert in Middle
```javascript
// Mixed comparisons
// Verify correct narrowing
```

### Test Case 4: Single Movie List
```javascript
// Edge case: Only one comparison needed
```

### Test Case 5: Empty List
```javascript
// Edge case: No comparisons, insert at 0
```

---

## 🔍 Current Implementation Issues

### Identified Problems

1. **Initial mid calculation might be wrong**
   - Uses `(length - 1) / 2` instead of `(low + high) / 2`

2. **State/Ref synchronization**
   - Both `mid` state and `midRef` are updated
   - `secondMovieData` uses state which might be stale

3. **No logging of actual array positions**
   - Need to log which movie is at each index

4. **Edge case handling**
   - What happens when low === high?
   - What happens with 0 or 1 comparison movies?

---

## 💡 Recommended Fixes

### Fix 1: Simplify State Management
```javascript
// Use only refs for binary search variables
// Trigger re-render manually when needed
const [, forceUpdate] = useReducer(x => x + 1, 0);
```

### Fix 2: Add Comprehensive Logging
```javascript
const logBinarySearchState = () => {
  fileLogger.info('Binary Search Debug', {
    range: `[${lowRef.current}, ${highRef.current}]`,
    mid: midRef.current,
    movieAtMid: comparisonMovies[midRef.current],
    totalMovies: comparisonMovies.length
  });
};
```

### Fix 3: Validate Array State
```javascript
// Before each comparison
if (mid >= comparisonMovies.length) {
  fileLogger.error('Mid out of bounds!', { mid, length: comparisonMovies.length });
}
```

---

## 🔗 Related Documentation

- `CURRENT_BUG_STATUS.md` - Details about the comparison loop bug
- `CODEBASE_MAP.md` - Where to find the implementation
- `DEBUGGING_GUIDE.md` - How to debug effectively

---

This documentation should help future developers understand both the theory and implementation of the binary search algorithm used for movie ranking in ReelRecs.