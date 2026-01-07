#!/usr/bin/env node

/**
 * Script to fetch user's ranked movies from ReelRecs API
 * Uses credentials: william@loduer.ai / test123
 * This script will authenticate and pull all rated movies for debugging
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
      email_id: USER_CREDENTIALS.email,  // Changed from 'email' to 'email_id'
      password: USER_CREDENTIALS.password
    });

    if (response.data && response.data.token) {
      console.log('✅ Authentication successful!');
      console.log('User:', response.data.user?.username || response.data.username);
      return response.data.token;
    } else {
      throw new Error('No token received from login');
    }
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data || error.message);
    throw error;
  }
}

// Fetch rated movies with pagination
async function fetchRatedMovies(token) {
  console.log('\n📊 Fetching rated movies...');
  const allMovies = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      console.log(`  Fetching page ${page}...`);
      const response = await api.get(`/rated-movies?page=${page}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      const data = response.data;

      if (data.results && Array.isArray(data.results)) {
        allMovies.push(...data.results);
        console.log(`  ✓ Page ${page}: ${data.results.length} movies`);

        // Check if there are more pages
        hasMore = data.next !== null && data.results.length > 0;
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error(`  ❌ Error fetching page ${page}:`, error.message);
      hasMore = false;
    }
  }

  return allMovies;
}

// Fetch movies with specific preference
async function fetchMoviesWithPreference(token, preference) {
  console.log(`\n🎬 Fetching ${preference} movies...`);
  try {
    const response = await api.get(`/rated-movies-with-preference?preference=${preference}`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    return response.data.results || [];
  } catch (error) {
    console.error(`  ❌ Error fetching ${preference} movies:`, error.message);
    return [];
  }
}

// Format movie data for markdown
function formatMovieForMarkdown(movie, index) {
  return `${index}. **${movie.title || 'Unknown Title'}** (${movie.release_year || 'N/A'})
   - IMDB ID: ${movie.imdb_id}
   - Rating: ${movie.rating !== undefined ? movie.rating.toFixed(2) : 'Not rated'}
   - User Preference: ${movie.user_preference || 'N/A'}
   - Rec Score: ${movie.rec_score !== undefined ? movie.rec_score.toFixed(2) : 'N/A'}
   - IMDB Rating: ${movie.imdb_rating || 'N/A'}
`;
}

// Create markdown file with rankings
function createMarkdownFile(allMovies, loveMovies, likeMovies, dislikeMovies) {
  const timestamp = new Date().toISOString();

  const content = `# User Rankings - william@louder.ai
## Last Updated: ${timestamp}
## API Endpoint: ${BASE_URL}

---

## Summary Statistics
- **Total Rated Movies**: ${allMovies.length}
- **Loved**: ${loveMovies.length}
- **Liked**: ${likeMovies.length}
- **Disliked**: ${dislikeMovies.length}

---

## All Rated Movies (Sorted by Rating)
${allMovies
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .map((movie, i) => formatMovieForMarkdown(movie, i + 1))
  .join('\n')}

---

## Movies by Preference

### 💚 LOVED (${loveMovies.length} movies)
${loveMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

### 👍 LIKED (${likeMovies.length} movies)
${likeMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

### 👎 DISLIKED (${dislikeMovies.length} movies)
${dislikeMovies.map((movie, i) => formatMovieForMarkdown(movie, i + 1)).join('\n') || 'No movies in this category'}

---

## Debug Information
- Script Run Time: ${timestamp}
- User Email: william@louder.ai
- API Base URL: ${BASE_URL}

---

## Notes for Debugging Binary Search
This ranking list represents the user's current movie preferences as stored in the backend.
Use this as a reference to verify that the binary search algorithm is correctly:
1. Finding the insertion point for new movies
2. Recording comparisons correctly
3. Updating rankings appropriately

Look for patterns in the ratings to identify potential issues with the ranking algorithm.
`;

  const filePath = path.join(__dirname, 'USER_MOVIE_RANKINGS.md');
  fs.writeFileSync(filePath, content);
  console.log(`\n✅ Markdown file created: ${filePath}`);
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting ReelRecs Rankings Fetch\n');

    // Authenticate
    const token = await authenticate();

    // Fetch all movies
    const allMovies = await fetchRatedMovies(token);
    console.log(`\n📈 Total rated movies: ${allMovies.length}`);

    // Fetch movies by preference
    const loveMovies = await fetchMoviesWithPreference(token, 'love');
    const likeMovies = await fetchMoviesWithPreference(token, 'like');
    const dislikeMovies = await fetchMoviesWithPreference(token, 'dislike');

    // Create markdown file
    createMarkdownFile(allMovies, loveMovies, likeMovies, dislikeMovies);

    // Log summary
    console.log('\n📊 Summary:');
    console.log(`  Total: ${allMovies.length} movies`);
    console.log(`  Loved: ${loveMovies.length}`);
    console.log(`  Liked: ${likeMovies.length}`);
    console.log(`  Disliked: ${dislikeMovies.length}`);

    // Log top 5 highest rated
    const topMovies = allMovies
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    console.log('\n🏆 Top 5 Highest Rated:');
    topMovies.forEach((movie, i) => {
      console.log(`  ${i + 1}. ${movie.title} (${movie.rating?.toFixed(2) || 'N/A'})`);
    });

  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();