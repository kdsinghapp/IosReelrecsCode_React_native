import { getUserFeed } from "@redux/Api/FeedApi";
import { useState, useEffect } from "react";
 
const useUserFeed = (token: string,profile:any) => {
  const [feedData, setFeedData] = useState<any[]>([]);
  const [page, setPage] = useState(1);            // ✅ current page
  const [hasMore, setHasMore] = useState(true);   // ✅ aur data bacha hai ya nahi
  const [loadingFeed, setLoadingFeed] = useState(false);

  const fetchFeed = async (
    type: "home" | "profile" | "otherprofile",
    username?: string,
    reset: boolean = false   // ✅ reset true → fresh load
  ) => {
    if (!token || loadingFeed) return;
    if (!hasMore && !reset) return;

    setLoadingFeed(true);
console.log(type ,"type")
// console.log(type , username , 'userFeed__data__here___username')

    try {
      // ✅ page parameter bhejna important hai
      const res = await getUserFeed(token, type, username, reset ? 1 : page);
       setFeedData((prev) =>
        reset ? res.results : [...prev, ...res.results] // ✅ overwrite ya append
      );
            setLoadingFeed(false);

 if (feedData && page ===1) {
      setLoadingFeed(false);

    setPage( page + 1);
} else if (res.current_page >= res?.total_pages) {
        setHasMore(false);
      } else {
                    setLoadingFeed(false);

        setTimeout(() => {
        setPage( page + 1); // ✅ next page set karo
          
        }, 600);
      }
    } catch (err) {
              setHasMore(false);

            setLoadingFeed(false);

      console.log("❌ Feed error:", err);
    } finally {
              setHasMore(false);

      setLoadingFeed(false);
    }
  };

  // ✅ Initial Load
  // useEffect(() => {
  //   fetchFeed("home", undefined, true);
//   // }, [token]);
// useEffect(() => {
//        // fetchFeed("home", otherUserData?.username);
//       fetchFeed("otherprofile", );
  
//   }, []);
  return {
    feedData,
    fetchFeed,
    loadingFeed,
    hasMore,
  };
};

export default useUserFeed;


// import { useState } from 'react';
// import { getUserFeed } from '@redux/Api/FeedApi';

// const useUserFeed = (token: string) => {
//   const [feedData, setFeedData] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingFeed, setLoadingFeed] = useState(false);
//  const [page, setPage] = useState(1);         




// const fetchFeed = async (
//   type: "home" | "profile" | "otherprofile",
//   username?: string,
//   reset: boolean = false   // agar true hua to feed reset karega
// ) => {
//   if (!token || loadingFeed) return;
//   if (!hasMore && !reset) return;

//   setLoadingFeed(true);

//   try {
//     const res = await getUserFeed(token, type, username, reset ? 1 : page); 
//     // 👆 API call me page number bhejna hoga (API agar support karti ho)

//     setFeedData(prev =>
//       reset ? res.results : [...prev, ...res.results]   // ✅ overwrite ya append
//     );

//     if (res.current_page >= res.total_pages) {
//       setHasMore(false);
//     } else {
//       setPage(prev => reset ? 2 : prev + 1);   // ✅ next page ke liye ready
//     }
//   } catch (err) {
//     console.log("❌ Feed error:", err);
//   } finally {
//     setLoadingFeed(false);
//   }
// };






//   // const fetchFeed = async (
//   //   type: "home" | "profile" | "otherprofile",
//   //   username?: string
//   // ) => {
//   //   if (!token || !hasMore || loadingFeed) return;
//   //   setLoadingFeed(true);
//   //     // console.log(username ,  "edfgbvcddfvcdf")
//   //   try {
//   //     // const res = await getUserFeed(token, type, username);
//   //     const res = await getUserFeed(token,'home', username);
//   //     setFeedData(res.results);
//   //     // console.log("✅ feed response______", res);

//   //     if (!res.next) setHasMore(false);
//   //   } catch (err) {
//   //     // console.log("❌ Feed error:", err);
//   //   } finally {
//   //     setLoadingFeed(false);
//   //   }
//   // };

//   return {
//     feedData,
//     fetchFeed,
//     loadingFeed,
//     hasMore,
//   };
// };

// export default useUserFeed;
