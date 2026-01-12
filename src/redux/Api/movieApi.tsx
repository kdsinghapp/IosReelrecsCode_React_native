import axios from "axios";
import axiosInstance from "./axiosInstance";

// export const Trending_without_Filter = async (params: any) => {
//     try {
//         const response = await axiosInstance.get(params.url, {
//             headers: {
//                 Authorization: `Token ${params.token}`
//             }
//         })
//         console.log('✅ Trending Data:', response.data);
//         return response;

//     } catch {
//         console.error('❌ Error fetching trending:', error?.response?.data || error.message);
//         return { success: false, error: error?.response?.data || error.message };
//     }
// }

export const Trending_without_Filter = async (params: any) => {
  try {
    const encodedUrl = encodeURI(params.url); // ✅ Safe encode
    console.log(encodedUrl, 'encodedUrl__h')

    const response = await axiosInstance.get(encodedUrl, {
      headers: {
        Authorization: `Token ${params.token}`,
      },
    });
    console.log()
    console.log('✅ Trending Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching trending:', error?.response?.data || error.message);
    return { success: false, error: error?.response?.data || error.message };
  }
};



export const getUniqueGenres = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/unique-genres`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching unique genres:', error);
    throw error
  }
}

export const searchMovies = async (query: string, token: string) => {
  console.log(query, 'query___dsf')
  try {
    const response = await axiosInstance.get('/search?', {
      params: { query },
      headers: { Authorization: `Token ${token}` },
    });
    console.log(response)
    return response || [];
  } catch (error: any) {
    console.error('Search API Error:', error.message);
    return [];
  }
};



export const getRatedMovies = async (token: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get(`/rated-movies?page=${page}`, {
      headers: { Authorization: `Token ${token}` }
    });
    console.log(`Rated Movies (Page ${page}):`, response.data);
    return response.data;
  } catch (error) {
    console.error("Rating movie Error :- ", error);
    throw error;
  }
};



export const homeDiscoverApi = async (token: string, url: string) => {
  console.log("url",url)
  console.log("token",token)
  try {
    const response = await axiosInstance.get(`${url}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    // console.log('homeDiscoverApi___url',url)
    return response.data
  } catch (error) {
    console.error('homeDiscoverApi- ', error)
  }
}

// without pagination
export const getAllRatedMovies = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/ranked-movies`, {
      headers: { Authorization: `Token ${token}` }
    });
    console.log(`Get_ALL_Rated__Movie__:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Rating movie Error :- ", error);
    throw error;
  }
};

