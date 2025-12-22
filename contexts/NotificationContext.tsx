
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((type: NotificationType, message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-20 right-4 z-[9999] space-y-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`
              pointer-events-auto flex items-center p-4 rounded-lg shadow-lg border min-w-[300px] animate-in slide-in-from-right duration-300
              ${n.type === 'success' ? 'bg-white border-green-200 text-green-800' : ''}
              ${n.type === 'error' ? 'bg-white border-red-200 text-red-800' : ''}
              ${n.type === 'info' ? 'bg-white border-blue-200 text-blue-800' : ''}
            `}
          >
            <div className="mr-3">
              {n.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
              {n.type === 'error' && <XCircle size={20} className="text-red-500" />}
              {n.type === 'info' && <AlertCircle size={20} className="text-blue-500" />}
            </div>
            <p className="flex-1 font-medium text-sm">{n.message}</p>
            <button onClick={() => removeNotification(n.id)} className="ml-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
