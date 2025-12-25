import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchProducts } from '@/lib/store/product-slice';
import { selectFilteredProducts, selectLoading, selectError, selectProducts } from '@/lib/store/selectors';
import { Sidebar } from '@/components/sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsCards } from '@/components/stats-cards';
import { ProductChart } from '@/components/product-chart';
import { ProductTable } from '@/components/product-table';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ErrorAlert } from '@/components/error-alert';
import { ProductFormDialog } from '@/components/product-form-dialog';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { ReduxProvider } from '@/lib/providers/redux-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Product } from '@/lib/api/api-service';

function Dashboard() {
  const dispatch = useAppDispatch();
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const allProducts = useAppSelector(selectProducts);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; title: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id: number, title: string) => {
    setProductToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div className='flex min-h-screen bg-background overflow-x-hidden'>
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className='flex flex-1 flex-col lg:ml-64 min-w-0 overflow-hidden'>
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className='flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8'>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className='mx-auto w-full max-w-7xl space-y-4 sm:space-y-6 min-w-0'>
              <StatsCards products={allProducts} />

              <ProductTable
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onAddProduct={handleAddProduct}
              />
            </div>
          )}
        </main>
      </div>

      <ProductFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} product={selectedProduct} />

      {productToDelete && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          productId={productToDelete.id}
          productTitle={productToDelete.title}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <div className='font-sans antialiased'>
      <ReduxProvider>
        <Dashboard />
        <Toaster />
      </ReduxProvider>
    </div>
  );
}

export default App;
