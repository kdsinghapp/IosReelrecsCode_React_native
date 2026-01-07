// import { base_url, constant } from "../../config/constant";
// import ScreenNameEnum from "../../routes/screenName.enum";
// import { errorToast, successToast } from "../../utils/customToast";
// import { loginSuccess } from "../feature/authSlice";
// import { getSuccess } from "../feature/userSlice";
// const LoginUserApi = async (
//     param,
//     setLoading,
//     dispatch) => {
//     try {
//         setLoading(true)
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formdata = new FormData();
//         formdata.append("email", param?.email);
//         formdata.append("type", param?.usertype);
//         formdata.append("password", param?.password);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formdata,
//         };
//         const respons = await fetch(`${base_url}${constant.Login}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                  if (response?.status === '1') {
//                     if (response.result.step === "0") {
//                         if (response.result.type == "User") {
//                             successToast(response?.message);
//                             dispatch(loginSuccess({
//                                 userData: response?.result,
//                                 token: response?.result?.access_token,
//                             }));

//                             param.navigation.reset({
//                                 index: 0,
//                                 routes: [{ name: ScreenNameEnum.TabNavigator }],
//                             });
//                             return response;
//                         } else {
//                             param.navigation.navigate(ScreenNameEnum.AddService, {
//                                 item: response?.result
//                             });
//                             setLoading(false);
//                             return response;
//                         }

//                     }


//                     if (response.result.step === "1") {
//                         param.navigation.navigate(ScreenNameEnum.AddDocument, {
//                             item: response?.result
//                         });
//                         setLoading(false);
//                         return response;
//                     }
//                     if (response.result.step === "2") {
//                         successToast(response?.message);

//                         dispatch(loginSuccess({
//                             userData: response?.result,
//                             token: response?.result?.access_token,
//                         }));

//                         param.navigation.reset({
//                             index: 0,
//                             routes: [{ name: ScreenNameEnum.TabNavigator }],
//                         });
//                         return response;
//                     }

//                     setLoading(false);


//                     return response;
//                 } else {
//                     setLoading(false);
//                     errorToast(response.message);
//                     return response;
//                 }


//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };
 
// //     param,
// //     setLoading,
// //     dispatch) => {
// //     try {
// //         setLoading(true)
// //         const myHeaders = new Headers();
// //         myHeaders.append("Accept", "application/json");
// //         const formdata = new FormData();
// //         formdata.append("email", param?.email);
// //         formdata.append("type", param?.usertype);
// //         formdata.append("password", param?.password);
// //         const requestOptions = {
// //             method: "POST",
// //             headers: myHeaders,
// //             body: formdata,
// //         };
// //         const respons = await fetch(`${base_url}${constant.Login}`, requestOptions)
// //             .then((response) => response.text())
// //             .then((res) => {
// //                 console.log("response", res);
// //                 const response = JSON.parse(res)
// //                 if (response?.status == '1') {
// //                     if (response.step == "0") {
// //                         param.navigation.navigate(ScreenNameEnum.AddService);
// //                     }
// //                     setLoading(false)
// //                     successToast(
// //                         response?.message
// //                     );
// //                     dispatch(loginSuccess({ userData: response?.result, token: response?.result?.access_token, }));
// //                     param.navigation.reset({
// //                         index: 0,
// //                         routes: [{ name: ScreenNameEnum.TabNavigator }],
// //                     });
// //                     return response
// //                 } else {
// //                     setLoading(false)
// //                     errorToast(
// //                         response.message,
// //                     );
// //                     return response
// //                 }
// //             })
// //             .catch((error) =>
// //                 console.error(error));
// //         return respons
// //     } catch (error) {
// //         setLoading(false)
// //         errorToast(
// //             'Network error',
// //         );
// //     }
// // };
// const SinupUserApi = async (param, setLoading) => {
//     try {
//         setLoading(true);
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formData = new FormData();
//         formData.append("mobile", param?.mobile);
//         formData.append("email", param?.email);
//         formData.append("user_name", param?.fullName);
//         formData.append("password", param?.password);
//         formData.append("type", param?.roleType);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };
//         const response = await fetch(`${base_url}${constant.SignUp}`, requestOptions);
//         const res = await response.text();
//         const jsonResponse = JSON.parse(res);
//         setLoading(false);
//         if (jsonResponse?.status === "1") {
//             successToast(jsonResponse?.message);
//             param?.navigation.navigate(ScreenNameEnum.LoginScreen);
//             return jsonResponse;
//         } else {
//             errorToast(jsonResponse?.message);
//             return jsonResponse;
//         }
//     } catch (error) {
//         setLoading(false);
//         errorToast("Network error");
//     }
// };

