interface Category {
  id: string;
  name: string;
  path: string;
  children?: Category[];
}

interface ApiService {
  cms: {
    getCategories: (depth: number) => Promise<Category[]>;
  };
  auth: {
    refreshToken: (credentials: { refreshToken: string }) => Promise<{
      data: {
        accessToken: string;
        userId: string;
        loginType: string;
        newRefreshToken: string;
      };
    }>;
    // ... other auth methods
  };
  products: {
    createDraft: (productData: any) => Promise<any>;
  };
  // ... other API methods
}

declare const apiService: ApiService;
export default apiService; 