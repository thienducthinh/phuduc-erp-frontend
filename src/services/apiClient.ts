// Base API Client for making HTTP requests to Azure backend

import { getApiUrl, getDefaultHeaders } from '../config/api'

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Base API client for making HTTP requests
 */
class ApiClient {
  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    try {
      const url = new URL(getApiUrl(endpoint))

      // Add query parameters
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key]) {
            url.searchParams.append(key, params[key])
          }
        })
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: getDefaultHeaders(),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: getDefaultHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
        headers: getDefaultHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: getDefaultHeaders(),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle response and extract data
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Check if response is ok (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    // Parse JSON response
    const data = await response.json()

    // If response is wrapped in ApiResponse format
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T
    }

    return data as T
  }

  /**
   * Handle errors
   */
  private handleError(error: any): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    if (error instanceof Error) {
      return new ApiError(error.message)
    }

    return new ApiError('An unexpected error occurred')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
