import { motion } from 'framer-motion';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { brl, dateTime } from '@/lib/format';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onSort: (field: string) => void;
  currentSort: string;
}

export function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  onSort,
  currentSort
}: ProductTableProps) {
  const getSortIcon = (field: string) => {
    if (currentSort.includes(field)) {
      return <ArrowUpDown className="w-4 h-4 text-primary" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
  };

  const handleSort = (field: string) => {
    const isCurrentField = currentSort.includes(field);
    const isAsc = currentSort.includes('asc');
    const newDirection = isCurrentField && isAsc ? 'desc' : 'asc';
    onSort(`${field},${newDirection}`);
  };

  if (loading) {
    return (
      <div className="glass-card mx-6 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-muted/20 border-b border-border"></div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 bg-muted/10 border-b border-border/50"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card mx-6 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary transition-apple"
                >
                  Nome {getSortIcon('name')}
                </Button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-semibold text-foreground">Descrição</span>
              </th>
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('price')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary transition-apple"
                >
                  Preço {getSortIcon('price')}
                </Button>
              </th>
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('quantity')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary transition-apple"
                >
                  Qtd. {getSortIcon('quantity')}
                </Button>
              </th>
             
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('createdAt')}
                  className="h-auto p-0 font-semibold text-foreground hover:text-primary transition-apple"
                >
                  Criado em {getSortIcon('createdAt')}
                </Button>
              </th>
              <th className="text-center py-3 px-4">
                <span className="font-semibold text-foreground">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b border-border/50 hover:bg-accent/50 transition-apple group"
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-foreground">{product.name}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-muted-foreground max-w-xs truncate">
                    {product.description || '—'}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-primary">{brl(product.price)}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-foreground">{product.quantity}</div>
                </td>
               
                <td className="py-4 px-4">
                  <div className="text-sm text-muted-foreground">
                    {dateTime(product.createdAt)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-apple">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8 p-0 hover:bg-accent hover:text-primary transition-apple"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-apple"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}