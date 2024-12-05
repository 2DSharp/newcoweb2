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

interface DiscountProduct {
  id: string;
  name: string;
}

interface DiscountCondition {
  type: "NO_CONDITION" | "MIN_PURCHASE_QTY" | "MIN_PURCHASE_AMOUNT" | "REFERRAL";
  startDate: string;
  endDate: string;
  minPurchaseAmount: number | null;
  minPurchaseQty: number | null;
  referralCode: string | null;
}

interface Discount {
  id: string;
  name: string;
  discountType: "PERCENTAGE" | "FIXED" | "BUY_AND_GET_FREE";
  active: boolean;
  applicableDiscount: number;
  createdAt: string;
  updatedAt: string | null;
  triggerProducts: DiscountProduct[];
  targetProducts: DiscountProduct[];
  condition: DiscountCondition;
}

interface ApiService {
  cms: {
    getStateList: () => Promise<ApiResponse<any>>;
    getCategories: (level: number) => Promise<ApiResponse<any>>;
  };

  auth: {
    login: (credentials: LoginCredentials) => Promise<ApiResponse<LoginResponse>>;
    refreshToken: (credentials: { refreshToken: string }) => Promise<ApiResponse<any>>;
    register: (userData: RegisterData) => Promise<ApiResponse<any>>;
    verifyOtp: (data: OtpVerificationData) => Promise<ApiResponse<any>>;
    requestOtp: (phone: string) => Promise<ApiResponse<string>>;
  };

  identity: {
    requestOtp: (phone: string) => Promise<ApiResponse<string>>;
    verifyOtp: (verificationId: string, nonce: string) => Promise<ApiResponse<AuthResponse>>;
    logout: () => Promise<void>;
  };

  store: {
    create: (storeData: any) => Promise<ApiResponse<any>>;
    update: (storeId: string, storeData: any) => Promise<ApiResponse<any>>;
    getDetails: (storeId: string) => Promise<ApiResponse<any>>;
  };

  profile: {
    get: () => Promise<ApiResponse<any>>;
    update: (profileData: any) => Promise<ApiResponse<any>>;
  };

  products: {
    createDraft: (productData: any) => Promise<ApiResponse<any>>;
    updateDraft: (draftId: string, productData: any) => Promise<ApiResponse<any>>;
    getDrafts: () => Promise<ApiResponse<any>>;
    getDraft: (draftId: string) => Promise<ApiResponse<any>>;
    deleteDraft: (draftId: string) => Promise<ApiResponse<any>>;
    publishDraft: (draftId: string) => Promise<ApiResponse<any>>;
    getList: () => Promise<ApiResponse<any>>;
    getSellerProductDetails: (productId: string) => Promise<ApiResponse<any>>;
    updateStock: (productId: string, variantId: string, quantity: number) => Promise<ApiResponse<any>>;
    getProduct: (productId: string) => Promise<ApiResponse<any>>;
    updateProduct: (productId: string, productData: any) => Promise<ApiResponse<any>>;
    updatePricing: (productId: string, variants: any[]) => Promise<ApiResponse<any>>;
    updateActivation: (productId: string, variantId: string, active: boolean) => Promise<ApiResponse<any>>;
  };

  discounts: {
    create: (discountData: any) => Promise<ApiResponse<any>>;
    getList: () => Promise<ApiResponse<any>>;
    activate: (discountId: string) => Promise<ApiResponse<any>>;
    deactivate: (discountId: string) => Promise<ApiResponse<any>>;
  };

  accounts: {
    getAddresses: () => Promise<ApiResponse<Address[]>>;
    addAddress: (addressData: AddressInput) => Promise<ApiResponse<Address>>;
  };

  orders: {
    create: (orderData: OrderInput) => Promise<ApiResponse<{ orderId: string }>>;
  };

  files: {
    upload: (formData: FormData) => Promise<ApiResponse<any>>;
  };
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  loginType: string;
  expiry: string;
}

interface Address {
  id: string;
  label: string | null;
  name: string | null;
  phone: string | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: number;
  landmark: string;
  default: boolean;
}

interface AddressInput {
  label?: string;
  name?: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  isDefault: boolean;
}

interface OrderInput {
  item: {
    product: string;
    variantId: string;
    quantity: number;
    pricingVariantId: string;
  };
  paymentMethod: string;
  deliveryAddress: Address;
  billingAddress: Address;
}

declare const apiService: ApiService;
export default apiService; 