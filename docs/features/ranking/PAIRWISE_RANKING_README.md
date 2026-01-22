# Pairwise Ranking System - Complete Documentation

Welcome! This folder contains comprehensive documentation for understanding the pairwise ranking mechanism in this React Native app.

## Documentation Files

### 1. PAIRWISE_RANKING_QUICK_REFERENCE.md
**Start here for quick lookups**
- 8-step journey from "Rank Now" click to completion
- Key data structures
- File quick reference
- API endpoints summary
- Common issues & solutions
- Testing checklist
- ~350 lines

**Best for**: Developers who need quick answers while coding

---

### 2. PAIRWISE_RANKING_ANALYSIS.md
**Deep dive into the complete system**
- Purpose and business logic of pairwise ranking
- Why binary search is used
- Complete user journey (8 stages)
- Data collection details
- State management explanation
- Modal sequence
- API call details
- Component breakdown
- Algorithm explanation
- ~766 lines

**Best for**: Understanding the "why" and "how" of the system

---

### 3. PAIRWISE_RANKING_VISUAL_FLOWS.md
**Visual diagrams and flow charts**
- UI mockups with ASCII art
- User journey flow diagram
- Binary search step-by-step visualization
- Animation sequences
- State change diagrams
- API call sequence
- Data flow diagram
- Complete lifecycle flow
- ~463 lines

**Best for**: Visual learners and system architects

---

## Quick Summary

### The Pairwise Ranking Mechanism

When a user clicks "Rank Now" on a movie, the app launches an intelligent preference ranking system:

1. **Preference Selection** - User picks Love It / It Was Okay / Didn't Like It
2. **Comparison Movies Fetched** - App loads all movies user rated with that preference level
3. **Binary Search Initialized** - Sets up efficient O(log n) comparison algorithm
4. **Pairwise Comparisons** - Shows user two movies side-by-side, repeating until search complete
5. **Each Comparison Recorded** - Backend tracks user's preferences for ML/recommendation engine
6. **Final Rating Calculated** - Generates rec_score (0-100) showing predicted enjoyment
7. **Progress Tracked** - Shows visual progress (1-6 steps to unlock recommendations)
8. **Movie Ranked** - Movie appears in "Your Rated Movies" list with rec_score badge

### Key Technologies

- **Binary Search Algorithm** - O(log n) efficiency for ranking
- **React Native Hooks** - useCompareComponent for state management
- **Modal Stack** - FeedbackModal → ComparisonModal → StepProgressModal
- **Animated Transitions** - 700ms slide animations between movies
- **AsyncStorage** - Persists progress locally
- **Redux** - Manages authentication token and modal state
- **FastImage** - Efficient image caching and rendering
- **FlatList** - Optimized list rendering for performance

### Core Files

```
/src/screen/BottomTab/ranking/rankingScreen/
├── RankingScreen.tsx              (Main UI container)
├── useCompareComponent.tsx        (Binary search logic - core)
├── useComparisonModal.tsx         (Old comparison hook)
└── CompareModals.tsx              (Modal orchestrator)

/src/component/modal/
├── feedbackModal/FeedbackModal.tsx        (Preference selection)
├── comparisonModal/ComparisonModal.tsx    (Movie comparison)
├── stepProgressModal/StepProgressModal.tsx (Progress display)
└── stepProgressModal/StepProgressBar.tsx   (Progress bar)

/src/redux/Api/
├── movieApi.tsx                   (Ranking API calls)
└── ProfileApi.tsx                 (recordUserPreferences)
```

---

## How to Use These Documents

### Scenario 1: "I need to add a new feature to the ranking flow"
1. Read: PAIRWISE_RANKING_QUICK_REFERENCE.md (understand current flow)
2. Reference: PAIRWISE_RANKING_VISUAL_FLOWS.md (see exact sequence)
3. Deep dive: PAIRWISE_RANKING_ANALYSIS.md (understand business logic)

### Scenario 2: "I need to fix a bug in the comparison modal"
1. Look up: PAIRWISE_RANKING_QUICK_REFERENCE.md (File Quick Reference section)
2. Go to: ComparisonModal.tsx (or related file)
3. Check: PAIRWISE_RANKING_ANALYSIS.md Part 5 (Modal Sequence)

