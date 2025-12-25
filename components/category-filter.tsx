'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setCategoryFilter } from '@/lib/store/product-slice';
import { selectCategoryFilter } from '@/lib/store/selectors';
import { productApi } from '@/lib/api/api-service';

export function CategoryFilter() {
  const dispatch = useAppDispatch();
  const categoryFilter = useAppSelector(selectCategoryFilter);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    productApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <Select value={categoryFilter} onValueChange={value => dispatch(setCategoryFilter(value))}>
      <SelectTrigger className='w-full sm:w-[180px] md:w-[200px]'>
        <SelectValue placeholder='All Categories' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All Categories</SelectItem>
        {categories.map(category => (
          <SelectItem key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
