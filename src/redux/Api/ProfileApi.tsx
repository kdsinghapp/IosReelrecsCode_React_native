import axiosInstance from "./axiosInstance";
import axios from "axios";
import {
  validateImdbId,
  validateString,
  createSafeParams,
  throwValidationError,
} from '../../utils/apiInputValidator';

const BASE_URL = "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/bookmark";

export const getMoviePlatforms = async ({
  token,
  imdb_id,
  country,
  watch_type,
  
}) => {
  try {
    // Validate IMDB ID
    const imdbIdValidation = validateImdbId(imdb_id);
    if (!imdbIdValidation.isValid) {
      throwValidationError('IMDB ID', imdbIdValidation.error);
    }

    // Build params
    const params: Record<string, string> = { imdb_id: imdbIdValidation.sanitized };
    
    if (country) {
      const countryValidation = validateString(country, {
        fieldName: 'Country',
        maxLength: 10,
      });
      if (countryValidation.isValid) {
        params.country = countryValidation.sanitized;
      }
    }
    
    if (watch_type) {
      const watchTypeValidation = validateString(watch_type, {
        fieldName: 'Watch type',
        maxLength: 50,
      });
      if (watchTypeValidation.isValid) {
        params.watch_type = watchTypeValidation.sanitized;
      }
    }

    console.log("getMoviePlatforms params:", params);
    const response = await axiosInstance.get('/platforms', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams(params),
    });
    console.log(response.data, "_____getMoviePlatforms")
    return response;
  } catch (error) {
    console.error("Error fetching movie platforms:", error);
    return [];
  }
};



export const getRecentActiveUsers = async (token: string) => {
  try {
    const response = await axiosInstance.get('/recent-active-users', {
      headers: { Authorization: `Token ${token}` },
    });
    // console.log("boss_anna", response.data?.results)

    return response; // don't wrap in `[]`, let caller handle .data?.results
  } catch (error) {
    console.error("Failed to fetch recent active users", error);
    return { data: { results: [] } }; // fallback to empty array
  }
};

export const getOthereUsers = async (token: string, username: string) => {
  console.log(username, "-f-ff-ff-ff-f-f-ff-f-")
  try {
    const response = await axiosInstance.get('/user-profile', {
      params: { username },
      headers: { Authorization: `Token ${token}` },
    });
    console.log(response, "-chaha")
    return response || [];
  } catch (error) {
    console.error("Failed to fetch recent active users", error);
    return [];
  }
};