### Scenario 3: "I need to understand the algorithm"
1. Start: PAIRWISE_RANKING_QUICK_REFERENCE.md (Understanding Binary Search)
2. Visualize: PAIRWISE_RANKING_VISUAL_FLOWS.md (Binary Search Visualization)
3. Deep dive: PAIRWISE_RANKING_ANALYSIS.md Part 8 (Business Logic)

### Scenario 4: "I need to trace the data flow"
1. Reference: PAIRWISE_RANKING_QUICK_REFERENCE.md (What Data Is Sent)
2. Visualize: PAIRWISE_RANKING_VISUAL_FLOWS.md (API Call Sequence & Data Flow)
3. Study: PAIRWISE_RANKING_ANALYSIS.md Part 3 & 6 (Data Collection & API Summary)

---

## Key Concepts at a Glance

### The 3 Modals (in sequence)

**FeedbackModal** (User Input)
- Movie poster displayed
- User selects: Love It / It Was Okay / Didn't Like It
- Optional: Write review
- Posts comment to API if provided

**ComparisonModal** (Binary Search, repeats)
- Two movies side-by-side
- User picks Left / Right / Skip
- Smooth 700ms animations
- Each selection recorded via API
- Repeats until low > high

**StepProgressModal** (Celebration)
- "Awesome! You've just ranked your first movie!"
- Shows progress bar (1-6 steps)
- Motivates user to rank more

### The 4 Main State Types

1. **Binary Search Bounds** (low, high, mid)
   - Efficiently narrows down preference ranking
   - Updated after each comparison
   - Ends when low > high

2. **Modal Visibility** (isFeedbackVisible, isComparisonVisible, isStepsModalVisible)
   - Controls which modal shows
   - Triggers transitions
   - Dispatches modal refresh

3. **Movie Data** (selectedMovie, comparisonMovies, secondMovieData)
   - Which movie user is ranking
   - List of candidates to compare against
   - Current comparison movie

4. **User Preference** (userPreference.preference)
   - "love" | "like" | "dislike"
   - Determines which movies to compare
   - Sent to API with each decision

### The 6 API Endpoints

| Endpoint | When | Why |
|----------|------|-----|
| GET /ranked-movies | Screen load | Get user's previously rated movies |
| GET /suggest-movies | Screen load | Get new suggestions |
| GET /ranked-movies?preference=love | After feedback | Get movies with same preference |
| POST /record-pairwise-decision | Per comparison | Record each preference decision |
| POST /calculate-movie-rating | After complete | Calculate final rec_score |
| POST /comments | If review provided | Store user's review |

---

## Important Files (by location)

### Ranking Screen Components
- **RankingScreen.tsx** (Absolute path: `/Users/willi/Dev/frontend/src/screen/BottomTab/ranking/rankingScreen/RankingScreen.tsx`)
  - Main UI with two lists
  - Handles data fetching and item reordering
  - ~935 lines, complex, well-commented

- **useCompareComponent.tsx** (The core algorithm)
  - Binary search implementation
  - All modal state management
  - All preference recording logic
  - ~570 lines, critical file

### Modal Components
- **FeedbackModal.tsx** (Preference selection UI)
- **ComparisonModal.tsx** (Movie comparison UI with animations)
- **StepProgressModal.tsx** (Progress display)
- **StepProgressBar.tsx** (Progress bar component)

### API Handlers
- **movieApi.tsx** (Main API calls)
  - Line 158: `recordPairwiseDecision()`
  - Line 320: `calculateMovieRating()`
  - Line 266: `getRankingSuggestionMovie()`
  - Line 118: `getAllRatedMovies()`

- **ProfileApi.tsx** (Preference recording)
  - Line 187: `recordUserPreferences()` (test version)

---

## Understanding the Binary Search

### Simple Example:
```
Movies user rated as "love": [0, 1, 2, 3, 4, 5, 6]

Round 1: Compare selected movie vs movies[3]
- User picks LEFT → movies [4,5,6] are less preferred
- Update: high = 2

Round 2: Compare selected movie vs movies[1]
- User picks RIGHT → movies [0,1] are less preferred
- Update: low = 2

Round 3: Compare selected movie vs movies[2]
- User picks LEFT → ranking complete
- low > high → DONE

Result: Movie ranked in 3 comparisons instead of 7!
```

