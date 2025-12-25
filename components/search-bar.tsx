"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setSearchQuery } from "@/lib/store/product-slice"
import { selectSearchQuery } from "@/lib/store/selectors"

export function SearchBar() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchQuery)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search products by title..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="pl-10"
      />
    </div>
  )
}
