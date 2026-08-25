'use client';

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { Toast } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-3.5 text-white shadow-lg min-w-[300px] max-w-[400px] animate-in slide-in-from-right fade-in duration-300`}
            style={{
              backgroundColor: toast.type === 'success' ? '#00C853' : toast.type === 'error' ? '#D32F2F' : '#1B7A7A',
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <Icon size={18} />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => onRemove(toast.id)} className="hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
