# Complete Pairwise Ranking System Fix

## Problem Summary
The pairwise ranking system was failing due to:
1. Using wrong API endpoint (`/pairwise-comparison` instead of `/record-pairwise-decision`)
2. Using wrong parameter names (`movie1_id`, `movie2_id`, `winner_id` instead of `imdb_id_1`, `imdb_id_2`, `winner`)
3. API returning 500 errors, causing the binary search to not update its state
4. Movies being placed in the middle of categories instead of their calculated positions

## API Documentation (from Sunny's Notebook)

### Available Endpoints

1. **Record Pairwise Decision**
   - Endpoint: `/record-pairwise-decision`
   - Method: POST
   - Parameters:
     ```json
     {
       "imdb_id_1": "tt1234567",
       "imdb_id_2": "tt7654321",
       "winner": "tt1234567"
     }
     ```

2. **Calculate Movie Rating**
   - Endpoint: `/calculate-movie-rating`
   - Method: POST
   - Parameters:
     ```json
     {
       "imdb_id": "tt1234567",
       "preference": "love"  // or "like" or "dislike"
     }
     ```
   - Note: Server calculates position from recorded pairwise decisions

3. **Combined Endpoint (Alternative)**
   - Endpoint: `/record-pairwise-decision-and-calculate-rating`
   - Method: POST
   - Parameters:
     ```json
     {
       "imdb_id_1": "tt1234567",
       "imdb_id_2": "tt7654321",
       "winner": "tt1234567",
       "preference": "love"
     }
     ```

4. **Get Ranked Movies**
   - Endpoint: `/ranked-movies`
   - Method: GET
   - Optional query: `?preference=love` (or "like", "dislike")

5. **Rollback Pairwise Decisions**
   - Endpoint: `/rollback-pairwise-decisions`
   - Method: DELETE
   - Body:
     ```json
     {
       "imdb_id": "tt1234567"
     }
     ```

## Required Code Changes

### 1. Fix ProfileApi.tsx (Lines 251-287)

**Current WRONG Implementation:**
```typescript
// Line 267 - WRONG ENDPOINT AND PARAMETERS
const response = await axiosInstance.post('/pairwise-comparison', {
  movie1_id: movie1Id,
  movie2_id: movie2Id,
  winner_id: winnerId
});
```

**CORRECT Implementation:**
```typescript
export const recordUserPreferences = async (
  movie1Id: string,
  movie2Id: string,
  winnerId: string,
  token: string
) => {
  try {
    // CORRECT ENDPOINT AND PARAMETERS
    const response = await axiosInstance.post('/record-pairwise-decision',
      {
        imdb_id_1: movie1Id,
        imdb_id_2: movie2Id,
        winner: winnerId
      },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    );

    console.log('✅ Pairwise decision recorded:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error recording pairwise decision:', error?.response?.data || error.message);
    throw error;
  }
};
```

### 2. Update movieApi.tsx (Already has correct endpoints)

The `movieApi.tsx` file already has the correct implementations:
- `recordPairwiseDecision` (line 158-172) - Uses correct endpoint
- `calculateMovieRating` (line 326-353) - Uses correct endpoint
- `rollbackPairwiseDecisions` (line 357-375) - Uses correct endpoint

### 3. Fix useCompareComponent.tsx to Use Correct API

The main issue is that `useCompareComponent.tsx` is calling `recordUserPreferences` from `ProfileApi.tsx` which uses the WRONG endpoint.

**Changes needed in useCompareComponent.tsx:**

Replace calls to `recordUserPreferences` with `recordPairwiseDecision`:

**Line 366-374 (in handleSelectFirst):**
```typescript
// CHANGE FROM:
await recordUserPreferences(
  firstMovieData.imdb_id,
  secondMovieData.imdb_id,
  firstMovieData.imdb_id,
  token
);

// TO:
await recordPairwiseDecision(token, {
  imdb_id_1: firstMovieData.imdb_id,
  imdb_id_2: secondMovieData.imdb_id,
  winner: firstMovieData.imdb_id,
  preference: userPreference.preference as "love" | "like" | "dislike"
});
```

**Line 476-484 (in handleSelectSecond):**
```typescript
// CHANGE FROM:
await recordUserPreferences(
  firstMovieData.imdb_id,
  secondMovieData.imdb_id,
  secondMovieData.imdb_id,
  token
);

// TO:
await recordPairwiseDecision(token, {
  imdb_id_1: firstMovieData.imdb_id,
  imdb_id_2: secondMovieData.imdb_id,
  winner: secondMovieData.imdb_id,
  preference: userPreference.preference as "love" | "like" | "dislike"
});
```

### 4. Import the Correct Function

**At the top of useCompareComponent.tsx, change the import:**
```typescript
// REMOVE:
import { recordUserPreferences } from '../../../../redux/Api/ProfileApi';

// ADD:
import { recordPairwiseDecision } from '../../../../redux/Api/movieApi';
```

## Alternative: Use Combined Endpoint

Instead of recording each decision separately and then calculating rating at the end, you could use the combined endpoint for EACH comparison:

```typescript
// In handleSelectFirst and handleSelectSecond:
const response = await axios.post(
  'http://reelrecs.us-east-1.elasticbeanstalk.com/v1/record-pairwise-decision-and-calculate-rating',
  {
    imdb_id_1: firstMovieData.imdb_id,
    imdb_id_2: secondMovieData.imdb_id,
    winner: winnerId,
    preference: userPreference.preference
  },
  { headers: { Authorization: `Token ${token}` } }
);
```

This would update the rating after EACH comparison instead of waiting until the end.

## Testing the Fix

1. Clear app data/cache
2. Try rating "Guardians of the Galaxy" with preference "love"
3. Verify that:
   - Each comparison successfully records (no 500 errors)
   - The binary search progresses correctly
   - The final position is calculated properly
   - The movie appears in the correct position (not middle)

## Server-Side Considerations

The server appears to:
1. Track all pairwise decisions for each movie
2. Calculate position based on win/loss record against other movies
3. Assign rating based on calculated position within preference category
4. NOT use client-provided position data (only imdb_id and preference)

This means the position calculation happens entirely server-side based on the recorded comparisons.

## Summary of Changes

1. ✅ Fix endpoint: `/pairwise-comparison` → `/record-pairwise-decision`
2. ✅ Fix parameters: `movie1_id`, `movie2_id`, `winner_id` → `imdb_id_1`, `imdb_id_2`, `winner`
3. ✅ Use `recordPairwiseDecision` from `movieApi.tsx` instead of `recordUserPreferences` from `ProfileApi.tsx`
4. ✅ Ensure all pairwise decisions are recorded before calling `calculateMovieRating`
5. ✅ Consider using the combined endpoint for simpler implementation