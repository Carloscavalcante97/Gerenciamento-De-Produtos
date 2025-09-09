import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Header } from '@/components/Header';
import { ProductTable } from '@/components/ProductTable';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';
import { ProductFormModal } from '@/components/ProductFormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ToastContainer, ToastProps } from '@/components/Toast';
import { useProducts } from '@/hooks/useProducts';
import { createProduct, updateProduct, deleteProduct } from '@/services/products';
import { Product, ProductRequest } from '@/types/product';

type Toast = ToastProps;

let toastId = 0;

export default function ProductsPage() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    loading,
    error,
    page,
    size,
    sort,
    search,
    setPage,
    setSize,
    setSort,
    setSearch,
    refetch
  } = useProducts();

  const products = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  // 👇 clamp: garante que a página atual é válida sempre que totalPages mudar
  useEffect(() => {
    if (totalPages > 0 && page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, page, setPage]);

  // Toast functions
  const showToast = (type: Toast['type'], title: string, description?: string) => {
    const id = (++toastId).toString();
    const toast: Toast = { id, type, title, description };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // Product actions
  const handleCreateProduct = () => { setSelectedProduct(undefined); setIsModalOpen(true); };
  const handleEditProduct = (product: Product) => { setSelectedProduct(product); setIsModalOpen(true); };
  const handleDeleteProduct = (product: Product) => { setProductToDelete(product); setIsDeleteDialogOpen(true); };

  const handleToggleFavorite = async (product: Product) => {
    try {
      await updateProduct(product.id, { favorite: !product.favorite });
      showToast('success', product.favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
        `${product.name} foi ${product.favorite ? 'removido dos' : 'adicionado aos'} favoritos.`);
      refetch();
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        showToast(
          'error',
          'Erro ao atualizar favorito',
          (error.response.data as { message?: string }).message || 'Ocorreu um erro inesperado.'
        );
      } else {
        showToast('error', 'Erro ao atualizar favorito', 'Ocorreu um erro inesperado.');
      }
    }
  };

  // 👉 resetar página quando sort/search mudarem
  const handleSort = (newSort: string) => { setSort(newSort); setPage(0); };
  const handleSearchChange = (value: string) => { setSearch(value); setPage(0); };

  const handleSubmitProduct = async (payload: ProductRequest) => {
    setIsSubmitting(true);
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
        showToast('success', 'Produto atualizado', 'O produto foi atualizado com sucesso.');
      } else {
        await createProduct(payload);
        showToast('success', 'Produto criado', 'O produto foi criado com sucesso.');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      if ( error && typeof error === 'object' && 'response' 
        in error && error.response && typeof error.response
         === 'object' && 'data' in error.response && error.response.data 
         && typeof error.response.data === 'object' && 'message' in error.response.data )
          { showToast( 'error', 'Erro ao salvar produto', (error.response.data as { message?: string })
          .message || 'Ocorreu um erro inesperado.' ); } else { showToast('error', 'Erro ao salvar produto', 
            'Ocorreu um erro inesperado.'); 
           }} finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(productToDelete.id);
      showToast('success', 'Produto excluído', 'O produto foi excluído com sucesso.');
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      refetch(); // o clamp de página garante voltar p/ uma página válida se esvaziar
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        showToast(
          'error',
          'Erro ao excluir produto',
          (error.response.data as { message?: string }).message || 'Ocorreu um erro inesperado.'
        );
      } else {
        showToast('error', 'Erro ao excluir produto', 'Ocorreu um erro inesperado.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAny = totalElements > 0;
  const hasProducts = products.length > 0;
  const emptyPage = hasAny && !hasProducts && !loading;

  if (error && !loading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card text-center max-w-md mx-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar produtos</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button onClick={() => refetch()} className="button-primary px-4 py-2 rounded-lg">Tentar novamente</button>
          </div>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header
        search={search}
        onSearchChange={handleSearchChange}   // 👈 reset page
        sort={sort}
        onSortChange={handleSort}            // 👈 reset page
        onCreateProduct={handleCreateProduct}
      />

      <div className="space-y-6">
        {hasProducts && (
          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onToggleFavorite={handleToggleFavorite}
            onSort={handleSort}
            currentSort={sort}
          />
        )}

        {emptyPage && (
          <div className="glass-card mx-6 p-4 text-sm text-muted-foreground">
            Esta página está vazia após o filtro/ordenação. Use a paginação abaixo para voltar.
          </div>
        )}

        {!hasAny && !loading && (
          <EmptyState onCreateProduct={handleCreateProduct} />
        )}

        {/* 👇 A paginação fica SEMPRE visível quando existe qualquer item no resultado */}
        {hasAny && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={size}
            totalElements={totalElements}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setSize(s); setPage(0); }} // 👈 reset page ao trocar o tamanho
          />
        )}
      </div>

      <ProductFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={selectedProduct}
        onSubmit={handleSubmitProduct}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir Produto"
        description={productToDelete ? `Tem certeza que deseja excluir "${productToDelete.name}"? Essa ação não pode ser desfeita.` : ''}
        onConfirm={handleConfirmDelete}
        isLoading={isSubmitting}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AppShell>
  );
}
