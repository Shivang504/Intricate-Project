import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export const selectProducts = (state: RootState) => state.products.items
export const selectLoading = (state: RootState) => state.products.loading
export const selectError = (state: RootState) => state.products.error
export const selectSearchQuery = (state: RootState) => state.products.searchQuery
export const selectCategoryFilter = (state: RootState) => state.products.categoryFilter

// Memoized selector for filtered products
export const selectFilteredProducts = createSelector(
  [selectProducts, selectSearchQuery, selectCategoryFilter],
  (products, searchQuery, categoryFilter) => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  },
)
