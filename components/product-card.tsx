"use client"

import { Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/api/api-service"

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (id: number, title: string) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.title)}`}
            alt={product.title}
            className="h-full w-full object-contain p-4"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <Badge variant="secondary" className="mb-2 text-xs">
          {product.category}
        </Badge>
        <h3 className="line-clamp-2 text-balance font-semibold text-foreground">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">${product.price.toFixed(2)}</span>
          {product.rating && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-medium text-foreground">{product.rating.rate}</span>
              <span className="text-muted-foreground">({product.rating.count})</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-border p-4">
        <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent" onClick={() => onEdit?.(product)}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1 gap-2"
          onClick={() => onDelete?.(product.id, product.title)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
