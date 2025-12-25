import type { Product } from "@/lib/api/api-service"
import { ProductCard } from "@/components/product-card"

interface ProductListProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (id: number, title: string) => void
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
