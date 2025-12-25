import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { productApi, type Product } from "@/lib/api/api-service"

interface ProductState {
  items: Product[]
  loading: boolean
  error: string | null
  searchQuery: string
  categoryFilter: string
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
  categoryFilter: "all",
}

// Async thunks for API operations
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  return await productApi.getAllProducts()
})

export const createProduct = createAsyncThunk("products/createProduct", async (product: Omit<Product, "id">) => {
  return await productApi.createProduct(product)
})

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }: { id: number; product: Partial<Product> }) => {
    return await productApi.updateProduct(id, product)
  },
)

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: number) => {
  await productApi.deleteProduct(id)
  return id
})

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create product"
      })

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update product"
      })

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete product"
      })
  },
})

export const { setSearchQuery, setCategoryFilter } = productSlice.actions
export default productSlice.reducer
