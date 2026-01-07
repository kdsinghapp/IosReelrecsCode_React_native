// axiosPublic.js
import axios from 'axios';

const axiosPublic = axios.create({
  baseURL: "http://reelrecs.us-east-1.elasticbeanstalk.com/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosPublic;
