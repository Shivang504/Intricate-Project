import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CategoryFilter } from '@/components/category-filter';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSearchQuery } from '@/lib/store/product-slice';
import type { Product } from '@/lib/api/api-service';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number, title: string) => void;
  onAddProduct: () => void;
}

export function ProductTable({ products, onEdit, onDelete, onAddProduct }: ProductTableProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.products.searchQuery);

  return (
    <Card>
      <CardHeader className='p-4 sm:p-6'>
        <div className='flex flex-col gap-3 sm:gap-4'>
          <CardTitle className='text-lg sm:text-xl'>Products</CardTitle>

          {/* Search, Filter, and Add Button */}
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
            {/* Search */}
            <div className='relative flex-1 sm:flex-initial sm:min-w-0'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none' />
              <Input
                type='search'
                placeholder='Search products...'
                value={searchQuery}
                onChange={e => dispatch(setSearchQuery(e.target.value))}
                className='w-full pl-9 sm:w-56 md:w-64'
              />
            </div>

            {/* Category Filter */}
            <div className='w-full sm:w-auto'>
              <CategoryFilter />
            </div>

            {/* Add Product Button */}
            <Button onClick={onAddProduct} size='sm' className='gap-2 w-full sm:w-auto'>
              <Plus className='h-4 w-4 shrink-0' />
              <span className='hidden min-[400px]:inline'>Add Product</span>
              <span className='min-[400px]:hidden'>Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-0 sm:p-6 pt-0'>
        <div className='overflow-x-auto -mx-4 sm:mx-0'>
          <div className='inline-block min-w-full align-middle'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border text-left text-xs sm:text-sm font-medium text-muted-foreground'>
                  <th className='pb-3 pr-3 pl-4 sm:pl-6'>Product</th>
                  <th className='hidden pb-3 pr-3 md:table-cell'>Category</th>
                  <th className='pb-3 pr-3'>Price</th>
                  <th className='hidden pb-3 pr-3 lg:table-cell'>Rating</th>
                  <th className='pb-3 pr-4 sm:pr-6 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='py-8 sm:py-12 text-center text-muted-foreground'>
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className='border-b border-border last:border-0 hover:bg-muted/50 transition-colors'>
                      <td className='py-3 sm:py-4 pr-3 pl-4 sm:pl-6'>
                        <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.title}
                            className='h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-border object-contain shrink-0'
                          />
                          <div className='min-w-0 flex-1'>
                            <p className='truncate max-w-[500px] text-sm sm:text-base font-medium text-foreground'>{product.title}</p>
                            <div className='flex items-center gap-2 mt-0.5'>
                              <p className='truncate text-xs sm:text-sm text-muted-foreground md:hidden'>{product.category}</p>
                              <Badge variant='secondary' className='md:hidden text-xs shrink-0'>
                                ${product.price.toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='hidden pr-3 md:table-cell'>
                        <Badge variant='secondary' className='text-xs'>
                          {product.category}
                        </Badge>
                      </td>
                      <td className='hidden pr-3 font-semibold text-foreground text-sm sm:text-base md:table-cell'>
                        ${product.price.toFixed(2)}
                      </td>
                      <td className='hidden pr-3 lg:table-cell'>
                        {product.rating ? (
                          <div className='flex items-center gap-1 text-sm'>
                            <span className='text-foreground'>{product.rating.rate}</span>
                            <span className='text-muted-foreground'>({product.rating.count})</span>
                          </div>
                        ) : (
                          <span className='text-sm text-muted-foreground'>N/A</span>
                        )}
                      </td>
                      <td className='pr-4 sm:pr-6'>
                        <div className='flex items-center justify-end gap-1 sm:gap-2'>
                          <Button variant='ghost' size='icon' onClick={() => onEdit(product)} className='h-8 w-8 shrink-0'>
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onDelete(product.id, product.title)}
                            className='h-8 w-8 text-destructive hover:text-destructive shrink-0'>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
