import { Alert } from 'react-native';
import axiosInstance from './axiosInstance';
import { User, Group, Movie, PaginatedResponse, Activity } from '../../types/api.types';
import { 
  validatePage, 
  validatePageSize, 
  validateSearchQuery,
  createSafeParams,
  throwValidationError 
} from '../../utils/apiInputValidator';



// selectfriend
export const getAllFriends = async (token: string, page = 1, page_size = 20) => {
  try {
    // Validate inputs
    const pageValidation = validatePage(page);
    const pageSizeValidation = validatePageSize(page_size);
    
    if (!pageValidation.isValid) {
      console.warn('⚠️ Invalid page, using default:', pageValidation.error);
    }
    if (!pageSizeValidation.isValid) {
      console.warn('⚠️ Invalid page_size, using default:', pageSizeValidation.error);
    }

    const response = await axiosInstance.get('/group/friends', {
      headers: { Authorization: `Token ${token}` },
      params: createSafeParams({ 
        page: pageValidation.value, 
        page_size: pageSizeValidation.value 
      }),
    });
    console.log(response.data.results , 'adadaget___friend_')
    
    return response.data; // { results: [...], next: '...', previous: '...', count: n }
  } catch (error) {
    console.error("❌ getAllFriends Error:", error?.response?.data || error.message);
    throw error;
  }
};


/// 🔹 2. Search Friends (for group search input)
export const searchFriends = async (token: string, query: string, page = 1, page_size = 20) => {
  try {
    // Validate inputs
    const queryValidation = validateSearchQuery(query);
    const pageValidation = validatePage(page);
    const pageSizeValidation = validatePageSize(page_size);
    
    if (!queryValidation.isValid) {
      throwValidationError('Search query', queryValidation.error);
    }

    const response = await axiosInstance.get('/group/search-friends', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams({ 
        query: queryValidation.sanitized, 
        page: pageValidation.value, 
        page_size: pageSizeValidation.value 
      }),
    });
    console.log(response.data, "wokrcreategroup__d__ -  -  - ",query, page, page_size)
    return response.data;
  } catch (error) {
    console.error("❌ searchFriends Error:", error?.response?.data || error.message);
    throw error;
  }
};