### Why It Matters:
- **Naive approach**: Compare movie to every other movie (O(n²))
- **Binary search**: Cut options in half each time (O(log n))
- **Real impact**: 7 movies = 3 comparisons vs 7. 1000 movies = 10 comparisons vs 1000!

---

## Data Examples

### Movie Object Sent to Comparison Modal
```javascript
{
  imdb_id: "tt1375666",
  title: "Inception",
  release_year: 2010,
  cover_image_url: "https://m.media-amazon.com/...",
  rec_score: 95,
  preference: "love",
  rating: 92
}
```

### Pairwise Decision Sent to API
```javascript
{
  imdb_id_1: "tt1375666",  // Inception
  imdb_id_2: "tt0482571",  // The Prestige
  winner: "tt1375666",     // User picked Inception
  preference: "love"       // User loves this genre
}
```

### Rating Calculation Request
```javascript
{
  imdb_id: "tt1375666",
  preference: "love"
}
// API returns rec_score update
```

---

## Testing Guide

### Manual Testing Checklist
- [ ] Click "Rank Now" on a suggested movie
- [ ] Select each preference option (Love/Okay/Dislike)
- [ ] Write optional review, click Next
- [ ] See comparison modal appear
- [ ] Click left movie, see animation
- [ ] Animations complete smoothly
- [ ] New comparison movie loads
- [ ] Click right movie
- [ ] Continue clicking until search ends
- [ ] See progress modal
- [ ] Dismiss progress modal
- [ ] Movie appears in "Your Rated Movies"
- [ ] rec_score badge shows correct value
- [ ] Try manual reordering with up/down arrows
- [ ] Close and reopen app, progress persists

### Debugging Key Points
```javascript
// Add these logs to useCompareComponent.tsx
console.log({
  step: `Comparison ${currentStep} of ${comparisonMovies.length}`,
  bounds: `low=${low}, high=${high}, mid=${mid}`,
  selected: selectedMovie?.title,
  comparing: secondMovieData?.title,
  preference: userPreference.preference
});
```

---

## Performance Optimization

### Already Implemented
- FlatList with `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`
- FastImage for caching
- useRef for binary search (avoids re-renders)
- React.memo() on components
- Pagination for movie lists

### Further Optimization Opportunities
- Virtualize comparison movie list (if 1000+ movies)
- Debounce API calls on scroll
- Preload next comparison movie
- Cache comparison results

---

## Common Modifications

### Add a 4th preference level?
- Modify: `FeedbackModal.tsx` (add button)
- Modify: useCompareComponent.tsx (update type: `'love'|'like'|'okay'|'dislike'`)
- Backend: Update API to accept new preference

### Change progress from 6 to 10 steps?
- Modify: `RankingScreen.tsx` (const totalSteps = 10)
- Modify: `StepProgressModal.tsx` (totalSteps prop)
- All other references update automatically

### Skip comparison modal for quick rating?
- Modify: `handleFeedbackSubmit()` in useCompareComponent.tsx
- If no comparisons needed, jump directly to `calculateMovieRating()`

### Add animations to feedback modal?
- Study: `ComparisonModal.tsx` (slideAndResetImages function)
- Apply similar pattern to FeedbackModal

---

## Support & Resources

### If You Get Stuck

1. **Check the Quick Reference** - Most answers are there
2. **Look at Diagrams** - Visual flows clarify sequence
3. **Search Analysis Doc** - Deep explanations with code
4. **Check Source Files** - Comments explain intention
5. **Debug Console Logs** - Follow data transformation

### Key Debugging Values to Check

```javascript
// Verify binary search math
if (mid < 0 || mid >= comparisonMovies.length) {
  console.warn("❌ Invalid mid index!");
}

// Verify preference was saved
if (!userPreference.preference) {
  console.warn("❌ No preference selected!");
}

// Verify API response format
if (!response?.rec_score && !response?.[imdb_id]) {
  console.warn("❌ API response missing rec_score!");
}
```

---

## Document Versions

- Created: October 31, 2024
- Based on: React Native 0.77 + TypeScript
- App: ReelRecs (Movie Recommendation Engine)
- Branch: wmg/test

---

## Next Steps

1. **Pick your use case** above
2. **Read the appropriate document**
3. **Refer to Quick Reference** as needed
4. **Check Visual Flows** to see exact sequence
5. **Deep dive Analysis** for understanding

Good luck exploring the pairwise ranking system!

