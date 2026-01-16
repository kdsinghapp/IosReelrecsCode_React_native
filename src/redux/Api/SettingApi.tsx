import axiosInstance from "./axiosInstance";

export const getUniquePlatforms = async ({
  token,
  country,
  query,
  page,
  page_size=20,
}: {
  token: string;
  country?: string;
  query?: string;
  page?:number;
  page_size?:number;
}) => {
  try {
    let url = `/unique-platforms`;
    const params: string[] = [];
    if (country) params.push(`country=${country}`);
    if (query) params.push(`query=${encodeURIComponent(query)}`);
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: { page },
    });
    console.log(response.data , "getUniquePlatforms____________")
    return response.data;
  } catch (error) {
    console.error("Error fetching unique platforms:", error);
    throw error;
  }
};

export const  registerUserSubscriptions = async (token:string , subscriptions:string[] ) => {
  try {
    const response = await axiosInstance.post(`/user-subscriptions`, 
      {
        subscriptions: subscriptions,
      },
     { headers: {
      Authorization: `Token ${token}`
      }}
    )
    console.log(response ,"registerUserSubscriptions__________")
    return response
  }  catch (error) {
    console.error("Error registering subscriptions", error);
    throw error;
  }
}


export const getUserSubscriptions  = async (token:string)=> {
  try {
    const response = await axiosInstance.get(`/user-subscriptions`,
      {
        headers : {
          Authorization: `Token ${token}`
        }
      } 
    )
    // console.log(response.data , "getUserSubscriptions______<>___")
return response
  } catch (error) {
    console.error("Error ")
  }
}

export const deleteUserSubscriptions = async (token: string, subscriptions: string[]) => {
  try {
    const response = await axiosInstance.delete('/user-subscriptions', {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        subscriptions: subscriptions, 
      },
    });
    console.log('Deleted Subscriptions:', response.data);
    
    return response;
  } catch (error) {
    console.error('Error deleting subscriptions:', error);
    throw error;
  }
};


export const userFeedback = async (
  token: string,
  feedback_type: string,
  anonymous: boolean,
  feedback: string
) => {
  console.log(token, feedback_type, anonymous, feedback, "userFeedback__________");

  try {
    const response = await axiosInstance.post(
      `/feedback`,
      {
        feedback_type: feedback_type,
        feedback: feedback,
        anonymous: anonymous ? "yes" : "no",  
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    console.log(response.data, "userFeedback__________");
    return response.data;
  } catch (error) {
    console.error("Error submitting user feedback:", error);
    throw error;
  }
};


