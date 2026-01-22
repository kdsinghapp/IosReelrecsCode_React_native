# Pairwise Ranking Mechanism - Complete User Journey Analysis

## Executive Summary

This React Native app implements a sophisticated **Binary Search Pairwise Ranking System** to efficiently rank user preferences across movies/shows. The system uses binary search to intelligently narrow down which movies the user prefers, requiring fewer comparisons while maintaining accuracy.

---

## Part 1: PURPOSE & BUSINESS LOGIC

### What is Pairwise Ranking?

**Pairwise Ranking** is a preference elicitation technique where:
- The system presents TWO movies to the user
- User selects which one they prefer
- The system learns about preference ordering through these binary comparisons
- Results accumulate to create a ranked list of movies

### Why Binary Search?

Instead of comparing every movie pair (which is O(n²) comparisons), the app uses **Binary Search Algorithm**:
- Divides movies into "preferred" and "not preferred" groups
- Sets bounds: `low` and `high` indices
- Uses middle point (`mid`) for each comparison
- Adjusts bounds based on user's choice
- Requires only O(log n) comparisons

### Business Value

1. **Accurate Personalization** - Understand true user preferences through behavioral data
2. **Efficiency** - Minimal user effort (fewer comparisons needed)
3. **Recommendation Quality** - Build better recommendation engine with verified preferences
4. **User Engagement** - Interactive process keeps users engaged in the app

---

## Part 2: COMPLETE USER JOURNEY (STEP-BY-STEP)

### Stage 1: Entry Point

**File:** `/Users/willi/Dev/frontend/src/screen/BottomTab/ranking/rankingScreen/RankingScreen.tsx`

#### What User Sees:
- **Ranking Screen** with two sections:
  1. **Your Rated Movies** - Movies they've already ranked
  2. **Suggested Movies** - Movies system recommends they rate

#### What Happens:
1. User navigates to Ranking Tab
2. Screen fetches:
   - `getAllRatedMovies()` - All previously rated movies
   - `getRankingSuggestionMovie()` - New movies to rate

#### Code Flow:
```typescript
const fetchRatedMovies = async () => {
  const res_All_Rated = await getAllRatedMovies(currentToken);
  setRatedMovie(res_All_Rated?.results ?? []);
};

const fetchSuggestionMovies = async () => {
  const res = await getRankingSuggestionMovie(currentToken, pageRef.current);
  setFilteredMovies(res.results);
};
```

---

### Stage 2: Triggering Feedback Modal

**File:** `/Users/willi/Dev/frontend/src/component/modal/feedbackModal/FeedbackModal.tsx`

#### What User Sees:
User clicks "Rank Now" button on a movie card from suggestions

#### What Happens:
```typescript
const handleRankingPress = (movie) => {
  compareHook.openFeedbackModal(movie);
};
```

The **FeedbackModal** appears with:
- Movie poster (170x240px)
- Movie title & year
- Question: "How was it?"
- Three preference buttons:
  - "Love It" (love)
  - "It Was Okay" (like)
  - "Didn't Like It" (dislike)
- Text input for optional review

#### User Actions:
1. Select one of three preferences
2. Optionally write a review
3. Click "Next" button

#### Code Flow:
```typescript
const handleLovedIt = () => {
  setPreference('love');
  setShowFeedback(true);
};

const nextPress = async () => {
  if (preference) {
    // Post comment if provided
    if (text.trim() !== '') {
      const response = await postComment(token, selectedMovie?.imdb_id, text);
    }
    onSubmit(preference);
    onOpenSecondModal?.();
  }
};
```

---

### Stage 3: Fetching Comparison Movies

**File:** `/Users/willi/Dev/frontend/src/screen/BottomTab/ranking/rankingScreen/useCompareComponent.tsx`

#### What Happens After User Submits Preference:

```typescript
const handleFeedbackSubmit = async (pref: 'love' | 'like' | 'dislike') => {
  setUserPreference({ preference: pref });
  setFeedbackVisible(false);
  
  // Fetch movies with SAME preference
  const list = await fetchComparisonMovies(pref);
  
  if (list.length > 0) {
    setComparisonVisible(true); // Open comparison modal
  } else {
    // No comparisons needed, calculate rating directly
    await calculateMovieRating(token, {
      imdb_id: selectedMovie.imdb_id,
      preference: pref,
    });
  }
};
```

