"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import type { Product } from "@/lib/api/api-service"

interface ProductChartProps {
  products: Product[]
  type?: "price" | "category"
}

export function ProductChart({ products, type = "price" }: ProductChartProps) {
  const chartData =
    type === "price"
      ? products.slice(0, 10).map((p, i) => ({
          name: `P${i + 1}`,
          value: p.price,
        }))
      : Object.entries(
          products.reduce(
            (acc, p) => {
              acc[p.category] = (acc[p.category] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
        ).map(([name, value]) => ({ name: name.slice(0, 10), value }))

  return (
    <Card>
      <CardHeader className='p-4 sm:p-6'>
        <CardTitle className='text-base sm:text-lg'>{type === "price" ? "Price Trends" : "Products by Category"}</CardTitle>
      </CardHeader>
      <CardContent className='p-4 sm:p-6 pt-0'>
        <div className='w-full' style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tick={{ fontSize: 10 }}
                className='text-[10px] sm:text-xs'
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tick={{ fontSize: 10 }}
                className='text-[10px] sm:text-xs'
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