// const ForgotPassUserApi = async (
//     param,
//     setLoading,
// ) => {
//     try {
//         setLoading(true)
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formdata = new FormData();
//         formdata.append("email", param?.email);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formdata,
//         };
//         const respons = await fetch(`${base_url}${constant.ForgetPassword}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res)
//                 if (response?.status == '1') {
//                     setLoading(false)
//                     successToast(
//                         response?.message
//                     );
//                     if (param?.type == "Resend") {

//                     }
//                     else {
//                         param?.navigation.navigate(ScreenNameEnum.OtpScreen, {
//                             email: param?.email
//                         });
//                     }

//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response.message,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };



// const AddServies = async (param, setLoading) => {
//     console.log("param.MulImage",param.MulImage)
//      try {
//         setLoading(true);
//         const formData = new FormData();
//         formData.append("user_id", param.user_id);
//         formData.append("cat_id", param.cat_id);
//         formData.append("description", param.description);
//         formData.append("title", param.title);
//         formData.append("address", param.address);
//         formData.append("lat", param.lat);
//         formData.append("lon", param.lon);
//         formData.append("per_person_price", param.person_price);
//         formData.append("phone_number", param.phone);
//         formData.append("email", param.email);
//         formData.append("price", param.price);
//         formData.append("time_availability", JSON.stringify(param.time_availability));
//         param.MulImage.forEach((image, index) => {
//             console.log("image ----", image);
//             formData.append(`images`, {
//                 uri: image.image, // 👈 Corrected this line
//                 type: 'image/jpeg',
//                 name: `image_${index}.jpg`  // giving unique name is still good
//             });
//         });


//         // param.MulImage.forEach((image, index) => {
//         //     // Create a unique name for each image
//         //     const uniqueImageName = `image_${index}.jpg`;
//         //     formData.append("images", {
//         //         uri: image.image,  // Ensure this is the path to the image
//         //         type: 'image/jpeg',
//         //         name: uniqueImageName
//         //     });
//         // });
     
//         console.log("formData --",formData);

//         const requestOptions = {
//             method: "POST",
//             headers: {
//                 Accept: "application/json"
//             },
//             body: formData
//         };

//         const response = await fetch(`${base_url}${constant.addServiceWithTime}`, requestOptions);
//         const resultText = await response.text();
//         const result = JSON.parse(resultText);

//         if (result?.status === "1") {
//             param.navigation.navigate(ScreenNameEnum.AddDocument, {
//                 item: result?.result
//             });

//             successToast(result.message);

//         } else {
//             errorToast(result.message);
//         }

//         setLoading(false);
//         return result;
//     } catch (error) {
//         setLoading(false);
//         console.error("Network error:", error);
//         errorToast("Network error");
//     }
// };
// // const AddServies = async (param, setLoading) => {
// //     console.log("param.MulImage",param.MulImage)
// //      try {
// //         setLoading(true);
// //         const formData = new FormData();
// //         formData.append("user_id", param.user_id);
// //         formData.append("cat_id", param.cat_id);
// //         formData.append("description", param.description);
// //         formData.append("title", param.title);
// //         formData.append("address", param.address);
// //         formData.append("lat", param.lat);
// //         formData.append("lon", param.lon);
// //         formData.append("per_person_price", param.person_price);
// //         formData.append("phone_number", param.phone);
// //         formData.append("email", param.email);
// //         formData.append("price", param.price);
// //         formData.append("time_availability", JSON.stringify(param.time_availability));
// //           param.MulImage.forEach((image, index) => {
// //             console.log("image ----",image),
// //             formData.append(`images`, {
// //                 uri: image.uri,
// //                 type: 'image/jpeg',
// //                 name: `image.jpg`  // Give each image a unique name
// //             });
// //         });
// //         console.log("formData --",formData);

