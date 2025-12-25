'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch } from '@/lib/store/hooks';
import { createProduct, updateProduct } from '@/lib/store/product-slice';
import { useToast } from '@/hooks/use-toast';
import { productApi, type Product } from '@/lib/api/api-service';
import { Loader2 } from 'lucide-react';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

interface FormData {
  title: string;
  price: string;
  description: string;
  category: string;
  image: string;
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Load categories on mount
  useEffect(() => {
    productApi
      .getCategories()
      .then(setCategories)
      .catch(error => {
        console.error('Failed to load categories:', error);
      });
  }, []);

  // Initialize form data when dialog opens or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        // Edit mode: populate with product data
        setFormData({
          title: product.title || '',
          price: product.price?.toString() || '',
          description: product.description || '',
          category: product.category || '',
          image: product.image || '',
        });
      } else {
        // Add mode: reset to empty form
        setFormData({
          title: '',
          price: '',
          description: '',
          category: categories.length > 0 ? categories[0] : '',
          image: '',
        });
      }
      setErrors({});
    }
  }, [open, product, categories]);

  // Handle input changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        category: formData.category,
        image: formData.image.trim() || 'https://via.placeholder.com/300x300?text=No+Image',
      };

      if (product) {
        // Update existing product
        await dispatch(updateProduct({ id: product.id, product: productData })).unwrap();
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Create new product
        await dispatch(createProduct(productData)).unwrap();
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      // Reset form and close dialog
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error('Product save error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[95vh] overflow-y-auto w-[95vw] sm:w-full max-w-[500px] mx-4 sm:mx-auto p-4 sm:p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl'>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription className='text-sm'>
            {product ? 'Update the product details below' : 'Fill in the details to create a new product'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-sm font-medium'>Product Title *</Label>
            <Input
              id='title'
              placeholder='Enter product title'
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              disabled={loading}
              className='w-full'
            />
            {errors.title && <p className='text-xs sm:text-sm text-destructive'>{errors.title}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='price' className='text-sm font-medium'>Price *</Label>
            <Input
              id='price'
              type='number'
              step='0.01'
              placeholder='0.00'
              value={formData.price}
              onChange={e => handleChange('price', e.target.value)}
              disabled={loading}
              className='w-full'
            />
            {errors.price && <p className='text-xs sm:text-sm text-destructive'>{errors.price}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category' className='text-sm font-medium'>Category *</Label>
            <Select value={formData.category} onValueChange={value => handleChange('category', value)} disabled={loading}>
              <SelectTrigger id='category' className='w-full'>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className='text-xs sm:text-sm text-destructive'>{errors.category}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description' className='text-sm font-medium'>Description *</Label>
            <Textarea
              id='description'
              placeholder='Enter product description'
              rows={4}
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              disabled={loading}
              className='w-full resize-none'
            />
            {errors.description && <p className='text-xs sm:text-sm text-destructive'>{errors.description}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='image' className='text-sm font-medium'>Image URL</Label>
            <Input
              id='image'
              type='url'
              placeholder='https://example.com/image.jpg'
              value={formData.image}
              onChange={e => handleChange('image', e.target.value)}
              disabled={loading}
              className='w-full'
            />
          </div>

          <DialogFooter className='flex-col sm:flex-row gap-2 sm:gap-0'>
            <Button type='button' variant='outline' onClick={handleClose} disabled={loading} className='w-full sm:w-auto order-2 sm:order-1'>
              Cancel
            </Button>
            <Button type='submit' disabled={loading} className='w-full sm:w-auto order-1 sm:order-2'>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