export const userBookMark = async (token: string) => {
  try {
    const response = await axiosInstance.get("/bookmarks",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log(response, "dek")
    console.log("📥 Your Bookmarks:", response.data?.results);

    return response;
  } catch (error) {
    console.error("❌ Fetch Bookmarks Error:", error);
  }
};
interface Bookmark {
  imdb_id: string;
  title: string;
  imdb_rating: number;
  release_year: number;
  cover_image_url: string;
  rec_score?: number;
}

interface BookmarksResponse {
  current_page: number;
  total_pages: number;
  results: Bookmark[];
}

export const getUserBookmarks = async (token: string): Promise<BookmarksResponse> => {
  // console.log(token ,"getuser__BookMArk__token")
  try {
    const response = await axiosInstance.get("/bookmarks", {
      headers: { Authorization: `Token ${token}` },
    });
    console.log("📥 Bookmarks Fetched:", response.data);
    return response.data; // ✅ only the useful data
  } catch (error) {
    console.error("❌ Fetch Bookmarks Error:", error);
    throw error;
  }
};

// export const toggleBookmark = async (token: string, imdb_id: string): Promise<boolean> => {
//   try {
//     // Try to add bookmark first
//     await axiosInstance.post(
//       "/bookmark",
//       { imdb_id },
//       { headers: { Authorization: `Token ${token}` } }
//     );
//   console.log(token, imdb_id, "toggleBookmark called with token and imdb_id");

//     console.log("✅ Bookmark added:", imdb_id);
//     return true; // Successfully bookmarked
//   } catch (error: any) {
//     if (error.response?.status === 409) {
//     console.log("409__delete__movies:", imdb_id);

//       // Already bookmarked → remove it
//       try {
//         await axiosInstance.delete("/bookmark", {
//           headers: { Authorization: `Token ${token}` },
//           data: { imdb_id },
//         });
//         console.log("🗑️ Bookmark removed:", imdb_id);
//         return false;
//       } catch (deleteError) {
//         console.error("❌ Failed to remove bookmark:", deleteError);
//         throw deleteError;
//       }
//     } else {
//       console.error("❌ Bookmark toggle failed:", error);
//       throw error;
//     }
//   }
// };




export const toggleBookmark = async (token: string, imdb_id: string): Promise<boolean> => {
  const headers = { Authorization: `Token ${token}` };

  try {
    // Try adding first
    const addRes = await axios.post(BASE_URL, { imdb_id }, { headers });
 
    if (addRes.status === 200 || addRes.status === 201) {
 
  console.log("✅ Bookmark Added:", imdb_id);
      return true; // Added
    }
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: unknown } };
    if (err?.response?.status === 409) {
      console.warn("⚠️ Already Bookmarked. Attempting to remove...");
      // Already exists → Try deleting
      const delRes = await axios.delete(BASE_URL, {
        headers,
        data: { imdb_id },
      });

       if (delRes.status === 200) {
        console.log("🗑️ Bookmark Removed:", imdb_id);
        return false; // Removed
      }
    } else {
      console.error("❌ Error adding bookmark:", imdb_id, err?.response?.data || 'Unknown error');
      throw error;
    }
  }

  return false;
};




export const getOtherUserBookmarks = async (token: string, username?: string,page = 1): Promise<BookmarksResponse> => {
  try {
    // Validate inputs
    const { validateUsername, validatePage } = await import('../../utils/apiInputValidator');
    
    const params: Record<string, any> = {};
    
    if (username) {
      const usernameValidation = validateUsername(username);
      if (usernameValidation.isValid) {
        params.username = usernameValidation.sanitized;
      } else {
        console.warn('⚠️ Invalid username:', usernameValidation.error);
      }
    }
    
    const pageValidation = validatePage(page);
    if (pageValidation.isValid) {
      params.page = pageValidation.value;
    }

    const response = await axiosInstance.get('/bookmarks', {
      headers: { Authorization: `Token ${token}` },
      params: createSafeParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("❌ Fetch Other User Bookmarks other Error:", error);
    throw error;
  }
};



// matching movie 

// l

export const getMatchingMovies = async (
  token: string,
  imdb_id: string
) => {
  try {
    // Validate IMDB ID
    const imdbIdValidation = validateImdbId(imdb_id);
    if (!imdbIdValidation.isValid) {
      throwValidationError('IMDB ID', imdbIdValidation.error);
    }

    const response = await axiosInstance.get('/matching-movies', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams({ imdb_id: imdbIdValidation.sanitized }),
    });
    return response.data;
  } catch (error) {
    console.error('❌ Matching Movies API Error:', error);
    throw error;
  }
};



// history api

export const getHistoryApi = async (token: string, username?: string,page = 1) => {
  try {
    // Validate inputs
    const { validateUsername, validatePage } = await import('../../utils/apiInputValidator');
    
    const params: Record<string, any> = {};
    
    const pageValidation = validatePage(page);
    if (pageValidation.isValid) {
      params.page = pageValidation.value;
    }
    
    if (username) {
      const usernameValidation = validateUsername(username);
      if (usernameValidation.isValid) {
        params.username = usernameValidation.sanitized;
      } else {
        console.warn('⚠️ Invalid username:', usernameValidation.error);
      }
    }

    const response = await axiosInstance.get('/history', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams(params),
    });
    console.log(response.data , "getHistoryApi____")
    return response.data; // ✅ return result
  } catch (error) {
    console.error('[getHistoryApi]', error);
    return null;
  }
};