#### What Gets Fetched:
```typescript
const fetchComparisonMovies = async (pref) => {
  const response = await getAllRated_with_preference(token, pref);
  
  // Filter out selected movie, keep only same preference
  const filtered = allResults
    .filter(m => m.imdb_id !== selectedMovieId)
    .filter(m => m.preference === pref);
  
  // Initialize binary search bounds
  setLow(0);
  setHigh(filtered.length - 1);
  setMid(Math.floor((filtered.length - 1) / 2)); // Start at median
  
  setComparisonMovies(filtered);
  return filtered;
};
```

#### Key Variables Initialized:
- `low = 0` - Lower bound of comparison range
- `high = length - 1` - Upper bound of comparison range
- `mid = floor((length - 1) / 2)` - Middle pivot for comparison
- `currentStep = total_rated_with_preference` - Progress tracking

---

### Stage 4: Comparison Modal Opens

**File:** `/Users/willi/Dev/frontend/src/component/modal/comparisonModal/ComparisonModal.tsx`

#### What User Sees:

A modal showing TWO movies side-by-side:

```
┌─────────────────────────────────────┐
│    Which do you prefer?          [X]│
├─────────────┬───────────────────────┤
│             │                       │
│  Movie 1    │  OR  │  Movie 2      │
│  Poster     │      │  Poster       │
│  Title      │      │  Title        │
│  Year       │      │  Rec Score    │
│             │      │  Year         │
│             │      │               │
└─────────────┴───────────────────────┘
      [SELECT]        [SELECT]
         Skip Button
```

#### Movies Shown:
- **First Movie:** The movie user is ranking
- **Second Movie:** `comparisonMovies[mid]` (from binary search)

#### Rec Score:
Shows predicted enjoyment score based on user's history

---

### Stage 5: User Selects Preference

**File:** `/Users/willi/Dev/frontend/src/screen/BottomTab/ranking/rankingScreen/useCompareComponent.tsx`

#### Option A: User Selects First Movie (Left Side)

```typescript
const handleSelectFirst = async () => {
  // Record the preference
  await recordUserPreferences(
    token,
    userPreference.preference,     // 'love', 'like', or 'dislike'
    selectedMovie.imdb_id,          // Movie user is ranking
    secondMovieData.imdb_id,        // Movie shown on right
    selectedMovie.imdb_id           // Winner (left side won)
  );
  
  // BINARY SEARCH: Eliminate upper half
  // Why? If user picked left, all items >= mid are "less preferred"
  const newHigh = midRef.current - 1;
  const newMid = Math.floor((lowRef.current + newHigh) / 2);
  
  setHigh(newHigh);
  setMid(newMid);
  
  // Check if comparisons complete
  const remainingItems = highRef.current - lowRef.current + 1;
  if (remainingItems <= 0) {
    setComparisonVisible(false);
    // Calculate final rating & show progress
    await calculateMovieRating(token, {...});
  }
};
```

#### Option B: User Selects Second Movie (Right Side)

```typescript
const handleSelectSecond = async () => {
  // Record the preference
  await recordUserPreferences(
    token,
    userPreference.preference,
    selectedMovie.imdb_id,
    secondMovieData.imdb_id,
    secondMovieData.imdb_id    // Winner (right side won)
  );
  
  // BINARY SEARCH: Eliminate lower half
  // If user picked right, all items <= mid are "less preferred"
  const newLow = midRef.current + 1;
  const newMid = Math.floor((newLow + highRef.current) / 2);
  
  setLow(newLow);
  setMid(newMid);
  
  // Check if comparisons complete
  const remainingItems = highRef.current - lowRef.current + 1;
  if (remainingItems <= 0) {
    setComparisonVisible(false);
    await calculateMovieRating(token, {...});
  }
};
```

#### Option C: User Clicks Skip

```typescript
const handleSkipSetFirst = async () => {
  // Treat as first movie won (user didn't pick second)
  if (lastAction === 'first') {
    const newHigh = midRef.current - 1;
    const newMid = Math.floor((lowRef.current + newHigh) / 2);
    setHigh(newHigh);
    setMid(newMid);
  } else if (lastAction === 'second') {
    const newLow = midRef.current + 1;
    const newMid = Math.floor((newLow + highRef.current) / 2);
    setLow(newLow);
    setMid(newMid);
  }
  
  if (lowRef.current > highRef.current) {
    // Done with comparisons
    await calculateMovieRating(token, {...});
  }
};
```

