import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card border-card-border max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-foreground">
              {title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-muted-foreground leading-relaxed pl-13">
          {description}
          <br /><br />
          <span className="text-destructive font-medium">
            Esta ação não pode ser desfeita.
          </span>
        </AlertDialogDescription>
        
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="button-glass transition-apple hover:bg-secondary-hover">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive-hover text-destructive-foreground transition-apple hover:shadow-lg disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}