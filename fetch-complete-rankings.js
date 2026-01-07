#!/usr/bin/env node

/**
 * Manual script to fetch ALL user's movies
 * Based on the user's info that there should be:
 * - 19 loved movies
 * - 10 liked movies (including Manifest as the highest)
 * - 5 disliked movies
 * Total: 34 movies
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
  console.log('🔐 Authenticating with API...');
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

// Try different endpoints
async function tryEndpoints(token) {
  const endpoints = [
    { url: '/ranked-movies', name: 'Ranked Movies' },
    { url: '/rated-movies', name: 'Rated Movies' },
    { url: '/rated-movies?page_size=50', name: 'Rated Movies (50 per page)' },
    { url: '/rated-movies?limit=100', name: 'Rated Movies (limit 100)' },
  ];

  for (const endpoint of endpoints) {
    console.log(`\n📊 Trying ${endpoint.name} endpoint...`);
    try {
      const response = await api.get(endpoint.url, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      console.log(`  ✓ Response received:`);
      console.log(`    - Count: ${response.data.count || 'N/A'}`);
      console.log(`    - Results: ${response.data.results?.length || 0} items`);
      console.log(`    - Has next: ${response.data.next ? 'Yes' : 'No'}`);

      if (response.data.results && response.data.results.length > 0) {
        console.log(`    - Sample: ${response.data.results[0].title} (${response.data.results[0].preference || 'no pref'})`);
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.response?.status || error.message}`);
    }
  }
}

// Manually build the complete list based on what we know
async function buildCompleteList(token) {
  console.log('\n📊 Building complete movie list...');
  const allMovies = [];

  // Fetch multiple pages
  for (let page = 1; page <= 10; page++) {
    try {
      console.log(`  Fetching page ${page}...`);
      const response = await api.get(`/rated-movies?page=${page}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        allMovies.push(...response.data.results);
        console.log(`    ✓ Got ${response.data.results.length} movies (total: ${allMovies.length})`);

        // Check if we have enough movies (should be 34)
        if (allMovies.length >= 34) {
          console.log(`  ✅ Reached expected movie count`);
          break;
        }

        // Stop if no more pages
        if (!response.data.next) {
          console.log(`  ℹ️ No more pages available`);
          break;
        }
      } else {
        break;
      }
    } catch (error) {
      console.error(`  ❌ Error on page ${page}: ${error.message}`);
      break;
    }
  }

  return allMovies;
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

// Create markdown file
function createMarkdownFile(allMovies) {
  const timestamp = new Date().toISOString();

  // Filter by preference
  const loveMovies = allMovies.filter(m =>
    m.user_preference === 'love' ||
    m.preference === 'love'
  );

  const likeMovies = allMovies.filter(m =>
    m.user_preference === 'like' ||
    m.preference === 'like'
  );

  const dislikeMovies = allMovies.filter(m =>
    m.user_preference === 'dislike' ||
    m.preference === 'dislike'
  );

  // Sort each category by rating (highest first)
  loveMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  likeMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  dislikeMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // If we're still missing movies, add them manually based on what we know
  const expectedMovies = {
    liked: [
      'Manifest', // We know this is the highest liked movie
      // The user said there should be 9 more after Manifest
    ],
    disliked: [
      // User said there should be 5 disliked movies
    ]
  };

  const content = `# User Movie Rankings - william@louder.ai
## Last Updated: ${timestamp}
## API Endpoint: ${BASE_URL}

---

## 📊 Summary Statistics
- **Total Rated Movies**: ${allMovies.length} (fetched) / 34 (expected)
- **Loved**: ${loveMovies.length} (expected: 19)
- **Liked**: ${likeMovies.length} (expected: 10, including Manifest)
- **Disliked**: ${dislikeMovies.length} (expected: 5)

---

## 🎯 Preference Categories Explained

Based on the app's logic (from the code analysis):

- **💚 LOVED**: Movies the user selected "Love it" for. These are the user's favorite movies.
- **👍 LIKED**: Movies the user selected "It's OK" for. These are decent movies the user enjoyed but didn't love.
- **👎 DISLIKED**: Movies the user selected "Not for me" for. These are movies the user didn't enjoy.

The **App Rating/Score** is calculated through the pairwise ranking system using binary search to determine the movie's position relative to others in the same preference category.

---

## 💚 LOVED MOVIES (${loveMovies.length} movies, expected 19)
*These are sorted by their app rating score (highest to lowest)*

${loveMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

---

## 👍 LIKED MOVIES (${likeMovies.length} movies, expected 10)
*These are sorted by their app rating score (highest to lowest)*

${likeMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

---

## 👎 DISLIKED MOVIES (${dislikeMovies.length} movies, expected 5)
*These are sorted by their app rating score (highest to lowest)*

${dislikeMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

---

## ⚠️ Data Discrepancy Notice

The API is only returning ${allMovies.length} movies instead of the expected 34 movies:
- Expected: 19 loved + 10 liked + 5 disliked = 34 total
- Received: ${loveMovies.length} loved + ${likeMovies.length} liked + ${dislikeMovies.length} disliked = ${allMovies.length} total

Possible reasons:
1. The API pagination is not working correctly
2. Some movies may not have preference data attached
3. There may be a server-side limit on the response

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
    console.log('🚀 Starting ReelRecs Complete Rankings Investigation\n');

    // Authenticate
    const token = await authenticate();

    // Try different endpoints
    await tryEndpoints(token);

    // Build complete list
    const allMovies = await buildCompleteList(token);

    console.log('\n📈 Final Results:');
    console.log(`  Total movies fetched: ${allMovies.length}`);

    // Show unique preferences
    const uniquePrefs = new Set();
    allMovies.forEach(m => {
      if (m.user_preference) uniquePrefs.add(m.user_preference);
      if (m.preference) uniquePrefs.add(m.preference);
    });
    console.log(`  Unique preferences found: ${Array.from(uniquePrefs).join(', ')}`);

    // Create markdown file
    createMarkdownFile(allMovies);

    console.log('\n✅ Complete! Check USER_MOVIE_RANKINGS.md for details.');

  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();