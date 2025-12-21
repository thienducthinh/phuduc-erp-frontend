// Item Brand Service - API calls for Item Brands

import { apiClient, PaginatedResponse } from './apiClient'
import { API_CONFIG } from '../config/api'

export interface ItemBrandData {
  id: string
  code: string
  name: string
  manufacturer: string
  country: string
  website: string
  contactEmail: string
  contactPhone: string
  description: string
  itemCount: number
  status: 'Active' | 'Inactive'
}

export interface ItemBrandCreateRequest {
  code: string
  name: string
  manufacturer: string
  country: string
  website?: string
  contactEmail?: string
  contactPhone?: string
  description?: string
  status: 'Active' | 'Inactive'
}

export interface ItemBrandUpdateRequest extends Partial<ItemBrandCreateRequest> {}

export interface ItemBrandListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: 'Active' | 'Inactive' | 'all'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Item Brand Service
 */
export const itemBrandService = {
  /**
   * Get all item brands with optional filtering and pagination
   */
  async getAll(params?: ItemBrandListParams): Promise<PaginatedResponse<ItemBrandData>> {
    const queryParams: Record<string, string> = {}

    if (params?.page) queryParams.page = params.page.toString()
    if (params?.pageSize) queryParams.pageSize = params.pageSize.toString()
    if (params?.search) queryParams.search = params.search
    if (params?.status && params.status !== 'all') queryParams.status = params.status
    if (params?.sortBy) queryParams.sortBy = params.sortBy
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder

    return apiClient.get<PaginatedResponse<ItemBrandData>>(
      API_CONFIG.endpoints.itemBrands.list,
      queryParams
    )
  },

  /**
   * Get a single item brand by ID
   */
  async getById(id: string): Promise<ItemBrandData> {
    return apiClient.get<ItemBrandData>(
      API_CONFIG.endpoints.itemBrands.detail(id)
    )
  },

  /**
   * Create a new item brand
   */
  async create(data: ItemBrandCreateRequest): Promise<ItemBrandData> {
    return apiClient.post<ItemBrandData>(
      API_CONFIG.endpoints.itemBrands.create,
      data
    )
  },

  /**
   * Update an existing item brand
   */
  async update(id: string, data: ItemBrandUpdateRequest): Promise<ItemBrandData> {
    return apiClient.put<ItemBrandData>(
      API_CONFIG.endpoints.itemBrands.update(id),
      data
    )
  },

  /**
   * Delete an item brand
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_CONFIG.endpoints.itemBrands.delete(id)
    )
  },

  /**
   * Delete multiple item brands
   */
  async deleteMultiple(ids: string[]): Promise<void> {
    return apiClient.post<void>(
      `${API_CONFIG.endpoints.itemBrands.list}/batch-delete`,
      { ids }
    )
  },
}

// Mock data for fallback when API is not available
export const mockBrandsData: Record<string, ItemBrandData> = {
  '1': {
    id: '1',
    code: 'BRD001',
    name: 'Dell',
    manufacturer: 'Dell Inc.',
    country: 'USA',
    website: 'www.dell.com',
    contactEmail: 'support@dell.com',
    contactPhone: '+1-800-624-9897',
    description: 'Leading manufacturer of personal computers and enterprise technology solutions',
    itemCount: 45,
    status: 'Active'
  },
  '2': {
    id: '2',
    code: 'BRD002',
    name: 'HP',
    manufacturer: 'HP Inc.',
    country: 'USA',
    website: 'www.hp.com',
    contactEmail: 'support@hp.com',
    contactPhone: '+1-800-474-6836',
    description: 'Technology company specializing in printing, personal computing, and IT solutions',
    itemCount: 38,
    status: 'Active'
  },
  '3': {
    id: '3',
    code: 'BRD003',
    name: 'Lenovo',
    manufacturer: 'Lenovo Group Ltd.',
    country: 'China',
    website: 'www.lenovo.com',
    contactEmail: 'support@lenovo.com',
    contactPhone: '+86-400-100-6000',
    description: 'Global technology company producing PCs, tablets, smartphones, and data center products',
    itemCount: 52,
    status: 'Active'
  },
  '4': {
    id: '4',
    code: 'BRD004',
    name: 'Logitech',
    manufacturer: 'Logitech International S.A.',
    country: 'Switzerland',
    website: 'www.logitech.com',
    contactEmail: 'support@logitech.com',
    contactPhone: '+41-21-863-5111',
    description: 'Swiss manufacturer of computer peripherals and software',
    itemCount: 67,
    status: 'Active'
  },
  '5': {
    id: '5',
    code: 'BRD005',
    name: 'Samsung',
    manufacturer: 'Samsung Electronics',
    country: 'South Korea',
    website: 'www.samsung.com',
    contactEmail: 'support@samsung.com',
    contactPhone: '+82-2-2255-0114',
    description: 'Multinational electronics company producing consumer and business electronics',
    itemCount: 29,
    status: 'Inactive'
  }
}

export const emptyBrand: Omit<ItemBrandData, 'id' | 'itemCount'> = {
  code: '',
  name: '',
  manufacturer: '',
  country: 'USA',
  website: '',
  contactEmail: '',
  contactPhone: '',
  description: '',
  status: 'Active'
}