export const createGroup = async (
  token: string,
  groupName: string,
  members: string[]
) => {
  try {
    const response = await axiosInstance.post(
      '/group/create',
      {
        group_name: groupName,
        members: members,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log(response.data, "wokrcreategroupwokrcreategroup -  -  -  - ")
    // console.log(groupName, "wokrcreategroupwokrcreategroup -  -  -  - ")
    // console.log(members, "wokrcreategroupwokrcreategroup -  -  -  - ")

    return response;
  } catch (error) {
    console.error("❌ createGroup Error:", error?.response?.data || error.message);
    throw error;
  }
};
// need_Change
/// 🔹 4. Get Group Members
export const getGroupMembers = async (token: string, groupId: string) => {
  try {
    // Validate group ID
    const { validateGroupId } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(groupId);
    
    if (!groupIdValidation.isValid) {
      throwValidationError('Group ID', groupIdValidation.error);
    }

    const response = await axiosInstance.get('/group/members', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams({ group_id: groupIdValidation.sanitized }),
    });
    console.log( response.data, " all getGroupMembers_getGroupMembers_api__wwwe")
    return response.data;
  } catch (error) {
    console.error("❌ getGroupMembers Error:", error?.response?.data || error.message);
    throw error;
  }
};


/// 🔹 5. List My Groups
export const getAllGroups = async (token: string) => {
  try {
    const response = await axiosInstance.get('/group/list-groups', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log(response.data?.results, "getAllGroups__api")
    return response.data;
  } catch (error) {
    console.error("❌ getAllGroups Error:", error?.response?.data || error.message);
    throw error;
  }
};


/// 🔹 6. Add Members to a Group
export const addMembersToGroup = async (
  token: string,
  groupId: string,
  addmembers: string[]
) => {
  try {
    const response = await axiosInstance.post(
      '/group/add-members',
      {
        group_id: groupId,
        members: addmembers,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log(response, " add -----_______addMembersToGroup_________")
    return response.data;
  } catch (error) {
    console.error("❌ addMembersToGroup Error:", error?.response?.data || error.message);
    throw error;
  }
};


export const recordPreference = async (
  token: string,
  groupId: string,
  imdbId: string,
  preference: "like" | "dislike"
) => {
  try {
    const response = await axiosInstance.post(
      '/group/record-preference',
      {
        group_id: groupId,
        imdb_id: imdbId,
        preference: preference,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ recordPreference Error:", error?.response?.data || error.message);
    throw error;
  }
};

// 8. Leave Group
export const leaveGroup = async (token: string, groupId: string) => {
  try {
      console.log(token , groupId, "leaveGroup - - -  ")

    const response = await axiosInstance.delete('/group/leave', {
      // console.log(token , groupId, "leaveGroup - - -
      data: {
        group_id: groupId,
      },
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log("Group_left_successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ leaveGroup Error:", error?.response?.data || error.message);
    throw error;
  }
};


// 9.1 All Activities in Group
export const getGroupActivities = async (token: string, groupId: string) => {
  console.log(token , groupId, "  - getGroupActivities -  ------groupId - - ")

  try {
    // Validate group ID
    const { validateGroupId } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(groupId);
    
    if (!groupIdValidation.isValid) {
      throwValidationError('Group ID', groupIdValidation.error);
    }

    const response = await axiosInstance.get('/group/activities', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams({ group_id: groupIdValidation.sanitized }),
    });
    console.log(response.data.results, "getGroupActivities_getGroupActivities_api ")
    return response.data;
  } catch (error) {
    console.error("❌ getGroupActivities Error:", error?.response?.data || error.message);
    throw error;
  }
};


// 9.2 Activities for Specific Movie
export const getGroupActivitiesByMovie = async (
  token: string,
  groupId: string,
  imdbId: string
) => {
  try {
    // Validate inputs
    const { validateGroupId, validateImdbId } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(groupId);
    const imdbIdValidation = validateImdbId(imdbId);
    
    if (!groupIdValidation.isValid) {
      throwValidationError('Group ID', groupIdValidation.error);
    }
    if (!imdbIdValidation.isValid) {
      throwValidationError('IMDB ID', imdbIdValidation.error);
    }

    const response = await axiosInstance.get('/group/activities', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams({ 
        group_id: groupIdValidation.sanitized,
        imdb_id: imdbIdValidation.sanitized
      }),
    });
    return response.data;
  } catch (error) {
    console.error("❌ getGroupActivitiesByMovie Error:", error?.response?.data || error.message);
    throw error;
  }
};



// 10.
export const getGroupRecommendedMovies = async (token: string, groupId: string) => {
  console.log('grou____if___re',groupId)
  try {
    // Validate group ID
    const { validateGroupId } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(groupId);
    
    if (!groupIdValidation.isValid) {
      throwValidationError('Group ID', groupIdValidation.error);
    }

    const response = await axiosInstance.get('/group/recommend-movies', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams({ group_id: groupIdValidation.sanitized }),
    })
    console.log(response.data.results, "🎬 Recommended Movies for Group:", groupId);
    return response.data;
  } catch (error) {
    console.error("❌ getGroupRecommendedMovies Error:", error?.response?.data || error.message);
    throw error;
  }
};

// 11.
export const getSearchGroup = async (query: string, token: string) => {
  try {
    console.log(token, "Search Grou token")
    const response = await axiosInstance.get(`/group/search`, {
      headers: { Authorization: `Token ${token}` },
      params: { query }, // ✅ Axios handles URL encoding
    });
    console.log(query, "wokr___query________")
    console.log("getSearchGroup Response:", response.data.results);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("❌ getSearchGroup Error:", err?.response?.data || err?.message);
    throw error;
  }
};

// 12.
export const getGroupSearchMovies = async (
  token: string,
  group_id: string,
  query: string
): Promise<Movie[]> => {
  try {
    // Validate inputs
    const { validateGroupId } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(group_id);
    const queryValidation = validateSearchQuery(query);
    
    if (!groupIdValidation.isValid) {
      console.warn('⚠️ Invalid group_id:', groupIdValidation.error);
      return [];
    }
    if (!queryValidation.isValid) {
      console.warn('⚠️ Invalid search query:', queryValidation.error);
      return [];
    }

    const response = await axiosInstance.get('/group/search-movies', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams({ 
        group_id: groupIdValidation.sanitized,
        query: queryValidation.sanitized
      }),
    });
    console.log("[🔎 GroupSearch]", {
      token,
      group_id,
      query,
      results: response.data?.results,
    });
    return response.data?.results || [];
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("❌ Group search error:", err?.message || error);
    return [];
  }
};

// 13. Record Preference
export const recordGroupPreference = async (
  token: string,
  groupId: string,
  imdbId: string,
  preference: 'like' | 'dislike'
) => {
  console.log(token , groupId , imdbId , preference , "-------_____recordGroupPreference" )
  try {
    const response = await axiosInstance.post(
      '/group/record-preference',
      {
        group_id: groupId,
        imdb_id: imdbId,
        preference: preference,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log('✅ Preference recorded:', response);
    return response.data;
  } catch (error) {
  console.log(token , groupId , imdbId , preference , "-------_____recordGroupPreference" )

    console.error('❌ Error recording preference:', error?.response?.data || error.message);
    throw error;
  }
};



export const getGroupActivitiesAction = async (
  token: string,
  groupId: string,
  imdbId?: string
): Promise<PaginatedResponse<Activity>> => {
  console.log(groupId ,imdbId , "_____getGroupActivitiesAction_____")
  try {
    // Validate inputs
    const { validateGroupId, validateImdbId } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(groupId);
    
    if (!groupIdValidation.isValid) {
      console.error('❌ Invalid group ID:', groupIdValidation.error);
      return { current_page: 1, total_pages: 0, results: [] };
    }

    // Build params object
    const params: Record<string, string> = { group_id: groupIdValidation.sanitized };
    
    if (imdbId) {
      const imdbIdValidation = validateImdbId(imdbId);
      if (imdbIdValidation.isValid) {
        params.imdb_id = imdbIdValidation.sanitized;
      } else {
        console.warn('⚠️ Invalid IMDB ID, skipping:', imdbIdValidation.error);
      }
    }

    const response = await axiosInstance.get('/group/activities', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams(params),
    });
    console.log(response.data ,"<--------_______eeeegetGroupActivitiesAction")
    return response.data;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("❌ Failed to fetch group activities:", err?.message);
    return { current_page: 1, total_pages: 0, results: [] };
  }
};


 export const getFilteredGroupMovies = async (
  token: string,
  groupId: string,
  n_members?: number,
  members?: string[]) => {
  console.log( token,
  groupId,
  n_members,
  members, "______------g___etFilteredGroupMovies")

  try {
    // Validate inputs
    const { validateGroupId, validateStringArray } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(groupId);
    
    if (!groupIdValidation.isValid) {
      console.error('❌ Invalid group ID:', groupIdValidation.error);
      return null;
    }

    // Build params object
    const params: Record<string, any> = { group_id: groupIdValidation.sanitized };
    
    if (members && members.length > 0) {
      const membersValidation = validateStringArray(members, {
        fieldName: 'Members',
        maxItems: 50,
      });
      if (membersValidation.isValid) {
        params.members = membersValidation.sanitized.join(',');
      } else {
        console.warn('⚠️ Invalid members array:', membersValidation.error);
      }
    }
    
    if (n_members !== undefined && n_members !== null) {
      const nMembersValidation = validatePage(n_members); // Use validatePage for positive integers
      if (nMembersValidation.isValid) {
        params.n_members = nMembersValidation.value;
      } else {
        console.warn('⚠️ Invalid n_members:', nMembersValidation.error);
      }
    }

    const response = await axiosInstance.get('/group/filter-movies', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: createSafeParams(params),
    });

    console.log( 'no.---',n_members,members,  groupId ,response?.data , "<--__api__-----____s_getFilteredGroupMovies____--->")

    return response.data;
  } catch (err) {
    console.log("Error in getFilteredGroupMovies", err);
    return null;
  }
};


// export const getMoviePlatforms = async ({
//   token,
//   imdb_id,
//   country,
//   watch_type
// }: {
//   token: string;
//   imdb_id: string;
//   country?: string;
//   watch_type?: string;
// }) => {
//   Alert.alert("helo")
//   console.log( token,
//   imdb_id,
//   country,
//   watch_type , "helo api________ ------------")
//   try {
//     let url = `/platforms?imdb_id=${imdb_id}`;
//     if (watch_type) {
//       url += `${watch_type}`
//     }
//     // if (country) url += `&country=${country}`;
//     // if (watch_type) url += `&watch_type=${watch_type}`;
//     const response = await axiosInstance.get(url, {
//       headers: {
//         Authorization: `Token ${token}`,
//       },
//     });
//     // if (!response.ok) throw new Error('API Error');
//     // const data = await response.json();
//     console.log(response  , "________data________")
//     return response;
//   } catch (error) {
//     console.error("Error fetching movie platforms:", error);
//     return [];
//   }
// };






// export const getMoviePlatforms = async ({
//   token,
//   imdb_id,
//   country,
//   watch_type,
  
// }) => {
//   try {
//     let url = `/platforms?imdb_id=${imdb_id}`;
//     if (country) url += `&country=${country}`;
//     if (watch_type) url += `&watch_type=${watch_type}`;
//     console.log(url , "___url__herer")
//     console.log(url , "workUrl____")
//     const response = await axiosInstance.get(url, {
//       headers: {
//         Authorization: `Token ${token}`,
//       },
//     });
//     console.log(response.data ,url ,  "_____getMoviePlatforms")
//     return response;
//   } catch (error) {
//     console.error("Error fetching movie platforms:", error);
//     return [];
//   }
// };


export const getMembersScores =  async (token:string , group_id:string ,imdb_id:string) => {
  console.log(group_id ,imdb_id , "getmemebersScroce___________" )
  
  try {
    // Validate inputs
    const { validateGroupId, validateImdbId } = await import('../../utils/apiInputValidator');
    const groupIdValidation = validateGroupId(group_id);
    const imdbIdValidation = validateImdbId(imdb_id);
    
    if (!groupIdValidation.isValid) {
      throwValidationError('Group ID', groupIdValidation.error);
    }
    if (!imdbIdValidation.isValid) {
      throwValidationError('IMDB ID', imdbIdValidation.error);
    }

    const response = await axiosInstance.get('/group/members-scores', {
      headers: {
        Authorization : `Token ${token}`,
      },
      params: createSafeParams({ 
        group_id: groupIdValidation.sanitized,
        imdb_id: imdbIdValidation.sanitized
      }),
    })
    console.log(response.data , "getMembersSCore___________")
    return response.data
  } catch (error ) {
    console.error("Error not able to get Members Scores" , error)
    throw error
  }
}



export const  renameGroup = async (token:string , group_id:string ,group_name:string)=> {
  console.log(token ,token ,group_id , group_name  ,"renameGroup_________renameGroup______" )
  try{
    const response = await axiosInstance.put(`/group/rename`, 
      {
        group_id:group_id,
        group_name:group_name,
      },
     { headers:{
        Authorization: `Token ${token}`
      }}
    )
     console.log("Group___renamed:", response.data);
     return response.data
  } catch (error) {
   console.error("Error renaming group", error);
    throw error;
  }
}

// 47. 


// 49.


// 52. Group Notification On/Off


export const toggleGroupNotification = async (
  token: string,
  groupId: string,
  status: 'on' | 'off'
) => {
  try {
    const response = await axiosInstance.put(
      '/group/notification-settings',
      {
        group_id: groupId,
        notification: status,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log('Notification_Toggle_Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Notification Toggle Failed:', error);
    throw error;
  }
};


// No.	Function Name	Description
// 1	getAllFriends	Get friend list for group creation
// 2	searchFriends	Search friends for group
// 3	createGroup	Create a new group
// 4	getGroupMembers	Get members of a group
// 5	listGroups	List all groups
// 6	addMembersToGroup	Add new members to group
// 7	recordPreference	Record like/dislike for a movie in a group
// 8	leaveGroup	Leave a group
// 9.1	getGroupActivities	Get group activities
// 9.2	getGroupActivitiesByMovie	Get activities for specific movie
// 13. 