// //         const requestOptions = {
// //             method: "POST",
// //             headers: {
// //                 Accept: "application/json"
// //             },
// //             body: formData
// //         };

// //         const response = await fetch(`${base_url}${constant.addServiceWithTime}`, requestOptions);
// //         const resultText = await response.text();
// //         const result = JSON.parse(resultText);

// //         if (result?.status === "1") {
// //             param.navigation.navigate(ScreenNameEnum.AddDocument, {
// //                 item: result?.result
// //             });

// //             successToast(result.message);

// //         } else {
// //             errorToast(result.message);
// //         }

// //         setLoading(false);
// //         return result;
// //     } catch (error) {
// //         setLoading(false);
// //         console.error("Network error:", error);
// //         errorToast("Network error");
// //     }
// // };


// const OtpUserApi = async (
//     param,
//     setLoading,
// ) => {
//     try {
//         setLoading(true)
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formdata = new FormData();
//         formdata.append("email", param?.email);
//         formdata.append("otp", param?.otp);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formdata,
//         };
//         const respons = await fetch(`${base_url}${constant.OtpVerify}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res)
//                 if (response?.status == '1') {
//                     setLoading(false)
//                     successToast(
//                         response?.message
//                     );
//                     param.navigation.navigate(ScreenNameEnum.CreatePassword, {
//                         userId: response?.result?.id
//                     })
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response.message,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };

// const UpdatePassUserApi = async (
//     param,
//     setLoading,
// ) => {

//     try {
//         setLoading(true)
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formdata = new FormData();
//         formdata.append("user_id", param?.userId);
//         formdata.append("password", param?.newPassword);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formdata,
//         };
//         const respons = await fetch(`${base_url}${constant.UpdatePassword}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res)
//                 if (response?.status == '1') {
//                     setLoading(false)
//                     successToast(
//                         response?.message
//                     );
//                     param.navigation.navigate(ScreenNameEnum.LoginScreen)
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response.message,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };

// const UpdateProfile_Api = async (
//     param,
//     setLoading,
// ) => {
//     try {
//         setLoading(true)
//         console.log("param?.images?.path", param?.images?.path);
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formData = new FormData();
//         if (param?.images) {
//             formData.append("image", {
//                 uri: param?.images?.path,
//                 type: 'image/jpeg',
//                 name: 'image.jpg'
//             });
//         }
//         formData.append("user_name", param?.name ?? '');
//         formData.append("user_id", param?.userId);
//         formData.append("user_name", param?.name);
//         formData.append("mobile", param?.mobiles);
//         formData.append("email", param?.email);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };
//         const respons = await fetch(`${base_url}${constant.updateProfile}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                 if (response.status == '1') {
//                     setLoading(false)
//                     successToast(
//                         response?.message
//                     );
//                     param.navigation.goBack()
//                     // param.navigation.navigate(ScreenNameEnum.TabNavigator)
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response?.message || response?.error,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };
// const AddSellerDocument = async (param, setLoading) => {
//     try {
//         setLoading(true);

//         const formData = new FormData();

//         if (param?.certificateDoc) {
//             formData.append("certificate", {
//                 uri: param.certificateDoc,
//                 type: 'image/jpeg',
//                 name: 'certificate.jpg',
//             });
//         }

//         if (param?.tradeLicenseDoc) {
//             formData.append("trade_license", {
//                 uri: param.tradeLicenseDoc,
//                 type: 'image/jpeg',
//                 name: 'trade_license.jpg',
//             });
//         }

//         if (param?.identityDocument) {
//             formData.append("identity", {
//                 uri: param.identityDocument,
//                 type: 'image/jpeg',
//                 name: 'identity.jpg',
//             });
//         }

//         formData.append("seller_id", param.userId);

//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");

//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };

