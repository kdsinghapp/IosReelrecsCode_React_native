import axiosInstance from "./axiosInstance"


// export const getCommentsByMovie = async (token: string, imdb_id: string,
//     page: number = 1,
//   page_size: number = 20
// ) => {
//     console.log('getCommentsByMovie___kiouyjbg', imdb_id , token)
//     try {
//         const res = await axiosInstance.get(`/comments?imdb_id=${imdb_id}`, {
//             headers: {
//                 Authorization: `Token ${token}`,
//             },
//         });
//         console.log(res.data, "getCommentsByMovie___data");
//         // if (!res.data || !res.data.results) {   
//         return res.data;
//     } catch (error) {
//         console.error("❌ Get comments failed:", error);
//         throw error;
//     }
// };



export const getCommentsByMovie = async (
  token: string,
  imdb_id: string,
  page: number = 1,
  page_size: number = 20
) => {
  try {
    const res = await axiosInstance.get(`/comments`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        imdb_id,
        page,
        page_size,
      },
    });

    // Backend response: { results: [...], current_page, total_pages, has_commented }
    return res.data;
  } catch (error) {
    console.error("❌ Get comments failed:", error);
    throw error;
  }
};


export const postComment = async (token: string, imdb_id: string, comment: string) => {
    try {
        const response = await axiosInstance.post(
            `/comment`,
           {imdb_id: imdb_id, 
                                    comment: comment,
                                    },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        )
        console.log(response.data, " postComment__ ĀĀĀĀĀĀĀĀĀĀĀĀĀ - ", imdb_id, comment)
        return response.data
    } catch (error) {
        console.error("❌ Post comment failed:", error);
        throw error;
    }
}

export const updateComment = async (token: string, imdb_id: string, comment: string) => {
    try {
        const response = await axiosInstance.put(
            `/comment`,
            { imdb_id, comment },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        )
        console.log(response.data, " updateComment - update")
        return response.data

    } catch (error) {
        console.error("❌ Update comment failed:", error);
        throw error;
    };
};

export const deleteComment = async (token: string, imdb_id: string) => {
    try {
        const response = await axiosInstance.delete(`/comment`, {
            headers: {
                Authorization: `Token ${token}`,
            },
            data: {
                imdb_id: imdb_id
            },
        });
        console.log(response.data, deleteComment)
        return response.data
    } catch (error) {
        console.error("❌ Delete comment failed:", error);
        throw error;
    }
}