// without pagination
export const getAllRated_with_preference = async (token: string, preference: string) => {
  try {
    const response = await axiosInstance.get(`/ranked-movies?preference=${preference}`, {
      headers: { Authorization: `Token ${token}` }
    });
    console.log(`GegetAllRated_with_preference__:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Rating movie Error :- ", error);
    throw error;
  }
};




export const recordPairwiseDecision = async (token: string, payload: {
  imdb_id_1: string;
  imdb_id_2: string;
  winner: string;
  preference: "love" | "like" | "dislike";
}) => {
  console.log(payload, 'payload___of__recordPairwiseDecision')
  const response = await axios.post(
    "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/record-pairwise-decision",
    // "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/record-pairwise-decision-and-calculate-rating",
    
    payload,
    { headers: { Authorization: `Token ${token}` } }
  );

  console.log( ' Raking response___of__recordPairwiseDecision',response.data)
  return response.data;
};
export const recordPairwiseDecision1 = async (token: string, payload: {
  imdb_id_1: string;
  imdb_id_2: string;
  winner: string;
  preference: "love" | "like" | "dislike";
}) => {
  console.log(payload, 'payload___of__recordPairwiseDecision')
  const response = await axios.post(
    // "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/record-pairwise-decision",
  "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/record-pairwise-decision-and-calculate-rating",
    
    payload,
    { headers: { Authorization: `Token ${token}` } }
  );
  return response.data;
};


export const getOtherUserRatedMovies = async (token: string, username?: string,page = 1 ) => {
  console.log('pther_usr__[rpfgfiloe__', username, token, '--', page)
  try {
    const response = await axiosInstance.get(`/rated-movies?username=${username}&page=${page}`, {
      headers: { Authorization: `Token ${token}` },
    })
    console.log('✅ Rated Movies (Other User):', response.data);
    return response.data
  } catch (error) {
    console.error('❌ Rated Movies (Other User) Error:', error);
    throw error
  }
}



export const getCommonBookmarks = async (token: string, page =1 ) => {
  try {
    const response = await axiosInstance.get(`/bookmarks?page=${page}`, {
      headers: { Authorization: `Token ${token}` },
    })
    console.log("getCommonBookmarks___", response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error fetching common bookmarks:', error);
    throw error
  }
}


export const getCommonBookmarkOtherUser = async (token: string,username:string, page=1) => {
  try {
    // const response = await axiosInstance.get(`/bookmarks-common?username=${username}page=${page}`, {
    const response = await axiosInstance.get(`/bookmarks-common?username=${username}&page=${page}`, {

      headers: { Authorization: `Token ${token}` },
    })
    console.log("getCommonBookmarkOtherUser__", response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error fetching common bookmarks:', error);
    throw error
  }
}


export const getMovieMetadata = async (token: string, imdb_id: string) => {
  try {
    const response = await axiosInstance.get(`/movie-metadata?imdb_id=${imdb_id}`, {
      // const response = await axiosInstance.get(`/movie-metadata?imdb_id=${'tt31510819'}`, {
      headers: { Authorization: `Token ${token}` },
    });
    // console.log(response.data, "✅ Movie Metadata Response");
    console.log(response.data.matching_movies, 'matching_movies')
    console.log(response.data, 'response.data')


    return response.data;
  } catch (error) {
    console.log("❌ Axios Error while fetching movie metadata:", error);
    throw error;
  };
};

export const getEpisodes = async (token: string, imdb_id: string) => {
  try {
    const response = await axiosInstance.get(`episodes?imdb_id=${imdb_id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    console.log(response.data, "✅ Episodes Data");
    return response.data;
  } catch (error) {
    console.log(error, "❌ Error fetching episodes");
    throw error;
  }
}


export const getEpisodesBySeason = async (token: string, imdb_id: string, season: number) => {
  console.log("imdb_id",imdb_id)
  try {
    const response = await axiosInstance.get(`episodes?imdb_id=${imdb_id}&season=${season}`, {
      headers: { Authorization: `Token ${token}` },
    });
     return response.data;
  } catch (error) {
    console.log("❌ Error fetching episodes by season", error);
    throw error;
  }
};


export const getRankingSuggestionMovie = async (token: string, page = 1) => {
  try {
    // page = 2
    const response = await axiosInstance.get(`/suggest-movies`, {
      headers: {
        Authorization: `Token ${token}`
      },
      params: { page }
    })
    // console.log(response.data.total_pages , "getRankingSuggestionMovie____________<<____>>_--", response)
// console.log('page__from__suggestion__data_api--',page , '------ - - - --', response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error fetching ranking suggestion movies:", error);
    throw error;
  }
};

export const recordTrailerInteraction = async (token: string,
  data: {
    imdb_id: string;
    trailer_url: string;
    start_at: string;
    end_at: string;
  }) => {
  console.log("🪪 token being used:", token);
  console.log("📤 Payload__for_trailer_interaction:", data);

  console.log(data, "recordTrailerInteraction - - data");
  try {

    const response = await axiosInstance.post(`/record-user-trailer-interaction`,
      data,
      {

        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    console.log('✅ Tradiler interaction recorde:', response.data);
    console.log(data, "recordTrailerInteraction - - data");
    return response.data;
  } catch (error: any) {
    console.error("❌ Error recording trailer interaction:", error?.response?.data || error.message);
    throw error;
  }
};

interface CalculateRatingPayload {
  imdb_id: string;
  preference: 'love' | 'like' | 'okay' | 'dislike';
}

export const calculateMovieRating = async (
  token: string,
  payload: CalculateRatingPayload
): Promise<any> => {
  console.log(payload, "   ----ranking flow last step.")
  try {
    const response = await axiosInstance.post(
      '/calculate-movie-rating',
      payload,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
    console.log('Api response last step.', response.data);
    return true;
    // return response.data;
  } catch (error: any) {
    console.error('❌ calculateMovieRating Error:', error?.response?.data || error);
    throw error;
  }
};



export const rollbackPairwiseDecisions = async (
  token: string,
  imdbId: string
): Promise<any> => {
  console.log(imdbId, "----rollbackPairwiseDecisions----");

  try {
    const response = await axiosInstance.delete('/rollback-pairwise-decisions', {
      headers: { Authorization: `Token ${token}` },
      data: { imdb_id: imdbId }, // DELETE method me axios me body bhejne ka tarika
    });

    console.log('🎯 Rollback successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ rollbackPairwiseDecisions Error:', error?.response?.data || error);
    throw error;
  }
};



// const handleCalculateRating = async (token) => {
//   try {
//    // your token
//     const response = await calculateMovieRating(token, {
//       imdb_id: 'tt0898266',
//       preference: 'love',
//     });

//     console.log('Rating response:', response);
//   } catch (err) {
//     console.log('Error calculating rating:', err);
//   }
// };
