# ReelRecs API Documentation

## Base URL
```
Production: http://reelrecs.us-east-1.elasticbeanstalk.com/v1
```

## Authentication
Most endpoints require authentication using a token obtained from login.
Include the token in the Authorization header:
```
Authorization: Token {your_token_here}
```

---

## Table of Contents
1. [Authentication & User Management](#authentication--user-management)
2. [User Profile & Settings](#user-profile--settings)
3. [Movie Rankings & Preferences](#movie-rankings--preferences)
4. [Pairwise Ranking System](#pairwise-ranking-system)
5. [Content Discovery](#content-discovery)
6. [Social Features](#social-features)
7. [Groups](#groups)
8. [Bookmarks & Watchlist](#bookmarks--watchlist)
9. [Comments & Feedback](#comments--feedback)
10. [Notifications](#notifications)

---

## Authentication & User Management

### 1.1 Check Existing User
**GET** `/existing-user`
```
Query Parameters:
- email_id: string (required)

Example:
GET /existing-user?email_id=user@example.com
```

### 1.2 Check Username Availability
**GET** `/check-username-availability`
```
Query Parameters:
- username: string (required)

Example:
GET /check-username-availability?username=john123
```

### 1.3 Verify Email
**GET** `/verify-email`
```
Query Parameters:
- email_id: string (required)
- purpose: "signup" | "reset_password" (required)

Example:
GET /verify-email?email_id=user@example.com&purpose=signup
```

### 1.4 Confirm Email PIN Code
**POST** `/confirm-email-code`
```json
{
  "email_id": "user@example.com",
  "purpose": "signup",
  "code": "1234"
}
```

### 1.5 Sign Up
**POST** `/signup`
```json
{
  "email_id": "user@example.com",
  "password": "securepassword",
  "username": "john123"
}
```

### 1.6 Login
**POST** `/login`
```json
{
  "email_id": "user@example.com",
  "password": "securepassword"
}
```
Returns:
```json
{
  "token": "your_auth_token_here",
  "user": {...}
}
```

### 1.7 Logout
**POST** `/logout`
```
Headers: Authorization: Token {token}
Body: {}
```

### 1.8 Reset Password
**POST** `/reset-password`
```json
{
  "email_id": "user@example.com",
  "password": "newpassword"
}
```

### 1.9 Change Password
**POST** `/change-password`
```
Headers: Authorization: Token {token}
Body:
{
  "old_password": "currentpassword",
  "new_password": "newpassword"
}
```

---

## User Profile & Settings

### 2.1 Get User Profile
**GET** `/user-profile`
```
Headers: Authorization: Token {token}

Returns user profile data including:
- username, email, name, bio, pronouns
- avatar, is_private, subscription details
- settings flags (autoplay_trailer, etc.)
```

### 2.2 Update User Profile
**PUT** `/user-profile`
```
Headers: Authorization: Token {token}

Supported fields:
- name: string
- pronouns: string
- bio: string
- username: string (check availability first)
- is_private: "yes" | "no"
- autoplay_trailer: "yes" | "no"
- videos_start_with_sound: "yes" | "no"
- group_add_approval_required: "yes" | "no"
- opt_out_third_party_data_sharing: "yes" | "no"

Example:
{
  "name": "John Doe",
  "bio": "Movie enthusiast",
  "is_private": "no"
}
```

### 2.3 Upload Avatar
**POST** `/avatar`
```
Headers: Authorization: Token {token}
Body: multipart/form-data
- avatar: image file (jpeg, png, etc.)

Returns:
{
  "avatar": "avatar/username.jpg"
}
```

---

## Movie Rankings & Preferences

### 3.1 Get Rated Movies
**GET** `/rated-movies`
```
Headers: Authorization: Token {token}
Query Parameters:
- page: number (optional, default: 1)
- username: string (optional, for viewing other users)

Example:
GET /rated-movies?page=1
GET /rated-movies?username=john123&page=1
```

### 3.2 Get Ranked Movies
**GET** `/ranked-movies`
```
Headers: Authorization: Token {token}
Query Parameters:
- preference: "love" | "like" | "dislike" (optional)

Example:
GET /ranked-movies
GET /ranked-movies?preference=love

Returns movies sorted by rating within each preference category
```

### 3.3 Record User Preference
**POST** `/record-user-preference`
```json
{
  "imdb_id": "tt1234567",
  "preference": "love"
}
```

### 3.4 Get User Preference for Movie
**GET** `/user-preference`
```
Query Parameters:
- imdb_id: string (required)

Example:
GET /user-preference?imdb_id=tt1234567
```

---

## Pairwise Ranking System

### 4.1 Record Pairwise Decision
**POST** `/record-pairwise-decision`
```json
{
  "imdb_id_1": "tt1234567",
  "imdb_id_2": "tt7654321",
  "winner": "tt1234567",
  "preference": "love"
}
```
**Important Notes:**
- Records a single pairwise comparison between two movies
- The `winner` must be either `imdb_id_1` or `imdb_id_2`
- `preference` indicates the category being ranked

### 4.2 Calculate Movie Rating
**POST** `/calculate-movie-rating`
```json
{
  "imdb_id": "tt1234567",
  "preference": "love"
}
```
**Notes:**
- Call this AFTER all pairwise comparisons are complete
- Server calculates position based on recorded comparisons
- Returns the calculated rating for the movie

### 4.3 Combined: Record Decision & Calculate Rating
**POST** `/record-pairwise-decision-and-calculate-rating`
```json
{
  "imdb_id_1": "tt1234567",
  "imdb_id_2": "tt7654321",
  "winner": "tt1234567",
  "preference": "love"
}
```
**Notes:**
- Combines recording and calculation in single call
- More efficient for real-time updates
- Updates rating after each comparison

### 4.4 Rollback Pairwise Decisions
**DELETE** `/rollback-pairwise-decisions`
```json
{
  "imdb_id": "tt1234567"
}
```
**Notes:**
- Removes all pairwise decisions for a movie
- Use when user cancels mid-rating
- Allows re-rating from scratch

---

## Content Discovery

### 5.1 Trending Content
**GET** `/trending`
```
Headers: Authorization: Token {token}
Query Parameters:
- country: string (optional, e.g., "US", "IN")
- genres: comma-separated string (optional)
- platforms: comma-separated string (optional)
- sort_by: "release_date" | "alphabetical" (optional)

Examples:
GET /trending
GET /trending?country=US
GET /trending?country=US&genres=Action,Comedy
GET /trending?country=US&platforms=Netflix,Disney+
```

### 5.2 Search Movies
**GET** `/search`
```
Headers: Authorization: Token {token}
Query Parameters:
- query: string (required)

Example:
GET /search?query=inception
```

### 5.3 Get Movie Metadata
**GET** `/movie-metadata`
```
Headers: Authorization: Token {token}
Query Parameters:
- imdb_id: string (required)

Example:
GET /movie-metadata?imdb_id=tt1375666
```

### 5.4 Get Episodes (TV Shows)
**GET** `/episodes`
```
Headers: Authorization: Token {token}
Query Parameters:
- imdb_id: string (required)
- season: number (optional)

Examples:
GET /episodes?imdb_id=tt0944947
GET /episodes?imdb_id=tt0944947&season=1
```

### 5.5 Get Seasons Count
**GET** `/seasons-count`
```
Query Parameters:
- imdb_id: string (required)

Example:
GET /seasons-count?imdb_id=tt0944947
```

### 5.6 Suggest Movies
**GET** `/suggest-movies`
```
Headers: Authorization: Token {token}
Query Parameters:
- page: number (optional)

Example:
GET /suggest-movies?page=1
```

### 5.7 Recommend Movies
**GET** `/recommend-movies`
```
Headers: Authorization: Token {token}

Returns personalized movie recommendations
```

### 5.8 Get Unique Genres
**GET** `/unique-genres`
```
Headers: Authorization: Token {token}

Returns list of all available genres
```

### 5.9 Get Unique Platforms
**GET** `/unique-platforms`
```
Headers: Authorization: Token {token}

Returns list of all available streaming platforms
```

### 5.10 Get Platforms for Movie
**GET** `/platforms`
```
Query Parameters:
- imdb_id: string (required)
- country: string (optional)

Example:
GET /platforms?imdb_id=tt1375666&country=US
```

---

## Social Features

### 6.1 Follow User
**POST** `/follow`
```json
{
  "username": "john123"
}
```

### 6.2 Get Followers
**GET** `/followers`
```
Headers: Authorization: Token {token}
Query Parameters:
- username: string (optional, defaults to logged-in user)
- page: number (optional)

Examples:
GET /followers
GET /followers?username=john123&page=1
```

### 6.3 Get Following
**GET** `/following`
```
Headers: Authorization: Token {token}
Query Parameters:
- username: string (optional, defaults to logged-in user)
- page: number (optional)

Examples:
GET /following
GET /following?username=john123&page=1
```

### 6.4 Search Followers
**GET** `/search-followers`
```
Query Parameters:
- query: string (required)
- username: string (optional)

Example:
GET /search-followers?query=john
```

### 6.5 Search Following
**GET** `/search-following`
```
Query Parameters:
- query: string (required)
- username: string (optional)

Example:
GET /search-following?query=jane
```

### 6.6 Get User Feed
**GET** `/user-feed`
```
Headers: Authorization: Token {token}
Query Parameters:
- username: string (optional, for specific user's activities)
- page: number (optional)

Examples:
GET /user-feed (your feed from people you follow)
GET /user-feed?username=john123&page=1 (specific user's activities)
```

### 6.7 Suggest Friends
**GET** `/suggest-friends`
```
Headers: Authorization: Token {token}
Query Parameters:
- query: string (optional, for searching)

Examples:
GET /suggest-friends
GET /suggest-friends?query=john
```

### 6.8 Get Matching Movies
**GET** `/matching-movies`
```
Query Parameters:
- username: string (required)

Example:
GET /matching-movies?username=john123

Returns movies both users have rated
```

### 6.9 Get Recent Active Users
**GET** `/recent-active-users`
```
Headers: Authorization: Token {token}

Returns list of recently active users
```

---

## Groups

### 7.1 Create Group
**POST** `/group/create`
```json
{
  "name": "Movie Night Club",
  "description": "Weekly movie discussions"
}
```

### 7.2 List Groups
**GET** `/group/list-groups`
```
Headers: Authorization: Token {token}
Query Parameters:
- page: number (optional)
```

### 7.3 Add Members to Group
**POST** `/group/add-members`
```json
{
  "group_id": "123",
  "members": ["username1", "username2"]
}
```

### 7.4 Accept Group Invitation
**POST** `/group/accept-invitation`
```json
{
  "group_id": "123"
}
```

### 7.5 Leave Group
**POST** `/group/leave`
```json
{
  "group_id": "123"
}
```

### 7.6 Get Group Members
**GET** `/group/members`
```
Query Parameters:
- group_id: string (required)

Example:
GET /group/members?group_id=123
```

### 7.7 Get Group Activities
**GET** `/group/activities`
```
Query Parameters:
- group_id: string (required)
- page: number (optional)

Example:
GET /group/activities?group_id=123&page=1
```

### 7.8 Search Movies in Group
**GET** `/group/search-movies`
```
Query Parameters:
- group_id: string (required)
- query: string (required)

Example:
GET /group/search-movies?group_id=123&query=inception
```

### 7.9 Filter Movies in Group
**GET** `/group/filter-movies`
```
Query Parameters:
- group_id: string (required)
- genres: string (optional)
- platforms: string (optional)

Example:
GET /group/filter-movies?group_id=123&genres=Action
```

### 7.10 Record Group Preference
**POST** `/group/record-preference`
```json
{
  "group_id": "123",
  "imdb_id": "tt1234567",
  "preference": "love"
}
```

### 7.11 Get Group Recommendations
**GET** `/group/recommend-movies`
```
Query Parameters:
- group_id: string (required)

Example:
GET /group/recommend-movies?group_id=123
```

---

## Bookmarks & Watchlist

### 8.1 Add/Remove Bookmark
**POST** `/bookmark`
```json
{
  "imdb_id": "tt1234567",
  "action": "add" | "remove"
}
```

### 8.2 Get Bookmarks
**GET** `/bookmarks`
```
Headers: Authorization: Token {token}
Query Parameters:
- page: number (optional)

Example:
GET /bookmarks?page=1
```

### 8.3 Get Common Bookmarks
**GET** `/bookmarks-common`
```
Query Parameters:
- username: string (required)
- page: number (optional)

Example:
GET /bookmarks-common?username=john123&page=1
```

### 8.4 Get Watchlist
**GET** `/watchlist`
```
Headers: Authorization: Token {token}
Query Parameters:
- page: number (optional)

Example:
GET /watchlist?page=1
```

---

## Comments & Feedback

### 9.1 Add Comment
**POST** `/comment`
```json
{
  "imdb_id": "tt1234567",
  "comment": "Great movie!"
}
```

### 9.2 Get Comments
**GET** `/comments`
```
Query Parameters:
- imdb_id: string (required)
- page: number (optional)

Example:
GET /comments?imdb_id=tt1234567&page=1
```

### 9.3 Submit Feedback
**POST** `/feedback`
```json
{
  "type": "bug" | "feature" | "general",
  "message": "Your feedback here"
}
```

### 9.4 Contact Us
**POST** `/contact-us`
```json
{
  "subject": "Subject line",
  "message": "Your message here"
}
```

---

## Notifications

### 10.1 Get Notifications
**GET** `/notifications`
```
Headers: Authorization: Token {token}
Query Parameters:
- page: number (optional)
- unread_only: boolean (optional)

Example:
GET /notifications?page=1&unread_only=true
```

### 10.2 Mark Notification as Read
**PUT** `/notifications/{notification_id}`
```json
{
  "read": true
}
```

---

## Additional Features

### 11.1 Record Trailer Interaction
**POST** `/record-user-trailer-interaction`
```json
{
  "imdb_id": "tt1234567",
  "trailer_url": "https://youtube.com/watch?v=...",
  "start_at": "2024-01-01T10:00:00Z",
  "end_at": "2024-01-01T10:02:30Z"
}
```

### 11.2 Get History
**GET** `/history`
```
Headers: Authorization: Token {token}
Query Parameters:
- page: number (optional)

Example:
GET /history?page=1
```

### 11.3 Get User Subscriptions
**GET** `/user-subscriptions`
```
Headers: Authorization: Token {token}

Returns user's streaming service subscriptions
```

---

## Important Implementation Notes

### Binary Search & Pairwise Ranking Flow

1. **Initial Setup**: When user selects preference (love/like/dislike) for a new movie
2. **Fetch Existing Movies**: Get all movies in that preference category
3. **Binary Search Process**:
   - Start with middle movie of the category
   - Show comparison modal
   - Record each decision using `/record-pairwise-decision`
   - Update search bounds based on user choice
   - Continue until position is found
4. **Finalize Rating**: Call `/calculate-movie-rating` with movie ID and preference
5. **Server Calculation**: Server uses recorded comparisons to calculate final position

### Error Handling

- If API calls fail during pairwise comparisons, offer offline mode
- Store failed comparisons locally for later sync
- Use `/rollback-pairwise-decisions` if user cancels mid-rating

### Authentication

- Token required for most endpoints
- Include as: `Authorization: Token {your_token}`
- Token obtained from `/login` endpoint
- Logout invalidates token

### Pagination

- Most list endpoints support pagination
- Use `page` query parameter (starts at 1)
- Response includes:
  - `results`: array of items
  - `count`: total items
  - `total_pages`: total pages
  - `current_page`: current page number

### Response Formats

Success responses typically include:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error description",
  "detail": "Detailed error message"
}
```

---

## Testing Base URL
For local development:
```
http://127.0.0.1:8000/v1
```

## Rate Limiting
- API has rate limiting in place
- Specific limits not documented in notebook
- Handle 429 responses appropriately

---

*Last Updated: Based on API Verification notebook (November 2024)*
*Source: Sunny's API Verification Jupyter Notebook*