"use client"

import { Package, TrendingUp, DollarSign, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Product } from "@/lib/api/api-service"

interface StatsCardsProps {
  products: Product[]
}

export function StatsCards({ products }: StatsCardsProps) {
  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.price, 0)
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0
  const inStock = products.filter((p) => p.rating && p.rating.count > 0).length

  const stats = [
    {
      label: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Average Price",
      value: `$${avgPrice.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "In Stock",
      value: inStock.toString(),
      icon: ShoppingCart,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4 sm:p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">{stat.value}</p>
            </div>
            <div className={`rounded-full p-2 sm:p-3 shrink-0 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
