import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card mx-6"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="text-sm text-muted-foreground">
          Exibindo {startItem} a {endItem} de {totalElements} resultado{totalElements !== 1 ? 's' : ''}
        </div>


        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Por página:</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20 glass border-input-border bg-input focus:border-primary focus:ring-1 focus:ring-primary transition-apple">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-card-border bg-card">
                <SelectItem value="10" className="text-foreground hover:bg-accent focus:bg-accent">10</SelectItem>
                <SelectItem value="20" className="text-foreground hover:bg-accent focus:bg-accent">20</SelectItem>
                <SelectItem value="50" className="text-foreground hover:bg-accent focus:bg-accent">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="button-glass disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="px-3 py-1 text-sm font-medium text-foreground">
              Página {currentPage + 1} de {totalPages}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="button-glass disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}