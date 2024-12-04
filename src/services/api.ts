import { ApiResponse } from "@/types/api";
import  unauthenticatedApiClient from "./api.js";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  loginType: string;
  expiry: string;
}

const apiService = {
  // ... other services


  // ... rest of the services
};

export default apiService;
