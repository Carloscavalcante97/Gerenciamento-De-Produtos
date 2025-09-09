import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastType = "success" | "error" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastWithCloseProps extends ToastProps {
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

const toastColors = {
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
};

export const Toast = React.forwardRef<HTMLDivElement, ToastWithCloseProps>(
  ({ id, type, title, description, onClose }, ref) => {
    const Icon = toastIcons[type];
    const iconColor = toastColors[type];

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className="glass-card max-w-md w-full shadow-apple"
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClose(id)}
            className="h-6 w-6 p-0 hover:bg-secondary-hover transition-apple"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </motion.div>
    );
  }
);

Toast.displayName = "Toast";


interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
