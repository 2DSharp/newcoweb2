interface ApiResponse<T> {
  successful: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

interface Category {
  id: string;
  name: string;
  path: string;
  children?: Category[];
}

interface State {
  id: string;
  name: string;
  code: string;
}

interface LoginCredentials {
  phone: string;
  password: string;
  loginType: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  loginType: string;
}

interface RegisterData {
  phone: string;
  password: string;
  email: string;
  name: string;
}

interface OtpVerificationData {
  phone: string;
  otp: string;
}

interface StoreData {
  name: string;
  description?: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  // Add other profile fields
}

interface ProductDraft {
  id?: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  finalCategory: string;
  manufacturingType: string;
  variations?: ProductVariation[];
  keywords?: string[];
  audience?: string[];
  materialType?: string[];
}

interface ProductVariation {
  name: string;
  price: number;
  stock: number;
  sku: string;
  images: string[];
}

interface ApiService {
  cms: {
    getStateList: () => Promise<ApiResponse<State[]>>;
    getCategories: (level: number) => Promise<ApiResponse<Category[]>>;
  };

  auth: {
    login: (credentials: LoginCredentials) => Promise<ApiResponse<LoginResponse>>;
    refreshToken: (credentials: { refreshToken: string }) => Promise<ApiResponse<{
      accessToken: string;
      userId: string;
      loginType: string;
      newRefreshToken: string;
    }>>;
    register: (userData: RegisterData) => Promise<ApiResponse<any>>;
    verifyOtp: (data: OtpVerificationData) => Promise<ApiResponse<any>>;
  };

  store: {
    create: (storeData: StoreData) => Promise<ApiResponse<any>>;
    update: (storeId: string, storeData: Partial<StoreData>) => Promise<ApiResponse<any>>;
    getDetails: (storeId: string) => Promise<ApiResponse<StoreData>>;
  };

  profile: {
    get: () => Promise<ApiResponse<ProfileData>>;
    update: (profileData: Partial<ProfileData>) => Promise<ApiResponse<ProfileData>>;
  };

  products: {
    createDraft: (productData: ProductDraft) => Promise<ApiResponse<string>>;
    updateDraft: (draftId: string, productData: Partial<ProductDraft>) => Promise<ApiResponse<any>>;
    getDraft: (draftId: string) => Promise<ApiResponse<ProductDraft>>;
    deleteDraft: (draftId: string) => Promise<ApiResponse<any>>;
    publishDraft: (draftId: string) => Promise<ApiResponse<any>>;
  };
}

declare const apiService: ApiService;
export default apiService; 