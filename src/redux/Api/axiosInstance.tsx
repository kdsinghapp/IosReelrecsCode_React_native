// axiosInstance.js
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://reelrecs.us-east-1.elasticbeanstalk.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;



export const  BASE_IMAGE_URL = "https://reelrecs.s3.us-east-1.amazonaws.com/static/users";

