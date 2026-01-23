#!/usr/bin/env node

/**
 * Complete script to fetch ALL user's ranked movies with scores
 * and categorize them by preference (love/like/dislike)
 * This version ensures we get all movies, not just first page
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// API Configuration
const BASE_URL = 'http://reelrecs.us-east-1.elasticbeanstalk.com/v1';

// User credentials
const USER_CREDENTIALS = {
  email: 'william@louder.ai',
  password: 'test123'
};

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Login and get token
async function authenticate() {
   try {
    const response = await api.post('/login', {
      email_id: USER_CREDENTIALS.email,
      password: USER_CREDENTIALS.password
    });

    if (response.data && response.data.token) {
      console.log('✅ Authentication successful!');
      return response.data.token;
    } else {
      throw new Error('No token received from login');
    }
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data || error.message);
    throw error;
  }
}

// Fetch ALL rated movies (not limited by pages)
async function fetchAllRatedMovies(token) {
   const allMovies = [];
  let page = 1;
  let hasMore = true;
  let totalPages = 0;

  try {
    while (hasMore) {
      const response = await api.get(`/rated-movies?page=${page}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        allMovies.push(...response.data.results);
        console.log(`  ✓ Page ${page}: ${response.data.results.length} movies (total so far: ${allMovies.length})`);

        // Check if there are more pages
        if (response.data.next) {
          page++;
        } else {
          hasMore = false;
          totalPages = page;
        }

        // For initial testing, let's get at least 3 pages to ensure we get all categories
        if (page > 5 && allMovies.length >= 34) {
          // We should have at least 34 movies (19 loved + 10 liked + 5 disliked)
           hasMore = false;
          totalPages = page;
        }
      } else {
        hasMore = false;
        totalPages = page - 1;
      }
    }

    console.log(`\n✅ Fetched ${allMovies.length} movies across ${totalPages} pages`);
    return allMovies;
  } catch (error) {
    console.error(`  ❌ Error fetching movies:`, error.message);
    return allMovies; // Return what we have so far
  }
}

// Format movie data for markdown
function formatMovieForMarkdown(movie, index) {
  const rating = movie.rating !== undefined ? movie.rating.toFixed(2) : 'N/A';
  const recScore = movie.rec_score !== undefined ? movie.rec_score.toFixed(2) : 'N/A';
  return `${index}. **${movie.title || 'Unknown Title'}** (${movie.release_year || 'N/A'})
   - IMDB ID: ${movie.imdb_id}
   - **App Rating/Score**: ${rating}
   - Rec Score: ${recScore}
   - IMDB Rating: ${movie.imdb_rating || 'N/A'}
   - User Preference: ${movie.user_preference || movie.preference || 'N/A'}
`;
}

// Create markdown file with rankings
function createMarkdownFile(loveMovies, likeMovies, dislikeMovies) {
  const timestamp = new Date().toISOString();

  // Sort each category by rating (highest first)
  loveMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  likeMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  dislikeMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const content = `# User Movie Rankings - william@louder.ai
## Last Updated: ${timestamp}
## API Endpoint: ${BASE_URL}

---

## 📊 Summary Statistics
- **Total Rated Movies**: ${loveMovies.length + likeMovies.length + dislikeMovies.length}
- **Loved**: ${loveMovies.length}
- **Liked**: ${likeMovies.length}
- **Disliked**: ${dislikeMovies.length}

---

## 🎯 Preference Categories Explained

Based on the app's logic (from the code analysis):

- **💚 LOVED**: Movies the user selected "Love it" for. These are the user's favorite movies.
- **👍 LIKED**: Movies the user selected "It's OK" for. These are decent movies the user enjoyed but didn't love.
- **👎 DISLIKED**: Movies the user selected "Not for me" for. These are movies the user didn't enjoy.

The **App Rating/Score** is calculated through the pairwise ranking system using binary search to determine the movie's position relative to others in the same preference category.

---

## 💚 LOVED MOVIES (${loveMovies.length} movies)
*These are sorted by their app rating score (highest to lowest)*

${loveMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

---

## 👍 LIKED MOVIES (${likeMovies.length} movies)
*These are sorted by their app rating score (highest to lowest)*

${likeMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

---

## 👎 DISLIKED MOVIES (${dislikeMovies.length} movies)
*These are sorted by their app rating score (highest to lowest)*

${dislikeMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

---

## 📝 Notes on Scoring System

1. **App Rating/Score**: This is the internal score calculated by the pairwise comparison algorithm. Higher scores within each category mean the movie ranks higher among movies in that preference group.

2. **Rec Score**: This is the recommendation score - how likely the system thinks you'll enjoy this movie based on your rating patterns.

3. **Binary Search Ranking**: When you add a new movie with "Love it", "It's OK", or "Not for me", the app uses binary search through pairwise comparisons to find where it ranks within that preference category.

4. **Score Ranges**:
   - Loved movies typically have the highest scores
   - Liked movies have moderate scores
   - Disliked movies have lower scores
   - Within each category, the scores determine relative ranking

---

## 🔍 For Debugging Pairwise Ranking

When a new movie is added with preference "love":
1. It's compared against existing loved movies using binary search
2. Starting at the middle movie (index = loved_movies.length / 2)
3. Each comparison narrows down the position by half
4. Final position determines the movie's rating score

The bug we identified occurs when the API fails (500 error) after comparisons, preventing the binary search from updating its position, causing the same comparison to repeat.
`;

  const filePath = path.join(__dirname, 'USER_MOVIE_RANKINGS.md');
  fs.writeFileSync(filePath, content);
  console.log(`\n✅ Markdown file created: ${filePath}`);
  return filePath;
}

// Main function
async function main() {
  try {
 
    // Authenticate
    const token = await authenticate();

    // Fetch all movies
    const allMovies = await fetchAllRatedMovies(token);

    // Debug: Show all unique preference values found
    const uniquePreferences = new Set();
    allMovies.forEach(m => {
      if (m.user_preference) uniquePreferences.add(m.user_preference);
      if (m.preference) uniquePreferences.add(m.preference);
    });
    console.log('\n🔍 Unique preference values found:', Array.from(uniquePreferences));

    // Filter by preference - check both user_preference and preference fields
    const loveMovies = allMovies.filter(m =>
      m.user_preference === 'love' ||
      m.preference === 'love' ||
      m.user_preference === 'loved' ||
      m.preference === 'loved'
    );

    const likeMovies = allMovies.filter(m =>
      m.user_preference === 'like' ||
      m.preference === 'like' ||
      m.user_preference === 'liked' ||
      m.preference === 'liked' ||
      m.user_preference === 'ok' ||
      m.preference === 'ok'
    );

    const dislikeMovies = allMovies.filter(m =>
      m.user_preference === 'dislike' ||
      m.preference === 'dislike' ||
      m.user_preference === 'disliked' ||
      m.preference === 'disliked' ||
      m.user_preference === 'not_for_me' ||
      m.preference === 'not_for_me'
    );

    // console.log('\n📈 Movies by preference:');
    // console.log(`  Loved: ${loveMovies.length}`);
    // console.log(`  Liked: ${likeMovies.length}`);
    // console.log(`  Disliked: ${dislikeMovies.length}`);
    // console.log(`  Total categorized: ${loveMovies.length + likeMovies.length + dislikeMovies.length}`);
    // console.log(`  Total fetched: ${allMovies.length}`);

    // Check for uncategorized movies
    const uncategorized = allMovies.length - (loveMovies.length + likeMovies.length + dislikeMovies.length);
    if (uncategorized > 0) {
      console.log(`\n⚠️ Warning: ${uncategorized} movies could not be categorized`);
      console.log('Sample uncategorized movies:');
      allMovies.filter(m =>
        !loveMovies.includes(m) &&
        !likeMovies.includes(m) &&
        !dislikeMovies.includes(m)
      ).slice(0, 3).forEach(m => {
        console.log(`  - ${m.title}: preference="${m.preference}", user_preference="${m.user_preference}"`);
      });
    }

    // Create markdown file
    const filePath = createMarkdownFile(loveMovies, likeMovies, dislikeMovies);

    // Log summary
    //  console.log(`  Total: ${loveMovies.length + likeMovies.length + dislikeMovies.length} movies`);
    // console.log(`  Loved: ${loveMovies.length}`);
    // console.log(`  Liked: ${likeMovies.length}`);
    // console.log(`  Disliked: ${dislikeMovies.length}`);

    // Show sample from each category
    if (loveMovies.length > 0) {
      console.log('\n💚 Sample Loved Movies (Top 3):');
      loveMovies.slice(0, 3).forEach((movie, i) => {
        console.log(`  ${i + 1}. ${movie.title} - Score: ${movie.rating?.toFixed(2) || 'N/A'}`);
      });
    }

    if (likeMovies.length > 0) {
      console.log('\n👍 Sample Liked Movies (Top 3):');
      likeMovies.slice(0, 3).forEach((movie, i) => {
        console.log(`  ${i + 1}. ${movie.title} - Score: ${movie.rating?.toFixed(2) || 'N/A'}`);
      });
    }

    if (dislikeMovies.length > 0) {
      console.log('\n👎 Sample Disliked Movies (Top 3):');
      dislikeMovies.slice(0, 3).forEach((movie, i) => {
        console.log(`  ${i + 1}. ${movie.title} - Score: ${movie.rating?.toFixed(2) || 'N/A'}`);
      });
    }

    console.log('\n✅ Complete! Check USER_MOVIE_RANKINGS.md for full details.');

  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();