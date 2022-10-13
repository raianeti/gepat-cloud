import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "http://ld-patrimony-management-1460998202.us-east-1.elb.amazonaws.com/api/v1"
});

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;