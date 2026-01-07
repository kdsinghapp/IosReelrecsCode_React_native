import { errorToast } from "../../utils/customToast";
import axiosInstance from "./axiosInstance";
import { urlEndPoint } from "./urlEndPoint";

export const followUser = async (token: string, username: string) => {
  console.log(token , username , 'usrnameFFFFollowun')

    try {
        const res = await axiosInstance.post(
            '/follow',
            { username },
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        // console.log('followdatate', res.data)
        return res.data;
    } catch (error) {
      errorToast("oijhuj")
        console.error('❌ Follow failed:', error);
        throw error;
    }
};

export const unfollowUser = async (token: string, username: string) => {
  console.log(token , username , 'usrnameUnFollowun')
    try {
        const res = await axiosInstance.delete(
            '/follow',
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
                data: { username },
            }
        );
        return res.data;
    } catch (error) {
        console.error('❌ Unfollow failed:', error);
        throw error;
    }
};

// export const getFollowers = async (token: string, username?: string) => {
//     try {
//         const url = username ? `/followers?username=${username}` : `/followers`;
//         const res = await axiosInstance.get(url, {
//             headers: {
//                 Authorization: `Token ${token}`,
//             },
//         });
//         console.log('followdatate', res.data)

//         return res.data;
//     } catch (error) {
//         console.error('❌ Get followers failed:', error);
//         throw error;
//     }
// };


// export const getFollowing = async (token: string, username?: string ,  query: string = '') => {
//     try {
//         const url = username ? `/following?username=${username}` : `/following`;
//         const res = await axiosInstance.get(url, {
//             headers: {
//                 Authorization: `Token ${token}`,
//             },
//         });
//         console.log('followingdatagetFollowing', res.data)
//         return res.data;
//     } catch (error) {
//         console.error('❌ Get following failed:', error);
//         throw error;
//     }
// };

export const getFollowing = async (token: string, query: string = '') => {
  try {
    const url = query.trim()
      ? `/following?query=${encodeURIComponent(query.trim())}`
      : `/following`;

    const res = await axiosInstance.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
console.log('Following Data:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Get following failed:', error);
    throw error;
  }
};






export const getFollowers = async (token: string, query: string = '') => {
  try {
    const url = query.trim()
      ? `/followers?query=${encodeURIComponent(query.trim())}`
      : `/followers`;

    const res = await axiosInstance.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
console.log('Followers Data:', res.data);   
    return res.data;
  } catch (error) {
    console.error('❌ Get followers failed:', error);
    throw error;
  }
};


export const getSuggestedFriends = async (
  token: string,
  query: string = ''
): Promise<any> => {
  try {
    const endpoint = query.trim()
      ? `/suggest-friends?query=${encodeURIComponent(query.trim())}`
      : `/suggest-friends`;

    const response = await axiosInstance.get(endpoint, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log('Suggested friends:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching suggested friends:', error?.response?.data || error.message);
    throw error;
  }
};