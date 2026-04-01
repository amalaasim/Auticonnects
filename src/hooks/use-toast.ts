import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
};

function toast({ variant, title, description }: ToastProps) {
  const message = title || '';
  if (variant === 'destructive') {
    sonnerToast.error(message, { description });
  } else {
    sonnerToast.success(message, { description });
  }
}

function useToast() {
  return {
    toast,
    toasts: [] as ToastProps[],
    dismiss: (_toastId?: string) => {},
  };
}

export { useToast, toast };
