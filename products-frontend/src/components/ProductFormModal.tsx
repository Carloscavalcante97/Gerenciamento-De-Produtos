import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Product, ProductRequest } from '@/types/product';
import { Loader2 } from 'lucide-react';
import { brl, parseBRL } from '@/lib/format';
import { useState, useEffect, useRef } from 'react';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que R$ 0,00'),
  quantity: z.number().int().min(0, 'Quantidade não pode ser negativa'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: ProductRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ProductFormModal({ 
  open, 
  onOpenChange, 
  product, 
  onSubmit, 
  isLoading 
}: ProductFormModalProps) {
  const [priceDisplay, setPriceDisplay] = useState('');
  const isEditing = !!product;
  const wasOpen = useRef(open);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        quantity: product.quantity,
      });
      setPriceDisplay(brl(product.price));
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
      });
      setPriceDisplay('');
    }
  }, [product, form, open]);

  useEffect(() => {
    if (wasOpen.current && !open) {
      form.reset({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
      });
      setPriceDisplay('');
    }
    wasOpen.current = open;
  }, [open, form]);

  const handlePriceChange = (value: string) => {
    setPriceDisplay(value);
    const numericValue = parseBRL(value);
    form.setValue('price', numericValue);
  };

  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit({
      name: data.name,
      description: data.description || null,
      price: data.price,
      quantity: data.quantity,
    });
    if (!isEditing) {
      form.reset({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
      });
      setPriceDisplay('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto border-card-border">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-semibold text-foreground">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Nome *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome do produto"
                        className="glass border-input-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-apple"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Digite a descrição do produto"
                        rows={3}
                        className="glass border-input-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-apple resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Preço *</FormLabel>
                      <FormControl>
                        <Input
                          value={priceDisplay}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          placeholder="R$ 0,00"
                          className="glass border-input-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-apple"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Quantidade *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="glass border-input-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-apple"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onOpenChange(false);
                    form.reset({
                      name: '',
                      description: '',
                      price: 0,
                      quantity: 0,
                    });
                    setPriceDisplay('');
                  }}
                  className="button-glass transition-apple hover:bg-secondary-hover"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="button-primary px-8 py-2.5 font-medium transition-apple hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Atualizar' : 'Criar'} Produto
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}