//         const response = await fetch(`${base_url}${constant.addSellerDocument}`, requestOptions);
//         const textResponse = await response.text();
//         const jsonResponse = JSON.parse(textResponse);
//         setLoading(false);
//         if (jsonResponse.status === '1') {
//             successToast(jsonResponse.message);
//             param.navigation.goBack();
//         } else {
//             errorToast(jsonResponse.message || jsonResponse.error);
//         }
//         return jsonResponse;
//     } catch (error) {
//         console.error("Upload Error:", error);
//         setLoading(false);
//         errorToast('Network error');
//     }
// };

// const DeleteDoc = async (param, setLoading) => {
//     try {
//         setLoading(true);

//         const formData = new FormData();
 

//         formData.append("seller_id", param.userId);
//         formData.append("type", param.type);

//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");

//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };

//         const response = await fetch(`${base_url}${constant.delete_seller_documents}`, requestOptions);
//         const textResponse = await response.text();
//         const jsonResponse = JSON.parse(textResponse);
//         setLoading(false);
//         if (jsonResponse.status === '1') {
//             successToast(jsonResponse.message);
//             param.navigation.goBack();
//         } else {
//             errorToast(jsonResponse.message || jsonResponse.error);
//         }
//         return jsonResponse;
//     } catch (error) {
//         console.error("Upload Error:", error);
//         setLoading(false);
//         errorToast('Network error');
//     }
// };



// const UpdeSellerDocument = async (param, setLoading) => {
//     try {
//         setLoading(true);

//         const formData = new FormData();

//         if (param?.certificateDoc) {
//             formData.append("certificate", {
//                 uri: param.certificateDoc,
//                 type: 'image/jpeg',
//                 name: 'certificate.jpg',
//             });
//         }

//         if (param?.tradeLicenseDoc) {
//             formData.append("trade_license", {
//                 uri: param.tradeLicenseDoc,
//                 type: 'image/jpeg',
//                 name: 'trade_license.jpg',
//             });
//         }

//         if (param?.identityDocument) {
//             formData.append("identity", {
//                 uri: param.identityDocument,
//                 type: 'image/jpeg',
//                 name: 'identity.jpg',
//             });
//         }

//         formData.append("seller_id", param.userId);

//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");

//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };

//         const response = await fetch(`${base_url}${constant.update_seller_document}`, requestOptions);
//         const textResponse = await response.text();
//         const jsonResponse = JSON.parse(textResponse);
//         setLoading(false);
//         if (jsonResponse.status === '1') {
//             successToast(jsonResponse.message);
//             param.navigation.goBack();
//         } else {
//             errorToast(jsonResponse.message || jsonResponse.error);
//         }
//         return jsonResponse;
//     } catch (error) {
//         console.error("Upload Error:", error);
//         setLoading(false);
//         errorToast('Network error');
//     }
// }; 






// const GetProfile = async (userId, dispatch) => {
//     try {
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formdata = new FormData();
//         formdata.append("user_id", userId);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formdata,
//         };
//         const response = await fetch(`${base_url}${constant.getrofile}`, requestOptions)
//         const resText = await response.text(); // Ensure text is received before parsing
//         const responseData = JSON.parse(resText);
//         if (responseData.status === '1') {
//             dispatch(
//                 getSuccess({
//                     userGetData: responseData.result,
//                 })
//             );
//             return { userGetData: responseData.result };
//         } else {
//             errorToast(responseData.message);
//         }
//     } catch (error) {
//         errorToast('Network error');
//     }
// };

// const GetaboutusePolicyApi = async (
//     setLoading,
// ) => {
//     try {
//         setLoading(true)

//         const requestOptions = {
//             method: "GET",
//         };
//         const respons = await fetch(`${base_url}${constant.getAboutUs}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                 if (response.status == '1') {
//                     setLoading(false)
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response.error,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };
// const PrivacyPolicyApi = async (
//     setLoading,
// ) => {
//     try {
//         setLoading(true)

//         const requestOptions = {
//             method: "GET",
//         };
//         const respons = await fetch(`${base_url}${constant.getPrivacy}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                 if (response.status == '1') {
//                     setLoading(false)
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response.error,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };


// const AddContactUs = async (
//     data,
//     setLoading,
//     id,
// ) => {

