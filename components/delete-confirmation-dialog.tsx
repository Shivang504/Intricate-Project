'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppDispatch } from '@/lib/store/hooks';
import { deleteProduct } from '@/lib/store/product-slice';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productTitle: string;
}

export function DeleteConfirmationDialog({ open, onOpenChange, productId, productTitle }: DeleteConfirmationDialogProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='w-[95vw] sm:w-full max-w-[425px] mx-4 sm:mx-auto p-4 sm:p-6'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-lg sm:text-xl'>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className='text-sm break-words'>
            This will permanently delete <span className='font-semibold'>{productTitle}</span>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-col sm:flex-row gap-2 sm:gap-0'>
          <AlertDialogCancel disabled={loading} className='w-full sm:w-auto order-2 sm:order-1'>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className='w-full sm:w-auto order-1 sm:order-2 bg-destructive text-destructive-foreground hover:bg-destructive/90'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
