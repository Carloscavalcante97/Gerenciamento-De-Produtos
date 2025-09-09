import { Search, Plus, Star, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;

  sort: string;
  onSortChange: (value: string) => void;
  onCreateProduct: () => void;
}

export function Header({
  search,
  onSearchChange,
  sort,
  onSortChange,
  onCreateProduct
}: HeaderProps) {
  const getSortIcon = () => {
    if (sort.includes('asc')) return <SortAsc className="w-4 h-4" />;
    return <SortDesc className="w-4 h-4" />;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 glass backdrop-blur-xl border-b border-card-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">

          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gradient-primary">Products</h1>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 glass border-input-border bg-input focus:border-primary focus:ring-1 focus:ring-primary transition-apple"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">

            <div className="flex items-center gap-2">
              {getSortIcon()}
              <Select value={sort} onValueChange={onSortChange}>
                <SelectTrigger className="w-40 glass border-input-border bg-input focus:border-primary focus:ring-1 focus:ring-primary transition-apple">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-card-border bg-card">
                  <SelectItem value="name,asc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Nome (A-Z)
                  </SelectItem>
                  <SelectItem value="name,desc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Nome (Z-A)
                  </SelectItem>
                  <SelectItem value="price,asc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Menor Preço
                  </SelectItem>
                  <SelectItem value="price,desc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Maior Preço
                  </SelectItem>
                  <SelectItem value="quantity,asc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Menor Qtd.
                  </SelectItem>
                  <SelectItem value="quantity,desc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Maior Qtd.
                  </SelectItem>
                  <SelectItem value="createdAt,desc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Mais Recentes
                  </SelectItem>
                  <SelectItem value="createdAt,asc" className="text-foreground hover:bg-accent focus:bg-accent">
                    Mais Antigos
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={onCreateProduct}
              className="button-primary flex items-center gap-2 px-6 font-medium transition-apple hover:shadow-lg whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}