//     try {
//         setLoading(true)
//         const formData = new FormData();
//         const myHeaders = new Headers();
//         formData.append("user_id", id);
//         formData.append("name", data?.name);
//         formData.append("email", data?.email);
//         formData.append("mobile", data?.mobile);
//         formData.append("message", data?.message);
//         console.log("formData", formData)
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };
//         const respons = await fetch(`${base_url}${constant.AddContact_us}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                 if (response.status == '1') {
//                     setLoading(false);
//                     successToast(
//                         response?.message
//                     );
//                     data.navigation.navigate(ScreenNameEnum.BOTTOM_TAB)
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response?.message || response?.error,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };


// const ChangePasswordApi = async (
//     param,
//     setLoading,
// ) => {
//     try {
//         setLoading(true)
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formData = new FormData();
//         formData.append("user_id", param?.userId);
//         formData.append("password", param?.password);
//         formData.append("confirm_password", param?.confirm_password);
//         formData.append("old_password", param?.currentPass);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };
//         const respons = await fetch(`${base_url}${constant.changePassword}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                 if (response.status == '1') {
//                     setLoading(false)
//                     successToast(
//                         response?.message
//                     );
//                     param.navigation.navigate(ScreenNameEnum.BOTTOM_TAB)
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response?.message || response?.error,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };

// const GetCategory = async (setLoading) => {
//     setLoading(true)
//     try {
//         const response = await fetch(`${base_url}${constant.getCategory}`, {
//             method: "GET",
//         });

//         if (!response.ok) {
//             throw new Error("Failed to fetch categories");
//         }

//         const responseData = await response.json();
//         setLoading(false);
//         return responseData;

//     } catch (error) {
//         setLoading(false);

//         return null;
//     } finally {
//         setLoading(false);
//     }
// };


// const GetBanner = async (setLoading) => {
//     setLoading(true)
//     try {
//         const response = await fetch(`${base_url}${constant.getBanner}`, {
//             method: "GET",
//         });
//         if (!response.ok) {
//             throw new Error("Failed to fetch categories");
//         }
//         const responseData = await response.json();
//         setLoading(false);
//         return responseData;

//     } catch (error) {
//         errorToast(
//             response?.message || response?.error,
//         );
//         setLoading(false);

//         return null;
//     } finally {
//         setLoading(false);
//     }
// };



// const GetAllServices = async (setLoading) => {
//     setLoading(true)
//     try {
//         const response = await fetch(`${base_url}${constant.getallServices}`, {
//             method: "POST",
//         });
//         if (!response.ok) {
//             throw new Error("Failed to fetch categories");
//         }
//         const responseData = await response.json();
//         setLoading(false);
//         return responseData;

//     } catch (error) {
//         errorToast(
//             response?.message || response?.error,
//         );
//         setLoading(false);

//         return null;
//     } finally {
//         setLoading(false);
//     }
// };
// const GetpostCity = async (setLoading) => {
//     setLoading(true)
//     try {
//         const response = await fetch(`${base_url}${constant.getPostcity}`, {
//             method: "GET",
//         });
//         if (!response.ok) {
//             throw new Error("Failed to fetch categories");
//         }
//         const responseData = await response.json();
//         setLoading(false);
//         return responseData;

//     } catch (error) {
//         errorToast(
//             response?.message || response?.error,
//         );
//         setLoading(false);

//         return null;
//     } finally {
//         setLoading(false);
//     }
// };

// const FavoriteServices = async (
//     item,
//     setLoading,
//     userId
// ) => {
//     try {
//         setLoading(true)
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formData = new FormData();
//         formData.append("user_id", userId);
//         formData.append("post_id", item?.id);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };
//         const respons = await fetch(`${base_url}${constant.togglePostSave}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                 if (response.status == '1') {
//                     setLoading(false)
//                     successToast(
//                         response?.message || response?.error,
//                     );
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response?.message || response?.error,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };

// const FavoriteUser = async (setLoading, userId) => {
//     setLoading(true);

//     try {
//         const formData = new FormData();
//         formData.append("user_id", userId); // yahan pe dynamic userId use kar rahe hain

//         const response = await fetch(`${base_url}${constant.getallServices}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 // Content-Type mat dena FormData ke sath — browser khud set karta hai
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch services");
//         }

