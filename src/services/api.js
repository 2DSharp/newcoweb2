import { ApiResponse } from '../types/api';
import axios from 'axios';
import {AuthService} from "@/services/authService";

// API Configuration
const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_BASE_API_BASEURL,
    timeout: parseInt(process.env.VITE_API_TIMEOUT || '60000'),
    headers: {
        'Content-Type': 'application/json',
    },
};

// Create a function to get authenticated client with explicit context
const getContextualApiClient = (isSellerContext = false) => {
  const client = axios.create(API_CONFIG);
  
  // Request interceptor with context-based token selection
  client.interceptors.request.use(
    (config) => {
      // Select auth data based on the provided context parameter
      const authDataKey = isSellerContext ? 'seller_data' : 'buyer_data';
      const authData = localStorage.getItem(authDataKey);
      
      if (authData) {
        const data = JSON.parse(authData);
        config.headers.Authorization = `Bearer ${data.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor with token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if error is 401 and we haven't tried refreshing yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Use the context-specific auth data
          const authDataKey = isSellerContext ? 'seller_data' : 'buyer_data';
          const authData = localStorage.getItem(authDataKey);

          if (!authData) {
            throw new Error('No auth data found');
          }

          const { userId, loginType } = JSON.parse(authData);

          // Get refresh token from HTTP-only cookie via Next.js API
          const refreshTokenResponse = await fetch('/api/auth/get-refresh-token');
          const { refreshToken } = await refreshTokenResponse.json();

          if (!refreshToken) {
            throw new Error('No refresh token found');
          }

          // Call backend refresh token endpoint
          const response = await unauthenticatedApiClient.post('/identity/refresh-token', {
            userId,
            loginType,
            token: refreshToken
          });

          const { accessToken, userId: newUserId, loginType: newLoginType } = response.data.data;
          const newRefreshToken = response.data.data.refreshToken;

          // Store new refresh token in HTTP-only cookie
          await fetch('/api/auth/set-refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: newRefreshToken }),
          });

          // Update localStorage with new access token and user info
          localStorage.setItem(authDataKey, JSON.stringify({
            accessToken,
            userId: newUserId,
            loginType: newLoginType
          }));

          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Retry the original request
          return client(originalRequest);
        } catch (refreshError) {
          // Clear auth data and redirect to login
          localStorage.removeItem(authDataKey);
          // Clear refresh token cookie
          await fetch('/api/auth/set-refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: null }),
          });
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
  
  return client;
};

// Create Axios instance
const authenticatedApiClient = axios.create(API_CONFIG);

export const authenticatedFileUploadClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADV_API_BASEURL
});

export const unauthenticatedApiClient = axios.create({
    baseURL: API_CONFIG.baseURL
});

export const unauthenticatedSearchClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADV_API_BASEURL
});

// Request Interceptor
authenticatedApiClient.interceptors.request.use(
    (config) => {
        // Check if the URL contains '/seller/' to determine which auth data to use
        const isSellerEndpoint = config.url?.includes('/seller/');
        
        // Try to get the appropriate auth data
        const authData = isSellerEndpoint 
            ? localStorage.getItem('seller_data')
            : localStorage.getItem('buyer_data');
        
        if (authData) {
            const data = JSON.parse(authData);
            config.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor with token refresh
authenticatedApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Determine which auth data to use based on the endpoint
                const isSellerEndpoint = originalRequest.url?.includes('/seller/');
                const authDataKey = isSellerEndpoint ? 'seller_data' : 'buyer_data';
                const authData = localStorage.getItem(authDataKey);

                if (!authData) {
                    throw new Error('No auth data found');
                }

                const { userId, loginType } = JSON.parse(authData);

                // Get refresh token from HTTP-only cookie via Next.js API
                const refreshTokenResponse = await fetch('/api/auth/get-refresh-token');
                const { refreshToken } = await refreshTokenResponse.json();

                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                // Call backend refresh token endpoint
                const response = await unauthenticatedApiClient.post('/identity/refresh-token', {
                    userId,
                    loginType,
                    token: refreshToken
                });

                const { accessToken, userId: newUserId, loginType: newLoginType } = response.data.data;
                const newRefreshToken = response.data.data.refreshToken;

                // Store new refresh token in HTTP-only cookie
                await fetch('/api/auth/set-refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: newRefreshToken }),
                });

                // Update localStorage with new access token and user info
                localStorage.setItem(authDataKey, JSON.stringify({
                    accessToken,
                    userId: newUserId,
                    loginType: newLoginType
                }));

                // Update the authorization header
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request
                return authenticatedApiClient(originalRequest);
            } catch (refreshError) {
                // Clear auth data and redirect to login
                localStorage.clear();
                // Clear refresh token cookie
                await fetch('/api/auth/set-refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: null }),
                });
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
// API Services
export const apiService = {

    cms: {
        getStateList: async () => {
            const response = await unauthenticatedApiClient.get('/public/cms/states');
            return response.data;
        },
        
        getCategories: async (level) => {
            const response = await unauthenticatedApiClient.get(`/public/cms/categories?level=${level}`);
            return response.data;
        },

        getHomepage: async () => {
            try {
                const response = await unauthenticatedApiClient.get('/public/cms/home');
                return response.data;
            } catch (error) {
                console.error('Error fetching homepage data:', error);
                throw error;
            }
        },
    },
    search: {
        query: async (searchParams) => {
            try {
                // If searchParams is an object with multiple parameters
                let url = '/search/';
                
                if (typeof searchParams === 'object' && searchParams !== null && !(searchParams instanceof String)) {
                    const queryParams = new URLSearchParams();
                    
                    // Properly encode each parameter
                    Object.entries(searchParams).forEach(([key, value]) => {
                        queryParams.append(encodeURIComponent(key), encodeURIComponent(value));
                    });
                    
                    const queryString = queryParams.toString();
                    url = `/search/?${queryString}`;
                } else {
                    // Backward compatibility for simple string queries
                    const searchTerm = typeof searchParams === 'string' ? searchParams : searchParams?.q || '';
                    url = `/search/?q=${encodeURIComponent(searchTerm)}`;
                }
                
                console.log('Sending search request to URL:', url);
                const response = await unauthenticatedSearchClient.get(url);
                console.log('Raw search API response:', response);
                
                // Handle different response formats
                const data = response.data;
                console.log('Response data structure:', {
                    isArray: Array.isArray(data),
                    hasResults: data && 'results' in data,
                    hasFilters: data && 'filters' in data
                });
                
                // Return a properly formatted response
                if (Array.isArray(data)) {
                    // If the API returns an array of results directly
                    return {
                        results: data,
                        filters: {}
                    };
                }
                
                return data;
            } catch (error) {
                console.error('Error in search query:', error);
                // Return empty results on error
                return {
                    results: [],
                    filters: {}
                };
            }
        },
        getSuggestions: async (searchTerm) => {
            const encodedTerm = encodeURIComponent(searchTerm);
            const response = await unauthenticatedSearchClient.get(`/search/suggest?q=${encodedTerm}`);
            return response.data;
        },
        getFilters: async (parentCategory) => {
            try {
                const encodedCategory = encodeURIComponent(parentCategory);
                const url = `/search/filter?parentCategory=${encodedCategory}`;
                console.log('Sending filter request to URL:', url);
                
                const response = await unauthenticatedSearchClient.get(url);
                return response.data;
            } catch (error) {
                console.error('Error fetching filters:', error);
                return {
                    filters: []
                };
            }
        },
    },
    // Auth endpoints
    auth: {
        login: async (credentials) => {
            try {
                const response = await unauthenticatedApiClient.post('/identity/login', {
                    phone: credentials.phone,
                    password: credentials.password,
                    loginType: credentials.loginType
                });

                if (response.data.successful) {
                    const { accessToken, refreshToken, userId, loginType } = response.data.data;

                    // Store refresh token in HTTP-only cookie
                    await fetch('/api/auth/set-refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refreshToken }),
                    });

                    if (loginType === 'BUYER') {
                        localStorage.setItem('buyer_data', JSON.stringify({
                            accessToken,
                            userId,
                            loginType
                        }));
                    } else {
                        // Store access token and user info in localStorage
                        localStorage.setItem('seller_data', JSON.stringify({
                            accessToken,
                            userId,
                            loginType
                        }));

                    }
                
                    return response.data;
                }
                
                throw new Error('Login failed');
            } catch (error) {
                throw error;
            }
        },

        refreshToken: async (credentials) => {
            const response = await unauthenticatedApiClient.post( '/identity/refresh-token', credentials);
            return response.data;
        },
        register: async (userData) => {
            const response = await unauthenticatedApiClient.post('/seller/accounts/register', userData);
            return response.data;
        },
        verifyOtp: async (data) => {
            const response = await unauthenticatedApiClient.post('/seller/accounts/verify-contact', data);
            return response.data;
        },
    },
    identity: {
        requestOtp: async (phone) => {
            console.log("Here")
            try {
                const response = await unauthenticatedApiClient.post('/identity/login/otp', {
                    phone
                });
    
                return response.data;
            } catch (error) {
                return {
                    status: 'FAIL',
                    message: error?.response?.data?.message || 'Failed to send OTP',
                    successful: false
                };
            }
        },
    
        verifyOtp: async (verificationId, nonce, fullName) => {
            try {
                const requestBody = {
                    verificationId,
                    nonce
                };
    
                // Add fullName to the request body if provided
                if (fullName) {
                    requestBody.fullName = fullName;
                }
    
                const response = await unauthenticatedApiClient.post('/identity/verify-contact', requestBody);
    
                const data = response.data;
    
                if (data.successful) {
                    // Set the refresh token in HTTP-only cookie
                    await fetch('/api/auth/set-refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refreshToken: data.data.refreshToken }),
                    });
    
                    // Store access token in memory or secure storage
                }
    
                return data;
            } catch (error) {
                return {
                    status: 'FAIL',
                    message: error?.response?.data?.message || 'Failed to verify OTP',
                    successful: false
                };
            }
        },
    
        logout: async () => {
            try {
                // Clear HTTP-only cookie
                await fetch('/api/auth/set-refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: '' }),
                });
    
                // Clear local storage
                localStorage.removeItem('access_token');
                localStorage.removeItem('auth_data');
                localStorage.removeItem('buyer_data');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        },
    
    },
    
    // Store endpoints
    store: {
        create: async (storeData) => {
            const response = await authenticatedApiClient.post('/seller/store/', storeData);
            return response.data;
        },
        update: async (storeId, storeData) => {
            const response = await authenticatedApiClient.put(`/seller/store/`, storeData);
            return response.data;
        },
        getDetails: async () => {
            const response = await authenticatedApiClient.get(`/seller/store/`);
            return response.data;
        },
        getPublicDetails: async (storeId) => {
            const response = await unauthenticatedApiClient.get(`/public/stores/${storeId}`);
            return response.data;
        }
    },

    // User profile endpoints
    profile: {
        get: async () => {
            const response = await authenticatedApiClient.get('/profile');
            return response.data;
        },
        update: async (profileData) => {
            const response = await authenticatedApiClient.put('/profile', profileData);
            return response.data;
        },
    },

    products: {
        createDraft: async (productData) => {
            const response = await authenticatedApiClient.post('/seller/products/drafts', productData);
            return response.data;
        },
        updateDraft: async (draftId, productData) => {
            const response = await authenticatedApiClient.put(`/seller/products/drafts`,{ ...productData, id: draftId});
            return response.data;
        },
        getDrafts: async () => {
            const response = await authenticatedApiClient.get(`/seller/products/drafts`);
            return response.data;
        },
        getDraft: async (draftId) => {
            const response = await authenticatedApiClient.get(`/seller/products/drafts/${draftId}`);
            return response.data;
        },
        deleteDraft: async (draftId) => {
            const response = await authenticatedApiClient.delete(`/seller/products/drafts/${draftId}`);
            return response.data;
        },

        publishDraft: async (draftId) => {
            const response = await authenticatedApiClient.post(`/seller/products/drafts/${draftId}/publish`);
            return response.data;
        },
        getList: async () => {
            const response = await authenticatedApiClient.get('/seller/products/');
            return response.data;
        },
        getSellerProductDetails: async (productId) => {
            const response = await authenticatedApiClient.get(`/seller/products/${productId}`);
            return response.data;
        },
        updateStock: async (productId, variantId, quantity) => {
            const response = await authenticatedApiClient.put(`/seller/products/${productId}/stock`, {
                variantId,
                quantity
            });
            return response.data;
        },
        getProduct: async (productId) => {
            try {
                const response = await unauthenticatedApiClient.get(`/public/products/${productId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching product:', error);
                throw error;
            }
        },
        updateProduct: async (productId, productData) => {
            const response = await authenticatedApiClient.put(`/seller/products/${productId}`, productData);
            return response.data;
        },
        updatePricing: async (productId, variants) => {
            const response = await authenticatedApiClient.put(`/seller/products/${productId}/pricing`, {
                variants
            });
            return response.data;
        },
        updateActivation: async (productId, variantId, active) => {
            const response = await authenticatedApiClient.put(`/seller/products/activation`, {
                productId,
                variantId,
                active
            });
            return response.data;
        },
    },
    discounts: {
        create: async (discountData) => {
            const response = await authenticatedApiClient.post('/seller/products/discounts', discountData);
            return response.data;
        },
        getList: async () => {
            const response = await authenticatedApiClient.get('/seller/products/discounts');
            return response.data;
        },
        activate: async (discountId) => {
            const response = await authenticatedApiClient.put(`/seller/products/discounts/${discountId}/activate`);
            return response.data;
        },
        deactivate: async (discountId) => {
            const response = await authenticatedApiClient.delete(`/seller/products/discounts/${discountId}`);
            return response.data;
        },
    },
    accounts: {
        getAddresses: async (isSellerContext = false) => {
          // Get the client with the correct context
          const client = getContextualApiClient(isSellerContext);
          // Use the endpoint - no need to modify the path as we're using the correct token
          const response = await client.get('/accounts/addresses/');
          return response.data;
        },
    
        addAddress: async (addressData, isSellerContext = false) => {
          // Get the client with the correct context
          const client = getContextualApiClient(isSellerContext);
          // Use the endpoint - no need to modify the path as we're using the correct token
          const response = await client.post('/accounts/addresses', addressData);
          return response.data;
        },

        updateAddress: async (addressId, addressData, isSellerContext = false) => {
            // Get the client with the correct context
            const client = getContextualApiClient(isSellerContext);
            // Use the endpoint - no need to modify the path as we're using the correct token
            const response = await client.put(`/accounts/addresses/${addressId}`, addressData);
            return response.data;
        },

        getProfile: async (isSellerContext = false) => {
          // Get the client with the correct context
          const client = getContextualApiClient(isSellerContext);
          // Use the endpoint - no need to modify the path as we're using the correct token
          const response = await client.get('/accounts/profile');
          return response.data;
        },
    },
    
    orders: {
        create: async (orderData) => {
          const response = await authenticatedApiClient.post('/buy/order', orderData);
          return response.data;
        },
        getDetails: async (orderId) => {
          const response = await authenticatedApiClient.get(`/buy/order/${orderId}`);
          return response.data;
        },
        getList: async () => {
          const response = await authenticatedApiClient.get('/buy/order');
          return response.data;
        },
        getSellerOrders: async (status) => {
          const response = await authenticatedApiClient.get('/seller/orders/', {
            params: { status }
          });
          return response.data;
        },
        updateOrderStatus: async (subOrderId, status) => {
          const response = await authenticatedApiClient.put('/seller/orders/fulfill', {
            subOrderId,
            status
          });
          return response.data;
        },
        processOrderItem: async (orderItemId, subOrderId, quantity, customizationVerified) => {
          const response = await authenticatedApiClient.post('/seller/orders/process-item', {
            orderItemId,
            subOrderId,
            quantity,
            customizationVerified
          });
          return response.data;
        },
    },
    
    files: {
        upload: async (formData) => {
            const response = await authenticatedFileUploadClient.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
    },

    // AI endpoints
    ai: {
        generateMetadata: async (imageIds) => {
            const response = await authenticatedFileUploadClient.post('/ai/generate-metadata', {
                image_ids: imageIds
            });
            return response.data;
        }
    },

    // Cart endpoints
    cart: {
        addItem: async (itemData) => {
            const response = await authenticatedApiClient.post('/buy/cart/item', itemData);
            return response.data;
        },
        addItems: async (items) => {
            const response = await authenticatedApiClient.post('/buy/cart', items);
            return response.data;
        },
        updateQuantity: async (variantId, quantity) => {
            const response = await authenticatedApiClient.patch(`/buy/cart/item/${variantId}/quantity/${quantity}`, { });
            return response.data;
        },
        getItems: async () => {
            const response = await authenticatedApiClient.get('/buy/cart');
            return response.data;
        },
        clearCart: async () => {
            const response = await authenticatedApiClient.delete('/cart/items');
            return response.data;
        }
    },

    reviews: {
        getProductReviews: async (productId) => {
            const buyerData = localStorage.getItem('buyer_data');
            if (buyerData) {
                const response = await authenticatedApiClient.get(`/reviews/product/${productId}`);
                return response.data;
            } else {
                const response = await unauthenticatedApiClient.get(`/public/reviews/product/${productId}`);
                return response.data;
            }
        },
        addReview: async (reviewData) => {
            const response = await authenticatedApiClient.post('/buy/reviews/add', reviewData);
            return response.data;
        }
    },
};

export default apiService;