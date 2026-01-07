#!/usr/bin/env node

/**
 * Final script to fetch ALL user's ranked movies from the correct endpoint
 * Uses /ranked-movies which returns all 34 movies
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

// Fetch all ranked movies using the correct endpoint
async function fetchAllRankedMovies(token) {
  console.log(`\n📊 Fetching all ranked movies from /ranked-movies endpoint...`);

  try {
    const response = await api.get('/ranked-movies', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    if (response.data.results && response.data.results.length > 0) {
      console.log(`✅ Fetched ${response.data.results.length} movies successfully!`);
      return response.data.results;
    } else {
      console.log('⚠️ No results in response');
      return [];
    }
  } catch (error) {
    console.error(`❌ Error fetching ranked movies:`, error.message);
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

  const content = `# User Movie Rankings - william@louder.ai
## Last Updated: ${timestamp}
## API Endpoint: ${BASE_URL}/ranked-movies

---

## 📊 Summary Statistics
- **Total Rated Movies**: ${allMovies.length}
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
   - Loved movies: Highest scores (typically 6.80-10.00 in this dataset)
   - Liked movies: Moderate scores (typically 5.00-6.70 in this dataset)
   - Disliked movies: Lower scores (typically below 5.00 in this dataset)
   - Within each category, the scores determine relative ranking

---

## 🔍 For Debugging Pairwise Ranking

When a new movie is added with preference "love":
1. It's compared against existing loved movies using binary search
2. Starting at the middle movie (index = loved_movies.length / 2)
3. Each comparison narrows down the position by half
4. Final position determines the movie's rating score

The bug we identified occurs when the API fails (500 error) after comparisons, preventing the binary search from updating its position, causing the same comparison to repeat.

For example, with 19 loved movies:
- Initial comparison: Index 9 (middle movie)
- If new movie is preferred: Compare with index 14
- If existing is preferred: Compare with index 4
- Continue until position is found (typically 4-5 comparisons)
`;

  const filePath = path.join(__dirname, 'USER_MOVIE_RANKINGS.md');
  fs.writeFileSync(filePath, content);
  console.log(`\n✅ Markdown file created: ${filePath}`);
  return filePath;
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting ReelRecs Complete Rankings Fetch\n');

    // Authenticate
    const token = await authenticate();

    // Fetch all ranked movies
    const allMovies = await fetchAllRankedMovies(token);

    // Debug: Show all unique preference values found
    const uniquePreferences = new Set();
    allMovies.forEach(m => {
      if (m.user_preference) uniquePreferences.add(m.user_preference);
      if (m.preference) uniquePreferences.add(m.preference);
    });
    console.log('\n🔍 Unique preference values found:', Array.from(uniquePreferences));

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

    console.log('\n📈 Movies by preference:');
    console.log(`  Loved: ${loveMovies.length}`);
    console.log(`  Liked: ${likeMovies.length}`);
    console.log(`  Disliked: ${dislikeMovies.length}`);
    console.log(`  Total: ${allMovies.length}`);

    // Create markdown file
    const filePath = createMarkdownFile(allMovies);

    // Log summary with samples
    console.log('\n📊 Summary:');
    console.log(`  Total: ${allMovies.length} movies`);
    console.log(`  Loved: ${loveMovies.length}`);
    console.log(`  Liked: ${likeMovies.length}`);
    console.log(`  Disliked: ${dislikeMovies.length}`);

    // Show samples from each category
    if (loveMovies.length > 0) {
      console.log('\n💚 Loved Movies (Top 3 and Bottom 1):');
      loveMovies.slice(0, 3).forEach((movie, i) => {
        console.log(`  ${i + 1}. ${movie.title} - Score: ${movie.rating?.toFixed(2) || 'N/A'}`);
      });
      if (loveMovies.length > 3) {
        const last = loveMovies[loveMovies.length - 1];
        console.log(`  ...`);
        console.log(`  ${loveMovies.length}. ${last.title} - Score: ${last.rating?.toFixed(2) || 'N/A'}`);
      }
    }

    if (likeMovies.length > 0) {
      console.log('\n👍 Liked Movies (All):');
      likeMovies.forEach((movie, i) => {
        console.log(`  ${i + 1}. ${movie.title} - Score: ${movie.rating?.toFixed(2) || 'N/A'}`);
      });
    }

    if (dislikeMovies.length > 0) {
      console.log('\n👎 Disliked Movies (All):');
      dislikeMovies.forEach((movie, i) => {
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