//         return responseData;

//     } catch (error) {
//         console.error("Error in FavoriteUser:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };


// const GetServiesData = async (setLoading, Itemid, userId) => {
//     setLoading(true);

//     try {
//         const formData = new FormData();
//         formData.append("cat_id", Itemid.id); // yahan pe dynamic userId use kar rahe hain

//         const response = await fetch(`${base_url}${constant.getServicesByCategory}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch services");
//         }

//         return responseData;

//     } catch (error) {
//         console.error("Error in FavoriteUser:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };
 
// const EditVendorActivity = async (setLoading, parms) => {
//     setLoading(true);
//      try {
//         const formData = new FormData();
//         formData.append("base_duration", parms?.baseDur);
//         formData.append("rate_per_minute", parms?.rate);
//         formData.append("id", parms?.id); // Dynamic ID passed from caller
//         const response = await fetch(`${base_url}${constant.editSellerVendorActivity}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();
//         console.log("responseData",responseData)
//          if (responseData.status == "1") {
//             successToast(responseData.message);
//         }
//         return responseData;

//     } catch (error) {
//          errorToast(error.message || "An unexpected error occurred.");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };

// const AddVendorActivity = async (setLoading, parms) => {
//     setLoading(true);
// //     activities_id:2
// // sub_activities_id:1
// // service_id:1
// // base_duration:10 
// // rate_per_minute:1 
// console.log("parms",parms);
//     try {
//         const formData = new FormData();
//         formData.append("base_duration", parms?.baseDur);
//         formData.append("rate_per_minute", parms?.rate);
//         formData.append("sub_activities_id", "1");
//         formData.append("service_id", "1");
//         formData.append("activities_id", "2");
//         // formData.append("base_duration", parms?.baseDur);
//         // formData.append("rate_per_minute", parms?.rate);
//         // formData.append("sub_activities_id", "1");
//         // formData.append("service_id", "33");
//         // formData.append("activities_id", parms?.activitiesid);
//         const response = await fetch(`${base_url}${constant.addSellerVendorActivity}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();
//          if (responseData.status == "1") {
//             successToast(responseData.message);
//         }
//         return responseData;

//     } catch (error) {
//          errorToast(error.message || "An unexpected error occurred.");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };

// const DeleteSellerVendorActivityid = async (setLoading, id) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("id", id?.seller_vendor_activities_id);
//       const response = await fetch(`${base_url}${constant.deleteSellerVendorActivity}`, {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Accept": "application/json",
//         },
//       });
  
//       const responseData = await response.json();
//       if (responseData.status == "1") {
//         successToast(responseData.message);
//     }
//       return responseData;
  
//     } catch (error) {
//        errorToast(error.message || "An unexpected error occurred.");
//       return null;
  
//     } finally {
//       setLoading(false);
//     }
//   };
  


// const GetServicesSellerAndCategory = async (setLoading, Itemid, userId) => {
//     setLoading(true);
// // console.log("Ss",Itemid) 
// // cat_id 19,20 
// console.log("userId",userId)
// console.log("Itemid.",Itemid.id)
//     try {
//         const formData = new FormData();
//         formData.append("seller_id", userId); // yahan pe dynamic userId use kar rahe hain
//         //  formData.append("seller_vendor_activities_id", userId); // yahan pe dynamic userId use kar rahe hain
//             formData.append("cat_id", Itemid.id); // yahan pe dynamic userId use kar rahe hain
//           const response = await fetch(`${base_url}${constant.getServicesBySellerAndCategory}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();
//         console.log("responseData",)

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch services");
//         }

//         return responseData;

//     } catch (error) {
//         console.error("Error in FavoriteUser:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };

// const GetCityData = async (setLoading, Itemid) => {
//     setLoading(true);
//     try {
//         const formData = new FormData();
//         formData.append("city_id", Itemid.id); // yahan pe dynamic userId use kar rahe hain
//         const response = await fetch(`${base_url}${constant.getServicesByCity}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch services");
//         }

//         return responseData;

//     } catch (error) {
//         console.error("Error in FavoriteUser:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };


