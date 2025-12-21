// API Configuration for Azure Backend

// Environment variables - configure these in your .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-azure-api.azurewebsites.net/api'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'

// Azure AD B2C Configuration (if using Azure AD authentication)
export const azureAdConfig = {
  clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID || '',
  tenantId: import.meta.env.VITE_AZURE_AD_TENANT_ID || '',
  redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI || window.location.origin,
}

// API Endpoints
export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  version: API_VERSION,
  endpoints: {
    // Item Brands
    itemBrands: {
      list: `/item-brands`,
      detail: (id: string) => `/item-brands/${id}`,
      create: `/item-brands`,
      update: (id: string) => `/item-brands/${id}`,
      delete: (id: string) => `/item-brands/${id}`,
    },
    // Item Categories
    itemCategories: {
      list: `/item-categories`,
      detail: (id: string) => `/item-categories/${id}`,
      create: `/item-categories`,
      update: (id: string) => `/item-categories/${id}`,
      delete: (id: string) => `/item-categories/${id}`,
    },
    // Items
    items: {
      list: `/items`,
      detail: (id: string) => `/items/${id}`,
      create: `/items`,
      update: (id: string) => `/items/${id}`,
      delete: (id: string) => `/items/${id}`,
    },
    // Purchase Orders
    purchaseOrders: {
      list: `/purchase-orders`,
      detail: (id: string) => `/purchase-orders/${id}`,
      create: `/purchase-orders`,
      update: (id: string) => `/purchase-orders/${id}`,
      delete: (id: string) => `/purchase-orders/${id}`,
    },
    // Sales Orders
    salesOrders: {
      list: `/sales-orders`,
      detail: (id: string) => `/sales-orders/${id}`,
      create: `/sales-orders`,
      update: (id: string) => `/sales-orders/${id}`,
      delete: (id: string) => `/sales-orders/${id}`,
    },
  }
}

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}/${API_CONFIG.version}${endpoint}`
}

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken')
}

// Default headers for API requests
export const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}
