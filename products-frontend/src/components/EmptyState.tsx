import { motion } from 'framer-motion';
import { Package, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters?: boolean;
  onCreateProduct: () => void;
}

export function EmptyState({ hasFilters, onCreateProduct }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card text-center py-16 mx-6"
    >
      <div className="max-w-md mx-auto">
        {hasFilters ? (
          <>
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar os filtros de busca ou ordenação para encontrar o que procura.
            </p>
          </>
        ) : (
          <>
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum produto cadastrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu primeiro produto para organizar seu inventário.
            </p>
          </>
        )}
        
        <Button
          onClick={onCreateProduct}
          className="button-primary flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          {hasFilters ? 'Criar Produto' : 'Criar Primeiro Produto'}
        </Button>
      </div>
    </motion.div>
  );
}