// const GetServiceDataById = async (setLoading, date, Itemid, userId) => {
//     setLoading(true);
//     try {
//         const formData = new FormData();
//         formData.append("service_id", Itemid.id); // yahan pe dynamic userId use kar rahe hain
//         formData.append("date", date); // yahan pe dynamic userId use kar rahe hain
//         const response = await fetch(`${base_url}${constant.getServiceById}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch services");
//         }

//         return responseData;

//     } catch (error) {
//         console.error("Error in FavoriteUser:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };

// const AddfeedbackApi = async (
//     param,
//     setLoading,
// ) => {
//     try {
//         setLoading(true)
//         const myHeaders = new Headers();
//         myHeaders.append("Accept", "application/json");
//         const formData = new FormData();
//         formData.append("user_id", param?.userId);
//         formData.append("rating", param?.rating);
//         formData.append("feedback", param?.messs);
//         const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: formData,
//         };
//         const respons = await fetch(`${base_url}${constant.Addfeedback}`, requestOptions)
//             .then((response) => response.text())
//             .then((res) => {
//                 const response = JSON.parse(res);
//                 if (response.status == '1') {
//                     setLoading(false)
//                     successToast(
//                         response?.message
//                     );
//                     param.navigation.goBack()
//                     // param.navigation.navigate(ScreenNameEnum.TabNavigator)
//                     return response
//                 } else {
//                     setLoading(false)
//                     errorToast(
//                         response?.message || response?.error,
//                     );
//                     return response
//                 }
//             })
//             .catch((error) =>
//                 console.error(error));
//         return respons
//     } catch (error) {
//         setLoading(false)
//         errorToast(
//             'Network error',
//         );
//     }
// };





// const GetAllPackage = async (setLoading) => {
//     setLoading(true);

//     try {
//         const response = await fetch(`${base_url}${constant.get_package}`, {
//             method: "GET",
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch packages");
//         }

//         return responseData;
//     } catch (error) {
//         console.error("Error in GetAllPackage:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;
//     } finally {
//         setLoading(false);
//     }
// };


// const SellerServies = async (setLoading, userId) => {
//     setLoading(true);

//     try {
//         const formData = new FormData();
//         formData.append("seller_id", userId); // yahan pe dynamic userId use kar rahe hain
//         const response = await fetch(`${base_url}${constant.getallServices}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 // Content-Type mat dena FormData ke sath — browser khud set karta hai
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch services");
//         }

//         return responseData;

//     } catch (error) {
//         console.error("Error in FavoriteUser:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };






// const SellerViewDoc = async (setLoading, userId) => {
//     setLoading(true);

//     try {
//         const formData = new FormData();
//         formData.append("seller_id", userId); // yahan pe dynamic userId use kar rahe hain
//         const response = await fetch(`${base_url}${constant.get_seller_document}`, {
//             method: "POST",
//             body: formData,
//             headers: {
//                 // Content-Type mat dena FormData ke sath — browser khud set karta hai
//                 "Accept": "application/json",
//             },
//         });

//         const responseData = await response.json();

//         if (!response.ok) {
//             throw new Error(responseData.message || "Failed to fetch services");
//         }

//         return responseData;

//     } catch (error) {
//         console.error("Error in FavoriteUser:", error);
//         errorToast(error.message || "An unexpected error occurred");
//         return null;

//     } finally {
//         setLoading(false);
//     }
// };

// export { PrivacyPolicyApi,AddVendorActivity, EditVendorActivity,DeleteSellerVendorActivityid,AddServies,DeleteDoc,GetServicesSellerAndCategory,SellerServies,UpdeSellerDocument, AddSellerDocument, GetServiceDataById, GetCityData, GetAllPackage, FavoriteServices,SellerViewDoc, GetServiesData, FavoriteUser, AddfeedbackApi, GetAllServices, GetBanner, GetpostCity, GetCategory, GetaboutusePolicyApi, AddContactUs, ChangePasswordApi, LoginUserApi, UpdateProfile_Api, GetProfile, SinupUserApi, ForgotPassUserApi, OtpUserApi, UpdatePassUserApi }  