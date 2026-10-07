import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
                <AnimatePresence>
                    {toasts.map((toast) => {
                        let bgColor = 'bg-slate-900/90 border-slate-800 text-slate-100';
                        let Icon = Info;
                        let iconColor = 'text-indigo-400';
                        let progressColor = 'bg-indigo-500';

                        if (toast.type === 'success') {
                            bgColor = 'bg-emerald-950/90 border-emerald-800 text-emerald-50';
                            Icon = CheckCircle;
                            iconColor = 'text-emerald-400';
                            progressColor = 'bg-emerald-500';
                        } else if (toast.type === 'error') {
                            bgColor = 'bg-rose-950/90 border-rose-800 text-rose-50';
                            Icon = AlertCircle;
                            iconColor = 'text-rose-400';
                            progressColor = 'bg-rose-500';
                        } else if (toast.type === 'warning') {
                            bgColor = 'bg-amber-950/90 border-amber-800 text-amber-50';
                            Icon = AlertCircle;
                            iconColor = 'text-amber-400';
                            progressColor = 'bg-amber-500';
                        }

                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                                layout
                                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl relative overflow-hidden ${bgColor}`}
                            >
                                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
                                <div className="flex-1 text-sm font-medium pr-4">{toast.message}</div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {/* Progress bar animation */}
                                <motion.div
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                                    className={`absolute bottom-0 left-0 h-1 ${progressColor}`}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
