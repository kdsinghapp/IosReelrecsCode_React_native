#!/usr/bin/env node

/**
 * Simplified script to fetch user's ranked movies with scores
 * and categorize them by preference (love/like/dislike)
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

// Fetch all rated movies and filter by preference
async function fetchAllRatedMovies(token) {
  console.log(`\n📊 Fetching all rated movies...`);
  const allMovies = [];
  let page = 1;
  const maxPages = 20; // Limit to first 20 pages to avoid timeout

  try {
    while (page <= maxPages) {
      const response = await api.get(`/rated-movies?page=${page}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        allMovies.push(...response.data.results);
        console.log(`  ✓ Page ${page}: ${response.data.results.length} movies`);

        if (!response.data.next) break; // No more pages
        page++;
      } else {
        break;
      }
    }

    return allMovies;
  } catch (error) {
    console.error(`  ❌ Error fetching movies:`, error.message);
    return [];
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
    console.log('🚀 Starting ReelRecs Rankings Fetch (Simplified)\n');

    // Authenticate
    const token = await authenticate();

    // Fetch all movies
    const allMovies = await fetchAllRatedMovies(token);

    // Filter by preference
    const loveMovies = allMovies.filter(m => m.user_preference === 'love' || m.preference === 'love');
    const likeMovies = allMovies.filter(m => m.user_preference === 'like' || m.preference === 'like');
    const dislikeMovies = allMovies.filter(m => m.user_preference === 'dislike' || m.preference === 'dislike');

    console.log('\n📈 Filtered movies by preference:');
    console.log(`  Loved: ${loveMovies.length}`);
    console.log(`  Liked: ${likeMovies.length}`);
    console.log(`  Disliked: ${dislikeMovies.length}`);

    // Create markdown file
    const filePath = createMarkdownFile(loveMovies, likeMovies, dislikeMovies);

    // Log summary
    console.log('\n📊 Summary:');
    console.log(`  Total: ${loveMovies.length + likeMovies.length + dislikeMovies.length} movies`);
    console.log(`  Loved: ${loveMovies.length}`);
    console.log(`  Liked: ${likeMovies.length}`);
    console.log(`  Disliked: ${dislikeMovies.length}`);

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