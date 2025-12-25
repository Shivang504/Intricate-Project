// Generic API service layer for all HTTP requests
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface ApiConfig {
  method: HttpMethod
  body?: unknown
  headers?: Record<string, string>
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, config: ApiConfig): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const options: RequestInit = {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    }

    if (config.body && config.method !== "GET") {
      options.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Handle empty responses (e.g., 204 No Content for DELETE requests)
      const contentType = response.headers.get("content-type")
      const text = await response.text()
      
      // If response is empty, return empty object
      if (!text || text.trim() === "") {
        return {} as T
      }

      // Try to parse as JSON, return empty object if parsing fails
      try {
        return JSON.parse(text) as T
      } catch (parseError) {
        // If it's not JSON but we have content, return empty object for DELETE requests
        if (config.method === "DELETE") {
          return {} as T
        }
        throw parseError
      }
    } catch (error) {
      console.error("[v0] API request failed:", error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: data })
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body: data })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Fake Store API instance
export const fakeStoreApi = new ApiService("https://fakestoreapi.com")

// Product API methods
export const productApi = {
  getAllProducts: () => fakeStoreApi.get<Product[]>("/products"),
  getProduct: (id: number) => fakeStoreApi.get<Product>(`/products/${id}`),
  createProduct: (product: Omit<Product, "id">) => fakeStoreApi.post<Product>("/products", product),
  updateProduct: (id: number, product: Partial<Product>) => fakeStoreApi.put<Product>(`/products/${id}`, product),
  deleteProduct: (id: number) => fakeStoreApi.delete<Product>(`/products/${id}`),
  getCategories: () => fakeStoreApi.get<string[]>("/products/categories"),
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: {
    rate: number
    count: number
  }
}
