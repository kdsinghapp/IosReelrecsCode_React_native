import { Alert } from 'react-native';
import axiosInstance from './axiosInstance';
import axiosPublic from './axiosPublic';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { UserProfile, UpdateProfileData, ProfileFlags, ApiResponse } from '../../types/api.types';


export const loginUser_Api = async (email: string, password: string): Promise<string | null> => {
  try {
    const response = await axiosInstance.post('/login', {
      email_id: email,
      password: password,
    });

    if (response.status === 200 && response.data.token) {
      return response.data.token;
    } else {
      return null;
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.log('Login error:', err?.response?.data || err?.message);
    return null;
  }
};


export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/existing-user?email_id=${email}`);
    console.log(response, "checkEmailExists");
    return response.data?.existing_user === 'yes';
  } catch (error) {
    console.log('Email check error:', error);
    return true; // fallback
  }
};

export const sendOTPToEmail_GET = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get(
      `/verify-email?email_id=${encodeURIComponent(email)}&purpose=signup`
    );

    console.log("✅ OTP Response:", response.data);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const errMsg = err?.response?.data?.message || err?.message;
    console.log("❌ OTP GET error:", errMsg);
    return { success: false, message: errMsg || "OTP send failed" };
  }
};
export const confirmEmailCodeApi = async (
  email: string, 
  code: string
): Promise<ApiResponse> => {
  console.log("email  - ", email)
  console.log("code  -  -", code)
  try {
    const response = await axiosInstance.post('/confirm-email-code', {
      email_id: email,
      purpose: 'signup',
      code: String(code),
    });

    return {
      success: response.status === 200 && response.data?.verification === 'success',
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.log('OTP verify error:', err?.response?.data || err?.message);
    return {
      success: false,
      message: err?.response?.data?.message || 'Verification  failed',
    };
  }
};


export const checkUsernameAvailability = async (
  username: string
): Promise<ApiResponse<{ available: boolean }>> => {
  try {
    const response = await axiosInstance.get(`/check-username-availability?username=${username}`);
    console.log("🔍 Username Check Response:", response?.data);
    return {
      success: true,
      data: { available: response?.data?.username_available === "yes" },
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.log("Username Check Error:", err?.response?.data || err?.message);
    return {
      success: false,
      message: err?.response?.data?.message || 'Something went wrong',
    };
  }
};


// ✅ authService.js

export const signupWithUsername = async (
  email: string, 
  password: string, 
  username: string
): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await axiosInstance.post('/signup', {
      email_id: email,
      password: password,
      username: username,
    });

    return {
      success: true,
      data: response?.data?.result as UserProfile,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.log("Signup Error:", err?.response?.data || err?.message);
    return {
      success: false,
      message: err?.response?.data?.message || 'Signup failed',
    };
  }
};



export const logoutApi = async (token: string) => {
  console.log(token, "api logout api  token")
  try {
    const response = await axiosInstance.post(
      '/logout',
      {}, // empty JSON body
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (response.status === 200) {
      console.log('✅ Logged out successfully:', response.data);
      return true;
    } else {
      console.warn('⚠️ Logout failed:', response.status);
      return false;
    }
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.log('❌ Logout API Error:', err?.message);
    return false;
  }
};

// export const getMovieMetadata_Api = async (imdb_id: string, token: string) => {
//   try {
//     const response = await axiosInstance.get(`/movie-metadata?imdb_id=${imdb_id}`, {
//       headers: {
//         Authorization: `Token ${token}`,
//       },
//     });

//     if (response.status === 200) {
//       console.log('🎬 Movie Metadata:', response.data);
//       return response.data;
//     } else {
//       console.warn('⚠️ Failed to fetch movie metadata:', response.status);
//       return null;
//     }
//   } catch (error) {
//     console.log('❌ Movie Metadata Fetch Error:', error.message);
//     return null;
//   }
// };


// 1



export const sendResetOTP = async (email: string): Promise<ApiResponse> => {
  console.log(email, 'email___work__fauilos')
  try {
    const response = await axiosPublic.get(`/verify-email`, {
      params: {
        email_id: email,
        purpose: "reset_password",
      },
    });
    console.log("✅ OTP Sent sendResetOTP__:", response.data);
    return { success: true, message: response.data.message };
  } catch (error: unknown) {
    console.log(error)
    const err = error as { response?: { data?: { message?: string } } };
    const msg = err?.response?.data?.message || "Failed to send OTP";
    console.error("❌ OTP Send Error:", msg);
    return { success: false, message: msg };
  }
};

// 2
export const verifyResetOTP = async (
  email: string, 
  code: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosPublic.post(`/confirm-email-code`, {
      email_id: email,
      code: code,
      purpose: "reset_password",
    });
    console.log("✅ OTP Verified verifyResetOTP:", response.data);
    return { success: true, message: response.data.verification };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const msg = err?.response?.data?.message || "OTP verification failed";
    console.error("❌ OTP Verify Error:", msg);
    return { success: false, message: msg };
  }
};



//3 Password Reset
// export const resetPassword = async (email: string, newPassword: string) => {
//   const trimmedEmail = email.toLowerCase();
//   console.log(trimmedEmail, email ,newPassword , "newPassword____newPassword")

//   try {
//     const response = await axiosPublic.post(`/reset-password`, {
//       email_id: email,  // Ensure this matches backend expectations
//       password: newPassword,  // Some APIs expect "new_password" instead
//     });
//     Alert.alert("password__change")
//     console.log("password__change")
//     return {
//       success: true,
//       data: response?.data
//     };
//   } catch (error) {
//     console.log("Full error:", error.response?.data); // Debug
//     return {
//       success: false,
//       message: error.response?.data?.message || "Password reset failed"
//     };
//   }
// };


export const resetPassword = async (
  email: string, 
  newPassword: string
): Promise<ApiResponse> => {
  const trimmedEmail = email.trim().toLowerCase();
  console.log(trimmedEmail, email, newPassword, "newPassword____newPassword");

  try {
    const response = await axios.post(
      "http://reelrecs.us-east-1.elasticbeanstalk.com/v1/reset-password",
      {
        email_id: trimmedEmail,
        password: newPassword,
      }
    );

    Alert.alert("Password changed successfully!");
    console.log("password__change");
    return {
      success: true,
      data: response?.data,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.log("Full error:", err.response?.data);
    return {
      success: false,
      message: err.response?.data?.message || "Password reset failed",
    };
  }
};

export const changePassword = async (
  token: string, 
  newPassword: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/change-password', {
      password: newPassword,
    }, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return {
      success: response.status === 200 && response.data?.password_reset === "success",
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.log("❌ Change Password Error:", err?.response?.data || err?.message);
    return {
      success: false,
      message: err?.response?.data?.message || "Password change failed",
    };
  }
};



// user profile  update


export const updateUserProfile = async (
  token: string,
  data: UpdateProfileData
): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.put(`/user-profile`, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log("✅ updateUserProfile:", data, response.data);
    return response.data as UserProfile;
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
};


export const getUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get(`/user-profile`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    console.log("✅ getUserProfileop:", response.data);
    return response.data as UserProfile;
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    throw error;
  }
};




// export const uploadAvatarImage = async (token: string, image: any) => {
//   try {
//     console.log("🔐 Token:", token);
//     console.log("📷 Image:", image);

//     const formData = new FormData();
//     formData.append('avatar', {
//       uri: image?.path || image?.uri,
//       type: image?.mime || 'image/jpeg',
//       name: 'avatar.jpg',
//     });

//     const response = await axios.post(
//       'http://reelrecs.us-east-1.elasticbeanstalk.com/v1/avatar',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Token ${token}`,
//         },
//       }
//     );

//     console.log("✅ Upload Successpop:", response.data);
//     // getUserProfile(token)

//     return response;
//   } catch (error: any) {
//     console.error("❌ Upload Error:", error?.response?.data || error.message);
//     throw error;
//   }
// };

interface ImagePickerResult {
  path?: string;
  uri?: string;
  mime?: string;
}

export const uploadAvatarImage = async (
  token: string, 
  image: ImagePickerResult
): Promise<{ data: { avatar_url: string } }> => {
  try {
    const formData = new FormData();
    formData.append('avatar', {
      uri: image?.path || image?.uri,
      type: image?.mime || 'image/jpeg',
      name: 'avatar.jpg',
    } as unknown as Blob);

    const response = await axios.post(
      'http://reelrecs.us-east-1.elasticbeanstalk.com/v1/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      }
    );

    console.log("✅ Upload Successpop:", response.data);
    return response; 
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("❌ Upload Error:", err?.response?.data || err?.message);
    throw error;
  }
};

export const updateProfileFlags = async (
  token: string, 
  flags: ProfileFlags
): Promise<{ data: UserProfile }> => {
  try {
    const response = await axiosInstance.put(`/user-profile`,
      flags,
      {headers : {
        Authorization : `Token ${token}`
      }}
    )
    console.log(response , 'response_______updateProfileFlags__')
    return response;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown } };
    console.error("❌ Error updating profile flags:", err.response?.data || error);
    throw error;  
  }
}


export const appNotification = async (token: string): Promise<{ results: unknown[] }> => {
  try {
    const response = await axiosInstance.get(`/notifications`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    console.log('appNotification____Export', response.data)
    return response.data
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown } };
    console.error("❌ Error updating profile flags:", err?.response?.data || error);
    throw error;
  }
}