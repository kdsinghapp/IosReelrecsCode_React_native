import axiosInstance from './axiosInstance';

// export const getUserFeed = async (token: string, username?: string, page?: string) => {
//   console.log("🟢 getUserFeed CALLED with token:", token, "and username:", username, "and page:", page);

//   try {
//     let url = `http://reelrecs.us-east-1.elasticbeanstalk.com/v1/user-feed`;

//     const params = [];
//     if (username) params.push(`username=${username}`);
//     // if (page) params.push(`page=${page}`);

//     if (params.length > 0) {
//       url += `?${params.join("&")}`;
//     }

//     const response = await axiosInstance.get(url, {
//       headers: {
//         Authorization: `Token ${token}`,
//       },
//     });

//     console.log("✅ RESPONSEFeedbab:", response.data.results);
//     return response.data;
//   } catch (error) {
//     console.log("❌ Error fetching user feed:", error);
//     throw error;
//   }
// };

// export const getUserFeed = async (token: string, username?: string, page?: string) => {
//   let url = "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/user-feed";

//   const queryParams: string[] = [];
//   if (username) queryParams.push(`username=${username}`);
//   // if (page) queryParams.push(`page=${page}`);

//   if (queryParams.length > 0) {
//     url += "?" + queryParams.join("&");
//   }

//   const response = await axiosInstance.get(url, {
//     headers: {
//       Authorization: `Token ${token}`,
//     },
//   });

//   return response.data;
// };
// FeedApi.ts


export const getUserFeed = async (
  token: string,
  type: "home" | "profile" | "otherprofile",
  username?: string,
  page: number = 1 
) => {
  try {
    let url = "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/user-feed";
    const queryParams: string[] = [];
    if (type === "otherprofile" && username) {
      queryParams.push(`username=${username}`);
    }
    // if (type === "profile") {
    //    queryParams.push("page=2");
    //   if (username) {
    //     queryParams.push(`username=${username}`);
    //   }
    // }

    if (queryParams.length > 0) {
      url += "?" + queryParams.join("&");
    }

    console.log("📡 URL Called:", url);

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user feed:", error);
    throw error;
  }
};


// export const getUserFeed = async (
//   token: string,
//   type: "home" | "profile" | "otherprofile",
//   username?: string,
//   page: number = 1
// ) => {
//   try {
// console.log(type ,"1111 type")

//     let url = "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/user-feed";

//     const queryParams: string[] = [];

//     queryParams.push(`page=${page}`);

//     if (type === "otherprofile" && username) {
//       queryParams.push(`username=${username}`);
//     }
//      if (type === "profile" && username) {
//       queryParams.push(`username=${username}`);
//     }

//     if (queryParams.length > 0) {
//       url += "?" + queryParams.join("&");
//     }
//     console.log("B",   url);

//     const response = await axiosInstance.get(url, {
//       headers: {
//         Authorization: `Token ${token}`,
//       },
//     });
// console.log(response.data ,'response.data___fedddededata___here')
// console.log(response.data?.current_page ,'response__current___page__data')
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching user feed:", error);
//     throw error;
//   }
// };
