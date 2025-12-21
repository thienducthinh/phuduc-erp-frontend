// Item Category Service - API calls for Item Categories

import { apiClient, PaginatedResponse } from './apiClient'
import { API_CONFIG } from '../config/api'

export interface ItemCategoryData {
  id: string
  code: string
  name: string
  description: string
  parentCategory: string
  itemCount: number
  status: 'Active' | 'Inactive'
}

export interface ItemCategoryCreateRequest {
  code: string
  name: string
  description?: string
  parentCategory?: string
  status: 'Active' | 'Inactive'
}

export interface ItemCategoryUpdateRequest extends Partial<ItemCategoryCreateRequest> {}

export interface ItemCategoryListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: 'Active' | 'Inactive' | 'all'
  parentCategory?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Item Category Service
 */
export const itemCategoryService = {
  /**
   * Get all item categories with optional filtering and pagination
   */
  async getAll(params?: ItemCategoryListParams): Promise<PaginatedResponse<ItemCategoryData>> {
    const queryParams: Record<string, string> = {}

    if (params?.page) queryParams.page = params.page.toString()
    if (params?.pageSize) queryParams.pageSize = params.pageSize.toString()
    if (params?.search) queryParams.search = params.search
    if (params?.status && params.status !== 'all') queryParams.status = params.status
    if (params?.parentCategory) queryParams.parentCategory = params.parentCategory
    if (params?.sortBy) queryParams.sortBy = params.sortBy
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder

    return apiClient.get<PaginatedResponse<ItemCategoryData>>(
      API_CONFIG.endpoints.itemCategories.list,
      queryParams
    )
  },

  /**
   * Get a single item category by ID
   */
  async getById(id: string): Promise<ItemCategoryData> {
    return apiClient.get<ItemCategoryData>(
      API_CONFIG.endpoints.itemCategories.detail(id)
    )
  },

  /**
   * Create a new item category
   */
  async create(data: ItemCategoryCreateRequest): Promise<ItemCategoryData> {
    return apiClient.post<ItemCategoryData>(
      API_CONFIG.endpoints.itemCategories.create,
      data
    )
  },

  /**
   * Update an existing item category
   */
  async update(id: string, data: ItemCategoryUpdateRequest): Promise<ItemCategoryData> {
    return apiClient.put<ItemCategoryData>(
      API_CONFIG.endpoints.itemCategories.update(id),
      data
    )
  },

  /**
   * Delete an item category
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(
      API_CONFIG.endpoints.itemCategories.delete(id)
    )
  },

  /**
   * Delete multiple item categories
   */
  async deleteMultiple(ids: string[]): Promise<void> {
    return apiClient.post<void>(
      `${API_CONFIG.endpoints.itemCategories.list}/batch-delete`,
      { ids }
    )
  },
}

// Mock data for fallback when API is not available
export const mockCategoriesData: Record<string, ItemCategoryData> = {
  '1': {
    id: '1',
    code: 'CAT001',
    name: 'Electronics',
    description: 'Electronic devices and components',
    parentCategory: 'None',
    itemCount: 125,
    status: 'Active'
  },
  '2': {
    id: '2',
    code: 'CAT002',
    name: 'Accessories',
    description: 'Computer and electronic accessories',
    parentCategory: 'Electronics',
    itemCount: 89,
    status: 'Active'
  },
  '3': {
    id: '3',
    code: 'CAT003',
    name: 'Cables',
    description: 'Various types of cables and connectors',
    parentCategory: 'Accessories',
    itemCount: 45,
    status: 'Active'
  },
  '4': {
    id: '4',
    code: 'CAT004',
    name: 'Office Supplies',
    description: 'General office supplies and stationery',
    parentCategory: 'None',
    itemCount: 67,
    status: 'Active'
  },
  '5': {
    id: '5',
    code: 'CAT005',
    name: 'Furniture',
    description: 'Office and workstation furniture',
    parentCategory: 'None',
    itemCount: 23,
    status: 'Inactive'
  }
}

export const emptyCategory: Omit<ItemCategoryData, 'id' | 'itemCount'> = {
  code: '',
  name: '',
  description: '',
  parentCategory: 'None',
  status: 'Active'
}