#### Animation:
- Selected movie's poster slides away horizontally
- New comparison movie slides in
- Unselected movie gets grayscale filter
- Selected movie gets blue border highlight

---

### Stage 6: Data Sent to Backend

**API Call 1: Record Pairwise Decision**

```typescript
// File: /Users/willi/Dev/frontend/src/redux/Api/movieApi.tsx

const payload = {
  imdb_id_1: string;        // First movie ID
  imdb_id_2: string;        // Second movie ID
  winner: string;           // Which movie won (imdb_id)
  preference: "love" | "like" | "dislike";  // User's preference level
};

await recordUserPreferences(token, payload);
// Endpoint: POST /record-pairwise-decision
```

**API Call 2: Calculate Final Rating**

```typescript
const ratingPayload = {
  imdb_id: selectedMovie.imdb_id,
  preference: 'love' | 'like' | 'dislike'
};

await calculateMovieRating(token, ratingPayload);
// Endpoint: POST /calculate-movie-rating
```

---

### Stage 7: Step Progress Modal

**File:** `/Users/willi/Dev/frontend/src/component/modal/stepProgressModal/StepProgressModal.tsx`

#### What User Sees:

After completing all comparisons:

```
┌─────────────────────────────────────┐
│ Awesome! You've just ranked your    │
│ first movie!                        │
│                                     │
│ [Progress Bar: ██████░░░░░░░░░░]   │
│                                     │
│ Recs Score Progress                 │
│ Rate a few more movies/shows to get │
│ your personalized recommendations.  │
└─────────────────────────────────────┘
```

#### Progress Tracking:
```typescript
// Current step = number of movies with preference
const currentStep = comparisonMovies.length;
const progress = currentStep / totalSteps;
const progressBar = [1][2][3][4][5][6]  // 6 steps total
```

#### What Happens:
- Shows visual progress (steps 1-6)
- Each dot represents a ranked movie
- Encourages user to rank more movies
- Closes modal on click

---

### Stage 8: Updated Ranking List

**Back on RankingScreen:**

User sees:
1. **Your Rated Movies** section updates with newly ranked movie
2. Each movie shows:
   - Poster image
   - Title & year
   - Rec Score (predicted enjoyment: 0-100)
   - Up/Down arrows to manually reorder

#### Swap Items (Manual Reordering):

```typescript
const swapItems = async (from: number, to: number) => {
  // Optimistically update UI
  setRatedMovie(prev => {
    const updated = [...prev];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    return updated;
  });
  
  // Send to backend
  const payload = {
    imdb_id_1: movieFrom.imdb_id,
    imdb_id_2: movieTo.imdb_id,
    winner: from > to ? movieFrom.imdb_id : movieTo.imdb_id,
    preference: movieFrom.preference
  };
  
  const res = await recordPairwiseDecision(token, payload);
  
  // Update rec_score based on response
  setRatedMovie(prev =>
    prev.map(m => ({
      ...m,
      rec_score: res?.[m.imdb_id] ?? m.rec_score
    }))
  );
};
```

---

## Part 3: DATA COLLECTION

### What Data Is Collected?

#### 1. Preference Recordings
```typescript
{
  imdb_id_1: "tt1375666",        // Inception
  imdb_id_2: "tt0068646",        // The Godfather
  winner: "tt1375666",           // User picked Inception
  preference: "love"             // User loves this genre
}
```

#### 2. Movie Ratings
```typescript
{
  imdb_id: "tt1375666",
  preference: "love"  // Aggregated preference level
}
```

#### 3. Optional Reviews
```typescript
// User's comment about the movie
await postComment(token, imdb_id, "Great movie!")
```

#### 4. User Rankings (Stored Locally)
```typescript
// AsyncStorage
currentStep: "6"  // Number of movies rated with preference

// Redux store
ratedMovie: [
  {
    imdb_id: "tt1375666",
    title: "Inception",
    preference: "love",
    rec_score: 95,
    release_year: 2010,
    cover_image_url: "..."
  },
  // ... more movies in ranked order
]
```

