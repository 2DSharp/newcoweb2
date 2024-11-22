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
  // ... other API methods
}

declare const apiService: ApiService;
export default apiService; 