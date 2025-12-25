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
      <CardHeader className='px-6'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4'>
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

      <CardContent className='p-0'>
        {/* Mobile/Tablet Card View */}
        <div className='lg:hidden'>
          {products.length === 0 ? (
            <div className='py-8 sm:py-12 text-center text-sm sm:text-base text-muted-foreground px-4 sm:px-6'>No products found</div>
          ) : (
            <div className='space-y-3 sm:space-y-4 p-4 sm:p-6'>
              {products.map(product => (
                <Card key={product.id} className='overflow-hidden hover:shadow-md transition-shadow'>
                  <CardContent className='p-4 sm:p-5'>
                    <div className='flex gap-3 sm:gap-4'>
                      {/* Product Image */}
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.title}
                        className='h-16 w-16 sm:h-20 sm:w-20 rounded-lg border border-border object-contain shrink-0'
                      />

                      {/* Product Details */}
                      <div className='flex-1 min-w-0 space-y-2 sm:space-y-3'>
                        {/* Title and Actions */}
                        <div className='flex items-start justify-between gap-2'>
                          <h3 className='text-sm sm:text-base font-semibold text-foreground line-clamp-2 flex-1'>{product.title}</h3>
                          <div className='flex items-center gap-1 shrink-0'>
                            <Button variant='ghost' size='icon' onClick={() => onEdit(product)} className='h-8 w-8 sm:h-9 sm:w-9'>
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => onDelete(product.id, product.title)}
                              className='h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive'>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        {/* Product Info Grid */}
                        <div className='grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm'>
                          <div>
                            <span className='text-muted-foreground'>Category:</span>
                            <div className='mt-0.5'>
                              <Badge variant='secondary' className='text-xs'>
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <span className='text-muted-foreground'>Price:</span>
                            <p className='mt-0.5 font-semibold text-foreground'>${product.price.toFixed(2)}</p>
                          </div>
                          {product.rating && (
                            <div className='col-span-2'>
                              <span className='text-muted-foreground'>Rating:</span>
                              <p className='mt-0.5'>
                                <span className='font-medium text-foreground'>{product.rating.rate}</span>
                                <span className='text-muted-foreground ml-1'>({product.rating.count} reviews)</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className='hidden lg:block overflow-x-auto'>
          <div className='inline-block min-w-full align-middle'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b border-border text-left text-sm font-medium text-muted-foreground bg-muted/30'>
                  <th className='py-3 pr-3 pl-6 whitespace-nowrap'>Product</th>
                  <th className='py-3 pr-3 whitespace-nowrap'>Category</th>
                  <th className='py-3 pr-3 whitespace-nowrap'>Price</th>
                  <th className='py-3 pr-3 whitespace-nowrap'>Rating</th>
                  <th className='py-3 pr-6 text-right whitespace-nowrap'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='py-12 text-center text-base text-muted-foreground px-6'>
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className='border-b border-border last:border-0 hover:bg-muted/50 transition-colors'>
                      <td className='py-4 pr-3 pl-6 min-w-[200px]'>
                        <div className='flex items-center gap-3 min-w-0'>
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.title}
                            className='h-12 w-12 rounded-lg border border-border object-contain shrink-0'
                          />
                          <div className='min-w-0 flex-1'>
                            <p className='truncate text-base font-medium xl:max-w-[500px] text-foreground'>{product.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 pr-3'>
                        <Badge variant='secondary' className='text-xs whitespace-nowrap'>
                          {product.category}
                        </Badge>
                      </td>
                      <td className='py-4 pr-3 font-semibold text-foreground text-base whitespace-nowrap'>${product.price.toFixed(2)}</td>
                      <td className='py-4 pr-3'>
                        {product.rating ? (
                          <div className='flex items-center gap-1 text-sm whitespace-nowrap'>
                            <span className='text-foreground'>{product.rating.rate}</span>
                            <span className='text-muted-foreground'>({product.rating.count})</span>
                          </div>
                        ) : (
                          <span className='text-sm text-muted-foreground'>N/A</span>
                        )}
                      </td>
                      <td className='py-4 pr-6'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button variant='ghost' size='icon' onClick={() => onEdit(product)} className='h-9 w-9 shrink-0'>
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => onDelete(product.id, product.title)}
                            className='h-9 w-9 text-destructive hover:text-destructive shrink-0'>
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