---

## Part 4: STATE MANAGEMENT

### Redux Store

```typescript
// File: /Users/willi/Dev/frontend/src/redux/store.ts

auth: {
  token: string         // User authentication token
}

modal: {
  isModalClosed: boolean  // Triggers refresh when modal closes
}
```

### Local State (useCompareComponent Hook)

```typescript
// Binary Search State
low: number             // Lower bound
high: number            // Upper bound
mid: number             // Current pivot
lowRef, highRef, midRef // Ref versions for accuracy

// Movie Data
selectedMovie: Movie    // Movie being ranked
comparisonMovies: []    // All movies with same preference
secondMovieData: Movie  // Current comparison movie
currentComparisonIndex: number

// User Preference
userPreference: {
  preference: 'love' | 'like' | 'dislike' | null
}

// UI State
isFeedbackVisible: boolean
isComparisonVisible: boolean
isStepsModalVisible: boolean
currentStep: number
```

### AsyncStorage

```typescript
currentStep: "6"      // Persisted progress
hasSeenTooltip: "true" // One-time tooltip
DEBUG_FILTERED: {...} // Debug data
```

---

## Part 5: MODAL SEQUENCE

### Modal Flow Chart:

```
RankingScreen
    ↓
[User clicks Rank Now on suggested movie]
    ↓
FeedbackModal
├─ Movie poster displayed
├─ User selects: Love It / It Was Okay / Didn't Like It
├─ Optional: User writes review
└─ User clicks Next
    ↓
ComparisonModal (loops until done)
├─ Two movies displayed side-by-side
├─ User selects Left / Right / Skip
├─ Selected movie animates away
├─ New comparison movie slides in
├─ Repeat until binary search complete
└─ Close modal
    ↓
StepProgressModal
├─ Shows "Awesome! You've just ranked..."
├─ Visual progress bar (1-6 steps)
└─ User clicks to dismiss
    ↓
Back to RankingScreen
└─ Movie appears in "Your Rated Movies" section
```

---

## Part 6: COMPLETE API SUMMARY

### API Endpoints Called

#### 1. Fetch Rated Movies
```
GET /ranked-movies
Headers: Authorization: Token ${token}
Response: { results: Movie[], total_pages: number }
```

#### 2. Fetch Suggestion Movies
```
GET /suggest-movies?page=1
Headers: Authorization: Token ${token}
Response: { results: Movie[], total_pages: number }
```

#### 3. Fetch Movies with Preference
```
GET /ranked-movies?preference=love
Headers: Authorization: Token ${token}
Response: { results: Movie[], total_pages: number }
```

#### 4. Record Pairwise Decision
```
POST /record-pairwise-decision
Headers: Authorization: Token ${token}
Body: {
  imdb_id_1: string,
  imdb_id_2: string,
  winner: string,
  preference: "love" | "like" | "dislike"
}
Response: { [imdb_id]: rec_score, ... }
```

#### 5. Calculate Movie Rating
```
POST /calculate-movie-rating
Headers: Authorization: Token ${token}
Body: {
  imdb_id: string,
  preference: "love" | "like" | "dislike"
}
Response: { success: boolean }
```

#### 6. Post Comment/Review
```
POST /comments
Headers: Authorization: Token ${token}
Body: { imdb_id: string, text: string }
Response: { comment_id: string, ... }
```

#### 7. Record Pairwise (Alternative)
```
POST /record-pairwise-decision-and-calculate-rating
Headers: Authorization: Token ${token}
Body: { imdb_id_1, imdb_id_2, winner, preference }
```

---

## Part 7: KEY COMPONENTS BREAKDOWN

### Component Hierarchy

```
RankingScreen (Main Container)
├─ SearchBarCustom (Search functionality)
├─ StepProgressBar (Shows progress 1-6)
├─ FlatList: Your Rated Movies
│  └─ RankingMovieList (Rendered item)
│     ├─ FastImage (Movie poster)
│     ├─ CustomText (Title/Year)
│     ├─ RankingWithInfo (Rec Score with tooltip)
│     └─ Up/Down buttons for reordering
├─ FlatList: Suggested Movies
│  └─ renderMovie (Rendered item)
│     └─ NormalMovieCard
│        ├─ FastImage (Poster)
│        ├─ Title/Year
│        ├─ Save bookmark button
│        └─ Rank Now button
└─ CompareModals (Three modals)
   ├─ FeedbackModal
   │  ├─ Movie poster
   │  ├─ Preference buttons (Love/Okay/Dislike)
   │  ├─ Review input
   │  └─ Next button
   ├─ ComparisonModal
   │  ├─ Two movie cards
   │  ├─ Selection buttons
   │  ├─ Skip button
   │  └─ "Or" divider
   └─ StepProgressModal
      ├─ Congratulations text
      ├─ Progress bar
      └─ Step indicators
```

