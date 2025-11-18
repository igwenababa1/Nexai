
import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { Toast } from '../hooks/useToast.ts';

const ToastMessage: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [toast, onDismiss]);

    const typeClasses = {
        info: 'from-blue-500 to-blue-700',
        success: 'from-green-500 to-green-700',
        error: 'from-red-500 to-red-700',
    };
    
    const iconClasses = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
    }

    return (
        <div 
        className={`w-full max-w-sm p-4 rounded-lg shadow-2xl text-white bg-gradient-to-br ${typeClasses[toast.type]} flex items-center gap-4 animate-fade-in`}
        role="alert"
        >
            <i className={`fas ${iconClasses[toast.type]} text-xl`}></i>
            <span className="flex-grow">{toast.message}</span>
            <button onClick={() => onDismiss(toast.id)} className="text-xl leading-none">&times;</button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useContext(AppContext);
    
    if (!toasts.length) return null;

    return (
        <div className="fixed top-24 right-6 z-[100] space-y-3">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </div>
    );
};