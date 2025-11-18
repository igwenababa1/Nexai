import { useState, useCallback } from 'react';

export interface Toast {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
}

export const useToasts = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = Date.now();
        setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
};