---

## Part 8: BUSINESS LOGIC SUMMARY

### Algorithm: Binary Search Pairwise Ranking

**Goal:** Efficiently rank N movies by asking user to compare pairs

**Steps:**

1. **Initial Setup**
   - Get list of movies with same preference (love/like/dislike)
   - Set: low=0, high=n-1, mid=(n-1)/2

2. **Comparison Loop**
   - Show: Movie[mid] vs. Selected Movie
   - Get user choice

3. **Binary Search Adjustment**
   - If user picks LEFT (first movie):
     - Movies from mid to high are "less preferred"
     - Set: high = mid - 1
   - If user picks RIGHT (second movie):
     - Movies from low to mid are "less preferred"
     - Set: low = mid + 1
   - Recalculate: mid = (low + high) / 2

4. **Termination**
   - When low > high: All movies ranked
   - Send to API: calculateMovieRating()

5. **Output**
   - rec_score updated for the movie
   - Movie added to user's ranking list
   - Progress incremented

---

## Part 9: USER EXPERIENCE FLOW

### Timeline of Events

1. **User lands on Ranking Screen**
   - Sees "Your Rated Movies" (empty or populated)
   - Sees "Suggested Movies to Rate"

2. **User clicks "Rank Now" on a suggested movie**
   - FeedbackModal appears (animation slides in from left)

3. **User selects preference & optionally writes review**
   - API posts comment if provided
   - Modal animates out

4. **ComparisonModal appears** (if movies exist to compare)
   - Two movies shown side-by-side
   - Binary search begins

5. **User makes selections** (repeats until done)
   - Each click triggers animation
   - New comparison loaded
   - Progress updates

6. **After final comparison**
   - StepProgressModal appears
   - Shows 1-6 step progress
   - User dismisses

7. **Back to RankingScreen**
   - Newly ranked movie appears in list
   - With rec_score badge
   - With up/down reorder buttons

---

## Part 10: KEY FILES REFERENCE

| File | Purpose | Key Functions |
|------|---------|---|
| RankingScreen.tsx | Main UI, movie lists | fetchRatedMovies, fetchSuggestionMovies, swapItems |
| useCompareComponent.tsx | Binary search logic | handleSelectFirst, handleSelectSecond, fetchComparisonMovies |
| FeedbackModal.tsx | Preference selection | handleLovedIt, handleOkay, handleDidntLike, nextPress |
| ComparisonModal.tsx | Visual comparison | slideAndResetImages, onSelectFirst, onSelectSecond |
| StepProgressModal.tsx | Progress display | Shows currentStep/totalSteps |
| StepProgressBar.tsx | Progress bar UI | Renders filled/unfilled steps |
| movieApi.tsx | API calls | recordUserPreferences, calculateMovieRating, getAllRated_with_preference |
| ProfileApi.tsx | User preferences | recordUserPreferences implementation |
| NormalMovieCard.tsx | Suggested movie item | Display + "Rank Now" button |
| RankingWithInfo.tsx | Rec score tooltip | Shows score with explanation |

---

## CONCLUSION

This is a well-architected pairwise ranking system that:
- Uses efficient binary search (O(log n) complexity)
- Collects behavioral preference data
- Provides smooth animations and UX
- Persists progress locally and on server
- Integrates with recommendation engine (rec_score)
- Gamifies ranking process with progress indicators

The complete journey from clicking "Rank Now" to seeing the ranked movie involves:
1. Feedback modal (preference selection)
2. Multiple comparison modals (binary search comparisons)
3. API calls to record decisions
4. Progress modal (visual feedback)
5. Updated ranking list

All while maintaining optimal performance through proper state management, pagination, and React optimization techniques.

